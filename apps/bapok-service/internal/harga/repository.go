package harga

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindByTanggalAndPasar(ctx context.Context, tanggal, pasarID string) ([]HargaWithDetail, error) {
	query := `
		SELECT h.id, h.komoditas_id, k.nama, k.satuan, h.pasar_id, p.nama, h.harga, h.tanggal::text
		FROM bapok.harga_harian h
		JOIN bapok.komoditas k ON k.id = h.komoditas_id
		JOIN bapok.pasar p ON p.id = h.pasar_id
		WHERE h.tanggal = $1`

	args := []any{tanggal}

	if pasarID != "" {
		query += ` AND h.pasar_id = $2`
		args = append(args, pasarID)
	}

	query += ` ORDER BY k.nama ASC`

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []HargaWithDetail
	for rows.Next() {
		var h HargaWithDetail
		if err := rows.Scan(&h.ID, &h.KomoditasID, &h.NamaKomoditas, &h.Satuan,
			&h.PasarID, &h.NamaPasar, &h.Harga, &h.Tanggal); err != nil {
			return nil, err
		}
		result = append(result, h)
	}
	return result, nil
}

func (r *Repository) FindHistori(ctx context.Context, komoditasID string) ([]HargaHistori, error) {
	rows, err := r.db.Query(ctx,
		`SELECT h.tanggal::text, h.harga, h.pasar_id, p.nama
		 FROM bapok.harga_harian h
		 JOIN bapok.pasar p ON p.id = h.pasar_id
		 WHERE h.komoditas_id = $1
		   AND h.tanggal >= CURRENT_DATE - INTERVAL '7 days'
		 ORDER BY h.tanggal DESC, p.nama ASC`,
		komoditasID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []HargaHistori
	for rows.Next() {
		var h HargaHistori
		if err := rows.Scan(&h.Tanggal, &h.Harga, &h.PasarID, &h.NamaPasar); err != nil {
			return nil, err
		}
		result = append(result, h)
	}
	return result, nil
}

func (r *Repository) Create(ctx context.Context, req CreateHargaRequest) (*HargaHarian, error) {
	var h HargaHarian
	err := r.db.QueryRow(ctx,
		`INSERT INTO bapok.harga_harian (komoditas_id, pasar_id, harga, tanggal, input_oleh)
		 VALUES ($1, $2, $3, $4, $5)
		 ON CONFLICT (komoditas_id, pasar_id, tanggal)
		 DO UPDATE SET harga = EXCLUDED.harga, input_oleh = EXCLUDED.input_oleh
		 RETURNING id, komoditas_id, pasar_id, harga, tanggal, input_oleh, created_at`,
		req.KomoditasID, req.PasarID, req.Harga, req.Tanggal, req.InputOleh,
	).Scan(&h.ID, &h.KomoditasID, &h.PasarID, &h.Harga, &h.Tanggal, &h.InputOleh, &h.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &h, nil
}

func (r *Repository) LoadKomoditasMap(ctx context.Context) (map[string]string, error) {
	rows, err := r.db.Query(ctx, `SELECT nama, id FROM bapok.komoditas WHERE is_active = true`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	m := make(map[string]string)
	for rows.Next() {
		var nama, id string
		if err := rows.Scan(&nama, &id); err != nil {
			return nil, err
		}
		m[nama] = id
	}
	return m, nil
}

func (r *Repository) LoadPasarMap(ctx context.Context) (map[string]string, error) {
	rows, err := r.db.Query(ctx, `SELECT nama, id FROM bapok.pasar`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	m := make(map[string]string)
	for rows.Next() {
		var nama, id string
		if err := rows.Scan(&nama, &id); err != nil {
			return nil, err
		}
		m[nama] = id
	}
	return m, nil
}

func (r *Repository) UpsertHarga(ctx context.Context, komoditasID, pasarID string, harga int64, tanggal, inputOleh string) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO bapok.harga_harian (komoditas_id, pasar_id, harga, tanggal, input_oleh)
		 VALUES ($1, $2, $3, $4, $5)
		 ON CONFLICT (komoditas_id, pasar_id, tanggal)
		 DO UPDATE SET harga = EXCLUDED.harga, input_oleh = EXCLUDED.input_oleh`,
		komoditasID, pasarID, harga, tanggal, inputOleh,
	)
	return err
}

func (r *Repository) GetFCMTokensByNik(ctx context.Context, userNik string) ([]string, error) {
	rows, err := r.db.Query(ctx,
		`SELECT rt.fcm_token
		 FROM auth.refresh_tokens rt
		 JOIN auth.users u ON u.id = rt.user_id
		 WHERE u.nik = $1
		   AND rt.fcm_token IS NOT NULL
		   AND rt.is_revoked = false
		   AND rt.expires_at > NOW()`,
		userNik,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tokens []string
	for rows.Next() {
		var t string
		if err := rows.Scan(&t); err != nil {
			return nil, err
		}
		tokens = append(tokens, t)
	}
	return tokens, nil
}

func (r *Repository) FindAlertsToCheck(ctx context.Context, komoditasID string) ([]AlertToCheck, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, user_nik, tipe, nominal
		 FROM bapok.price_alert
		 WHERE komoditas_id = $1 AND is_active = true`,
		komoditasID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []AlertToCheck
	for rows.Next() {
		var a AlertToCheck
		if err := rows.Scan(&a.ID, &a.UserNik, &a.Tipe, &a.Nominal); err != nil {
			return nil, err
		}
		result = append(result, a)
	}
	return result, nil
}

func (r *Repository) TriggerAlert(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx,
		`UPDATE bapok.price_alert SET last_triggered_at = NOW() WHERE id = $1`,
		id,
	)
	return err
}

func (r *Repository) FindKoperasiAll(ctx context.Context) ([]Koperasi, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, nama, kota FROM bapok.koperasi WHERE is_active = true ORDER BY nama ASC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []Koperasi
	for rows.Next() {
		var k Koperasi
		if err := rows.Scan(&k.ID, &k.Nama, &k.Kota); err != nil {
			return nil, err
		}
		result = append(result, k)
	}
	return result, nil
}

func (r *Repository) FindHargaKoperasiByTanggal(ctx context.Context, tanggal, koperasiID string) ([]HargaKoperasiDetail, error) {
	query := `
		SELECT h.id, h.komoditas_id, k.nama, k.satuan, h.koperasi_id, kp.nama, h.harga, h.tanggal::text
		FROM bapok.harga_koperasi h
		JOIN bapok.komoditas k ON k.id = h.komoditas_id
		JOIN bapok.koperasi kp ON kp.id = h.koperasi_id
		WHERE h.tanggal = $1`

	args := []any{tanggal}
	if koperasiID != "" {
		query += ` AND h.koperasi_id = $2`
		args = append(args, koperasiID)
	}
	query += ` ORDER BY k.nama ASC`

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []HargaKoperasiDetail
	for rows.Next() {
		var h HargaKoperasiDetail
		if err := rows.Scan(&h.ID, &h.KomoditasID, &h.NamaKomoditas, &h.Satuan,
			&h.KoperasiID, &h.NamaKoperasi, &h.Harga, &h.Tanggal); err != nil {
			return nil, err
		}
		result = append(result, h)
	}
	return result, nil
}

func (r *Repository) FindHargaPerbandingan(ctx context.Context, tanggal string) ([]HargaPerbandingan, error) {
	rows, err := r.db.Query(ctx, `
		SELECT
			k.id,
			k.nama,
			k.satuan,
			$1::text,
			AVG(hp.harga)::bigint,
			AVG(hk.harga)::bigint
		FROM bapok.komoditas k
		LEFT JOIN bapok.harga_harian hp ON hp.komoditas_id = k.id AND hp.tanggal = $1::date
		LEFT JOIN bapok.harga_koperasi hk ON hk.komoditas_id = k.id AND hk.tanggal = $1::date
		WHERE k.is_active = true
		GROUP BY k.id, k.nama, k.satuan
		HAVING AVG(hp.harga) IS NOT NULL OR AVG(hk.harga) IS NOT NULL
		ORDER BY k.nama ASC
	`, tanggal)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []HargaPerbandingan
	for rows.Next() {
		var h HargaPerbandingan
		if err := rows.Scan(&h.KomoditasID, &h.NamaKomoditas, &h.Satuan, &h.Tanggal,
			&h.HargaPasar, &h.HargaKoperasi); err != nil {
			return nil, err
		}
		if h.HargaPasar != nil && h.HargaKoperasi != nil {
			selisih := *h.HargaPasar - *h.HargaKoperasi
			h.Selisih = &selisih
		}
		result = append(result, h)
	}
	return result, nil
}

func (r *Repository) CreateHargaKoperasi(ctx context.Context, req CreateHargaKoperasiRequest) (*HargaKoperasi, error) {
	var h HargaKoperasi
	err := r.db.QueryRow(ctx,
		`INSERT INTO bapok.harga_koperasi (komoditas_id, koperasi_id, harga, tanggal, input_oleh)
		 VALUES ($1, $2, $3, $4, $5)
		 ON CONFLICT (komoditas_id, koperasi_id, tanggal)
		 DO UPDATE SET harga = EXCLUDED.harga, input_oleh = EXCLUDED.input_oleh
		 RETURNING id, komoditas_id, koperasi_id, harga, tanggal::text, input_oleh, created_at`,
		req.KomoditasID, req.KoperasiID, req.Harga, req.Tanggal, req.InputOleh,
	).Scan(&h.ID, &h.KomoditasID, &h.KoperasiID, &h.Harga, &h.Tanggal, &h.InputOleh, &h.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &h, nil
}

func (r *Repository) LoadKoperasiMap(ctx context.Context) (map[string]string, error) {
	rows, err := r.db.Query(ctx, `SELECT nama, id FROM bapok.koperasi WHERE is_active = true`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	m := make(map[string]string)
	for rows.Next() {
		var nama, id string
		if err := rows.Scan(&nama, &id); err != nil {
			return nil, err
		}
		m[nama] = id
	}
	return m, nil
}

func (r *Repository) UpsertHargaKoperasi(ctx context.Context, komoditasID, koperasiID string, harga int64, tanggal, inputOleh string) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO bapok.harga_koperasi (komoditas_id, koperasi_id, harga, tanggal, input_oleh)
		 VALUES ($1, $2, $3, $4, $5)
		 ON CONFLICT (komoditas_id, koperasi_id, tanggal)
		 DO UPDATE SET harga = EXCLUDED.harga, input_oleh = EXCLUDED.input_oleh`,
		komoditasID, koperasiID, harga, tanggal, inputOleh,
	)
	return err
}
