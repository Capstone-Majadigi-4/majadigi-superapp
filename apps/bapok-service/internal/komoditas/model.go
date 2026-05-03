package komoditas

import "time"


type Komoditas struct {
	ID  string    `json:"id"`
	Nama string    `json:"nama"`
	Kategori string `json:"kategori"`
	Satuan string   `json:"satuan"`
	IkonURL string  `json:"ikon_url"`
	IsActive bool    `json:"is_active"`
	CreatedAt time.Time  `json:"created_at"`

}

type CreateKomoditasRequest struct {
	Nama string    `json:"nama" validate:"required"`
	Kategori string `json:"kategori" validate:"required"`
	Satuan string   `json:"satuan" validate:"required"`
	IkonURL string  `json:"ikon_url" validate:"required,url"`
}