using System;
using System.Collections.Generic;
using System.Linq;
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

    // Lectura HTTP Directa apuntando a la vista oficial del esquema
    public async Task<Telemetria> ObtenerUltimoAsync()
    {
        try
        {
            using var httpClient = new System.Net.Http.HttpClient();
            
            string supabaseUrl = "https://wnjgfpuclcxsbsafdvtx.supabase.co/rest/v1/v_robot_telemetry_live?select=*&order=received_at.desc&limit=1";
            string supabaseKey = "sb_publishable_UpuAf93rrPTZC7w9khKC2w_dWK6vV6c"; 
            
            httpClient.DefaultRequestHeaders.Add("apikey", supabaseKey);
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {supabaseKey}");

            var response = await httpClient.GetAsync(supabaseUrl);
            
            if (response.IsSuccessStatusCode)
            {
                var jsonResult = await response.Content.ReadAsStringAsync();
                
                // Usamos un Documento JSON genérico para evitar errores de modelos incompatibles
                using var doc = System.Text.Json.JsonDocument.Parse(jsonResult);
                var root = doc.RootElement;
                
                if (root.ValueKind == System.Text.Json.JsonValueKind.Array && root.GetArrayLength() > 0)
                {
                    var elemento = root[0];
                    
                    // Devolvemos una entidad construida directamente del JSON plano
                    return new Telemetria
                    {
                        // Intentamos extraer el payload o los datos básicos si existen
                        DatosJson = elemento.GetRawText(),
                        FechaRegistro = elemento.TryGetProperty("received_at", out var fecha) ? fecha.GetDateTime() : DateTime.UtcNow
                    };
                }
            }
            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al consultar Supabase directamente: {ex.Message}");
            return null;
        }
    }

    // Escucha en tiempo real (WebSockets)
    public async Task SuscribirseAWebSocketsAsync(Action<Telemetria> alRecibirDato)
    {
        try
        {
            // Descomentar este bloque el martes para usar Realtime con el ESP32
            /*
            var canal = _client.Realtime.Channel("realtime", "public", "telemetry_frames");

            canal.AddPostgresChangeHandler(ListenType.Inserts, (sender, change) =>
            {
                var modelo = change.Model<TelemetriaModel>();
                if (modelo != null)
                {
                    alRecibirDato(modelo.ToEntity());
                }
            });

            await canal.Subscribe();
            */
            
            Console.WriteLine("Suscripción a WebSockets de Telemetría omitida temporalmente.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error crítico al suscribirse a Supabase Realtime: {ex.Message}");
        }
    }

    public async Task<List<Telemetria>> ObtenerHistorialAsync(int limite = 50)
    {
        try
        {
            using var httpClient = new System.Net.Http.HttpClient();
            
            string url = $"https://wnjgfpuclcxsbsafdvtx.supabase.co/rest/v1/v_readings_interpreted?select=*&order=received_at.desc&limit={limite}";
            string key = "sb_publishable_UpuAf93rrPTZC7w9khKC2w_dWK6vV6c";
            
            httpClient.DefaultRequestHeaders.Add("apikey", key);
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {key}");

            var response = await httpClient.GetAsync(url);
            
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                using var doc = System.Text.Json.JsonDocument.Parse(json);
                
                var historial = new List<Telemetria>();
                foreach (var elemento in doc.RootElement.EnumerateArray())
                {
                    historial.Add(new Telemetria
                    {
                        DatosJson = elemento.GetRawText(),
                        // Ajustamos también para que lea received_at
                        FechaRegistro = elemento.TryGetProperty("received_at", out var d) && d.ValueKind != System.Text.Json.JsonValueKind.Null ? d.GetDateTime() : DateTime.UtcNow
                    });
                }
                return historial;
            }
            return new List<Telemetria>();
        }
        catch
        {
            return new List<Telemetria>();
        }
    }

    // Método para Recordatorios
    public async Task<string> ObtenerAlertasAsync()
    {
        try
        {
            using var httpClient = new System.Net.Http.HttpClient();
            string url = "https://wnjgfpuclcxsbsafdvtx.supabase.co/rest/v1/v_active_alerts?select=*";
            string key = "sb_publishable_UpuAf93rrPTZC7w9khKC2w_dWK6vV6c";
            
            httpClient.DefaultRequestHeaders.Add("apikey", key);
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {key}");

            var response = await httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode) return await response.Content.ReadAsStringAsync();
            return "[]";
        }
        catch { return "[]"; }
    }

    // Método para Cuenta
    public async Task<string> ObtenerCuentaAsync()
    {
        try
        {
            using var httpClient = new System.Net.Http.HttpClient();
            string url = "https://wnjgfpuclcxsbsafdvtx.supabase.co/rest/v1/homes?select=*,memberships(*)";
            string key = "sb_publishable_UpuAf93rrPTZC7w9khKC2w_dWK6vV6c";
            
            httpClient.DefaultRequestHeaders.Add("apikey", key);
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {key}");

            var response = await httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode) return await response.Content.ReadAsStringAsync();
            return "{}";
        }
        catch { return "{}"; }
    }
}