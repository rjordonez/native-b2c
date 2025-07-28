import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ProblemSection = () => {
  const { t, language } = useLanguage();
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const problems = [
    {
      id: 1,
      title: t('problem.card1.title'),
      description: t('problem.card1.description')
    },
    {
      id: 2,
      title: t('problem.card2.title'),
      description: t('problem.card2.description')
    },
    {
      id: 3,
      title: t('problem.card3.title'),
      description: t('problem.card3.description')
    }
  ];

  const handleCardClick = (id: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section className="w-full px-6 md:px-12 bg-muted/30 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`font-heading font-bold text-4xl md:text-5xl tracking-tight text-foreground text-center mb-4${language === 'vi' ? ' font-vietnamese-heading' : ''}`}>
            {t('problem.title')}
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            {t('problem.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {problems.map((problem) => {
            const isFlipped = flippedCards.has(problem.id);
            
            return (
              <div
                key={problem.id}
                className="relative h-64 perspective-1000 cursor-pointer group"
                onClick={() => handleCardClick(problem.id)}
              >
                {/* Card Container */}
                <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}>
                  
                  {/* Front Side */}
                  <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div className="bg-card rounded-2xl border h-full flex flex-col items-center justify-center p-8 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 relative">
                      <div className="text-3xl md:text-4xl font-bold text-primary mb-6 w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center">
                        {problem.id}
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground text-center leading-tight mb-6">
                        {problem.id === 3
                          ? (
                            (() => {
                              const [first, ...rest] = problem.title.split(',');
                              return <>{first},{<br />}{rest.join(',').trim()}</>;
                            })()
                          )
                          : `"${problem.title}"`}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <span>{t('problem.tapToReveal')}</span>
                        <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="bg-primary rounded-2xl h-full flex flex-col items-center justify-center p-8 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 relative">
                      <div className="text-xl md:text-2xl font-bold text-primary-foreground mb-4 text-center">
                        {t('problem.problemLabel')} {problem.id}
                      </div>
                      <p className="text-primary-foreground text-center leading-relaxed text-base md:text-lg mb-6">
                        {problem.description}
                      </p>
                      <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                        <span>{t('problem.tapToFlipBack')}</span>
                        <ChevronRight className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
                      </div>
                    </div>
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

export default ProblemSection;