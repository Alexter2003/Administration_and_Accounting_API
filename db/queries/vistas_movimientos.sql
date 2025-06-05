-- =============================================================================
-- VISTAS Y FUNCIONES
-- =============================================================================
-- Archivo: vistas_movimientos.sql
-- Descripción: Vistas para consultar movimientos y descargar lógica del backend
-- Fecha: 2024
-- =============================================================================

-- RESUMEN DE MOVIMIENTOS
-- 📊 VISTAS Y FUNCIONES DISPONIBLES
-- 1. Vista Base
-- vista_movimientos_completa
-- Propósito: Vista principal que contiene toda la información de movimientos con datos relacionados (servicios, tipos de movimiento) y campos calculados (año, mes, trimestre, etc.)
-- Uso: Base para todas las demás consultas y análisis
-- 2. Vista de Resumen por Tipo
-- vista_movimientos_por_tipo
-- Propósito: Resumen estadístico de movimientos agrupados por tipo de movimiento
-- Datos: Total de movimientos, montos totales, promedios, mínimos, máximos, fechas de primer y último movimiento
-- 3. Función Principal
-- obtener_movimientos_por_tipo(tipo_movimiento_id INTEGER)
-- Propósito: Función flexible para obtener movimientos filtrados por tipo específico
-- Uso: Reemplaza la lógica del backend para consultas de salarios (tipo 1), compras (tipo 2), etc.
-- 4. Vistas de Resúmenes Temporales
-- vista_movimientos_diarios
-- Propósito: Resumen de movimientos agrupados por día
-- Datos: Total movimientos, montos y promedios por fecha, servicio y tipo
-- vista_movimientos_mensuales
-- Propósito: Resumen de movimientos agrupados por mes
-- Datos: Estadísticas mensuales para análisis de tendencias
-- vista_movimientos_trimestrales
-- Propósito: Resumen de movimientos agrupados por trimestre
-- Datos: Análisis trimestral para reportes ejecutivos
-- vista_movimientos_semestrales
-- Propósito: Resumen de movimientos agrupados por semestre
-- Datos: Análisis semestral para evaluaciones de medio año
-- vista_movimientos_anuales
-- Propósito: Resumen de movimientos agrupados por año
-- Datos: Análisis anual para comparaciones de rendimiento año tras año


-- =============================================================================
-- VISTA BASE: MOVIMIENTOS CON INFORMACIÓN RELACIONADA
-- =============================================================================

-- Vista base que incluye toda la información relacionada de movimientos
CREATE or replace VIEW vista_movimientos_completa AS
SELECT
    m.id,
    m.id_tipo_movimiento,
    tm.nombre as tipo_movimiento_nombre,
    tm.descripcion as tipo_movimiento_descripcion,
    m.id_servicio,
    s.nombre as servicio_nombre,
    s.descripcion as servicio_descripcion,
    m.concepto,
    m.cantidad,
    m.fecha_movimiento,
    m.id_producto,
    m.nombre_producto,
    m.nombre_empleado,
    m.estado,
    m."createdAt",
    m."updatedAt",
    -- Campos calculados
    EXTRACT(YEAR FROM m.fecha_movimiento) as año,
    EXTRACT(MONTH FROM m.fecha_movimiento) as mes,
    EXTRACT(QUARTER FROM m.fecha_movimiento) as trimestre,
    CASE
        WHEN EXTRACT(MONTH FROM m.fecha_movimiento) BETWEEN 1 AND 6 THEN 1
        ELSE 2
    END as semestre,
    EXTRACT(DAY FROM m.fecha_movimiento) as dia,
    EXTRACT(DOW FROM m.fecha_movimiento) as dia_semana,
    TO_CHAR(m.fecha_movimiento, 'YYYY-MM') as año_mes,
    TO_CHAR(m.fecha_movimiento, 'YYYY-Q') as año_trimestre,
    DATE_TRUNC('week', m.fecha_movimiento) as semana_inicio
FROM movimientos m
LEFT JOIN tipo_movimientos tm ON m.id_tipo_movimiento = tm.id
LEFT JOIN servicios s ON m.id_servicio = s.id
WHERE m.estado = true;

-- =============================================================================
-- VISTAS DE MOVIMIENTOS AGRUPADOS POR TIPO
-- =============================================================================

-- Vista de resumen de movimientos agrupados por tipo
CREATE VIEW vista_movimientos_por_tipo AS
SELECT
    tm.id as tipo_movimiento_id,
    tm.nombre as tipo_movimiento,
    tm.descripcion,
    COUNT(m.id) as total_movimientos,
    SUM(m.cantidad) as total_monetario,
    AVG(m.cantidad) as promedio_movimiento,
    MIN(m.cantidad) as minimo_movimiento,
    MAX(m.cantidad) as maximo_movimiento,
    MIN(m.fecha_movimiento) as primera_fecha,
    MAX(m.fecha_movimiento) as ultima_fecha
FROM tipo_movimientos tm
LEFT JOIN movimientos m ON tm.id = m.id_tipo_movimiento AND m.estado = true
WHERE tm.estado = true
GROUP BY tm.id, tm.nombre, tm.descripcion
ORDER BY total_monetario DESC;

-- Procedimiento almacenado para obtener movimientos por tipo
CREATE OR REPLACE FUNCTION obtener_movimientos_por_tipo(tipo_movimiento_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    nombre_empleado VARCHAR(45),
    cantidad NUMERIC(10,2),
    fecha_movimiento DATE,
    concepto VARCHAR(150),
    servicio_nombre VARCHAR(255),
    año NUMERIC,
    mes NUMERIC,
    año_mes TEXT,
    rol_descripcion TEXT,
    tipo_movimiento_nombre VARCHAR(50),
    id_producto INTEGER,
    nombre_producto VARCHAR(45)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.id,
        m.nombre_empleado,
        m.cantidad,
        m.fecha_movimiento,
        m.concepto,
        m.servicio_nombre,
        m.año,
        m.mes,
        m.año_mes,
        -- Información adicional de empleado (si se puede obtener del concepto)
        CASE
            WHEN m.concepto LIKE '%rol %' THEN
                TRIM(SUBSTRING(m.concepto FROM 'rol (.+)'))
            ELSE NULL
        END as rol_descripcion,
        m.tipo_movimiento_nombre,
        m.id_producto,
        m.nombre_producto
    FROM vista_movimientos_completa m
    WHERE m.id_tipo_movimiento = tipo_movimiento_id
    ORDER BY m.fecha_movimiento DESC, m.nombre_empleado;
END;
$$ LANGUAGE plpgsql;


-- =============================================================================
-- VISTAS DE RESÚMENES POR PERÍODO
-- =============================================================================

-- Vista de movimientos diarios
CREATE VIEW vista_movimientos_diarios AS
SELECT
    fecha_movimiento,
    EXTRACT(YEAR FROM fecha_movimiento) as año,
    EXTRACT(MONTH FROM fecha_movimiento) as mes,
    EXTRACT(DAY FROM fecha_movimiento) as dia,
    TO_CHAR(fecha_movimiento, 'Day') as nombre_dia,
    id_servicio,
    servicio_nombre,
    id_tipo_movimiento,
    tipo_movimiento_nombre,
    COUNT(*) as total_movimientos,
    SUM(cantidad) as total_monetario,
    AVG(cantidad) as promedio_movimiento
FROM vista_movimientos_completa
GROUP BY
    fecha_movimiento,
    id_servicio,
    servicio_nombre,
    id_tipo_movimiento,
    tipo_movimiento_nombre
ORDER BY fecha_movimiento DESC;

-- Vista de movimientos mensuales
CREATE VIEW vista_movimientos_mensuales AS
SELECT
    año,
    mes,
    año_mes,
    TO_CHAR(DATE(año::text || '-' || mes::text || '-01'), 'Month') as nombre_mes,
    id_servicio,
    servicio_nombre,
    id_tipo_movimiento,
    tipo_movimiento_nombre,
    COUNT(*) as total_movimientos,
    SUM(cantidad) as total_monetario,
    AVG(cantidad) as promedio_movimiento
FROM vista_movimientos_completa
GROUP BY
    año,
    mes,
    año_mes,
    id_servicio,
    servicio_nombre,
    id_tipo_movimiento,
    tipo_movimiento_nombre
ORDER BY año DESC, mes DESC;

-- Vista de movimientos trimestrales
CREATE VIEW vista_movimientos_trimestrales AS
SELECT
    año,
    trimestre,
    año_trimestre,
    CASE trimestre
        WHEN 1 THEN 'Primer Trimestre'
        WHEN 2 THEN 'Segundo Trimestre'
        WHEN 3 THEN 'Tercer Trimestre'
        WHEN 4 THEN 'Cuarto Trimestre'
    END as nombre_trimestre,
    id_servicio,
    servicio_nombre,
    id_tipo_movimiento,
    tipo_movimiento_nombre,
    COUNT(*) as total_movimientos,
    SUM(cantidad) as total_monetario,
    AVG(cantidad) as promedio_movimiento
FROM vista_movimientos_completa
GROUP BY
    año,
    trimestre,
    año_trimestre,
    id_servicio,
    servicio_nombre,
    id_tipo_movimiento,
    tipo_movimiento_nombre
ORDER BY año DESC, trimestre DESC;

-- Vista de movimientos semestrales
CREATE VIEW vista_movimientos_semestrales AS
SELECT
    año,
    semestre,
    CASE semestre
        WHEN 1 THEN 'Primer Semestre'
        WHEN 2 THEN 'Segundo Semestre'
    END as nombre_semestre,
    id_servicio,
    servicio_nombre,
    id_tipo_movimiento,
    tipo_movimiento_nombre,
    COUNT(*) as total_movimientos,
    SUM(cantidad) as total_monetario,
    AVG(cantidad) as promedio_movimiento
FROM vista_movimientos_completa
GROUP BY
    año,
    semestre,
    id_servicio,
    servicio_nombre,
    id_tipo_movimiento,
    tipo_movimiento_nombre
ORDER BY año DESC, semestre DESC;

-- Vista de movimientos anuales
CREATE VIEW vista_movimientos_anuales AS
SELECT
    año,
    id_servicio,
    servicio_nombre,
    id_tipo_movimiento,
    tipo_movimiento_nombre,
    COUNT(*) as total_movimientos,
    SUM(cantidad) as total_monetario,
    AVG(cantidad) as promedio_movimiento
FROM vista_movimientos_completa
GROUP BY
    año,
    id_servicio,
    servicio_nombre,
    id_tipo_movimiento,
    tipo_movimiento_nombre
ORDER BY año DESC;

