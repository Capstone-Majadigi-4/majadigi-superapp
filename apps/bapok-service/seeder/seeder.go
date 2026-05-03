package seeder

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Run(db *pgxpool.Pool) {
	ctx := context.Background()
	seedKomoditas(ctx, db)
	seedPasar(ctx, db)
	seedHarga(ctx, db)
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

func seedHarga(ctx context.Context, db *pgxpool.Pool) {
	var count int
	db.QueryRow(ctx, `SELECT COUNT(1) FROM bapok.harga_harian WHERE tanggal = CURRENT_DATE`).Scan(&count)
	if count > 0 {
		return
	}

	// harga dasar per komoditas (nama -> harga_dasar dalam rupiah)
	hargaDasar := map[string]int64{
		"Beras Medium":         13000,
		"Cabai Merah Keriting": 45000,
		"Bawang Merah":         32000,
		"Bawang Putih":         28000,
		"Minyak Goreng":        18000,
		"Gula Pasir":           17000,
		"Tepung Terigu":        12000,
		"Daging Ayam":          35000,
		"Daging Sapi":          130000,
		"Telur Ayam":           28000,
	}

	// variasi harga per pasar (index 0-3 = 4 pasar)
	variasiPasar := []int64{0, 500, -500, 1000}

	// ambil semua komoditas
	komoditasRows, err := db.Query(ctx, `SELECT id, nama FROM bapok.komoditas`)
	if err != nil {
		log.Printf("seedHarga: gagal query komoditas: %v", err)
		return
	}
	defer komoditasRows.Close()

	var komoditasList []komoditasItem
	for komoditasRows.Next() {
		var k komoditasItem
		komoditasRows.Scan(&k.id, &k.nama)
		komoditasList = append(komoditasList, k)
	}

	// ambil semua pasar
	pasarRows, err := db.Query(ctx, `SELECT id FROM bapok.pasar ORDER BY nama`)
	if err != nil {
		log.Printf("seedHarga: gagal query pasar: %v", err)
		return
	}
	defer pasarRows.Close()

	var pasarIDs []string
	for pasarRows.Next() {
		var id string
		pasarRows.Scan(&id)
		pasarIDs = append(pasarIDs, id)
	}

	today := time.Now()
	inserted := 0
	cfg := hargaSeedConfig{
		komoditasList: komoditasList,
		pasarIDs:      pasarIDs,
		hargaDasar:    hargaDasar,
		variasiPasar:  variasiPasar,
	}
	for i := range 7 {
		tanggal := today.AddDate(0, 0, -i).Format("2006-01-02")
		inserted += insertHargaPerTanggal(ctx, db, cfg, tanggal, int64(i)*200)
	}
	log.Printf("Seeded: harga (%d rows)", inserted)
}

type komoditasItem struct {
	id   string
	nama string
}

type hargaSeedConfig struct {
	komoditasList []komoditasItem
	pasarIDs      []string
	hargaDasar    map[string]int64
	variasiPasar  []int64
}

func insertHargaPerTanggal(ctx context.Context, db *pgxpool.Pool, cfg hargaSeedConfig, tanggal string, dayOffset int64) int {
	count := 0
	for _, k := range cfg.komoditasList {
		dasar, ok := cfg.hargaDasar[k.nama]
		if !ok {
			dasar = 10000
		}
		for pi, pasarID := range cfg.pasarIDs {
			harga := max(dasar+cfg.variasiPasar[pi%len(cfg.variasiPasar)]-dayOffset, 1000)
			db.Exec(ctx,
				`INSERT INTO bapok.harga (komoditas_id, pasar_id, harga, tanggal) VALUES ($1, $2, $3, $4)`,
				k.id, pasarID, harga, tanggal,
			)
			count++
		}
	}
	return count
}
