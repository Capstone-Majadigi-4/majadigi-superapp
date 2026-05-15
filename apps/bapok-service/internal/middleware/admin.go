package middleware

import (
	"bapok-service/internal/common"

	"github.com/gofiber/fiber/v2"
)

func AdminGuard(adminKey string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		key := c.Get("x-admin-key")
		if key == "" || key != adminKey {
			return common.Error(c, "Akses admin tidak diizinkan", 401)
		}
		return c.Next()
	}
}
