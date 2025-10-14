import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Sparkles, Zap, Rocket } from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  icon: any;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
}

const tiers: PricingTier[] = [
  {
    id: 'free',
    name: 'LifeMax Core',
    tagline: 'Track smarter. Live longer.',
    emoji: '🆓',
    icon: null,
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Basic health tracking',
      'Daily score & streaks',
      'Up to 3 friends',
      'Manual data entry',
      'Light theme only'
    ]
  },
  {
    id: 'pro',
    name: 'LifeMax Pro',
    tagline: 'Unlock your potential — deeper insights, smarter feedback.',
    emoji: '💫',
    icon: Sparkles,
    monthlyPrice: 4.99,
    yearlyPrice: 39,
    features: [
      'Everything in Core',
      'Advanced analytics & trends',
      'Unlimited friends',
      'Custom goals & reminders',
      'Dark mode & themes'
    ],
    highlighted: true
  },
  {
    id: 'elite',
    name: 'LifeMax Elite',
    tagline: 'Biohack your life — data, performance, and coaching in one.',
    emoji: '⚡',
    icon: Zap,
    monthlyPrice: 11.99,
    yearlyPrice: 99,
    features: [
      'Everything in Pro',
      'AI-powered insights & coaching',
      'Wearable integrations',
      'Export data & reports',
      'Priority support'
    ]
  },
  {
    id: 'infinity',
    name: 'LifeMax Infinity',
    tagline: 'Optimize everything — your life, quantified.',
    emoji: '🚀',
    icon: Rocket,
    monthlyPrice: 24.99,
    yearlyPrice: 199,
    features: [
      'Everything in Elite',
      'Personalized longevity plan',
      'White-glove onboarding',
      'Early access to features',
      'Lifetime updates & support'
    ]
  }
];

export default function Pricing() {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const currentTier = 'free'; // TODO: Get from user profile

  const getSavings = (tier: PricingTier) => {
    if (tier.yearlyPrice === 0) return 0;
    const monthlyTotal = tier.monthlyPrice * 12;
    const savings = ((monthlyTotal - tier.yearlyPrice) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  const getPrice = (tier: PricingTier) => {
    if (tier.yearlyPrice === 0) return 'Free';
    const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
    const period = isYearly ? '/year' : '/month';
    return `$${price}${period}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container max-w-7xl mx-auto px-4 py-12 animate-fade-in">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Choose Your LifeMax Journey ✨
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From free tracking to infinite optimization — pick the plan that fits your goals.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-primary"
          />
          <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Yearly
          </span>
          {isYearly && (
            <Badge variant="secondary" className="animate-scale-in">
              Save up to 20% 💰
            </Badge>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {tiers.map((tier) => {
            const savings = getSavings(tier);
            const isCurrentTier = tier.id === currentTier;
            const Icon = tier.icon;

            return (
              <Card
                key={tier.id}
                className={`relative p-6 transition-all duration-300 hover:scale-105 ${
                  tier.highlighted
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border'
                } ${
                  isCurrentTier
                    ? 'ring-2 ring-accent animate-pulse'
                    : ''
                }`}
                style={{
                  boxShadow: tier.highlighted 
                    ? 'var(--shadow-elevated)' 
                    : isCurrentTier 
                    ? 'var(--shadow-glow-accent)'
                    : undefined
                }}
              >
                {tier.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent">
                    Most Popular 🔥
                  </Badge>
                )}

                {isCurrentTier && (
                  <Badge className="absolute -top-3 right-4 bg-accent">
                    Current Plan ✓
                  </Badge>
                )}

                <div className="space-y-4">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <div className="text-4xl mb-2">{tier.emoji}</div>
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground min-h-[3rem]">
                      {tier.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-foreground">
                      {getPrice(tier)}
                    </div>
                    {isYearly && savings > 0 && (
                      <Badge variant="outline" className="mt-2">
                        Save {savings}% yearly 🎉
                      </Badge>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    variant={tier.highlighted ? 'default' : 'outline'}
                    className="w-full"
                    disabled={isCurrentTier}
                    onClick={() => {
                      if (tier.id === 'free') {
                        navigate('/');
                      } else {
                        // TODO: Handle upgrade
                        console.log(`Upgrade to ${tier.id}`);
                      }
                    }}
                  >
                    {isCurrentTier ? (
                      'Current Plan ✓'
                    ) : tier.id === 'free' ? (
                      'Continue Free'
                    ) : (
                      <>
                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                        Upgrade Now
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border shadow-lg z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium">Ready to level up? 🚀</p>
              <p className="text-xs text-muted-foreground">
                Join thousands optimizing their health daily
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                Continue Free
              </Button>
              <Button
                className="bg-gradient-to-r from-primary to-accent"
                onClick={() => {
                  // TODO: Scroll to Pro tier or handle upgrade
                  const proCard = document.querySelector('[data-tier="pro"]');
                  proCard?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
