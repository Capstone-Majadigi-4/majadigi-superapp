package komoditas

import "time"


type Komoditas struct {
	ID            string    `json:"id"`
	Nama          string    `json:"nama"`
	Kategori      *string   `json:"kategori"`
	Satuan        *string   `json:"satuan"`
	IkonURL       *string   `json:"ikon_url"`
	IsActive      bool      `json:"is_active"`
	CreatedAt     time.Time `json:"created_at"`
	HargaRataRata *int64    `json:"harga_rata_rata"`
	HargaTerendah *int64    `json:"harga_terendah"`
	HargaTertinggi *int64   `json:"harga_tertinggi"`
	TanggalHarga  *string   `json:"tanggal_harga"`
}



type CreateKomoditasRequest struct {
	Nama     string `json:"nama" validate:"required"`
	Kategori string `json:"kategori" validate:"required"`
	Satuan   string `json:"satuan" validate:"required"`
	IkonURL  string `json:"ikon_url" validate:"required,url"`
}

type UpdateKomoditasRequest struct {
	Nama     *string `json:"nama"`
	Kategori *string `json:"kategori"`
	Satuan   *string `json:"satuan"`
	IkonURL  *string `json:"ikon_url" validate:"omitempty,url"`
	IsActive *bool   `json:"is_active"`
}