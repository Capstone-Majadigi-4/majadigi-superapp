package database

import (
	"bapok-service/config"
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)


func NewRedis(cfg *config.Config) *redis.Client {
	opt, err := redis.ParseURL(cfg.RedisURL)
	if err != nil {
		log.Fatalf("Invalid Redis URL: %v", err)
	}

	client := redis.NewClient(opt)

	if err := client.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("Redis ping failed: %v", err)
	}

	log.Println("Redis connected")
	return client
}
