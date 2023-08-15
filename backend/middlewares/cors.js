// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://mesto-frontend.nomoreparties.co',
  'http://mesto-frontend.nomoreparties.co',
  'https://api.mesto-frontend.nomoreparties.co',
  'http://api.mesto-frontend.nomoreparties.co',
  'localhost:3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};
