using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using RobotCentinela.Core.Entities;

namespace RobotCentinela.Infrastructure.Models;

[Table("telemetria")]
public class TelemetriaModel : BaseModel
{
    [PrimaryKey("id", false)]
    public int Id { get; set; }

    [Column("datos_json")]
    public string DatosJson { get; set; } = string.Empty;

    [Column("fecha_registro")]
    public DateTime FechaRegistro { get; set; }

    public Telemetria ToEntity() => new()
    {
        Id = Id,
        DatosJson = DatosJson,
        FechaRegistro = FechaRegistro
    };

    public static TelemetriaModel FromEntity(Telemetria entity) => new()
    {
        Id = entity.Id,
        DatosJson = entity.DatosJson,
        FechaRegistro = entity.FechaRegistro
    };
}