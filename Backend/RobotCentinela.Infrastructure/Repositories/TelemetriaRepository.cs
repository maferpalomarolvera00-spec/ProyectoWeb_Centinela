using System;
using System.Threading.Tasks;
using RobotCentinela.Core.Entities;
using RobotCentinela.Core.Interfaces;
using RobotCentinela.Infrastructure.Models;
using Supabase.Realtime;
using Supabase.Realtime.PostgresChanges;
using static Supabase.Realtime.PostgresChanges.PostgresChangesOptions;

namespace RobotCentinela.Infrastructure.Repositories;

public class TelemetriaRepository : ITelemetriaRepository
{
    private readonly Supabase.Client _client;

    public TelemetriaRepository(Supabase.Client client)
    {
        _client = client;
    }

    public async Task InsertarAsync(Telemetria telemetria)
    {
        var model = TelemetriaModel.FromEntity(telemetria);
        await _client.From<TelemetriaModel>().Insert(model);
    }

    public async Task SuscribirseAWebSocketsAsync(Action<Telemetria> alRecibirDato)
    {
        try
        {
            // 1. El primer parámetro DEBE ser estrictamente "realtime" para coincidir con el topic de Supabase
            var canal = _client.Realtime.Channel("realtime", "public", "telemetria");

            // 2. Asociar el evento para escuchar inserciones
            canal.AddPostgresChangeHandler(ListenType.Inserts, (sender, change) =>
            {
                var modelo = change.Model<TelemetriaModel>();
                if (modelo != null)
                {
                    alRecibirDato(modelo.ToEntity());
                }
            });

            // 3. Suscribirse al canal mediante WebSocket
            await canal.Subscribe();
            
            Console.WriteLine("Suscripción a WebSockets de Telemetría exitosa.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error crítico al suscribirse a Supabase Realtime: {ex.Message}");
        }
    }
}