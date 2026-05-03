package pasar

import (
	"bapok-service/internal/common"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) FindAll(c *fiber.Ctx) error {
	result, err := h.service.FindAll(c.Context())
	if err != nil {
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "OK", 200)
}

func (h *Handler) Create(c *fiber.Ctx) error {
	var req CreatePasarRequest
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
	return common.Success(c, result, "Pasar berhasil ditambahkan", 201)
}
