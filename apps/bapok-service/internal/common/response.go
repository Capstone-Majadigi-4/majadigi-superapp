package common

import "github.com/gofiber/fiber/v2"


type Response struct {
	Status string      `json:"status"`
	Message string      `json:"message"`
	Data any 	   `json:"data"`
	Code int		 `json:"code"`
}

func Success(c *fiber.Ctx, data any, message string, code int) error {
	return c.Status(code).JSON(Response{
		Status:  "success",
		Message: message,
		Data:    data,
		Code:    code,
	})
}

func Error(c *fiber.Ctx, message string, code int) error {
	return c.Status(code).JSON(Response{
		Status: "error",
		Message: message,
		Data:    nil,
		Code:    code,
	})
}