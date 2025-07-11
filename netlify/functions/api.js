const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const pregunta = body.pregunta || "Hola Ronco";
    const prompt = `Respondé con empatía y sabiduría, estilo del Ronco, a esta situación:\n\n"${pregunta}"`;

    const respuestaIA = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 120 }
      })
    });

    const data = await respuestaIA.json();
    const salida = Array.isArray(data) ? data[0]?.generated_text || "No entendí, Ronco." : data?.generated_text || "No entendí, Ronco.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ respuesta: salida })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ respuesta: "Me trabé, Ronco. Probá más tarde." })
    };
  }
};
