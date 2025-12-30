import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box, ThemeProvider } from '@mui/material';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ArticleComparison from './pages/ArticleComparison';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/article/:id" element={<ArticleComparison />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
