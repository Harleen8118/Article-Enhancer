import { ReactNode } from 'react';
import { Box, Chip, Typography } from '@mui/material';

interface ArticleContentPaneProps {
  title: string;
  variant: 'original' | 'enhanced';
  children: ReactNode;
}

const SCROLL_STYLE = {
  '&::-webkit-scrollbar': { width: 8 },
  '&::-webkit-scrollbar-track': { bgcolor: 'grey.100', borderRadius: 4 },
  '&::-webkit-scrollbar-thumb': {
    bgcolor: 'grey.300',
    borderRadius: 4,
    '&:hover': { bgcolor: 'grey.400' }
  }
};

function ArticleContentPane({ title, variant, children }: ArticleContentPaneProps) {
  const isOriginal = variant === 'original';

  return (
    <Box
      sx={{
        borderRight: isOriginal ? { md: '1px solid' } : undefined,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: isOriginal ? 'white' : '#fafbfc'
      }}
    >
      <Box
        sx={{
          height: 44,
          minHeight: 44,
          p: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: isOriginal ? 'grey.50' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <Typography variant="overline" color={isOriginal ? 'text.secondary' : 'secondary.main'} fontWeight={700} letterSpacing={1}>
          {title}
        </Typography>
        {!isOriginal && <Chip label="Final Draft" size="small" color="secondary" variant="outlined" sx={{ borderRadius: 1, height: 22, fontSize: '0.7rem' }} />}
      </Box>

      <Box
        sx={{
          p: 3,
          overflowY: 'auto',
          flexGrow: 1,
          minHeight: 0,
          ...(variant === 'enhanced'
            ? {
                '&::-webkit-scrollbar': { width: 8 },
                '&::-webkit-scrollbar-track': { bgcolor: 'grey.100', borderRadius: 4 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'secondary.light', borderRadius: 4, '&:hover': { bgcolor: 'secondary.main' } }
              }
            : SCROLL_STYLE)
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default ArticleContentPane;
