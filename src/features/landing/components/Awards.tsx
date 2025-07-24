import React from 'react';
import { Award, Trophy, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Awards = () => {
  const { t } = useLanguage();
  
  const awards = [{
    title: t('awards.award1.title'),
    description: t('awards.award1.description'),
    icon: Trophy,
    gradient: "from-primary/20 to-primary/40",
    iconColor: "text-primary"
  }, {
    title: t('awards.award2.title'),
    description: t('awards.award2.description'),
    icon: Star,
    gradient: "from-secondary/20 to-secondary/40",
    iconColor: "text-secondary"
  }, {
    title: t('awards.award3.title'),
    description: t('awards.award3.description'),
    icon: Award,
    gradient: "from-accent/20 to-accent/40",
    iconColor: "text-primary"
  }];
  
  return (
    <section className="w-full py-12 md:py-16 px-6 md:px-12 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <h2 className="font-heading font-bold text-4xl md:text-5xl tracking-tight text-foreground text-center mb-4">
            {t('awards.title')}
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            {t('awards.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {awards.map((award, index) => {
            const Icon = award.icon;
            return (
              <div
                key={index}
                className={`relative p-8 rounded-2xl bg-gradient-to-br ${award.gradient} border border-border/50 hover:border-primary/30 transition-all duration-300 group`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-background/80 backdrop-blur-sm">
                    <Icon className={`h-8 w-8 ${award.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-2">{award.title}</h3>
                    <p className="font-body text-muted-foreground">{award.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Awards;