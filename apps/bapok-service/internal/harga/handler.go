package harga

import (
	"encoding/csv"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"bapok-service/internal/common"

	"github.com/gofiber/fiber/v2"
)

const (
	dateLayout      = "2006-01-02"
	errDateFormat   = "Format tanggal tidak valid, gunakan YYYY-MM-DD"
	headerUserNik   = "x-user-nik"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) FindHarga(c *fiber.Ctx) error {
	tanggal := c.Query("tanggal")
	if tanggal == "" {
		tanggal = time.Now().Format(dateLayout)
	} else if _, err := time.Parse(dateLayout, tanggal); err != nil {
		return common.Error(c, errDateFormat, 400)
	}
	pasarID := c.Query("pasar_id")

	result, err := h.service.FindHarga(c.Context(), tanggal, pasarID)
	if err != nil {
		log.Printf("Error finding harga: %v", err)
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "OK", 200)
}

func (h *Handler) FindHistori(c *fiber.Ctx) error {
	komoditasID := c.Params("komoditas_id")
	result, err := h.service.FindHistori(c.Context(), komoditasID)
	if err != nil {
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "OK", 200)
}

func (h *Handler) BulkCSV(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return common.Error(c, "File CSV tidak ditemukan", 400)
	}

	f, err := file.Open()
	if err != nil {
		return common.Error(c, "Gagal membuka file", 400)
	}
	defer f.Close()

	reader := csv.NewReader(f)
	records, err := reader.ReadAll()
	if err != nil {
		return common.Error(c, "Format CSV tidak valid", 400)
	}

	if len(records) < 2 {
		return common.Error(c, "CSV kosong atau hanya berisi header", 400)
	}

	var rows []BulkCSVRow
	var parseErrors []string

	// skip header (index 0)
	for i, rec := range records[1:] {
		lineNum := i + 2
		if len(rec) < 4 {
			parseErrors = append(parseErrors, fmt.Sprintf("baris %d: kolom tidak lengkap", lineNum))
			continue
		}

		harga, err := strconv.ParseInt(strings.TrimSpace(rec[2]), 10, 64)
		if err != nil || harga <= 0 {
			parseErrors = append(parseErrors, fmt.Sprintf("baris %d: harga tidak valid", lineNum))
			continue
		}

		tanggal := strings.TrimSpace(rec[3])
		if _, err := time.Parse(dateLayout, tanggal); err != nil {
			parseErrors = append(parseErrors, fmt.Sprintf("baris %d: format tanggal tidak valid (gunakan YYYY-MM-DD)", lineNum))
			continue
		}

		rows = append(rows, BulkCSVRow{
			NamaKomoditas: strings.TrimSpace(rec[0]),
			NamaPasar:     strings.TrimSpace(rec[1]),
			Harga:         harga,
			Tanggal:       tanggal,
		})
	}

	if len(parseErrors) > 0 && len(rows) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "Semua baris gagal diparse",
			"errors":  parseErrors,
			"code":    400,
		})
	}

	inputOleh := c.Get(headerUserNik)
	result, err := h.service.BulkCSV(c.Context(), rows, inputOleh)
	if err != nil {
		return common.HandleError(c, err)
	}

	result.Errors = append(parseErrors, result.Errors...)
	result.Gagal += len(parseErrors)

	return common.Success(c, result, "Bulk upload selesai", 200)
}

func (h *Handler) Create(c *fiber.Ctx) error {
	var req CreateHargaRequest
	if err := c.BodyParser(&req); err != nil {
		return common.Error(c, "Request tidak valid", 400)
	}

	req.InputOleh = c.Get(headerUserNik)

	if errs := common.ValidateStruct(req); errs != nil {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "Validasi gagal",
			"errors":  errs,
			"code":    400,
		})
	}

	result, err := h.service.Create(c.Context(), req)
	if err != nil {
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "Harga berhasil diinput", 201)
}

func (h *Handler) FindKoperasiAll(c *fiber.Ctx) error {
	result, err := h.service.FindKoperasiAll(c.Context())
	if err != nil {
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "OK", 200)
}

func (h *Handler) FindHargaKoperasi(c *fiber.Ctx) error {
	tanggal := c.Query("tanggal")
	if tanggal == "" {
		tanggal = time.Now().Format(dateLayout)
	} else if _, err := time.Parse(dateLayout, tanggal); err != nil {
		return common.Error(c, errDateFormat, 400)
	}
	koperasiID := c.Query("koperasi_id")

	result, err := h.service.FindHargaKoperasi(c.Context(), tanggal, koperasiID)
	if err != nil {
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "OK", 200)
}

func (h *Handler) FindPerbandingan(c *fiber.Ctx) error {
	tanggal := c.Query("tanggal")
	if tanggal == "" {
		tanggal = time.Now().Format(dateLayout)
	} else if _, err := time.Parse(dateLayout, tanggal); err != nil {
		return common.Error(c, errDateFormat, 400)
	}

	result, err := h.service.FindPerbandingan(c.Context(), tanggal)
	if err != nil {
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "OK", 200)
}

func (h *Handler) CreateHargaKoperasi(c *fiber.Ctx) error {
	var req CreateHargaKoperasiRequest
	if err := c.BodyParser(&req); err != nil {
		return common.Error(c, "Request tidak valid", 400)
	}

	req.InputOleh = c.Get(headerUserNik)

	if errs := common.ValidateStruct(req); errs != nil {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "Validasi gagal",
			"errors":  errs,
			"code":    400,
		})
	}

	result, err := h.service.CreateHargaKoperasi(c.Context(), req)
	if err != nil {
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "Harga koperasi berhasil diinput", 201)
}

func (h *Handler) BulkCSVKoperasi(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return common.Error(c, "File CSV tidak ditemukan", 400)
	}

	f, err := file.Open()
	if err != nil {
		return common.Error(c, "Gagal membuka file", 400)
	}
	defer f.Close()

	reader := csv.NewReader(f)
	records, err := reader.ReadAll()
	if err != nil {
		return common.Error(c, "Format CSV tidak valid", 400)
	}

	if len(records) < 2 {
		return common.Error(c, "CSV kosong atau hanya berisi header", 400)
	}

	var rows []BulkCSVRowKoperasi
	var parseErrors []string

	for i, rec := range records[1:] {
		lineNum := i + 2
		if len(rec) < 4 {
			parseErrors = append(parseErrors, fmt.Sprintf("baris %d: kolom tidak lengkap", lineNum))
			continue
		}

		harga, err := strconv.ParseInt(strings.TrimSpace(rec[2]), 10, 64)
		if err != nil || harga <= 0 {
			parseErrors = append(parseErrors, fmt.Sprintf("baris %d: harga tidak valid", lineNum))
			continue
		}

		tanggal := strings.TrimSpace(rec[3])
		if _, err := time.Parse(dateLayout, tanggal); err != nil {
			parseErrors = append(parseErrors, fmt.Sprintf("baris %d: format tanggal tidak valid (gunakan YYYY-MM-DD)", lineNum))
			continue
		}

		rows = append(rows, BulkCSVRowKoperasi{
			NamaKomoditas: strings.TrimSpace(rec[0]),
			NamaKoperasi:  strings.TrimSpace(rec[1]),
			Harga:         harga,
			Tanggal:       tanggal,
		})
	}

	if len(parseErrors) > 0 && len(rows) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "Semua baris gagal diparse",
			"errors":  parseErrors,
			"code":    400,
		})
	}

	inputOleh := c.Get(headerUserNik)
	result, err := h.service.BulkCSVKoperasi(c.Context(), rows, inputOleh)
	if err != nil {
		return common.HandleError(c, err)
	}

	result.Errors = append(parseErrors, result.Errors...)
	result.Gagal += len(parseErrors)

	return common.Success(c, result, "Bulk upload selesai", 200)
}
