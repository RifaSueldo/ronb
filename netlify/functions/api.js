import fetch from 'node-fetch';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const { pregunta } = JSON.parse(event.body);

  if (!pregunta) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Falta la pregunta' }),
    };
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No está configurada la API key' }),
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // o 'gpt-4o' si tenés acceso
        messages: [
          { role: 'system', content: 'Eres Ronco, un amigo del barrio que da consejos sinceros y con onda.' },
          { role: 'user', content: pregunta },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error.message || 'Error desconocido' }),
      };
    }

    const respuesta = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Error en la solicitud' }),
    };
  }
}
