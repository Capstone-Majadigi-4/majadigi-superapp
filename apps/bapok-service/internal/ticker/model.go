package ticker

type TickerItem struct {
	KomoditasID    string  `json:"komoditas_id"`
	NamaKomoditas  string  `json:"nama_komoditas"`
	Satuan         string  `json:"satuan"`
	HargaHariIni   int64   `json:"harga_hari_ini"`
	HargaKemarin   int64   `json:"harga_kemarin"`
	Perubahan      int64   `json:"perubahan"`
	PersenPerubahan float64 `json:"persen_perubahan"`
}
