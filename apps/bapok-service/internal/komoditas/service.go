package komoditas

import (
	"bapok-service/internal/common"
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
)

const cacheKey = "bapok:komoditas:all"
const cacheTTL = 10 * time.Minute

type Service struct {
	repo *Repository
	rdb *redis.Client
}

func NewService(repo *Repository, rdb *redis.Client) *Service {
	return &Service{
		repo: repo,
		rdb: rdb,
	}
}

func (s *Service) FindAll(ctx context.Context) ([]Komoditas, error) {
	cached, err := s.rdb.Get(ctx, cacheKey).Bytes()
	if err == nil {
		var result []Komoditas
		if err := json.Unmarshal(cached, &result); err == nil {
			return result, nil
		}
	}

	result, err := s.repo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	if len(result) > 0 {
		if b, err := json.Marshal(result); err == nil {
			s.rdb.Set(ctx, cacheKey, b, cacheTTL)
		}
	}

	return result, nil
}

func (s *Service) FindById(ctx context.Context, id string) (*Komoditas, error) {
	k, err := s.repo.FindById(ctx,id)
	if err != nil {
		return nil, common.NewNotFound("Komoditas tidak ditemukan")
	}
	return k, nil
}

func (s *Service) Create(ctx context.Context, req CreateKomoditasRequest) (*Komoditas, error) {
	result, err := s.repo.Create(ctx, req)
	if err != nil {
		return nil, err
	}

	s.rdb.Del(ctx, cacheKey)

	return result, nil
}

func (s *Service) Update(ctx context.Context, id string, req UpdateKomoditasRequest) (*Komoditas, error) {
	result, err := s.repo.Update(ctx, id, req)
	if err != nil {
		if err == ErrNotFound {
			return nil, common.NewNotFound("Komoditas tidak ditemukan")
		}
		return nil, err
	}

	s.rdb.Del(ctx, cacheKey)

	return result, nil
}

func (s *Service) Delete(ctx context.Context, id string) error {
	if err := s.repo.Delete(ctx, id); err != nil {
		if err == ErrNotFound {
			return common.NewNotFound("Komoditas tidak ditemukan")
		}
		return err
	}

	s.rdb.Del(ctx, cacheKey)

	return nil
}