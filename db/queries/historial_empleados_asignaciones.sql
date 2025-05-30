CREATE TABLE historial_empleado_asignaciones (
    id SERIAL PRIMARY KEY,
    id_empleado_asignacion INTEGER NOT NULL,
    id_empleado INTEGER NOT NULL,
    -- Datos anteriores
    id_rol_anterior INTEGER,
    id_area_anterior INTEGER,
    horas_semanales_anterior INTEGER,
    estado_anterior BOOLEAN,
    -- Datos nuevos
    id_rol_nuevo INTEGER,
    id_area_nuevo INTEGER,
    horas_semanales_nuevo INTEGER,
    estado_nuevo BOOLEAN,
    -- Metadatos
    tipo_cambio VARCHAR(50) NOT NULL, -- 'asignacion_inicial', 'cambio_rol', 'cambio_area', 'cambio_horas', 'activacion', 'desactivacion'
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INTEGER, -- ID del usuario que realizó el cambio
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para historial de empleados
CREATE INDEX idx_historial_empleado_id ON historial_empleado_asignaciones(id_empleado);
CREATE INDEX idx_historial_empleado_asignacion_id ON historial_empleado_asignaciones(id_empleado_asignacion);
CREATE INDEX idx_historial_empleado_fecha_cambio ON historial_empleado_asignaciones(fecha_cambio);
CREATE INDEX idx_historial_empleado_tipo_cambio ON historial_empleado_asignaciones(tipo_cambio);


-- Índices para historial de empleados
CREATE INDEX idx_historial_empleado_id ON historial_empleado_asignaciones(id_empleado);
CREATE INDEX idx_historial_empleado_asignacion_id ON historial_empleado_asignaciones(id_empleado_asignacion);
CREATE INDEX idx_historial_empleado_fecha_cambio ON historial_empleado_asignaciones(fecha_cambio);
CREATE INDEX idx_historial_empleado_tipo_cambio ON historial_empleado_asignaciones(tipo_cambio);

-- =============================================================================
-- FUNCIONES PARA LOS TRIGGERS
-- =============================================================================

-- Función para registrar cambios en asignaciones de empleados
CREATE OR REPLACE FUNCTION registrar_cambio_empleado_asignacion()
RETURNS TRIGGER AS $$
DECLARE
    tipo_cambio_text VARCHAR(50);
    observaciones_text TEXT;
BEGIN
    -- Determinar el tipo de cambio y generar observaciones
    IF TG_OP = 'INSERT' THEN
        tipo_cambio_text := 'asignacion_inicial';
        observaciones_text := 'Nueva asignación de empleado';

        INSERT INTO historial_empleado_asignaciones (
            id_empleado_asignacion,
            id_empleado,
            id_rol_nuevo,
            id_area_nuevo,
            horas_semanales_nuevo,
            estado_nuevo,
            tipo_cambio,
            observaciones
        ) VALUES (
            NEW.id,
            NEW.id_empleado,
            NEW.id_rol,
            NEW.id_area,
            NEW.horas_semanales,
            NEW.estado,
            tipo_cambio_text,
            observaciones_text
        );

    ELSIF TG_OP = 'UPDATE' THEN
        -- Verificar qué cambió específicamente
        IF OLD.id_rol IS DISTINCT FROM NEW.id_rol THEN
            tipo_cambio_text := 'cambio_rol';
            observaciones_text := 'Cambio de rol';
        ELSIF OLD.id_area IS DISTINCT FROM NEW.id_area THEN
            tipo_cambio_text := 'cambio_area';
            observaciones_text := 'Cambio de área';
        ELSIF OLD.horas_semanales IS DISTINCT FROM NEW.horas_semanales THEN
            tipo_cambio_text := 'cambio_horas';
            observaciones_text := 'Cambio de horas semanales: ' || OLD.horas_semanales || ' → ' || NEW.horas_semanales;
        ELSIF OLD.estado IS DISTINCT FROM NEW.estado THEN
            IF NEW.estado = true THEN
                tipo_cambio_text := 'activacion';
                observaciones_text := 'Activación de asignación';
            ELSE
                tipo_cambio_text := 'desactivacion';
                observaciones_text := 'Desactivación de asignación';
            END IF;
        ELSE
            tipo_cambio_text := 'actualizacion_general';
            observaciones_text := 'Actualización de asignación';
        END IF;

        -- Solo registrar si realmente hubo cambios significativos
        IF OLD.id_rol IS DISTINCT FROM NEW.id_rol OR
           OLD.id_area IS DISTINCT FROM NEW.id_area OR
           OLD.horas_semanales IS DISTINCT FROM NEW.horas_semanales OR
           OLD.estado IS DISTINCT FROM NEW.estado THEN

            INSERT INTO historial_empleado_asignaciones (
                id_empleado_asignacion,
                id_empleado,
                id_rol_anterior,
                id_area_anterior,
                horas_semanales_anterior,
                estado_anterior,
                id_rol_nuevo,
                id_area_nuevo,
                horas_semanales_nuevo,
                estado_nuevo,
                tipo_cambio,
                observaciones
            ) VALUES (
                NEW.id,
                NEW.id_empleado,
                OLD.id_rol,
                OLD.id_area,
                OLD.horas_semanales,
                OLD.estado,
                NEW.id_rol,
                NEW.id_area,
                NEW.horas_semanales,
                NEW.estado,
                tipo_cambio_text,
                observaciones_text
            );
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers para cambios en asignaciones de empleados
CREATE TRIGGER trigger_historial_empleado_asignacion_insert
    AFTER INSERT ON empleado_asignaciones
    FOR EACH ROW
    EXECUTE FUNCTION registrar_cambio_empleado_asignacion();

CREATE TRIGGER trigger_historial_empleado_asignacion_update
    AFTER UPDATE ON empleado_asignaciones
    FOR EACH ROW
    EXECUTE FUNCTION registrar_cambio_empleado_asignacion();

-- Vista para obtener el historial de cambios de puestos de empleados con información detallada
CREATE VIEW vista_historial_empleados AS
SELECT
    h.id,
    h.id_empleado_asignacion,
    h.id_empleado,
    e.nombres || ' ' || e.apellidos as nombre_completo,
    e.dpi,
    e.usuario,
    -- Información del rol anterior
    r_anterior.nombre as rol_anterior,
    r_anterior.salario as salario_anterior,
    -- Información del área anterior
    a_anterior.nombre as area_anterior,
    s_anterior.nombre as servicio_anterior,
    -- Información del rol nuevo
    r_nuevo.nombre as rol_nuevo,
    r_nuevo.salario as salario_nuevo,
    -- Información del área nueva
    a_nuevo.nombre as area_nueva,
    s_nuevo.nombre as servicio_nuevo,
    -- Cambios en horas
    h.horas_semanales_anterior,
    h.horas_semanales_nuevo,
    -- Estados
    h.estado_anterior,
    h.estado_nuevo,
    -- Metadatos
    h.tipo_cambio,
    h.fecha_cambio,
    h.observaciones
FROM historial_empleado_asignaciones h
LEFT JOIN empleados e ON h.id_empleado = e.id
LEFT JOIN roles r_anterior ON h.id_rol_anterior = r_anterior.id
LEFT JOIN areas a_anterior ON h.id_area_anterior = a_anterior.id
LEFT JOIN servicios s_anterior ON a_anterior.id_servicio = s_anterior.id
LEFT JOIN roles r_nuevo ON h.id_rol_nuevo = r_nuevo.id
LEFT JOIN areas a_nuevo ON h.id_area_nuevo = a_nuevo.id
LEFT JOIN servicios s_nuevo ON a_nuevo.id_servicio = s_nuevo.id
ORDER BY h.fecha_cambio DESC;

-- Vista resumida de empleados activos con su información actual
CREATE VIEW vista_empleados_actuales AS
SELECT DISTINCT ON (e.id)
    e.id as empleado_id,
    e.nombres || ' ' || e.apellidos as nombre_completo,
    e.dpi,
    e.usuario,
    e.email,
    r.nombre as rol_actual,
    r.salario as salario_actual,
    a.nombre as area_actual,
    s.nombre as servicio_actual,
    ea.horas_semanales,
    ea.estado as asignacion_activa,
    ea.id as asignacion_id
FROM empleados e
LEFT JOIN empleado_asignaciones ea ON e.id = ea.id_empleado
LEFT JOIN roles r ON ea.id_rol = r.id
LEFT JOIN areas a ON ea.id_area = a.id
LEFT JOIN servicios s ON a.id_servicio = s.id
WHERE e.estado = true
ORDER BY e.id, ea.id DESC;

