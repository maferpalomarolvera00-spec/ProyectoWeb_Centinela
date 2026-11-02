using RobotCentinela.Core.Entities;

namespace RobotCentinela.Core.Interfaces;

public interface ITelemetriaRepository
{
    Task InsertarAsync(Telemetria telemetria);
    Task SuscribirseAWebSocketsAsync(Action<Telemetria> alRecibirDato);
    Task<Telemetria> ObtenerUltimoAsync(); //Lectura. Agregado

    Task<List<Telemetria>> ObtenerHistorialAsync(int limite = 50);

    Task<string> ObtenerAlertasAsync();
    Task<string> ObtenerCuentaAsync();
}