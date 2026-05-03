package komoditas

import (
	"bapok-service/internal/common"
	"log"

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
		log.Printf("Error finding all komoditas: %v", err)
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "OK", 200)
}

func (h *Handler) FindById(c *fiber.Ctx) error {
	id := c.Params("id")
	result, err := h.service.FindById(c.Context(), id)
	if err != nil {
		log.Printf("Error finding komoditas by ID: %v", err)
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "OK", 200)
}

func (h *Handler) Create(c *fiber.Ctx) error {
	var req CreateKomoditasRequest
	if err := c.BodyParser(&req); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return common.Error(c, "Request tidak Valid",400)
	}

	if errs := common.ValidateStruct(req); errs != nil {
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"message": "Validasi gagal",
			"errors": errs,
			"code": 400,
		})
	}

	result, err := h.service.Create(c.Context(), req)
	if err != nil {
		return common.HandleError(c, err)
	}

	return common.Success(c, result, "Komoditas berhasil dibuat", 201)
}