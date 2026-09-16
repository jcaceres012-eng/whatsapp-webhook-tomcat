// WhatsApp Webhook para Tomcat Store - Modo Coexistence
// Soporta: Cloud API + WhatsApp Business App (Sincronización automática)

const express = require('express');
const app = express();
app.use(express.json());

// Configuración
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN || '123456';
const phoneNumberId = process.env.PHONE_NUMBER_ID || '16103375938776188';
const businessAccountId = process.env.BUSINESS_ACCOUNT_ID || '16103375938776188';

// Logs mejorados para Coexistence
const logEvent = (type, data) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${ type }] ${timestamp}`);
  console.log(JSON.stringify(data, null, 2));
};

// ============================================
// WEBHOOK VERIFICATION (GET)
// ============================================
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    logEvent('WEBHOOK_VERIFIED', {
      mode,
      timestamp: new Date().toISOString(),
      phoneNumberId,
      coexistenceMode: true
    });
    res.status(200).send(challenge);
  } else {
    logEvent('WEBHOOK_VERIFICATION_FAILED', {
      receivedToken: token,
      expectedToken: verifyToken,
      mode
    });
    res.status(403).end();
  }
});

// ============================================
// WEBHOOK EVENTS (POST)
// ============================================
app.post('/', (req, res) => {
  const { entry } = req.body;

  // Respuesta inmediata a Meta
  res.status(200).json({ success: true });

  if (!entry) return;

  entry.forEach((item) => {
    const { changes } = item;

    changes.forEach((change) => {
      const { field, value } = change;

      // ========== MENSAJES ENTRANTES ==========
      if (field === 'messages') {
        const { messages, metadata } = value;

        messages?.forEach((message) => {
          logEvent('MESSAGE_RECEIVED', {
            from: message.from,
            type: message.type,
            messageId: message.id,
            timestamp: message.timestamp,
            phoneNumberId: metadata.phone_number_id,
            // Indicador de origen (API vs Business App)
            source: determineSource(message),
            content: getMessageContent(message)
          });

          // TODO: Integración con tu sistema
          // - Guardar mensaje en BD
          // - Procesar automáticamente
          // - Responder si es necesario
        });
      }

      // ========== ESTADO DE MENSAJES ==========
      if (field === 'message_status') {
        const { statuses } = value;

        statuses?.forEach((status) => {
          logEvent('MESSAGE_STATUS', {
            messageId: status.id,
            status: status.status, // sent, delivered, read, failed
            timestamp: status.timestamp,
            phoneNumberId: value.metadata?.phone_number_id,
            recipientId: status.recipient_id,
            errors: status.errors
          });
        });
      }

      // ========== ACTUALIZACIÓN DE TEMPLATES ==========
      if (field === 'message_template_status_update') {
        logEvent('TEMPLATE_STATUS_UPDATE', value);
      }

      // ========== CAMBIOS DE CUENTA ==========
      if (field === 'account_alerts') {
        logEvent('ACCOUNT_ALERT', value);
      }
    });
  });
});

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Determina si el mensaje viene de API o Business App
 * En Coexistence: ambas fuentes se sincronizan automáticamente
 */
function determineSource(message) {
  // Meta incluye metadata que indica la fuente
  if (message.from_me) return 'BUSINESS_APP'; // Enviado por la app manual
  return 'CLOUD_API'; // Recibido por Cloud API
}

/**
 * Extrae el contenido del mensaje según su tipo
 */
function getMessageContent(message) {
  const { type, text, image, video, audio, document, location, contacts } = message;

  switch (type) {
    case 'text':
      return { type: 'text', content: text?.body };
    case 'image':
      return { type: 'image', mediaId: image?.id };
    case 'video':
      return { type: 'video', mediaId: video?.id };
    case 'audio':
      return { type: 'audio', mediaId: audio?.id };
    case 'document':
      return { type: 'document', mediaId: document?.id };
    case 'location':
      return { type: 'location', data: location };
    case 'contacts':
      return { type: 'contacts', data: contacts };
    default:
      return { type, raw: message };
  }
}

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    webhook: 'WhatsApp Coexistence Enabled',
    phoneNumberId,
    verifyTokenSet: !!verifyToken
  });
});

// ============================================
// INICIO DEL SERVIDOR
// ============================================
app.listen(port, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║   WhatsApp Webhook - Tomcat Store     ║`);
  console.log(`║   Modo: COEXISTENCE (API + Business)  ║`);
  console.log(`║   Puerto: ${port}                            ║`);
  console.log(`║   Timestamp: ${new Date().toISOString()} ║`);
  console.log(`╚════════════════════════════════════════╝\n`);

  logEvent('SERVER_STARTED', {
    port,
    phoneNumberId,
    coexistenceMode: true,
    status: 'Ready to receive webhook events'
  });
});
