
Resumen de los cambios en C#:

1. TelemetriaController.cs: Se agrego el [HttpGet] para que la web tenga una URL donde pedir los datos.

2. TelemetriaService.cs: Se agrego la lógica para solicitar la última lectura.

3. ITelemetriaRepository.cs: Leer la base de datos.

4. TelemetriaRepository.cs: Se escribio la consulta real a Supabase.