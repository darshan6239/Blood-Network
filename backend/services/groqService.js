import fetch from "node-fetch";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Calls Groq's chat completion endpoint.
 * @param {string} systemPrompt - instructions for the model
 * @param {string} userPrompt - the actual input (e.g. raw emergency request text)
 * @returns {Promise<string>} model's text response
 */
export async function callGroq(systemPrompt, userPrompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    // Placeholder mode - no real key configured yet
    return mockAIResponse(userPrompt);
  }

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function mockAIResponse(userPrompt) {
  // Used only when no API key is set, so the app still runs end-to-end for demos.
  return JSON.stringify({
    bloodType: "O-",
    urgency: "high",
    quantityUnits: 2,
    location: "Nashik",
    note: "[MOCK RESPONSE - add GROQ_API_KEY in .env to enable real AI parsing]",
    rawInput: userPrompt,
  });
}
