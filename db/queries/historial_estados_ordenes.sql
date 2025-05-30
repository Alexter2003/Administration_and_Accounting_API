
-- Tabla para registrar el historial de cambios de estado
CREATE TABLE historial_estados (
    id SERIAL PRIMARY KEY,
    tipo_entidad VARCHAR(20) NOT NULL CHECK (tipo_entidad IN ('orden', 'detalle_orden')),
    entidad_id INTEGER NOT NULL,
    estado_anterior INTEGER,
    estado_nuevo INTEGER NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT, -- comentarios sobre el cambio
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Índices
CREATE INDEX idx_historial_estados_tipo_entidad ON historial_estados(tipo_entidad);
CREATE INDEX idx_historial_estados_entidad_id ON historial_estados(entidad_id);
CREATE INDEX idx_historial_estados_fecha_cambio ON historial_estados(fecha_cambio);
CREATE INDEX idx_historial_estados_tipo_entidad_id ON historial_estados(tipo_entidad, entidad_id);


-- FUNCIONES PARA LOS TRIGGERS
-- Funcion para registrar cambios de estado en ordenes
CREATE OR REPLACE FUNCTION registrar_cambio_estado_orden()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo registrar si el estado realmente cambio
    IF OLD.id_estado_orden IS DISTINCT FROM NEW.id_estado_orden THEN
        INSERT INTO historial_estados (
            tipo_entidad,
            entidad_id,
            estado_anterior,
            estado_nuevo,
            observaciones
        ) VALUES (
            'orden',
            NEW.id,
            OLD.id_estado_orden,
            NEW.id_estado_orden,
            CASE
                WHEN NEW.id_estado_orden = 1 THEN 'Orden confirmada'
                WHEN NEW.id_estado_orden = 2 THEN 'Orden en proceso'
                WHEN NEW.id_estado_orden = 3 THEN 'Orden entregada'
                WHEN NEW.id_estado_orden = 4 THEN 'Orden cancelada'
                ELSE 'Cambio de estado'
            END
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funcion para registrar cambios de estado en detalles de orden
CREATE OR REPLACE FUNCTION registrar_cambio_estado_detalle()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo registrar si el estado realmente cambio
    IF OLD.id_estado_detalle IS DISTINCT FROM NEW.id_estado_detalle THEN
        INSERT INTO historial_estados (
            tipo_entidad,
            entidad_id,
            estado_anterior,
            estado_nuevo,
            observaciones
        ) VALUES (
            'detalle_orden',
            NEW.id,
            OLD.id_estado_detalle,
            NEW.id_estado_detalle,
            CASE
                WHEN NEW.id_estado_detalle = 1 THEN 'Detalle completo'
                WHEN NEW.id_estado_detalle = 2 THEN 'Detalle incompleto'
                WHEN NEW.id_estado_detalle = 3 THEN 'Detalle no recibido'
                ELSE 'Cambio de estado en detalle'
            END ||
            CASE
                WHEN OLD.cantidad IS DISTINCT FROM NEW.cantidad THEN
                    ' - Cantidad actualizada: ' || OLD.cantidad || ' → ' || NEW.cantidad
                ELSE ''
            END
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CREACION DE LOS TRIGGERS
-- Trigger para cambios de estado en la tabla ordenes
CREATE TRIGGER trigger_historial_estado_orden
    AFTER UPDATE ON ordenes
    FOR EACH ROW
    EXECUTE FUNCTION registrar_cambio_estado_orden();

-- Trigger para cambios de estado en la tabla ordenes_detalle
CREATE TRIGGER trigger_historial_estado_detalle
    AFTER UPDATE ON ordenes_detalle
    FOR EACH ROW
    EXECUTE FUNCTION registrar_cambio_estado_detalle();

--VISTA
CREATE VIEW vista_historial_ordenes AS
SELECT
    h.id,
    h.entidad_id as orden_id,
    o.fecha_orden,
    o.costo_total,
    h.estado_anterior,
    eo_anterior.nombre as estado_anterior_nombre,
    h.estado_nuevo,
    eo_nuevo.nombre as estado_nuevo_nombre,
    h.fecha_cambio,
    h.observaciones,
    s.nombre as servicio_nombre,
    p.nombres as proveedor_nombre
FROM historial_estados h
LEFT JOIN ordenes o ON h.entidad_id = o.id
LEFT JOIN estados_orden eo_anterior ON h.estado_anterior = eo_anterior.id
LEFT JOIN estados_orden eo_nuevo ON h.estado_nuevo = eo_nuevo.id
LEFT JOIN servicios s ON o.id_servicio = s.id
LEFT JOIN proveedores p ON o.id_proveedor = p.id
WHERE h.tipo_entidad = 'orden'
ORDER BY h.fecha_cambio DESC;