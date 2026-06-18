const dotenv = require('dotenv');
const path = require('path');
const https = require('https');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Error: GEMINI_API_KEY not found in .env');
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('Fetching available models directly from API...');

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.error) {
        console.error('API Error:', parsed.error);
        return;
      }

      console.log('\nAvailable Models:');
      console.log('-----------------');
      if (parsed.models) {
        parsed.models.forEach((model) => {
          console.log(`Name: ${model.name}`);
          console.log(`Methods: ${model.supportedGenerationMethods.join(', ')}`);
          console.log('-----------------');
        });
      } else {
        console.log('No models returned. Response:', parsed);
      }
    } catch (e) {
      console.error('Failed to parse response:', e);
      console.log('Raw data:', data);
    }
  });
}).on('error', (err) => {
  console.error('HTTP Request failed:', err);
});
