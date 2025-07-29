import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../shared/services/supabase';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LogoMarquee from './components/LogoMarquee';
import ProblemSection from './components/ProblemSection';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Awards from './components/Awards';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import { useLanguage } from './contexts/LanguageContext';

const LandingPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated and redirect to library
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/library', { replace: true });
      }
    };
    checkUser();
  }, [navigate]);
  
  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground${language === 'vi' ? ' font-vietnamese' : ''}`}>
      <Header />
      <main>
        <HeroSection />
        <LogoMarquee />
        <ProblemSection />
        <Features />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;