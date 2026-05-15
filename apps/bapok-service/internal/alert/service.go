package alert

import (
	"context"

	"bapok-service/internal/common"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) FindByUser(ctx context.Context, userNik string) ([]AlertWithDetail, error) {
	return s.repo.FindByUser(ctx, userNik)
}

func (s *Service) Create(ctx context.Context, userNik string, req CreateAlertRequest) (*PriceAlert, error) {
	result, err := s.repo.Create(ctx, userNik, req)
	if err != nil {
		if err == ErrDuplicate {
			return nil, common.NewConflict("Alert untuk komoditas dan tipe ini sudah ada")
		}
		return nil, err
	}
	return result, nil
}

func (s *Service) Delete(ctx context.Context, id, userNik string) error {
	if err := s.repo.Delete(ctx, id, userNik); err != nil {
		if err == ErrNotFound {
			return common.NewNotFound("Alert tidak ditemukan atau bukan milik Anda")
		}
		return err
	}
	return nil
}
