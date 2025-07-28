import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './context/ContextProvider/ThemeProvider';
// import { useTheme } from './hooks/useTheme';
import { DashboardPage, HomePage, LoginPage } from './pages';

function AppContent() {
  // const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen`}>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Public Route */}
          <Route path="/" element={<HomePage />} />

          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
