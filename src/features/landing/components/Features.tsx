import React from 'react';
import { Mic, MessageSquare, Play, Brain, Target, Zap } from "lucide-react";
import { useLanguage } from '../contexts/LanguageContext';

const Features = () => {
  const { t } = useLanguage();
  
  const featuresData = [{
    title: t('features.section1.title'),
    highlightedWords: ["Practice"],
    description: t('features.section1.description'),
    features: [{
      title: t('features.section1.feature1.title'),
      description: t('features.section1.feature1.description'),
      icon: <Mic size={20} className="text-primary" />
    }, {
      title: t('features.section1.feature2.title'),
      description: t('features.section1.feature2.description'),
      icon: <MessageSquare size={20} className="text-primary" />
    }],
    videoSrc: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center",
    videoAlt: "Native AI tutor demonstration"
  }, {
    title: t('features.section2.title'),
    highlightedWords: ["feedback"],
    description: t('features.section2.description'),
    features: [{
      title: t('features.section2.feature1.title'),
      description: t('features.section2.feature1.description'),
      icon: <Brain size={20} className="text-primary" />
    }, {
      title: t('features.section2.feature2.title'),
      description: t('features.section2.feature2.description'),
      icon: <Target size={20} className="text-primary" />
    }],
    videoSrc: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&crop=center",
    videoAlt: "AI analysis demonstration"
  }, {
    title: t('features.section3.title'),
    highlightedWords: ["track", "goal"],
    description: t('features.section3.description'),
    features: [{
      title: t('features.section3.feature1.title'),
      description: t('features.section3.feature1.description'),
      icon: <Zap size={20} className="text-primary" />
    }, {
      title: t('features.section3.feature2.title'),
      description: t('features.section3.feature2.description'),
      icon: <MessageSquare size={20} className="text-primary" />
    }],
    videoSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center",
    videoAlt: "Results dashboard demonstration"
  }];
  
  const FeatureSection = ({
    data,
    reversed = false,
    index
  }) => {
    const { language } = useLanguage();
    // Helper to render title with highlighted words
    const renderTitle = (title, highlightedWords) => {
      if (index === 0) {
        if (language === 'vi') {
          // Hardcoded Vietnamese with line break
          return (
            <>
              Luyện tập khoa học,<br /> không luyện "cày"
            </>
          );
        } else {
          // Hardcoded English with highlight
          return (
            <>
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Practice</span> smarter, not harder
            </>
          );
        }
      }
      // Split by space, but keep punctuation attached to words
      return title.split(/(\s+)/).map((word, i) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
        if (highlightedWords && highlightedWords.includes(cleanWord)) {
          return (
            <span key={i} className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">{word}</span>
          );
        }
        return <span key={i} className="text-foreground">{word}</span>;
      });
    };
    return (
      <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
        {/* Content Column */}
        <div className={`space-y-8 ${reversed ? 'lg:order-2' : ''}`}>
          {/* Headline with gradient */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              {renderTitle(data.title, data.highlightedWords)}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              {data.description}
            </p>
          </div>

          {/* Feature Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.features.map((feature, index) => {})}
          </div>
        </div>

        {/* Video Column */}
        <div className={`bg-muted/30 rounded-2xl p-8 ${reversed ? 'lg:order-1' : ''}`}>
          <div className="relative group">
            <div className="relative overflow-hidden rounded-xl shadow-lg bg-muted aspect-video">
              <img src={data.videoSrc} alt={data.videoAlt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-primary/90 backdrop-blur-sm rounded-full p-4 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Play className="h-8 w-8 text-primary-foreground fill-current" />
                </div>
              </div>

              {/* Subtle border glow on hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return <section id="features" className="w-full py-16 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Main Headline */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl tracking-tight text-foreground text-center mb-4">
            {t('features.title')}
          </h2>
        </div>

        {/* Feature Sections */}
        {featuresData.map((data, index) => <FeatureSection key={index} data={data} reversed={index % 2 === 1} index={index} />)}
      </div>
    </section>;
};
export default Features;