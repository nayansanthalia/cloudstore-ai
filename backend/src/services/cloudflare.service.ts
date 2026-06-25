import axios from "axios";

export class CloudflareService {
  private static accountId = process.env.CF_ACCOUNT_ID!;
  private static token = process.env.CF_API_TOKEN!;

  private static headers = {
    Authorization: `Bearer ${CloudflareService.token}`,
    "Content-Type": "application/json",
  };

  static async generateEmbedding(text: string): Promise<number[]> {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/@cf/baai/bge-base-en-v1.5`,
      {
        text: [text],
      },
      {
        headers: this.headers,
      }
    );

    return response.data.result.data[0];
  }

  static async generateAnswer(prompt: string): Promise<string> {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        messages: [
          {
            role: "system",
            content: "You are CloudSphere AI."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: this.headers,
      }
    );

    return response.data.result.response;
  }
}