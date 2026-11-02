using RobotCentinela.Application.Services;
using RobotCentinela.Core.Interfaces;
using RobotCentinela.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar CORS para la computadora del Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontendExterno", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

// 2. Variables de Entorno y Configuración del WebSocket de Supabase
var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL") 
                  ?? "https://wnjgfpuclcxsbsafdvtx.supabase.co";
var supabaseKey = Environment.GetEnvironmentVariable("SUPABASE_SERVICE_KEY") 
                  ?? "sb_publishable_UpuAf93rrPTZC7w9khKC2w_dWK6vV6c";

// AutoConnectRealtime inicializa la conexión WebSocket automáticamente
var options = new Supabase.SupabaseOptions { AutoConnectRealtime = true };
var supabaseClient = new Supabase.Client(supabaseUrl, supabaseKey, options);
await supabaseClient.InitializeAsync();

// 3. Inyección de dependencias
builder.Services.AddSingleton(supabaseClient);
builder.Services.AddScoped<ITelemetriaRepository, TelemetriaRepository>();
builder.Services.AddScoped<TelemetriaService>();

var app = builder.Build();

app.UseCors("PermitirFrontendExterno");
app.UseAuthorization();
app.MapControllers();

// 4. Inicializar la escucha WebSocket al arrancar el servidor
using (var scope = app.Services.CreateScope())
{
    var telemetriaService = scope.ServiceProvider.GetRequiredService<TelemetriaService>();
    await telemetriaService.IniciarEscuchaEnTiempoReal(dato => 
    {
        // Aquí puedes integrar SignalR en el futuro si necesitas retransmitir esto directamente al frontend web
        Console.WriteLine($"Nueva telemetría recibida del robot: {dato.DatosJson}");
    });
}

app.Run();