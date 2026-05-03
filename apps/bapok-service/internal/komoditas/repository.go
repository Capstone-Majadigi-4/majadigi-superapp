package komoditas

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


func (r *Repository) FindAll(ctx context.Context) ([]Komoditas, error) {
	query := `
		SELECT
			k.id,
			k.nama,
			k.kategori,
			k.satuan,
			k.ikon_url,
			k.is_active,
			k.created_at,
			CAST(AVG(h.harga) AS BIGINT)  AS harga_rata_rata,
			MIN(h.harga)                   AS harga_terendah,
			MAX(h.harga)                   AS harga_tertinggi,
			MAX(h.tanggal::text)           AS tanggal_harga
		FROM komoditas k
		LEFT JOIN harga_harian h ON h.komoditas_id = k.id
			AND h.tanggal = CURRENT_DATE
		WHERE k.is_active = true
		GROUP BY k.id, k.nama, k.kategori, k.satuan, k.ikon_url, k.is_active, k.created_at
		ORDER BY k.nama ASC
	`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []Komoditas
	for rows.Next() {
		var k Komoditas
		err := rows.Scan(
			&k.ID,
			&k.Nama,
			&k.Kategori,
			&k.Satuan,
			&k.IkonURL,
			&k.IsActive,
			&k.CreatedAt,
			&k.HargaRataRata,
			&k.HargaTerendah,
			&k.HargaTertinggi,
			&k.TanggalHarga,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, k)
	}
	return result, nil
}


func (r *Repository) FindById(ctx context.Context, id string) (*Komoditas, error) {
	var k Komoditas

	err := r.db.QueryRow(ctx,
		`SELECT id, nama, kategori, satuan, ikon_url, is_active, created_at
		 FROM bapok.komoditas WHERE id = $1`,
		id,
	).Scan(&k.ID, &k.Nama, &k.Kategori, &k.Satuan, &k.IkonURL, &k.IsActive, &k.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &k, nil
}

func (r *Repository) Create(ctx context.Context, req CreateKomoditasRequest) (*Komoditas, error) {
	var k Komoditas

	err := r.db.QueryRow(ctx,
		`INSERT INTO bapok.komoditas (nama, kategori, satuan, ikon_url)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, nama, kategori, satuan, ikon_url, is_active, created_at`,
		req.Nama, req.Kategori, req.Satuan, req.IkonURL,
	).Scan(&k.ID, &k.Nama, &k.Kategori, &k.Satuan, &k.IkonURL, &k.IsActive, &k.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &k, nil
}