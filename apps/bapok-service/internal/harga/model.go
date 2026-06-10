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

type Koperasi struct {
	ID   string `json:"id"`
	Nama string `json:"nama"`
	Kota string `json:"kota"`
}

type HargaKoperasi struct {
	ID          string    `json:"id"`
	KomoditasID string    `json:"komoditas_id"`
	KoperasiID  string    `json:"koperasi_id"`
	Harga       int64     `json:"harga"`
	Tanggal     string    `json:"tanggal"`
	InputOleh   *string   `json:"input_oleh"`
	CreatedAt   time.Time `json:"created_at"`
}

type HargaKoperasiDetail struct {
	ID            string `json:"id"`
	KomoditasID   string `json:"komoditas_id"`
	NamaKomoditas string `json:"nama_komoditas"`
	Satuan        string `json:"satuan"`
	KoperasiID    string `json:"koperasi_id"`
	NamaKoperasi  string `json:"nama_koperasi"`
	Harga         int64  `json:"harga"`
	Tanggal       string `json:"tanggal"`
}

type HargaPerbandingan struct {
	KomoditasID   string `json:"komoditas_id"`
	NamaKomoditas string `json:"nama_komoditas"`
	Satuan        string `json:"satuan"`
	Tanggal       string `json:"tanggal"`
	HargaPasar    *int64 `json:"harga_pasar"`
	HargaKoperasi *int64 `json:"harga_koperasi"`
	Selisih       *int64 `json:"selisih"`
}

type CreateHargaKoperasiRequest struct {
	KomoditasID string `json:"komoditas_id" validate:"required,uuid"`
	KoperasiID  string `json:"koperasi_id" validate:"required,uuid"`
	Harga       int64  `json:"harga" validate:"required,min=0"`
	Tanggal     string `json:"tanggal" validate:"required"`
	InputOleh   string `json:"input_oleh"`
}

type BulkCSVRowKoperasi struct {
	NamaKomoditas string
	NamaKoperasi  string
	Harga         int64
	Tanggal       string
}

