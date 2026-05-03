package harga

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

const cacheTTL = 5 * time.Minute

type Service struct {
	repo *Repository
	rdb  *redis.Client
}

func NewService(repo *Repository, rdb *redis.Client) *Service {
	return &Service{repo: repo, rdb: rdb}
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
	pattern := fmt.Sprintf("bapok:harga:%s:*", req.Tanggal)
	keys, _ := s.rdb.Keys(ctx, pattern).Result()
	if len(keys) > 0 {
		s.rdb.Del(ctx, keys...)
	}

	// invalidasi cache histori komoditas
	s.rdb.Del(ctx, fmt.Sprintf("bapok:histori:%s", req.KomoditasID))

	// cek price
	go s.checkAlerts(context.Background(), req.KomoditasID, req.Harga)

	return result, nil
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
			}
		}
	}
}
