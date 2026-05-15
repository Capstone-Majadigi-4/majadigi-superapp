package alert

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

func (h *Handler) FindByUser(c *fiber.Ctx) error {
	userNik := c.Get("x-user-nik")
	if userNik == "" {
		return common.Error(c, "x-user-nik header diperlukan", 401)
	}

	result, err := h.service.FindByUser(c.Context(), userNik)
	if err != nil {
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "OK", 200)
}

func (h *Handler) Create(c *fiber.Ctx) error {
	userNik := c.Get("x-user-nik")
	if userNik == "" {
		return common.Error(c, "x-user-nik header diperlukan", 401)
	}

	var req CreateAlertRequest
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

	result, err := h.service.Create(c.Context(), userNik, req)
	if err != nil {
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "Alert berhasil dibuat", 201)
}

func (h *Handler) Delete(c *fiber.Ctx) error {
	userNik := c.Get("x-user-nik")
	if userNik == "" {
		return common.Error(c, "x-user-nik header diperlukan", 401)
	}

	id := c.Params("id")
	if err := h.service.Delete(c.Context(), id, userNik); err != nil {
		return common.HandleError(c, err)
	}
	return common.Success(c, nil, "Alert berhasil dihapus", 200)
}
