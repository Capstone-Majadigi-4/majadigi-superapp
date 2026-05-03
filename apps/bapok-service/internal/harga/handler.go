package harga

import (
	"time"

	"bapok-service/internal/common"

	"github.com/gofiber/fiber/v2"
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
		tanggal = time.Now().Format("2006-01-02")
	}
	pasarID := c.Query("pasar_id")

	result, err := h.service.FindHarga(c.Context(), tanggal, pasarID)
	if err != nil {
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

func (h *Handler) Create(c *fiber.Ctx) error {
	var req CreateHargaRequest
	if err := c.BodyParser(&req); err != nil {
		return common.Error(c, "Request tidak valid", 400)
	}

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
