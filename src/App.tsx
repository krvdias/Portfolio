import { Suspense, useEffect } from 'react'
import PageLoading from "./components/PageLoading";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import ProjectView from './pages/ProjectView';
import './App.css'

function App() {
  useEffect(() => {
    document.title = "Portfolio";
  }, []);

  return (
    <Suspense fallback={<PageLoading />}>
      <Router>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="projectview" element={<ProjectView />} />
      </Routes>
      </Router>
    </Suspense>
  )
}

export default App
