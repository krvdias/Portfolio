import { Suspense, useEffect } from 'react'
import PageLoading from "./components/PageLoading";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import ProjectView from './pages/ProjectView';
import AdminDashboard from './pages/AdminDashboard';
import { PortfolioProvider } from './contexts/PortfolioDataContext';

function App() {
  useEffect(() => {
    document.title = "Portfolio";
  }, []);

  return (
    <Suspense fallback={<PageLoading />}>
      <PortfolioProvider>
        <Router>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="projectview" element={<ProjectView />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Routes>
        </Router>
      </PortfolioProvider>
    </Suspense>
  )
}

export default App
