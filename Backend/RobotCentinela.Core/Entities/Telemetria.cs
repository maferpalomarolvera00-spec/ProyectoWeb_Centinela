namespace RobotCentinela.Core.Entities;

public class Telemetria
{
    public int Id { get; set; }
    public string DatosJson { get; set; } = string.Empty;
    public DateTime FechaRegistro { get; set; }
}