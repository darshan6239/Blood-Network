import fetch from "node-fetch";

/**
 * Calls a locally running Ollama instance.
 * Useful for hospitals/NGOs that don't want request data leaving their network.
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @returns {Promise<string>}
 */
export async function callOllama(systemPrompt, userPrompt) {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.1";

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return data.message?.content ?? "";
  } catch (err) {
    // Ollama not running locally - fall back to a mock so the demo still works
    return JSON.stringify({
      note: "[OLLAMA UNAVAILABLE - start Ollama locally (ollama serve) to enable]",
      error: err.message,
      rawInput: userPrompt,
    });
  }
}
