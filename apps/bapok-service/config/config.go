package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port           string
	DBHost         string
	DBPort         string
	DBUser         string
	DBPassword     string
	DBName         string
	RedisURL       string
	AdminSecretKey string
	FCMProjectID   string
	FCMCredentials string
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	cfg := &Config{
		Port:           getEnv("PORT", "3003"),
		DBHost:         getEnv("DB_HOST", "localhost"),
		DBPort:         getEnv("DB_PORT", "5432"),
		DBUser:         getEnv("DB_USER", "admin"),
		DBPassword:     getEnv("DB_PASS", ""),
		DBName:         getEnv("DB_NAME", "majadigi_main"),
		RedisURL:       getEnv("REDIS_URL", "redis://localhost:6379"),
		AdminSecretKey: getEnv("ADMIN_SECRET_KEY", ""),
		FCMProjectID:   getEnv("FCM_PROJECT_ID", ""),
		FCMCredentials: getEnv("FCM_CREDENTIALS_JSON", ""),
	}

	if cfg.AdminSecretKey == "" {
		log.Fatal("ADMIN_SECRET_KEY must be set in environment")
	}

	return cfg
}