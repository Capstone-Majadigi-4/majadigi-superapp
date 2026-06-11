package server

import (
	"bapok-service/config"
	"bapok-service/internal/alert"
	"bapok-service/internal/common"
	"bapok-service/internal/fcm"
	"bapok-service/internal/harga"
	"bapok-service/internal/komoditas"
	"bapok-service/internal/middleware"
	"bapok-service/internal/ticker"

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
		BodyLimit: 5 * 1024 * 1024, // 5 MB
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return common.Error(c, err.Error(), 500)
		},
	})

	app.Use(logger.New())
	app.Use(recover.New())

	// wire dependencies
	komoditasRepo    := komoditas.NewRepository(db)
	komoditasService := komoditas.NewService(komoditasRepo, rdb)
	komoditasHandler := komoditas.NewHandler(komoditasService)

	fcmClient    := fcm.NewClient(cfg.FCMProjectID, cfg.FCMCredentials)

	hargaRepo    := harga.NewRepository(db)
	hargaService := harga.NewService(hargaRepo, rdb, fcmClient)
	hargaHandler := harga.NewHandler(hargaService)

	alertRepo    := alert.NewRepository(db)
	alertService := alert.NewService(alertRepo)
	alertHandler := alert.NewHandler(alertService)

	tickerRepo    := ticker.NewRepository(db)
	tickerService := ticker.NewService(tickerRepo, rdb)
	tickerHandler := ticker.NewHandler(tickerService)

	// routes
	api := app.Group("/api/v1/bapok")
	api.Get("/health", func(c *fiber.Ctx) error {
		return common.Success(c, nil, "OK", 200)
	})

	// komoditas
	const komoditasID = "/komoditas/:id"
	api.Get("/komoditas", komoditasHandler.FindAll)
	api.Get(komoditasID, komoditasHandler.FindById)

	// ticker
	api.Get("/ticker", tickerHandler.FindTicker)

	// harga pasar
	api.Get("/harga", hargaHandler.FindHarga)
	api.Get("/harga/koperasi", hargaHandler.FindHargaKoperasi)
	api.Get("/harga/perbandingan", hargaHandler.FindPerbandingan)
	api.Get("/harga/:komoditas_id/histori", hargaHandler.FindHistori)

	// pasar & koperasi
	api.Get("/pasar", hargaHandler.FindPasarAll)
	api.Get("/koperasi", hargaHandler.FindKoperasiAll)

	// alert
	api.Get("/alert/saya", alertHandler.FindByUser)
	api.Post("/alert", alertHandler.Create)
	api.Delete("/alert/:id", alertHandler.Delete)

	// admin
	admin := api.Group("/admin", middleware.AdminGuard(cfg.AdminSecretKey))
	admin.Post("/komoditas", komoditasHandler.Create)
	admin.Patch(komoditasID, komoditasHandler.Update)
	admin.Delete(komoditasID, komoditasHandler.Delete)
	admin.Post("/harga", hargaHandler.Create)
	admin.Post("/harga/bulk-csv", hargaHandler.BulkCSV)
	admin.Post("/harga-koperasi", hargaHandler.CreateHargaKoperasi)
	admin.Post("/harga-koperasi/bulk-csv", hargaHandler.BulkCSVKoperasi)

	return &Server{app: app, cfg: cfg}
}

func (s *Server) Start() error {
	return s.app.Listen(":" + s.cfg.Port)
}
