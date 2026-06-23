package ticker

import (
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
)

const cacheTTL = 5 * time.Minute
const cacheKey = "bapok:ticker"

type Service struct {
	repo *Repository
	rdb  *redis.Client
}

func NewService(repo *Repository, rdb *redis.Client) *Service {
	return &Service{repo: repo, rdb: rdb}
}

func (s *Service) FindTicker(ctx context.Context) ([]TickerItem, error) {
	cached, err := s.rdb.Get(ctx, cacheKey).Bytes()
	if err == nil {
		var result []TickerItem
		if err := json.Unmarshal(cached, &result); err == nil {
			return result, nil
		}
	}

	result, err := s.repo.FindTopVolatile(ctx)
	if err != nil {
		return nil, err
	}

	if b, err := json.Marshal(result); err == nil {
		s.rdb.Set(ctx, cacheKey, b, cacheTTL)
	}

	return result, nil
}
