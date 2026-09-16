# WhatsApp Webhook para Tomcat Store

Webhook receiver para WhatsApp Business API implementado en Node.js con Express.

## Descripción

Esta aplicación es un endpoint webhook que recibe eventos de WhatsApp Business, incluyendo:
- Mensajes entrantes
- Cambios de estado de mensajes
- Alertas de cuenta

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

1. Ir a: Panel de apps > WhatsApp > Webhooks > Configuración
2. URL de devolución de llamada: `https://whatsapp-webhook-xxxx.onrender.com/`
3. Token de verificación: (el valor de VERIFY_TOKEN)
4. Hacer clic en "Verificar y guardar"

## Monitoreo

Los eventos se registran en la consola de Render, accesible desde el dashboard.
