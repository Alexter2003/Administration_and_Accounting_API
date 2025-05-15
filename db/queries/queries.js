const inasistencias_por_empleado = `
  WITH dias_laborales AS (
    SELECT unnest(j.dias_laborales) AS dia
    FROM empleados e
    JOIN jornadas j ON e.id_jornada = j.id
    WHERE e.id = :id_empleado
  ),
  fechas AS (
    SELECT generate_series(:fecha_inicio::date, :fecha_fin::date, interval '1 day') AS fecha
  )
  SELECT
    COUNT(*) AS no_inasistencias,
    array_agg(f.fecha::date) AS inasistencias
  FROM fechas f
  JOIN dias_laborales d ON EXTRACT(ISODOW FROM f.fecha)::int = d.dia
  WHERE NOT EXISTS (
    SELECT 1 FROM asistencias a
    WHERE a.id_empleado = :id_empleado AND a.fecha = f.fecha
  );
`;

module.exports = { inasistencias_por_empleado };
