require("dotenv").config();
const axios = require("axios");

async function testAI() {
  try {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        messages: [
          {
            role: "user",
            content: "Say hello in one sentence."
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      JSON.stringify(error.response?.data || error.message, null, 2)
    );
  }
}

testAI();