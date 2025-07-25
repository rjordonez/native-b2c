import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../shared/components/layout/ui/button';
import { Mic } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    t,
    language
  } = useLanguage();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  return <section className="relative w-full py-12 md:py-20 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden" style={{
    background: 'var(--hero-gradient)'
  }}>
      {/* Cosmic particle effect (background dots) */}
      <div className="absolute inset-0 cosmic-grid opacity-30"></div>
      
      {/* Gradient glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full">
        <div className="w-full h-full opacity-10 bg-primary blur-[120px]"></div>
      </div>
      
      <div className={`relative z-10 max-w-5xl text-center space-y-6 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex justify-center">
          
        </div>
        
        <h1 className={`font-heading font-bold text-[34px] leading-tight tracking-tight text-balance text-foreground px-[19px] py-[11px] md:text-5xl${language === 'vi' ? ' font-vietnamese-heading' : ''}`}>
          {language === 'vi' ? (
            <>
              <span>Loay hoay mãi với IELTS Speaking?</span><br />
              <span className="mt-3 inline-block">Để <span className="text-primary">Native</span> giải quyết!</span>
            </>
          ) : (
            <>
              {t('hero.title')} <span className="text-primary">{t('hero.highlight')}</span>
            </>
          )}
        </h1>
        
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          {t('hero.description')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 items-center">
          <Link to="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 text-base h-12 px-8 transition-all duration-300 min-h-[48px] interactive-button font-bold rounded-lg">
              {t('hero.cta.primary')}
            </Button>
          </Link>
        </div>
        
        
      </div>
      
      {/* Library Interface Image */}
      <div className={`w-full max-w-7xl mt-12 z-10 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <div className="cosmic-glow relative rounded-xl overflow-hidden border border-border backdrop-blur-sm bg-card shadow-lg interactive-card">
          <img 
            src="/src/features/landing/lib/images/dash.png" 
            alt="Native Library Interface" 
            className="w-full h-auto rounded-xl"
            style={{ maxHeight: '600px', objectFit: 'contain' }}
          />
        </div>
      </div>
    </section>;
};
export default HeroSection;