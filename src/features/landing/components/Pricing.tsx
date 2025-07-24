import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
const Pricing = () => {
  const {
    t
  } = useLanguage();
  const plans = [{
    name: t('pricing.basic.name'),
    price: t('pricing.basic.price'),
    description: t('pricing.basic.description'),
    features: [t('pricing.basic.feature1'), t('pricing.basic.feature2'), t('pricing.basic.feature3'), t('pricing.basic.feature4'), t('pricing.basic.feature5')],
    buttonText: t('pricing.basic.button'),
    buttonVariant: "outline",
    popular: false
  }, {
    name: t('pricing.premium.name'),
    price: t('pricing.premium.price'),
    period: t('pricing.premium.period'),
    description: t('pricing.premium.description'),
    features: [t('pricing.premium.feature1'), t('pricing.premium.feature2'), t('pricing.premium.feature3'), t('pricing.premium.feature4'), t('pricing.premium.feature5'), t('pricing.premium.feature6'), t('pricing.premium.feature7')],
    buttonText: t('pricing.premium.button'),
    buttonVariant: "default",
    popular: true
  }, {
    name: t('pricing.tutor.name'),
    price: t('pricing.tutor.price'),
    period: t('pricing.tutor.period'),
    description: t('pricing.tutor.description'),
    features: [t('pricing.tutor.feature1'), t('pricing.tutor.feature2'), t('pricing.tutor.feature3'), t('pricing.tutor.feature4'), t('pricing.tutor.feature5'), t('pricing.tutor.feature6'), t('pricing.tutor.feature7')],
    buttonText: t('pricing.tutor.button'),
    buttonVariant: "outline",
    popular: false
  }];
  return (
    <section className="w-full py-20 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-4xl md:text-5xl tracking-tight text-foreground text-center mb-4">Choose Your Plan</h2>
          <p className="text-muted-foreground text-lg">Get started with flexible pricing options.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="text-3xl font-bold">
                  {plan.price}
                  {plan.period && <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.buttonVariant as 'default' | 'outline'} className="w-full">
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Pricing;