package server

import (
	"bapok-service/config"
	"bapok-service/internal/alert"
	"bapok-service/internal/common"
	"bapok-service/internal/harga"
	"bapok-service/internal/komoditas"
	"bapok-service/internal/middleware"
	"bapok-service/internal/pasar"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type Server struct {
	app *fiber.App
	cfg *config.Config
}

func New(cfg *config.Config, db *pgxpool.Pool, rdb *redis.Client) *Server {
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return common.Error(c,err.Error(), 500)
		},
	})

	app.Use(logger.New())
	app.Use(recover.New())

	// wire dependencies
	komoditasRepo    := komoditas.NewRepository(db)
	komoditasService := komoditas.NewService(komoditasRepo, rdb)
	komoditasHandler := komoditas.NewHandler(komoditasService)

	pasarRepo    := pasar.NewRepository(db)
	pasarService := pasar.NewService(pasarRepo, rdb)
	pasarHandler := pasar.NewHandler(pasarService)

	hargaRepo    := harga.NewRepository(db)
	hargaService := harga.NewService(hargaRepo, rdb)
	hargaHandler := harga.NewHandler(hargaService)

	alertRepo    := alert.NewRepository(db)
	alertService := alert.NewService(alertRepo)
	alertHandler := alert.NewHandler(alertService)

	// routes
	api := app.Group("/api/v1/bapok")
	api.Get("/health", func(c *fiber.Ctx) error {
		return common.Success(c, nil, "OK", 200)
	})

	// komoditas
	api.Get("/komoditas", komoditasHandler.FindAll)
	api.Get("/komoditas/:id", komoditasHandler.FindById)

	// harga
	api.Get("/harga", hargaHandler.FindHarga)
	api.Get("/harga/:komoditas_id/histori", hargaHandler.FindHistori)

	// alert
	api.Get("/alert/saya", alertHandler.FindByUser)
	api.Post("/alert", alertHandler.Create)
	api.Delete("/alert/:id", alertHandler.Delete)

	// admin
	admin := api.Group("/admin", middleware.AdminGuard(cfg.AdminSecretKey))
	admin.Post("/komoditas", komoditasHandler.Create)
	admin.Post("/pasar", pasarHandler.Create)
	admin.Post("/harga", hargaHandler.Create)

	return &Server{app: app, cfg: cfg}
}

func (s *Server) Start() error {
	return s.app.Listen(":" + s.cfg.Port)
}
