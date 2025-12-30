import puppeteer, { Browser } from 'puppeteer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Article } from '../models/Article.js';

dotenv.config();

interface ScrapedArticle {
  title: string;
  content: string;
  url: string;
}

// Article URLs from the oldest pages (14-15) of BeyondChats blog
const OLDEST_ARTICLE_URLS = [
  'https://beyondchats.com/blogs/introduction-to-chatbots/',
  'https://beyondchats.com/blogs/live-chatbot/',
  'https://beyondchats.com/blogs/virtual-assistant/',
  'https://beyondchats.com/blogs/lead-generation-chatbots/',
  'https://beyondchats.com/blogs/chatbots-for-small-business-growth/'
];

async function scrapeArticle(browser: Browser, url: string): Promise<ScrapedArticle | null> {
  const page = await browser.newPage();
  
  // Set user agent to avoid bot detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    console.log(`📄 Scraping: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10000 }).catch(() => {});
    
    // Extract content directly using Puppeteer's evaluate
    const result = await page.evaluate(() => {
      // Get title - try multiple selectors
      const titleElement = document.querySelector('h1.wp-block-post-title') ||
                          document.querySelector('h1.entry-title') ||
                          document.querySelector('article h1') ||
                          document.querySelector('h1');
      const title = titleElement?.textContent?.trim() || '';
      
      // Get content - try multiple selectors for WordPress themes
      let content = '';
      const contentSelectors = [
        '.entry-content',
        '.post-content', 
        '.wp-block-post-content',
        'article .content',
        '.blog-content',
        'main article',
        'article'
      ];
      
      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          // Clone to avoid modifying the page
          const clone = element.cloneNode(true) as HTMLElement;
          
          // Remove unwanted elements
          clone.querySelectorAll('script, style, nav, footer, .sidebar, .comments, .share-buttons, .related-posts, header, .breadcrumb').forEach(el => el.remove());
          
          const text = clone.textContent?.trim() || '';
          if (text.length > 200) {
            content = text;
            break;
          }
        }
      }
      
      // Fallback: get all paragraph text
      if (!content || content.length < 200) {
        const paragraphs = Array.from(document.querySelectorAll('article p, main p, .content p'));
        content = paragraphs.map(p => p.textContent?.trim()).filter(Boolean).join('\n\n');
      }
      
      return { title, content };
    });
    
    // Clean up content
    const content = result.content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
    
    if (!result.title || content.length < 100) {
      console.log(`⚠️ Could not extract content from ${url} (title: "${result.title}", content length: ${content.length})`);
      return null;
    }
    
    console.log(`✅ Scraped: "${result.title}" (${content.length} chars)`);
    
    return {
      title: result.title,
      content,
      url
    };
  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error);
    return null;
  } finally {
    await page.close();
  }
}

async function scrapeAllArticles(): Promise<ScrapedArticle[]> {
  console.log('🚀 Starting BeyondChats blog scraper...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });
  
  const articles: ScrapedArticle[] = [];
  
  try {
    for (const url of OLDEST_ARTICLE_URLS) {
      const article = await scrapeArticle(browser, url);
      if (article) {
        articles.push(article);
      }
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } finally {
    await browser.close();
  }
  
  console.log(`\n📊 Successfully scraped ${articles.length} articles`);
  return articles;
}

async function saveToDatabase(articles: ScrapedArticle[]) {
  console.log('\n💾 Saving articles to MongoDB...\n');
  
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/beyondchats';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB');
  
  let saved = 0;
  let skipped = 0;
  
  for (const article of articles) {
    try {
      const existing = await Article.findOne({ source_url: article.url });
      
      if (existing) {
        console.log(`⏭️ Skipped (already exists): "${article.title}"`);
        skipped++;
        continue;
      }
      
      await Article.create({
        title: article.title,
        original_content: article.content,
        updated_content: null,
        source_url: article.url,
        references: [],
        created_at: new Date()
      });
      
      console.log(`✅ Saved: "${article.title}"`);
      saved++;
    } catch (error) {
      console.error(`❌ Error saving "${article.title}":`, error);
    }
  }
  
  console.log(`\n📊 Summary: ${saved} saved, ${skipped} skipped`);
  
  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

async function main() {
  try {
    const articles = await scrapeAllArticles();
    
    if (articles.length > 0) {
      await saveToDatabase(articles);
    } else {
      console.log('❌ No articles scraped. Check the URLs or network connection.');
    }
    
    console.log('\n🎉 Scraping complete!');
  } catch (error) {
    console.error('❌ Scraper failed:', error);
    process.exit(1);
  }
}

main();
