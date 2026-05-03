package pasar

import (
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
)

const cacheKey = "bapok:pasar:all"
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

func (s *Service) FindAll(ctx context.Context) ([]Pasar, error) {
	cached, err := s.rdb.Get(ctx, cacheKey).Bytes()
	if err == nil {
		var result []Pasar
		if err := json.Unmarshal(cached, &result); err == nil {
			return result, nil
		}
	}

	result, err := s.repo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	if b, err := json.Marshal(result); err == nil {
		s.rdb.Set(ctx, cacheKey, b, cacheTTL)
	}

	return result, nil
}

func (s *Service) Create(ctx context.Context, req CreatePasarRequest) (*Pasar, error) {
	result, err := s.repo.Create(ctx, req)
	if err != nil {
		return nil, err
	}
	s.rdb.Del(ctx, cacheKey)
	return result, nil
}