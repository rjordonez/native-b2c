import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, Star, Users, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CallToAction = () => {
  const { t } = useLanguage();
  
  const stats = [{
    icon: Users,
    value: "2,000+",
    label: t('cta.stats.students')
  }, {
    icon: Star,
    value: "4.9/5",
    label: t('cta.stats.rating')
  }, {
    icon: Zap,
    value: "85%",
    label: t('cta.stats.improvement')
  }];
  
  return <section className="w-full py-20 px-6 md:px-12 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 cosmic-grid opacity-10 py-0"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-8">
          {/* Main CTA Content */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-4xl md:text-5xl tracking-tight text-foreground text-center mb-4">{t('cta.title')}</h2>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="group px-8 py-6 text-lg font-bold hover:scale-105 transition-all duration-300
                  hover:shadow-lg hover:shadow-primary/25 rounded-lg">
                {t('cta.button')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <p className="font-body text-sm text-muted-foreground">
              {t('cta.urgency')}
            </p>
          </div>

          {/* Stats */}
          

          {/* Trust indicators */}
          
        </div>
      </div>
    </section>;
};
export default CallToAction;