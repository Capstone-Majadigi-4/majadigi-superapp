package seeder

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Run(db *pgxpool.Pool) {
	ctx := context.Background()
	seedKomoditas(ctx, db)
	seedPasar(ctx, db)
}

func seedKomoditas(ctx context.Context, db *pgxpool.Pool) {
	var count int
	db.QueryRow(ctx, `SELECT COUNT(1) FROM bapok.komoditas`).Scan(&count)
	if count > 0 {
		return
	}

	komoditas := []struct{ nama, kategori, satuan string }{
		{"Beras Medium", "Pokok", "kg"},
		{"Cabai Merah Keriting", "Sayuran", "kg"},
		{"Bawang Merah", "Sayuran", "kg"},
		{"Bawang Putih", "Sayuran", "kg"},
		{"Minyak Goreng", "Pokok", "liter"},
		{"Gula Pasir", "Pokok", "kg"},
		{"Tepung Terigu", "Pokok", "kg"},
		{"Daging Ayam", "Protein", "kg"},
		{"Daging Sapi", "Protein", "kg"},
		{"Telur Ayam", "Protein", "kg"},
	}

	for _, k := range komoditas {
		db.Exec(ctx,
			`INSERT INTO bapok.komoditas (nama, kategori, satuan) VALUES ($1, $2, $3)`,
			k.nama, k.kategori, k.satuan,
		)
	}
	log.Println("Seeded: komoditas")
}

func seedPasar(ctx context.Context, db *pgxpool.Pool) {
	var count int
	db.QueryRow(ctx, `SELECT COUNT(1) FROM bapok.pasar`).Scan(&count)
	if count > 0 {
		return
	}

	pasar := []struct {
		nama, kota string
		lat, lng   float64
	}{
		{"Pasar Besar Malang", "Malang", -7.9797, 112.6304},
		{"Pasar Oro-Oro Dowo", "Malang", -7.9811, 112.6201},
		{"Pasar Blimbing", "Malang", -7.9523, 112.6378},
		{"Pasar Sukun", "Malang", -8.0012, 112.6089},
	}

	for _, p := range pasar {
		db.Exec(ctx,
			`INSERT INTO bapok.pasar (nama, kota, lat, lng) VALUES ($1, $2, $3, $4)`,
			p.nama, p.kota, p.lat, p.lng,
		)
	}
	log.Println("Seeded: pasar")
}
