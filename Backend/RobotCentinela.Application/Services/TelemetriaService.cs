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

    //Obtener los datos. Agregado
    public async Task<Telemetria> ObtenerUltimaTelemetriaAsync()
    {
        return await _repository.ObtenerUltimoAsync(); 
    }

    public async Task<List<Telemetria>> ObtenerHistorialAsync(int limite = 50)
    {
        return await _repository.ObtenerHistorialAsync(limite);
    }

    public async Task IniciarEscuchaEnTiempoReal(Action<Telemetria> notificarFrontend)
    {
        await _repository.SuscribirseAWebSocketsAsync(notificarFrontend);
    }

    public async Task<string> ObtenerAlertasAsync()
    {
        return await _repository.ObtenerAlertasAsync();
    }

    public async Task<string> ObtenerCuentaAsync()
    {
        return await _repository.ObtenerCuentaAsync();
    }

}