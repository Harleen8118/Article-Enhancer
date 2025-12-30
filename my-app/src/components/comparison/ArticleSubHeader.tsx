import { Paper, Stack, IconButton, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface ArticleSubHeaderProps {
  title: string;
  onBack: () => void;
  height?: number;
}

function ArticleSubHeader({ title, onBack, height = 56 }: ArticleSubHeaderProps) {
  return (
    <Paper
      square
      elevation={0}
      sx={{
        height,
        minHeight: height,
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'white',
        flexShrink: 0
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={onBack} size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" fontWeight={700} noWrap sx={{ maxWidth: { xs: 200, md: 500, lg: 700 } }}>
          {title}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default ArticleSubHeader;
