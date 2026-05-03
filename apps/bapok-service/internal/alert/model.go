package alert

import "time"

type PriceAlert struct {
	ID              string     `json:"id"`
	UserNik         string     `json:"user_nik"`
	KomoditasID     string     `json:"komoditas_id"`
	Tipe            string     `json:"tipe"`
	Nominal         int64      `json:"nominal"`
	IsActive        bool       `json:"is_active"`
	LastTriggeredAt *time.Time `json:"last_triggered_at"`
	CreatedAt       time.Time  `json:"created_at"`
}

type AlertWithDetail struct {
	ID              string     `json:"id"`
	KomoditasID     string     `json:"komoditas_id"`
	NamaKomoditas   string     `json:"nama_komoditas"`
	Tipe            string     `json:"tipe"`
	Nominal         int64      `json:"nominal"`
	IsActive        bool       `json:"is_active"`
	LastTriggeredAt *time.Time `json:"last_triggered_at"`
	CreatedAt       time.Time  `json:"created_at"`
}

type CreateAlertRequest struct {
	KomoditasID string `json:"komoditas_id" validate:"required,uuid"`
	Tipe        string `json:"tipe" validate:"required,oneof=naik_diatas turun_dibawah"`
	Nominal     int64  `json:"nominal" validate:"required,min=1"`
}
