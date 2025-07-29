
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../shared/components/layout/ui/button';
import Logo from './Logo';
import { Menu, X, Mic, BarChart3, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { ToggleGroup, ToggleGroupItem } from '../../../shared/components/layout/ui/toggle-group';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const [activePage, setActivePage] = useState('features');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  const handleNavClick = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActivePage(page);
    const element = document.getElementById(page);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handlePracticeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActivePage('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  return (
    <div className="sticky top-0 z-50 pt-8 px-4">
      <header className="w-full max-w-7xl mx-auto py-3 px-6 md:px-8 flex items-center justify-between">
        <div className="p-3 logo-hover">
          <Logo />
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-3 rounded-2xl text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110 hover:bg-accent/50"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={24} className="feature-icon" /> : <Menu size={24} className="feature-icon" />}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
          <div className="rounded-full px-1 py-1 backdrop-blur-md bg-background/80 border border-border shadow-lg">
            <ToggleGroup type="single" value={activePage} onValueChange={(value) => value && setActivePage(value)}>
                <ToggleGroupItem 
                value="practice"
                className={cn(
                  "px-4 py-2 rounded-full transition-all duration-300 relative nav-link hover:scale-105",
                  activePage === 'practice' ? '!text-primary bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={handlePracticeClick}
              >
                <Mic size={16} className="inline-block mr-1.5 feature-icon" /> {t('header.practice')}
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="features" 
                className={cn(
                  "px-4 py-2 rounded-full transition-all duration-300 relative nav-link hover:scale-105",
                  activePage === 'features' ? '!text-primary bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={handleNavClick('features')}
              >
                <BarChart3 size={16} className="inline-block mr-1.5 feature-icon" /> {t('header.features')}
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="testimonials" 
                className={cn(
                  "px-4 py-2 rounded-full transition-all duration-300 relative nav-link hover:scale-105",
                  activePage === 'testimonials' ? '!text-primary bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={handleNavClick('testimonials')}
              >
                <Trophy size={16} className="inline-block mr-1.5 feature-icon" /> {t('header.testimonials')}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </nav>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-4 right-4 bg-background/95 backdrop-blur-md py-4 px-6 border border-border rounded-2xl shadow-lg z-50">
            <div className="flex flex-col gap-4">
              <a 
                href="#" 
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  activePage === 'practice' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={handlePracticeClick}
              >
                <Mic size={16} className="inline-block mr-1.5" /> {t('header.practice')}
              </a>
              <a 
                href="#testimonials" 
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  activePage === 'testimonials' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={handleNavClick('testimonials')}
              >
                <BarChart3 size={16} className="inline-block mr-1.5" /> {t('header.features')}
              </a>
              <a 
                href="#testimonials" 
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  activePage === 'testimonials' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={handleNavClick('testimonials')}
              >
                <Trophy size={16} className="inline-block mr-1.5" /> {t('header.testimonials')}
              </a>
              
              {/* Language toggle for mobile */}
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-muted-foreground">{t('header.language')}</span>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <button
                    onClick={() => setLanguage('vi')}
                    className={cn(
                      "px-3 py-2 rounded transition-all",
                      language === 'vi' ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    VI
                  </button>
                  <span className="text-muted-foreground">|</span>
                  <button
                    onClick={() => setLanguage('en')}
                    className={cn(
                      "px-3 py-2 rounded transition-all",
                      language === 'en' ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    EN
                  </button>
                </div>
              </div>
              
              {/* Login button for mobile */}
              <div className="px-3 py-2">
                <Link to="/auth" className="block">
                  <Button className="w-full font-body bg-primary text-primary-foreground hover:bg-primary/90 interactive-button">{t('header.login')}</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <div className="hidden md:flex items-center gap-4">
          {/* Language toggle for desktop */}
          <div className="flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setLanguage('vi')}
              className={cn(
                "px-3 py-2 rounded transition-all",
                language === 'vi' ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              VI
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              onClick={() => setLanguage('en')}
              className={cn(
                "px-3 py-2 rounded transition-all",
                language === 'en' ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              EN
            </button>
          </div>
          <div className="rounded-2xl">
            <Link to="/auth">
              <Button className="font-body bg-primary text-primary-foreground hover:bg-primary/90 interactive-button">{t('header.login')}</Button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
