using RobotCentinela.Core.Entities;
using RobotCentinela.Core.Interfaces;

namespace RobotCentinela.Application.Services;

public class TelemetriaService
{
    private readonly ITelemetriaRepository _repository;

    public TelemetriaService(ITelemetriaRepository repository)
    {
        _repository = repository;
    }

    public async Task RegistrarTelemetriaAsync(string jsonSensores)
    {
        var telemetria = new Telemetria
        {
            DatosJson = jsonSensores,
            FechaRegistro = DateTime.UtcNow
        };
        
        await _repository.InsertarAsync(telemetria);
    }

    public async Task IniciarEscuchaEnTiempoReal(Action<Telemetria> notificarFrontend)
    {
        await _repository.SuscribirseAWebSocketsAsync(notificarFrontend);
    }
}