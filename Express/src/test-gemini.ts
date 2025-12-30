import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('=== Testing models/gemini-1.5-flash ===');
  console.log('API Key:', apiKey?.substring(0, 10) + '...');
  
  if (!apiKey) {
    console.log('ERROR: No API key');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    
    console.log('Sending request...');
    const result = await model.generateContent('Say hello in 3 words');
    const response = await result.response;
    console.log('SUCCESS!');
    console.log('Response:', response.text());
  } catch (error: any) {
    console.log('ERROR:', error.message);
    console.log('Status:', error.status || 'unknown');
  }
}

test();
