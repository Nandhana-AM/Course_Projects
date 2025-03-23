const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Summarize: Artificial Intelligence is the future of technology." }],
        });

        console.log(response.choices[0].message.content);
    } catch (error) {
        console.error("OpenAI API Error:", error.response?.data || error.message);
    }
}

testOpenAI();