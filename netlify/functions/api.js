const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { pregunta } = JSON.parse(event.body);

    if (!pregunta) {
      return {
        statusCode: 400,
        body: JSON.stringify({ respuesta: 'No recibí tu pregunta, Ronco.' }),
      };
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/tiiuae/falcon-rw-1b',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: pregunta }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ respuesta: 'Error interno: ' + JSON.stringify(data.error || data) }),
      };
    }

    let respuesta = '';

    if (Array.isArray(data) && data[0].generated_text) {
      respuesta = data[0].generated_text;
    } else if (data.generated_text) {
      respuesta = data.generated_text;
    } else {
      respuesta = 'No entendí, Ronco.';
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ respuesta: 'Error interno: ' + error.message }),
    };
  }
};
