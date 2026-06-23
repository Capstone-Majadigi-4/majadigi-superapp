package metrics

import "github.com/prometheus/client_golang/prometheus"

var (
    HttpRequestTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "bapok_http_requests_total",
            Help: "Total HTTP requests to bapok-service",
        },
        []string{"method", "path", "status"},
    )

    HttpRequestDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "bapok_http_request_duration_seconds",
            Help:    "HTTP request duration in seconds",
            Buckets: []float64{0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5},
        },
        []string{"method", "path", "status"},
    )

    HargaInputTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "bapok_harga_input_total",
            Help: "Total input harga berhasil disimpan",
        },
        []string{"type"}, // type: pasar | koperasi
    )

    KomoditasOperationTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "bapok_komoditas_operations_total",
            Help: "Total operasi komoditas",
        },
        []string{"operation"}, // operation: create | update | delete
    )
)

func Init() {
    prometheus.MustRegister(HttpRequestTotal)
    prometheus.MustRegister(HttpRequestDuration)
    prometheus.MustRegister(HargaInputTotal)
    prometheus.MustRegister(KomoditasOperationTotal)
}
