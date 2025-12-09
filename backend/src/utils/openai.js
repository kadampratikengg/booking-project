// backend/src/utils/openai.js
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const client = new OpenAIApi(configuration);

async function summarizeRideText(ride) {
  const prompt = `Summarize this ride: ${JSON.stringify(ride)}`;
  const resp = await client.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200
  });
  return resp.data.choices[0].message.content.trim();
}

module.exports = { summarizeRideText };
