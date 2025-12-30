import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

interface ScrapedContent {
  title: string;
  content: string;
  url: string;
  success: boolean;
}

// Demo external articles for when SerpAPI is not available
// These are relevant chatbot/AI articles from other sites
const DEMO_EXTERNAL_ARTICLES: Record<string, { title: string; content: string; url: string }[]> = {
  'chatbot': [
    {
      title: 'What is a Chatbot? Everything You Need to Know',
      content: `Chatbots are AI-powered software applications designed to simulate human conversation. They use natural language processing (NLP) and machine learning to understand user queries and provide relevant responses.

Key Types of Chatbots:
1. Rule-based chatbots - Follow predefined scripts and decision trees
2. AI-powered chatbots - Use machine learning to understand context and intent
3. Hybrid chatbots - Combine rule-based logic with AI capabilities

Benefits for Businesses:
- 24/7 customer support availability
- Reduced operational costs
- Faster response times
- Scalable customer interactions
- Data collection and insights

Best practices for implementing chatbots include starting with specific use cases, training with real customer data, and continuously improving based on feedback.`,
      url: 'https://www.salesforce.com/blog/what-is-a-chatbot/'
    },
    {
      title: 'The Complete Guide to Building Effective Chatbots',
      content: `Building an effective chatbot requires careful planning and execution. This guide covers everything from design principles to deployment strategies.

Chatbot Design Principles:
1. Define clear objectives - Know what problems your chatbot should solve
2. Map user journeys - Understand how users will interact with your bot
3. Create conversational flows - Design natural dialogue paths
4. Handle errors gracefully - Plan for misunderstandings

Technical Considerations:
- Choose the right platform (Dialogflow, Rasa, custom solutions)
- Integrate with existing systems (CRM, support tickets)
- Implement proper security measures
- Plan for scalability

Measuring Success:
Track metrics like resolution rate, customer satisfaction, and cost per interaction to continuously improve your chatbot performance.`,
      url: 'https://www.hubspot.com/blog/chatbot-guide'
    }
  ],
  'customer-engagement': [
    {
      title: 'Customer Engagement Strategies That Work',
      content: `Customer engagement is the emotional connection between a customer and a brand. Strong engagement drives loyalty, advocacy, and revenue growth.

Effective Engagement Strategies:
1. Personalization - Tailor experiences based on customer data
2. Omnichannel presence - Be where your customers are
3. Proactive communication - Reach out before problems arise
4. Community building - Create spaces for customers to connect

AI and Automation:
Modern customer engagement leverages AI for predictive analytics, personalized recommendations, and automated yet personalized interactions at scale.

Metrics to Track:
- Net Promoter Score (NPS)
- Customer Satisfaction (CSAT)
- Customer Effort Score (CES)
- Engagement rates across channels`,
      url: 'https://www.zendesk.com/blog/customer-engagement/'
    },
    {
      title: 'How AI is Transforming Customer Engagement',
      content: `Artificial intelligence is revolutionizing how businesses engage with customers, creating more personalized and efficient experiences.

AI-Powered Engagement Tools:
1. Intelligent chatbots - Handle complex queries with natural language
2. Predictive analytics - Anticipate customer needs
3. Sentiment analysis - Understand customer emotions in real-time
4. Recommendation engines - Suggest relevant products/content

Implementation Best Practices:
- Start with high-impact, low-complexity use cases
- Maintain human oversight for complex situations
- Continuously train AI models with new data
- Balance automation with personal touch

The future of customer engagement lies in seamlessly blending AI capabilities with human empathy to create exceptional experiences.`,
      url: 'https://www.mckinsey.com/ai-customer-engagement/'
    }
  ],
  'lead-generation': [
    {
      title: 'Lead Generation Strategies for Modern Businesses',
      content: `Lead generation is the process of attracting and converting prospects into potential customers. Modern strategies combine digital marketing with automation.

Effective Lead Generation Tactics:
1. Content marketing - Create valuable, targeted content
2. SEO optimization - Be found when prospects search
3. Social media marketing - Engage audiences on their platforms
4. Email marketing - Nurture leads with targeted campaigns
5. Chatbots - Qualify leads 24/7

Automation and AI:
Leverage marketing automation for lead scoring, nurturing sequences, and personalized outreach at scale. AI helps identify high-intent prospects.

Conversion Optimization:
Focus on clear CTAs, landing page optimization, and reducing friction in the lead capture process.`,
      url: 'https://www.marketo.com/lead-generation/'
    }
  ],
  'virtual-assistant': [
    {
      title: 'Virtual Assistants: The Future of Business Productivity',
      content: `Virtual assistants are AI-powered tools that help businesses automate tasks and improve productivity across operations.

Types of Virtual Assistants:
1. Personal productivity assistants (scheduling, reminders)
2. Customer service bots
3. IT help desk automation
4. HR and recruitment assistants

Key Capabilities:
- Natural language understanding
- Task automation and scheduling
- Integration with business systems
- Learning from interactions

Implementation Tips:
Start with specific use cases, train with domain-specific data, and ensure proper security measures. Virtual assistants work best when they complement human workers rather than replace them entirely.`,
      url: 'https://www.gartner.com/virtual-assistants-guide/'
    }
  ],
  'small-business': [
    {
      title: 'How Small Businesses Can Leverage AI Chatbots',
      content: `Small businesses can now access the same AI-powered chatbot technology that was once only available to enterprises, leveling the playing field.

Benefits for Small Businesses:
1. Cost-effective customer support - Handle inquiries without additional staff
2. Lead qualification - Capture and qualify leads automatically
3. Appointment scheduling - Reduce no-shows with automated reminders
4. FAQ automation - Answer common questions instantly

Getting Started:
Choose user-friendly platforms like Tidio, Intercom, or ManyChat. Start with simple FAQ automation and gradually add complexity.

ROI Considerations:
Track time saved, leads generated, and customer satisfaction improvements. Most small businesses see positive ROI within 3-6 months of implementation.`,
      url: 'https://www.smallbusiness.com/chatbot-guide/'
    }
  ]
};

function getExternalArticlesForTopic(title: string): { title: string; content: string; url: string }[] {
  const lowerTitle = title.toLowerCase();
  
  // Match articles based on title keywords
  if (lowerTitle.includes('lead') || lowerTitle.includes('generation')) {
    return [...(DEMO_EXTERNAL_ARTICLES['lead-generation'] || []), ...(DEMO_EXTERNAL_ARTICLES['chatbot'] || [])].slice(0, 2);
  }
  if (lowerTitle.includes('customer') || lowerTitle.includes('engagement') || lowerTitle.includes('interaction')) {
    return DEMO_EXTERNAL_ARTICLES['customer-engagement'] || [];
  }
  if (lowerTitle.includes('virtual') || lowerTitle.includes('assistant')) {
    return [...(DEMO_EXTERNAL_ARTICLES['virtual-assistant'] || []), ...(DEMO_EXTERNAL_ARTICLES['chatbot'] || [])].slice(0, 2);
  }
  if (lowerTitle.includes('small business') || lowerTitle.includes('business growth')) {
    return [...(DEMO_EXTERNAL_ARTICLES['small-business'] || []), ...(DEMO_EXTERNAL_ARTICLES['chatbot'] || [])].slice(0, 2);
  }
  
  // Default to chatbot articles
  return DEMO_EXTERNAL_ARTICLES['chatbot'] || [];
}

export async function scrapeExternalUrl(url: string): Promise<ScrapedContent> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const html = await page.content();
    const $ = cheerio.load(html);
    
    const title = $('h1').first().text().trim() || $('title').text().trim();
    
    // Remove unwanted elements
    $('script, style, nav, footer, header, aside, .sidebar, .comments, .ad').remove();
    
    const content = $('article, .post-content, .entry-content, main').first().text().trim()
      || $('body').text().trim();
    
    await browser.close();
    
    return {
      title,
      content: content.substring(0, 5000), // Limit content length
      url,
      success: true
    };
  } catch (error) {
    await browser.close();
    return {
      title: '',
      content: '',
      url,
      success: false
    };
  }
}

export function getExternalArticles(articleTitle: string): { title: string; content: string; url: string }[] {
  // Since SerpAPI is not available, use demo external articles
  console.log(`📚 Using demo external articles for: "${articleTitle}"`);
  return getExternalArticlesForTopic(articleTitle);
}
