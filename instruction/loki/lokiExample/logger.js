const configFile = require('./config.json');

const logger = getLokiLogger({
  lokiHost: configFile.host,
  lokiUser: configFile.user,
  lokiToken: configFile.accessToken,
});

function getLokiLogger(config) {
  if (!config.lokiHost || !config.lokiUser || !config.lokiToken) {
    throw new Error('Missing necessary configuration for Loki logger');
  }
  return ['info', 'warn', 'error', 'debug'].reduce((acc, level) => {
    acc[level] = (message, labels = {}) => log(config, level, message, labels);
    return acc;
  }, {});
}

async function log(config, logLevel, message, labels) {
  try {
    const lokiMessage = generateLokiMessage(logLevel, message, labels);
    await sendToLoki(config, lokiMessage);
  } catch (e) {
    console.error(`Failed to log message at level ${logLevel}:`, e);
  }
}

function generateLokiMessage(logLevel, message, labels) {
  return {
    streams: [
      {
        stream: Object.assign({ level: logLevel }, labels),
        values: [[`${Date.now().toString()}000000`, JSON.stringify(message)]],
      },
    ],
  };
}

async function sendToLoki(config, lokiMessage) {
  await fetch(`https://${config.lokiHost}/loki/api/v1/push`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${config.lokiUser}:${config.lokiToken}`)}`,
    },
    body: JSON.stringify(lokiMessage),
  })
    .then((r) => {
      if (!r.ok) {
        throw new Error(r.statusText);
      }
    })
    .catch((e) => {
      console.error('Error:', e);
    });
}

module.exports = logger;
