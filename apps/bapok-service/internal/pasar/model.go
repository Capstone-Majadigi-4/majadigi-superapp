package pasar

type Pasar struct {
    ID       string   `json:"id"`
    Nama     string   `json:"nama"`
    Kota     *string  `json:"kota"`
    Lat      *float64 `json:"lat"`
    Lng      *float64 `json:"lng"`
    IsActive bool     `json:"is_active"`
}


type CreatePasarRequest struct {
	Nama string  `json:"nama" validate:"required"`
	Kota string  `json:"kota" validate:"required"`
	Lat  float64 `json:"lat"`
	Lng  float64 `json:"lng"`
}