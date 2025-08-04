"use client";

import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pricingPlans = [
  {
    name: "Pay As You Go",
    price: "2.00",
    currency: "Ksh",
    period: "Per Usage",
    description: "Enjoy anytime access at 2/- per question",
    features: [],
    popular: false,
    cta: "Top Up",
    href: "#"
  },
  {
    name: "Bronze 600 Package",
    price: "600.00",
    currency: "Ksh",
    period: "Per Month",
    description: "Get one thousand assessment questions for the month",
    features: [],
    popular: true,
    cta: "Top Up",
    href: "#"
  }
];

export default function PricingSection() {

  return (
    <section id="pricing" className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Choose Your Assessment Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access quality assessment questions with flexible pricing options
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-blue-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-orange-600">{plan.name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm text-gray-600">{plan.currency}</span>
                    <span className="text-3xl font-bold text-blue-900">{plan.price}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{plan.period}</div>
                </div>

                {/* Separator */}
                <div className="border-t-2 border-dashed border-blue-300 w-16 mx-auto"></div>

                {/* Description */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>
              </CardContent>

              {/* Commented out Top Up buttons */}
              {/* {plan.cta && (
                <CardFooter className="pt-4">
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              )} */}
            </Card>
          ))}
        </div>


      </div>
    </section>
  );
} 