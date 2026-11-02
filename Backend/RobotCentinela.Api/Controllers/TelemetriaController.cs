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

//Agregado
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var datos = await _service.ObtenerUltimaTelemetriaAsync(); 

        if (datos == null)
        {
            return NotFound(new { mensaje = "Aún no hay datos de sensores registrados." });
        }

        return Ok(datos); 
    }


    [HttpGet("historial")]
    public async Task<IActionResult> GetHistorial()
    {
        var datos = await _service.ObtenerHistorialAsync(); 
        return Ok(datos); 
    }

   [HttpGet("alertas")]
    public async Task<IActionResult> GetAlertas()
    {
        var datos = await _service.ObtenerAlertasAsync();
        return Content(datos, "application/json");
    }

    [HttpGet("cuenta")]
    public async Task<IActionResult> GetCuenta()
    {
        var datos = await _service.ObtenerCuentaAsync();
        return Content(datos, "application/json");
    }
}