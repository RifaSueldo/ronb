const fetch = require("node-fetch");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ respuesta: "Método no permitido" })
    };
  }

  const { pregunta } = JSON.parse(event.body || "{}");

  if (!pregunta) {
    return {
      statusCode: 400,
      body: JSON.stringify({ respuesta: "No llegó ninguna confesión." })
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const respuestaIA = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Sos Padre IANN. Respondé como si fueras un confesor digital. Tu tono es serio, empático y humano. No juzgás, no aconsejás directamente: escuchás, comprendés y hacés reflexionar. Respondé en español."
          },
          {
            role: "user",
            content: pregunta
          }
        ],
        temperature: 0.7
      })
    });

    const data = await respuestaIA.json();

    const texto = data.choices?.[0]?.message?.content?.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta: texto || "No pude responderte esta vez." })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ respuesta: "Error interno: no pude contactar con Padre IANN." })
    };
  }
};
