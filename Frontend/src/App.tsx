import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import LegalAdvisor from '@/pages/LegalAdvisor';
import LawStudents from '@/pages/LawStudents';
import LegalResources from '@/pages/LegalResources';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [pathname, hash]);
  return null;
}

function Layout() {
  const { pathname } = useLocation();
  const isChatPage = pathname === '/legal-advisor';
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/legal-advisor" element={<LegalAdvisor />} />
        <Route path="/law-students" element={<LawStudents />} />
        <Route path="/legal-resources" element={<LegalResources />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {!isChatPage && !isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}
