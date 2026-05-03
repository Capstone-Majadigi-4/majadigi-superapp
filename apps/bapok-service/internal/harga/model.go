package harga

import "time"

type HargaHarian struct {
    ID          string    `json:"id"`
    KomoditasID string    `json:"komoditas_id"`
    PasarID     string    `json:"pasar_id"`
    Harga       int64     `json:"harga"`
    Tanggal     string    `json:"tanggal"`
    InputOleh   *string   `json:"input_oleh"`
    CreatedAt   time.Time `json:"created_at"`
}


type HargaWithDetail struct {
	ID            string `json:"id"`
	KomoditasID   string `json:"komoditas_id"`
	NamaKomoditas string `json:"nama_komoditas"`
	Satuan        string `json:"satuan"`
	PasarID       string `json:"pasar_id"`
	NamaPasar     string `json:"nama_pasar"`
	Harga         int64  `json:"harga"`
	Tanggal       string `json:"tanggal"`
}

type HargaHistori struct {
	Tanggal string `json:"tanggal"`
	Harga   int64  `json:"harga"`
	PasarID string `json:"pasar_id"`
	NamaPasar string `json:"nama_pasar"`
}

type CreateHargaRequest struct {
	KomoditasID string `json:"komoditas_id" validate:"required,uuid"`
	PasarID     string `json:"pasar_id" validate:"required,uuid"`
	Harga       int64  `json:"harga" validate:"required,min=0"`
	Tanggal     string `json:"tanggal" validate:"required"`
	InputOleh   string `json:"input_oleh"`
}

type AlertToCheck struct {
	ID      string
	UserNik string
	Tipe    string
	Nominal int64
}

type BulkCSVRow struct {
	NamaKomoditas string
	NamaPasar     string
	Harga         int64
	Tanggal       string
}

type BulkCSVResult struct {
	Total   int      `json:"total"`
	Sukses  int      `json:"sukses"`
	Gagal   int      `json:"gagal"`
	Errors  []string `json:"errors,omitempty"`
}

