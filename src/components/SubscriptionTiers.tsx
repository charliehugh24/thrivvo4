
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TierFeature {
  name: string;
  included: boolean;
}

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: TierFeature[];
  icon: React.ReactNode;
  popular?: boolean;
}

const tiers: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Thrivvo+ Basic',
    price: 4.99,
    description: 'Perfect for casual users who want a bit more access and flexibility.',
    icon: <Crown className="h-6 w-6 text-thrivvo-teal" />,
    features: [
      { name: 'Unlimited Swipes', included: true },
      { name: 'Priority RSVPs', included: true },
      { name: 'Location Flex', included: true },
      { name: 'Who\'s Active Nearby', included: true },
      { name: '1x Free Monthly Event Boost', included: true },
      { name: 'Match & Message with Groups', included: false },
      { name: 'Hidden Events Access', included: false },
      { name: 'See Who Liked Your Event', included: false },
      { name: 'Auto Check-In', included: false },
      { name: 'Exclusive Discounts', included: false },
      { name: 'Featured on "Happening Now"', included: false },
      { name: 'VIP-only Events & Launch Parties', included: false },
      { name: 'Smart Event Matching', included: false },
      { name: 'Event Performance Insights', included: false },
      { name: 'Early Access to New Features', included: false },
    ]
  },
  {
    id: 'social',
    name: 'Thrivvo+ Social',
    price: 9.99,
    description: 'For the extroverts and adventurers looking to connect, not just attend.',
    icon: <Zap className="h-6 w-6 text-thrivvo-orange" />,
    popular: true,
    features: [
      { name: 'Unlimited Swipes', included: true },
      { name: 'Priority RSVPs', included: true },
      { name: 'Location Flex', included: true },
      { name: 'Who\'s Active Nearby', included: true },
      { name: '1x Free Monthly Event Boost', included: true },
      { name: 'Match & Message with Groups', included: true },
      { name: 'Hidden Events Access', included: true },
      { name: 'See Who Liked Your Event', included: true },
      { name: 'Auto Check-In', included: true },
      { name: 'Exclusive Discounts', included: true },
      { name: 'Featured on "Happening Now"', included: false },
      { name: 'VIP-only Events & Launch Parties', included: false },
      { name: 'Smart Event Matching', included: false },
      { name: 'Event Performance Insights', included: false },
      { name: 'Early Access to New Features', included: false },
    ]
  },
  {
    id: 'vip',
    name: 'Thrivvo+ VIP',
    price: 14.99,
    description: 'The all-access pass for high-engagement users, creators, or hosts.',
    icon: <Star className="h-6 w-6 text-yellow-400" />,
    features: [
      { name: 'Unlimited Swipes', included: true },
      { name: 'Priority RSVPs', included: true },
      { name: 'Location Flex', included: true },
      { name: 'Who\'s Active Nearby', included: true },
      { name: '1x Free Monthly Event Boost', included: true },
      { name: 'Match & Message with Groups', included: true },
      { name: 'Hidden Events Access', included: true },
      { name: 'See Who Liked Your Event', included: true },
      { name: 'Auto Check-In', included: true },
      { name: 'Exclusive Discounts', included: true },
      { name: 'Featured on "Happening Now"', included: true },
      { name: 'VIP-only Events & Launch Parties', included: true },
      { name: 'Smart Event Matching', included: true },
      { name: 'Event Performance Insights', included: true },
      { name: 'Early Access to New Features', included: true },
    ]
  }
];

const SubscriptionTiers: React.FC = () => {
  const { toast } = useToast();

  const handleSubscribe = (tier: SubscriptionTier) => {
    // This would normally connect to a payment gateway
    toast({
      title: "Subscription started",
      description: `You've subscribed to ${tier.name} for $${tier.price}/month.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Thrivvo+ Premium</h2>
        <p className="text-muted-foreground">Unlock the full potential of your social experience</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card 
            key={tier.id}
            className="flex flex-col"
          >
            {tier.popular && (
              <div className="bg-thrivvo-orange text-white text-xs font-medium py-1 px-3 absolute right-4 rounded-b-md">
                MOST POPULAR
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-center">
                {tier.icon}
                <div className="text-right">
                  <span className="text-2xl font-bold">${tier.price}</span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>
              </div>
              <CardTitle className="mt-2">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {tier.features.filter(f => f.included).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-thrivvo-teal shrink-0 mr-2" />
                    <span className="text-sm">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSubscribe(tier)} 
                className={`w-full ${
                  tier.id === 'social' 
                    ? 'bg-thrivvo-orange hover:bg-thrivvo-orange/90' 
                    : tier.id === 'vip' 
                      ? 'bg-gradient-to-r from-yellow-400 to-thrivvo-orange hover:opacity-90' 
                      : 'bg-thrivvo-teal hover:bg-thrivvo-teal/90'
                }`}
              >
                Subscribe
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionTiers;
