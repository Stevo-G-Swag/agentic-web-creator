import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    const prompt = `
      Given the following web app description, extract the key features, design preferences, and technical requirements:
      
      ${description}

      Output the information in the following JSON format:
      {
        "features": [],
        "design": {
          "backgroundColor": "",
          "textColor": ""
        },
        "technicalRequirements": []
      }
    `;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 150,
    });

    const parsedData = JSON.parse(completion.data.choices[0].text.trim());
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error processing description:", error);
    res.status(500).json({ error: "Failed to process description" });
  }
}