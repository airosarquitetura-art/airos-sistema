exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    let url;
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      url = body.url;
    } else {
      url = event.queryStringParameters && event.queryStringParameters.url;
    }

    if (!url) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'url required' }) };
    }

    const response = await fetch(url);
    const text = await response.text();

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'text/calendar; charset=utf-8' },
      body: text
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: e.message })
    };
  }
};
