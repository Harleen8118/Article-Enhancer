import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert, Container, Typography } from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import ArticleSubHeader from '../components/comparison/ArticleSubHeader';
import ArticleContentPane from '../components/comparison/ArticleContentPane';
import ReferencesFooter from '../components/comparison/ReferencesFooter';
import type { Article } from '../types/article';

function FormattedContent({ content }: { content: string }) {
  return (
    <Box
      className="formatted-content"
      sx={{
        maxWidth: '65ch',
        lineHeight: 1.9,
        fontSize: '0.95rem',
        '& h1': { fontSize: '1.6rem', fontWeight: 700, mt: 3, mb: 1.5, color: 'text.primary', lineHeight: 1.3 },
        '& h2': { fontSize: '1.3rem', fontWeight: 600, mt: 2.5, mb: 1, color: 'text.primary' },
        '& h3': { fontSize: '1.1rem', fontWeight: 600, mt: 2, mb: 0.75 },
        '& p': { mb: 1.5 },
        '& li': { mb: 0.5 },
        '& strong': { fontWeight: 600, color: 'text.primary' }
      }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: content
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\n\n/g, '<p></p>')
        }}
      />
    </Box>
  );
}

function ArticleComparison() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/api/articles/${id}`)
      .then(res => res.json())
      .then(data => {
        setArticle(data.data || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ height: '100svh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!article) {
    return (
      <Container sx={{ mt: 10 }}>
        <Alert severity="error">Article not found</Alert>
      </Container>
    );
  }

  const HEADER_HEIGHT = 64;
  const SUB_HEADER_HEIGHT = 56;
  const REFERENCES_HEIGHT = article.references.length > 0 ? 120 : 0;

  return (
    <Box
      sx={{
        height: `calc(100svh - ${HEADER_HEIGHT}px)`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}
    >
      <ArticleSubHeader title={article.title} onBack={() => navigate('/')} height={SUB_HEADER_HEIGHT} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          flexGrow: 1,
          overflow: 'hidden',
          minHeight: 0
        }}
      >
        <ArticleContentPane variant="original" title="Original Source">
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'pre-line', maxWidth: '65ch', lineHeight: 1.9, color: 'text.secondary', fontSize: '0.95rem' }}
          >
            {article.original_content}
          </Typography>
        </ArticleContentPane>

        <ArticleContentPane variant="enhanced" title="AI Enhanced">
          {article.updated_content ? (
            <FormattedContent content={article.updated_content} />
          ) : (
            <Box
              sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
              <Typography>No enhanced content available</Typography>
            </Box>
          )}
        </ArticleContentPane>
      </Box>

      <ReferencesFooter references={article.references} height={REFERENCES_HEIGHT} />
    </Box>
  );
}

export default ArticleComparison;
