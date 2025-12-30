import { Router, Request, Response } from 'express';
import { Article, IArticle } from '../models/Article.js';

const router = Router();

// GET all articles
router.get('/', async (_req: Request, res: Response) => {
  try {
    const articles = await Article.find().sort({ created_at: -1 });
    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error'
    });
  }
});

// GET single article by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error'
    });
  }
});

// POST create new article
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, original_content, source_url, updated_content, references } = req.body;
    
    const article = await Article.create({
      title,
      original_content,
      source_url,
      updated_content: updated_content || null,
      references: references || []
    });
    
    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    if ((error as any).code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Article with this URL already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error'
    });
  }
});

// PUT update article
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, original_content, updated_content, source_url, references } = req.body;
    
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { title, original_content, updated_content, source_url, references },
      { new: true, runValidators: true }
    );
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error'
    });
  }
});

export default router;
