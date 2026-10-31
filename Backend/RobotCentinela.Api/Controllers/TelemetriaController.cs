using Microsoft.AspNetCore.Mvc;
using RobotCentinela.Application.Services;

namespace RobotCentinela.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TelemetriaController : ControllerBase
{
    private readonly TelemetriaService _service;

    public TelemetriaController(TelemetriaService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] object datosSensores)
    {
        // Se recibe el JSON crudo del robot y se delega al servicio
        await _service.RegistrarTelemetriaAsync(datosSensores.ToString());
        return Ok(new { estado = "Telemetría registrada correctamente" });
    }
}