import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface EnrichmentResult {
  updatedContent: string;
  success: boolean;
  error?: string;
}

export async function enrichArticleWithLLM(
  originalContent: string,
  originalTitle: string,
  externalArticles: { title: string; content: string; url: string }[]
): Promise<EnrichmentResult> {
  try {
    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite"
});

    
    // Build context from external articles
    const externalContext = externalArticles
      .map((article, index) => `
=== External Article ${index + 1}: "${article.title}" ===
Source: ${article.url}

${article.content.substring(0, 3000)}
${article.content.length > 3000 ? '...[truncated]' : ''}
`)
      .join('\n');
    
    const prompt = `You are an expert content writer and SEO specialist. Your task is to rewrite and improve an article based on high-ranking competitor content.

## ORIGINAL ARTICLE
Title: "${originalTitle}"

Content:
${originalContent}

## HIGH-RANKING COMPETITOR ARTICLES FOR REFERENCE
${externalContext || 'No external articles provided for this enrichment.'}

## YOUR TASK
Rewrite the original article to make it:
1. More comprehensive and in-depth like the competitors
2. Better structured with clear headings and subheadings
3. More engaging with improved formatting
4. SEO-optimized while keeping the original core message
5. Include relevant examples and actionable insights

## OUTPUT REQUIREMENTS
- Write the improved article in Markdown format
- Include H2 and H3 headings for structure
- Keep the same general topic and key points
- Make it at least as long as the original
- Write in a professional, engaging tone
- Do NOT include any citations or references (they will be added separately)

Write the improved article below:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const updatedContent = response.text();
    
    if (!updatedContent || updatedContent.length < 100) {
      return {
        updatedContent: '',
        success: false,
        error: 'LLM returned empty or too short response'
      };
    }
    
    return {
      updatedContent,
      success: true
    };
  } catch (error) {
    console.error('LLM Error:', error);
    return {
      updatedContent: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown LLM error'
    };
  }
}

export async function testLLMConnection(): Promise<boolean> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    return false;
  }
  
  console.log(`📝 Using API key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const result = await model.generateContent('Say "Hello, I am working!" in one sentence.');
    const response = await result.response;
    console.log('✅ LLM Connection Test:', response.text());
    return true;
  } catch (error: any) {
    console.error('❌ LLM Connection Failed:', error?.message || error);
    if (error?.status) {
      console.error(`   Status: ${error.status} ${error.statusText || ''}`);
    }
    return false;
  }
}
