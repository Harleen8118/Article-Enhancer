import { Paper, Typography, Stack, Chip } from '@mui/material';

interface ReferencesFooterProps {
  references: string[];
  height?: number;
}

function ReferencesFooter({ references, height = 120 }: ReferencesFooterProps) {
  if (references.length === 0) return null;

  return (
    <Paper
      square
      elevation={0}
      sx={{
        height,
        minHeight: height,
        borderTop: '1px solid',
        borderColor: 'divider',
        px: 3,
        py: 2,
        bgcolor: 'grey.50',
        flexShrink: 0,
        overflow: 'hidden'
      }}
    >
      <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1 }}>
        References & Citations
      </Typography>
      <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
        {references.map((ref, index) => (
          <Chip
            key={index}
            label={`[${index + 1}] ${ref.length > 40 ? ref.substring(0, 40) + '...' : ref}`}
            component="a"
            href={ref}
            target="_blank"
            clickable
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1, fontSize: '0.75rem', maxWidth: 300, '&:hover': { bgcolor: 'primary.50', borderColor: 'primary.main' } }}
          />
        ))}
      </Stack>
    </Paper>
  );
}

export default ReferencesFooter;
