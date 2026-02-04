const https = require('https');

const token = process.env.TELEGRAM_BOT_TOKEN;
const defaultChatId = process.env.TELEGRAM_CHAT_ID;

function sendMessage(text, chatId = defaultChatId) {
  return new Promise((resolve) => {
    if (!token || !chatId) return resolve(false);

    const payload = JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve(true));
    });
    req.on('error', () => resolve(false));
    req.write(payload);
    req.end();
  });
}

async function notifyNewSale(venta, chatId) {
  try {
    if (!venta) return false;
    const vendedor = venta.usuario && (venta.usuario.nombre || venta.usuario.apellido)
      ? `${venta.usuario.nombre || ''} ${venta.usuario.apellido || ''}`.trim()
      : `usuario_id: ${venta.usuario_id}`;
    const lines = [
      '🛎️ Nueva venta registrada',
      `ID: #${venta.venta_id}`,
      `Fecha: ${new Date(venta.fecha).toLocaleString()}`,
      `Vehículo: ${[venta.vehiculo_marca, venta.vehiculo_modelo].filter(Boolean).join(' ')}`,
      `Precio: $${Number(venta.precio_final).toLocaleString('es-ES')}`,
      `Vendedor: ${vendedor}`,
    ];
    const text = lines.filter(Boolean).join('\n');
    return await sendMessage(text, chatId);
  } catch (_) {
    return false;
  }
}

module.exports = { sendMessage, notifyNewSale };
