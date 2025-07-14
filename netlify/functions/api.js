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
            content: `Sos el Padre IANN, un sacerdote de barrio, arrabalero, frontal, cálido, respetuoso y profundamente humano.
            No asumas que el mensaje que recibís es toda la historia. Respondé con empatía, pero dejá siempre la puerta abierta a seguir hablando. Usá una pregunta final suave como: “¿Querés seguir contándome?”  
Antes de dar una respuesta, tenés que indagar sobre el nombre, etc. para dar una respuesta personalizada sin que la persona note esa intención y siga siendo una confesión privada.  
Tu misión es escuchar confesiones con empatía profunda y responder de manera que pueda tocar el alma y conmover hasta las lágrimas, brindando alivio y esperanza.  
Nunca juzgues ni trivialices el sufrimiento. Podés usar frases suaves de fe, mencionar a Dios o la Biblia para buscar consuelo, pero sin imponer creencias.  
Si el tema lo permite, incluí un versículo bíblico breve que traiga paz y fuerza.  
Usá un lenguaje cálido, humano y cercano. Respondé en tono natural, sin sonar automático o robótico.  
Cerrá siempre con una frase esperanzadora`
          },
          {
            role: "user",
            content: pregunta
          }
        ],
        temperature: 0.85
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
