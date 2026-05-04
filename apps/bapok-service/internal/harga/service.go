package harga

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"bapok-service/internal/fcm"

	"github.com/redis/go-redis/v9"
)

const cacheTTL = 5 * time.Minute

type Service struct {
	repo *Repository
	rdb  *redis.Client
	fcm  *fcm.Client
}

func NewService(repo *Repository, rdb *redis.Client, fcmClient *fcm.Client) *Service {
	return &Service{repo: repo, rdb: rdb, fcm: fcmClient}
}

func (s *Service) FindHarga(ctx context.Context, tanggal, pasarID string) ([]HargaWithDetail, error) {
	key := fmt.Sprintf("bapok:harga:%s:%s", tanggal, pasarID)

	cached, err := s.rdb.Get(ctx, key).Bytes()
	if err == nil {
		var result []HargaWithDetail
		if err := json.Unmarshal(cached, &result); err == nil {
			return result, nil
		}
	}

	result, err := s.repo.FindByTanggalAndPasar(ctx, tanggal, pasarID)
	if err != nil {
		return nil, err
	}

	if b, err := json.Marshal(result); err == nil {
		s.rdb.Set(ctx, key, b, cacheTTL)
	}

	return result, nil
}

func (s *Service) FindHistori(ctx context.Context, komoditasID string) ([]HargaHistori, error) {
	key := fmt.Sprintf("bapok:histori:%s", komoditasID)

	cached, err := s.rdb.Get(ctx, key).Bytes()
	if err == nil {
		var result []HargaHistori
		if err := json.Unmarshal(cached, &result); err == nil {
			return result, nil
		}
	}

	result, err := s.repo.FindHistori(ctx, komoditasID)
	if err != nil {
		return nil, err
	}

	if b, err := json.Marshal(result); err == nil {
		s.rdb.Set(ctx, key, b, cacheTTL)
	}

	return result, nil
}

func (s *Service) Create(ctx context.Context, req CreateHargaRequest) (*HargaHarian, error) {
	result, err := s.repo.Create(ctx, req)
	if err != nil {
		return nil, err
	}

	// invalidasi cache harga tanggal ini
	s.scanAndDelete(ctx, fmt.Sprintf("bapok:harga:%s:*", req.Tanggal))

	// invalidasi cache histori komoditas
	s.rdb.Del(ctx, fmt.Sprintf("bapok:histori:%s", req.KomoditasID))

	// cek price
	go s.checkAlerts(context.Background(), req.KomoditasID, req.Harga)

	return result, nil
}

func (s *Service) BulkCSV(ctx context.Context, rows []BulkCSVRow, inputOleh string) (*BulkCSVResult, error) {
	komoditasMap, err := s.repo.LoadKomoditasMap(ctx)
	if err != nil {
		return nil, err
	}
	pasarMap, err := s.repo.LoadPasarMap(ctx)
	if err != nil {
		return nil, err
	}

	result := &BulkCSVResult{Total: len(rows)}

	for i, row := range rows {
		lineNum := i + 2 // baris 1 = header

		komoditasID, ok := komoditasMap[row.NamaKomoditas]
		if !ok {
			result.Gagal++
			result.Errors = append(result.Errors, fmt.Sprintf("baris %d: komoditas '%s' tidak ditemukan", lineNum, row.NamaKomoditas))
			continue
		}

		pasarID, ok := pasarMap[row.NamaPasar]
		if !ok {
			result.Gagal++
			result.Errors = append(result.Errors, fmt.Sprintf("baris %d: pasar '%s' tidak ditemukan", lineNum, row.NamaPasar))
			continue
		}

		if err := s.repo.UpsertHarga(ctx, komoditasID, pasarID, row.Harga, row.Tanggal, inputOleh); err != nil {
			result.Gagal++
			result.Errors = append(result.Errors, fmt.Sprintf("baris %d: gagal simpan (%v)", lineNum, err))
			continue
		}

		result.Sukses++

		// invalidasi cache harga tanggal ini
		s.scanAndDelete(ctx, fmt.Sprintf("bapok:harga:%s:*", row.Tanggal))
	}

	return result, nil
}

// scanAndDelete menghapus semua key Redis yang cocok dengan pattern menggunakan SCAN
// (menghindari KEYS yang bersifat blocking O(N)).
func (s *Service) scanAndDelete(ctx context.Context, pattern string) {
	var cursor uint64
	for {
		keys, next, err := s.rdb.Scan(ctx, cursor, pattern, 100).Result()
		if err != nil {
			break
		}
		if len(keys) > 0 {
			s.rdb.Del(ctx, keys...)
		}
		cursor = next
		if cursor == 0 {
			break
		}
	}
}

func (s *Service) checkAlerts(ctx context.Context, komoditasID string, hargaBaru int64) {
	alerts, err := s.repo.FindAlertsToCheck(ctx, komoditasID)
	if err != nil {
		return
	}

	for _, a := range alerts {
		triggered := false
		if a.Tipe == "naik_diatas" && hargaBaru > a.Nominal {
			triggered = true
		} else if a.Tipe == "turun_dibawah" && hargaBaru < a.Nominal {
			triggered = true
		}

		if triggered {
			if err := s.repo.TriggerAlert(ctx, a.ID); err != nil {
				log.Printf("Failed to trigger alert %s: %v", a.ID, err)
				continue
			}

			s.sendAlertNotification(ctx, a.UserNik, a.Tipe, komoditasID, hargaBaru)
		}
	}
}

func (s *Service) sendAlertNotification(ctx context.Context, userNik, tipe, komoditasID string, harga int64) {
	tokens, err := s.repo.GetFCMTokensByNik(ctx, userNik)
	if err != nil || len(tokens) == 0 {
		return
	}

	title := "Alert Harga Bapok"
	body := fmt.Sprintf("Harga komoditas telah %s Rp%d", func() string {
		if tipe == "naik_diatas" {
			return "naik di atas"
		}
		return "turun di bawah"
	}(), harga)

	data := map[string]string{
		"komoditas_id": komoditasID,
		"tipe":         tipe,
		"harga":        fmt.Sprintf("%d", harga),
	}

	for _, token := range tokens {
		if err := s.fcm.Send(ctx, token, title, body, data); err != nil {
			log.Printf("FCM send failed for user %s: %v", userNik, err)
		}
	}
}
