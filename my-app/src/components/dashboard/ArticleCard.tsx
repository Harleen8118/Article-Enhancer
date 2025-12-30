import { Card, CardContent, Box, Chip, Typography, ButtonBase } from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import type { Article } from '../../types/article';

interface ArticleCardProps {
  article: Article;
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ButtonBase
        component={Link}
        to={`/article/${article._id}`}
        sx={{
          display: 'block',
          textAlign: 'left',
          height: '100%',
          width: '100%',
          '&:hover': { bgcolor: 'transparent' }
        }}
      >
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
          <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
            <Chip label={article.updated_content ? 'Enhanced' : 'Pending'} color={article.updated_content ? 'success' : 'default'} size="small" />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {new Date(article.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
            </Typography>
          </Box>

          <Typography
            variant="h5"
            gutterBottom
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
              fontWeight: 700,
              mb: 1
            }}
          >
            {article.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flexGrow: 1
            }}
          >
            {article.original_content}
          </Typography>

          <Box mt={3} display="flex" alignItems="center" color="secondary.main" fontSize="0.875rem" fontWeight={600}>
            View Comparison <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 16 }} />
          </Box>
        </CardContent>
      </ButtonBase>
    </Card>
  );
}

export default ArticleCard;
