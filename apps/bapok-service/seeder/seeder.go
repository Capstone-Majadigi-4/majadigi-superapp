package seeder

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// komoditasSeedData menyimpan semua data referensi komoditas dalam satu tempat
// agar tidak ada duplikasi string literal di fungsi seed lainnya.
type komoditasSeedData struct {
	nama, kategori, satuan string
	hargaPasar             int64
	hargaKoperasi          int64 // ~10% lebih murah, simulasi subsidi koperasi
}

var komoditasSeed = []komoditasSeedData{
	{"Beras Medium", "Pokok", "kg", 13000, 11700},
	{"Cabai Merah Keriting", "Sayuran", "kg", 45000, 40500},
	{"Bawang Merah", "Sayuran", "kg", 32000, 28800},
	{"Bawang Putih", "Sayuran", "kg", 28000, 25200},
	{"Minyak Goreng", "Pokok", "liter", 18000, 16200},
	{"Gula Pasir", "Pokok", "kg", 17000, 15300},
	{"Tepung Terigu", "Pokok", "kg", 12000, 10800},
	{"Daging Ayam", "Protein", "kg", 35000, 31500},
	{"Daging Sapi", "Protein", "kg", 130000, 117000},
	{"Telur Ayam", "Protein", "kg", 28000, 25200},
}

func Run(db *pgxpool.Pool) {
	ctx := context.Background()
	seedKomoditas(ctx, db)
	seedPasar(ctx, db)
	seedKoperasi(ctx, db)
	seedHarga(ctx, db)
	seedHargaKoperasi(ctx, db)
}

func seedKomoditas(ctx context.Context, db *pgxpool.Pool) {
	var count int
	db.QueryRow(ctx, `SELECT COUNT(1) FROM bapok.komoditas`).Scan(&count)
	if count > 0 {
		return
	}

	for _, k := range komoditasSeed {
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

func seedKoperasi(ctx context.Context, db *pgxpool.Pool) {
	var count int
	db.QueryRow(ctx, `SELECT COUNT(1) FROM bapok.koperasi`).Scan(&count)
	if count > 0 {
		return
	}

	koperasi := []struct{ nama, kota string }{
		{"Koperasi Merah Putih Klojen", "Malang"},
		{"Koperasi Merah Putih Blimbing", "Malang"},
		{"Koperasi Merah Putih Lowokwaru", "Malang"},
		{"Koperasi Merah Putih Sukun", "Malang"},
	}

	for _, k := range koperasi {
		db.Exec(ctx,
			`INSERT INTO bapok.koperasi (nama, kota) VALUES ($1, $2)`,
			k.nama, k.kota,
		)
	}
	log.Println("Seeded: koperasi")
}

func seedHarga(ctx context.Context, db *pgxpool.Pool) {
	var count int
	db.QueryRow(ctx, `SELECT COUNT(1) FROM bapok.harga_harian WHERE tanggal = CURRENT_DATE`).Scan(&count)
	if count > 0 {
		return
	}

	hargaDasar := buildHargaMap(false)
	variasiPasar := []int64{0, 500, -500, 1000}

	komoditasList, err := queryKomoditasItems(ctx, db)
	if err != nil {
		log.Printf("seedHarga: gagal query komoditas: %v", err)
		return
	}

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
	for i := range 7 {
		tanggal := today.AddDate(0, 0, -i).Format("2006-01-02")
		dayOffset := int64(i) * 200
		for _, k := range komoditasList {
			dasar := hargaDasar[k.nama]
			for pi, pasarID := range pasarIDs {
				harga := max(dasar+variasiPasar[pi%len(variasiPasar)]-dayOffset, 1000)
				db.Exec(ctx,
					`INSERT INTO bapok.harga_harian (komoditas_id, pasar_id, harga, tanggal) VALUES ($1, $2, $3, $4)`,
					k.id, pasarID, harga, tanggal,
				)
				inserted++
			}
		}
	}
	log.Printf("Seeded: harga (%d rows)", inserted)
}

func seedHargaKoperasi(ctx context.Context, db *pgxpool.Pool) {
	var count int
	db.QueryRow(ctx, `SELECT COUNT(1) FROM bapok.harga_koperasi WHERE tanggal = CURRENT_DATE`).Scan(&count)
	if count > 0 {
		return
	}

	hargaDasar := buildHargaMap(true)
	variasiKoperasi := []int64{0, 300, -300, 600}

	komoditasList, err := queryKomoditasItems(ctx, db)
	if err != nil {
		log.Printf("seedHargaKoperasi: gagal query komoditas: %v", err)
		return
	}

	koperasiRows, err := db.Query(ctx, `SELECT id FROM bapok.koperasi ORDER BY nama`)
	if err != nil {
		log.Printf("seedHargaKoperasi: gagal query koperasi: %v", err)
		return
	}
	defer koperasiRows.Close()

	var koperasiIDs []string
	for koperasiRows.Next() {
		var id string
		koperasiRows.Scan(&id)
		koperasiIDs = append(koperasiIDs, id)
	}

	today := time.Now()
	inserted := 0
	for i := range 7 {
		tanggal := today.AddDate(0, 0, -i).Format("2006-01-02")
		dayOffset := int64(i) * 180
		for _, k := range komoditasList {
			dasar := hargaDasar[k.nama]
			for ki, koperasiID := range koperasiIDs {
				harga := max(dasar+variasiKoperasi[ki%len(variasiKoperasi)]-dayOffset, 1000)
				db.Exec(ctx,
					`INSERT INTO bapok.harga_koperasi (komoditas_id, koperasi_id, harga, tanggal) VALUES ($1, $2, $3, $4)`,
					k.id, koperasiID, harga, tanggal,
				)
				inserted++
			}
		}
	}
	log.Printf("Seeded: harga_koperasi (%d rows)", inserted)
}

// buildHargaMap membangun map nama→harga dari komoditasSeed.
// Jika koperasi=true, gunakan hargaKoperasi; sebaliknya hargaPasar.
func buildHargaMap(koperasi bool) map[string]int64 {
	m := make(map[string]int64, len(komoditasSeed))
	for _, k := range komoditasSeed {
		if koperasi {
			m[k.nama] = k.hargaKoperasi
		} else {
			m[k.nama] = k.hargaPasar
		}
	}
	return m
}

type komoditasItem struct {
	id   string
	nama string
}

func queryKomoditasItems(ctx context.Context, db *pgxpool.Pool) ([]komoditasItem, error) {
	rows, err := db.Query(ctx, `SELECT id, nama FROM bapok.komoditas`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []komoditasItem
	for rows.Next() {
		var k komoditasItem
		rows.Scan(&k.id, &k.nama)
		list = append(list, k)
	}
	return list, nil
}
