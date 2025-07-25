import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Testimonials = () => {
  const { t, language } = useLanguage();
  
  const testimonials = [{
    quote: t('testimonials.card1.quote'),
    author: t('testimonials.card1.author'),
    position: t('testimonials.card1.position'),
    avatar: "bg-gradient-to-br from-primary/20 to-primary/40",
    likes: 156,
    rating: 5
  }, {
    quote: t('testimonials.card2.quote'),
    author: t('testimonials.card2.author'),
    position: t('testimonials.card2.position'),
    avatar: "bg-gradient-to-br from-secondary/20 to-secondary/40",
    likes: 203,
    rating: 5
  }, {
    quote: t('testimonials.card3.quote'),
    author: t('testimonials.card3.author'),
    position: t('testimonials.card3.position'),
    avatar: "bg-gradient-to-br from-accent/20 to-accent/40",
    likes: 128,
    rating: 5
  }];
  
  return <section id="testimonials" className="w-full px-6 md:px-12 bg-background py-[49px]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header section - aligned with other sections */}
        <div className="text-center space-y-4 max-w-5xl mx-auto">
          <h2 className={`font-heading font-bold text-4xl md:text-5xl tracking-tight text-foreground text-center mb-4${language === 'vi' ? ' font-vietnamese-heading' : ''}`}>
            {language === 'vi' ? (
              <>
                <span>2000+ học viên IELTS</span><br />
                <span className="mt-3 inline-block">trên khắp thế giới</span>
              </>
            ) : (
              t('testimonials.title')
            )}
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            {t('testimonials.subtitle')}
          </p>
          
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {testimonials.map((testimonial, index) => <div key={index} className="group relative bg-card rounded-2xl p-6 border border-border/50 
                hover:border-border transition-all duration-300 hover:scale-105 hover:shadow-lg
                cosmic-card-hover" style={{
          animation: `float-${index + 1} 6s ease-in-out infinite`,
          animationDelay: `${index * 2}s`
        }}>
              {/* Background glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${testimonial.avatar.replace('bg-gradient-to-br', '')} opacity-0 
                group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
              
              {/* Profile section */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${testimonial.avatar} flex items-center justify-center
                  group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-lg font-semibold text-primary">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {testimonial.author}
                  </h4>
                  <p className="font-body text-sm text-muted-foreground">{testimonial.position}</p>
                </div>
              </div>

              {/* Review text */}
              <p className="font-body text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Rating and likes */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => <span key={i} className="text-primary text-lg group-hover:scale-110 transition-transform duration-300">★</span>)}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span className="group-hover:scale-110 transition-transform duration-300">❤️</span>
                  <span>{testimonial.likes}</span>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default Testimonials;