import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './context/ContextProvider/ThemeProvider';
import { CampaignAnalyticsPage, CampaignDetailsPage, CampaignsPage, DashboardPage, HomePage, LandingPage, LoginPage, NotFoundPage, SiteDetailsPage, SitesPage } from './pages';

function AppContent() {
  
  return (
    <div className={`min-h-screen`}>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Public Route */}
          <Route path="/" element={<HomePage />} />

          {/* Public Route */}
          <Route path="/landing" element={<LandingPage />} />

          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Upgrade to ProtectedRoute */}
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
          <Route path="/campaigns/analytics/:id/:siteId?" element={<CampaignAnalyticsPage />} />


          <Route path="/sites" element={<SitesPage />} />
          <Route path="/sites/:id" element={<SiteDetailsPage />} />

          {/* No Route */}
          <Route path="*" element={<NotFoundPage />} />

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
