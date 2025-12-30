import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import ArticleCard from '../components/dashboard/ArticleCard';
import type { Article } from '../types/article';

function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box minHeight="60vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const enhancedCount = articles.filter(article => article.updated_content).length;

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Box mb={8}>
        <Typography variant="h2" gutterBottom>
          Content Dashboard
        </Typography>
        <Typography variant="h5" color="text.secondary" fontWeight={400}>
          {articles.length} articles • {enhancedCount} standard enhanced
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 4
        }}
      >
        {articles.map((article: Article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </Box>
    </Container>
  );
}

export default Dashboard;
