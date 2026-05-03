package alert

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

func (r *Repository) FindByUser(ctx context.Context, userNik string) ([]AlertWithDetail, error) {
	rows, err := r.db.Query(ctx,
		`SELECT a.id, a.komoditas_id, k.nama, a.tipe, a.nominal,
		        a.is_active, a.last_triggered_at, a.created_at
		 FROM bapok.price_alert a
		 JOIN bapok.komoditas k ON k.id = a.komoditas_id
		 WHERE a.user_nik = $1
		 ORDER BY a.created_at DESC`,
		userNik,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []AlertWithDetail
	for rows.Next() {
		var a AlertWithDetail
		if err := rows.Scan(&a.ID, &a.KomoditasID, &a.NamaKomoditas, &a.Tipe,
			&a.Nominal, &a.IsActive, &a.LastTriggeredAt, &a.CreatedAt); err != nil {
			return nil, err
		}
		result = append(result, a)
	}
	return result, nil
}

func (r *Repository) Create(ctx context.Context, userNik string, req CreateAlertRequest) (*PriceAlert, error) {
	var a PriceAlert
	err := r.db.QueryRow(ctx,
		`INSERT INTO bapok.price_alert (user_nik, komoditas_id, tipe, nominal)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, user_nik, komoditas_id, tipe, nominal, is_active, last_triggered_at, created_at`,
		userNik, req.KomoditasID, req.Tipe, req.Nominal,
	).Scan(&a.ID, &a.UserNik, &a.KomoditasID, &a.Tipe, &a.Nominal,
		&a.IsActive, &a.LastTriggeredAt, &a.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func (r *Repository) Delete(ctx context.Context, id, userNik string) error {
	result, err := r.db.Exec(ctx,
		`DELETE FROM bapok.price_alert WHERE id = $1 AND user_nik = $2`,
		id, userNik,
	)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}
