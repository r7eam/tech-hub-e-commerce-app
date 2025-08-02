import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Products from './components/Products';
import Users from './components/Users';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

const AppContent = () => {
  const { darkMode } = useTheme();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#6B9DD6' : '#7BA7D1',
        contrastText: darkMode ? '#ffffff' : '#ffffff',
      },
      secondary: {
        main: darkMode ? '#8BB8A8' : '#A3C4BC',
      },
      background: {
        default: darkMode ? '#1A1F2E' : '#F8FAFB',
        paper: darkMode ? '#252B3D' : '#FFFFFF',
      },
      text: {
        primary: darkMode ? '#E8EDF5' : '#2C3E50',
        secondary: darkMode ? '#B8C5D6' : '#5D7285',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: darkMode ? '#6B9DD6' : '#7BA7D1',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: darkMode ? '#5A8BC4' : '#6B95BF',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#252B3D' : '#7BA7D1',
            color: '#ffffff',
          },
        },
      },
    },
  });

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Navigation />
          <ProtectedRoute>
            <Routes>
              <Route path="/products/:id" element={<Products />} />
              <Route path="/products" element={<Products />} />
              <Route path="/users" element={<Users />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/" element={<Navigate to="/products" replace />} />
              <Route path="/login" element={<Navigate to="/products" replace />} />
            </Routes>
          </ProtectedRoute>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MUIThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
