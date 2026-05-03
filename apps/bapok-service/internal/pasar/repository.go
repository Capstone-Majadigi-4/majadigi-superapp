package pasar

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


func (r *Repository) FindAll(ctx context.Context) ([]Pasar, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, nama, kota, lat, lng, is_active
		 FROM bapok.pasar WHERE is_active = true ORDER BY nama ASC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var result []Pasar

	for rows.Next() {
		var p Pasar
		if err := rows.Scan(&p.ID, &p.Nama, &p.Kota, &p.Lat, &p.Lng, &p.IsActive); err != nil {
			return nil, err
		}
		result = append(result, p)
	}

	return result, nil
}

func (r *Repository) Create(ctx context.Context, req CreatePasarRequest) (*Pasar, error) {
	var p Pasar

	err := r.db.QueryRow(ctx,
		`INSERT INTO bapok.pasar (nama, kota, lat, lng)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, nama, kota, lat, lng, is_active`,
		req.Nama, req.Kota, req.Lat, req.Lng,
	).Scan(&p.ID, &p.Nama, &p.Kota, &p.Lat, &p.Lng, &p.IsActive)
	if err != nil {
		return nil, err
	}

	return &p, nil
}