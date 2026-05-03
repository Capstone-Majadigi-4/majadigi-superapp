package database

import (
	"bapok-service/config"
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)



func NewPostgres(cfg *config.Config) *pgxpool.Pool {
    dsn := fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName,
    )

    config, err := pgxpool.ParseConfig(dsn)
    if err != nil {
        log.Fatalf("Failed to parse config: %v", err)
    }

    config.ConnConfig.RuntimeParams["search_path"] = "bapok"

    pool, err := pgxpool.NewWithConfig(context.Background(), config)
    if err != nil {
        log.Fatalf("Failed to connect to PostgreSQL: %v", err)
    }

    if err := pool.Ping(context.Background()); err != nil {
        log.Fatalf("PostgreSQL ping failed: %v", err)
    }

    log.Println("Postgresql connected")
    return pool
}
