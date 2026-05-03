package ticker

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

func (r *Repository) FindTopVolatile(ctx context.Context) ([]TickerItem, error) {
	rows, err := r.db.Query(ctx, `
		WITH hari_ini AS (
			SELECT komoditas_id, AVG(harga)::BIGINT AS harga
			FROM bapok.harga_harian
			WHERE tanggal = CURRENT_DATE
			GROUP BY komoditas_id
		),
		kemarin AS (
			SELECT komoditas_id, AVG(harga)::BIGINT AS harga
			FROM bapok.harga_harian
			WHERE tanggal = CURRENT_DATE - INTERVAL '1 day'
			GROUP BY komoditas_id
		)
		SELECT
			k.id,
			k.nama,
			k.satuan,
			h.harga                                      AS harga_hari_ini,
			km.harga                                     AS harga_kemarin,
			h.harga - km.harga                           AS perubahan,
			ROUND((h.harga - km.harga)::numeric / km.harga * 100, 2) AS persen_perubahan
		FROM hari_ini h
		JOIN kemarin km ON km.komoditas_id = h.komoditas_id
		JOIN bapok.komoditas k ON k.id = h.komoditas_id
		WHERE k.is_active = true AND km.harga > 0
		ORDER BY ABS(h.harga - km.harga) DESC
		LIMIT 3
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []TickerItem
	for rows.Next() {
		var t TickerItem
		if err := rows.Scan(
			&t.KomoditasID, &t.NamaKomoditas, &t.Satuan,
			&t.HargaHariIni, &t.HargaKemarin,
			&t.Perubahan, &t.PersenPerubahan,
		); err != nil {
			return nil, err
		}
		result = append(result, t)
	}
	return result, nil
}
