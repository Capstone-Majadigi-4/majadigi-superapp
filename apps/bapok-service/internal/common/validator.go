package common

import "github.com/go-playground/validator/v10"

var validate = validator.New()

type ValidationError struct {
	Field string `json:"field"`
	Message string `json:"message"`
}

func ValidateStruct(s any) []ValidationError {
	var result []ValidationError

	err := validate.Struct(s)
	if err == nil {
		return nil
	}

	for _, e := range err.(validator.ValidationErrors) {
		result = append(result, ValidationError{
			Field:   e.Field(),
			Message: e.Tag(),
		})
	}

	return result
}