require("dotenv").config();
const axios = require("axios");

async function test() {
  const response = await axios.post(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/baai/bge-base-en-v1.5`,
    {
      text: ["Hello world"]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  console.log(response.data);
}

test();