package ticker

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

func (h *Handler) FindTicker(c *fiber.Ctx) error {
	result, err := h.service.FindTicker(c.Context())
	if err != nil {
		return common.HandleError(c, err)
	}
	return common.Success(c, result, "OK", 200)
}
