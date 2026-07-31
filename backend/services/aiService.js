import { callGroq } from "./groqService.js";
import { callOllama } from "./ollamaService.js";

/**
 * Routes to Groq or Ollama based on AI_PROVIDER env var.
 */
async function callAI(systemPrompt, userPrompt) {
  const provider = process.env.AI_PROVIDER || "groq";
  if (provider === "ollama") {
    return callOllama(systemPrompt, userPrompt);
  }
  return callGroq(systemPrompt, userPrompt);
}

/**
 * 1) NLP intake: turns a free-text/voice-transcribed emergency request
 *    into structured data (blood type, urgency, quantity, location).
 */
export async function parseEmergencyRequest(rawText) {
  const systemPrompt = `You are a medical intake assistant for a blood donation emergency network.
Extract structured data from the user's message. Respond ONLY with valid JSON in this exact shape:
{
  "bloodType": "A+/A-/B+/B-/O+/O-/AB+/AB-/unknown",
  "urgency": "critical/high/medium/low",
  "quantityUnits": number,
  "location": "string",
  "note": "short summary"
}
No preamble, no markdown, JSON only.`;

  const raw = await callAI(systemPrompt, rawText);
  return safeParseJSON(raw);
}

/**
 * 2) Donor eligibility screening chat - asks basic screening questions
 *    and returns eligible/not-eligible with reason.
 */
export async function screenDonorEligibility(donorAnswers) {
  const systemPrompt = `You are a blood donation eligibility screening assistant.
Given the donor's answers to standard pre-donation questions, respond ONLY with JSON:
{ "eligible": true/false, "reason": "short explanation" }`;

  const raw = await callAI(systemPrompt, JSON.stringify(donorAnswers));
  return safeParseJSON(raw);
}

/**
 * 3) Overall AI summary - generates a human-readable summary/report for
 *    NGO/admin dashboards (e.g. daily shortage summary, matching outcome).
 */
export async function generateSummary(context) {
  const systemPrompt = `You are an assistant generating a short, clear operational summary
for an NGO admin dashboard managing a blood donation network. Be concise (max 4 sentences),
plain language, no markdown.`;

  return callAI(systemPrompt, JSON.stringify(context));
}

/**
 * 4) Predictive shortage forecast (simple heuristic placeholder - swap
 *    with a real trained model / time-series later). AI is used here to
 *    produce a readable explanation of the forecast.
 */
export async function forecastShortageExplanation(stats) {
  const systemPrompt = `You are a healthcare data analyst. Given blood inventory and request
statistics, explain in 2-3 short sentences which blood types are likely to run short soon and why.
Plain language, no markdown.`;

  return callAI(systemPrompt, JSON.stringify(stats));
}

function safeParseJSON(text) {
  try {
    // Strip markdown code fences if the model added them
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { error: "Could not parse AI response", raw: text };
  }
}
