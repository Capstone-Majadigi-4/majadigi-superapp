package common

import (
	"errors"

	"github.com/gofiber/fiber/v2"
)


type AppError struct {
	Code int
	Message string
}

func (e *AppError) Error() string {
	return e.Message
}

func NewNotFound(msg string) error {
	return &AppError{Code: 404, Message: msg}
}


func NewConflict(msg string) error {
	return &AppError{Code: 409, Message: msg}
}

func NewBadRequest(msg string) error {
	return &AppError{Code: 400, Message: msg}
}

func HandleError(c *fiber.Ctx, err error) error {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return Error(c, appErr.Message,appErr.Code)
	}
	return Error(c, "Internal Server Error", 500)
}