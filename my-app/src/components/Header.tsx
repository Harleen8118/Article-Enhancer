import { AppBar, Toolbar, Typography, Container, Button, Stack, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { AutoAwesome as AutoAwesomeIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';

function Header() {
  return (
    <AppBar position="sticky" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 64, justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'text.primary' }}
          >
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: 32,
                height: 32,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AutoAwesomeIcon fontSize="small" />
            </Box>
            <Typography variant="h6" fontWeight={800}>
              BeyondChats AI
            </Typography>
          </Stack>

          <Button
            href="https://beyondchats.com/blogs/"
            target="_blank"
            variant="outlined"
            size="small"
            endIcon={<OpenInNewIcon />}
            sx={{ borderColor: 'divider', color: 'text.secondary', ':hover': { borderColor: 'text.primary', color: 'text.primary' } }}
          >
            Original Blog
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
