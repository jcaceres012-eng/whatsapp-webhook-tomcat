# WhatsApp Webhook para Tomcat Store

Webhook receiver para WhatsApp Business API implementado en Node.js con Express.

## Descripción

Esta aplicación es un endpoint webhook que recibe eventos de WhatsApp Business, con soporte para **Coexistence Mode** (Cloud API + Business App en el mismo número).

### Eventos soportados:
- Mensajes entrantes (desde Cloud API o Business App)
- Cambios de estado de mensajes
- Actualización de estado de templates
- Alertas de cuenta
- Sincronización automática entre Cloud API y Business App

## Requisitos previos

- Cuenta en GitHub
- Cuenta en Render.com
- WhatsApp Business Account configurada en Meta

## Instalación local

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Configurar variable de entorno: `VERIFY_TOKEN=tu_token_aqui`
4. Iniciar: `npm start`

## Despliegue en Render

1. Conectar este repositorio a Render.com
2. Configurar comando de compilación: `npm install express`
3. Configurar comando de inicio: `node app.js`
4. Agregar variable de entorno `VERIFY_TOKEN` en Render
5. Desplegar

Una vez desplegado, Render proporcionará una URL pública (p. ej., `https://whatsapp-webhook-xxxx.onrender.com`)

## Configuración en Meta

### Webhook Configuration
1. Ir a: Panel de apps > WhatsApp > Webhooks > Configuración
2. URL de devolución de llamada: `https://whatsapp-webhook-xxxx.onrender.com/`
3. Token de verificación: (el valor de VERIFY_TOKEN)
4. Campos a suscribirse:
   - `messages`
   - `message_status`
   - `message_template_status_update`
   - `account_alerts`
5. Hacer clic en "Verificar y guardar"

### Activar Coexistence Mode

1. Ir a: Meta Business Suite > WhatsApp Business Account > Configuración
2. Sección: "Modo de Coexistencia"
3. Habilitar: "Permitir WhatsApp Business App + Cloud API"
4. Meta sincronizará automáticamente todos los eventos

**Beneficios del Coexistence:**
- ✅ La app manual y la API funcionan simultáneamente
- ✅ Meta sincroniza automáticamente los mensajes
- ✅ Sin conflictos ni duplicados
- ✅ Redundancia completa
- ✅ Sin costo adicional

## Monitoreo

Los eventos se registran en la consola de Render con:
- Timestamp exacto
- Origen del mensaje (API o Business App)
- Tipo de evento
- Estado de sincronización
- Errores si los hay

### Health Check
Visita: `https://whatsapp-webhook-xxxx.onrender.com/health`

## Modo Coexistence (API + Business App)

En modo Coexistence, el webhook recibe eventos de ambas fuentes:

```
WhatsApp Business App (Manual)
          ↓
    [Evento de mensaje]
          ↓
    Webhook (este servidor)
          ↓
    Cloud API Automático
```

El webhook identifica automáticamente la fuente:
- `source: "BUSINESS_APP"` - Mensaje enviado por la app manual
- `source: "CLOUD_API"` - Mensaje recibido por Cloud API
