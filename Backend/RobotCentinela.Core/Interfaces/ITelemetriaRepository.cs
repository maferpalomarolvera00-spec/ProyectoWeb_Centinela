using RobotCentinela.Core.Entities;

namespace RobotCentinela.Core.Interfaces;

public interface ITelemetriaRepository
{
    Task InsertarAsync(Telemetria telemetria);
    Task SuscribirseAWebSocketsAsync(Action<Telemetria> alRecibirDato);
}