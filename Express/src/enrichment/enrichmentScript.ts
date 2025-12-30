import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Article } from '../models/Article.js';
import { enrichArticleWithLLM, testLLMConnection } from './llmService.js';
import { getExternalArticles } from './externalScraper.js';

dotenv.config();

async function enrichAllArticles() {
  console.log('🚀 Starting article enrichment process...\n');
  
  // Test LLM connection first
  console.log('🔌 Testing Gemini API connection...');
  const llmWorking = await testLLMConnection();
  if (!llmWorking) {
    console.error('❌ Cannot proceed without working LLM connection');
    process.exit(1);
  }
  console.log('');
  
  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/beyondchats';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB\n');
  
  // Get all articles that need enrichment
  const articles = await Article.find({ updated_content: null });
  console.log(`📚 Found ${articles.length} articles to enrich\n`);
  
  if (articles.length === 0) {
    console.log('ℹ️ No articles need enrichment. Run the scraper first or all articles are already enriched.');
    await mongoose.disconnect();
    return;
  }
  
  let enriched = 0;
  let failed = 0;
  
  for (const article of articles) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 Processing: "${article.title}"`);
    console.log(`${'='.repeat(60)}`);
    
    try {
      // Step 1: Get external articles (using demo data since no SerpAPI)
      console.log('\n1️⃣ Finding relevant external articles...');
      const externalArticles = getExternalArticles(article.title);
      console.log(`   Found ${externalArticles.length} external articles`);
      
      for (const ext of externalArticles) {
        console.log(`   - "${ext.title}"`);
      }
      
      // Step 2: Send to LLM for enrichment
      console.log('\n2️⃣ Sending to Gemini for AI rewriting...');
      const result = await enrichArticleWithLLM(
        article.original_content,
        article.title,
        externalArticles
      );
      
      if (!result.success) {
        console.error(`   ❌ LLM enrichment failed: ${result.error}`);
        failed++;
        continue;
      }
      
      console.log(`   ✅ Generated ${result.updatedContent.length} characters`);
      
      // Step 3: Update database
      console.log('\n3️⃣ Updating database...');
      const references = externalArticles.map(a => a.url);
      
      await Article.findByIdAndUpdate(article._id, {
        updated_content: result.updatedContent,
        references: references
      });
      
      console.log(`   ✅ Saved with ${references.length} references`);
      enriched++;
      
      // Rate limiting - wait between API calls
      console.log('\n⏳ Waiting before next article...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`\n❌ Error processing "${article.title}":`, error);
      failed++;
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 ENRICHMENT SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Successfully enriched: ${enriched}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📚 Total processed: ${articles.length}`);
  
  await mongoose.disconnect();
  console.log('\n🔌 Disconnected from MongoDB');
  console.log('🎉 Enrichment process complete!');
}

// Run the enrichment
enrichAllArticles().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
