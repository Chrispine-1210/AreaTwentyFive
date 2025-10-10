import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Shield, Truck, Clock } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="font-heading text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
                  Your Trusted Spot in{" "}
                  <span className="text-primary">Area 25</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed md:text-xl">
                  Premium cannabis products delivered to your door. Experience quality, 
                  comfort, and community at Mede-Mede Spot.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a href="/api/login">
                  <Button size="lg" className="w-full sm:w-auto gap-2" data-testid="button-hero-shop">
                    Shop Now
                  </Button>
                </a>
                <a href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto backdrop-blur-sm" data-testid="button-hero-learn">
                    Learn More
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-primary" />
                  <span>Authentic Products</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-9xl">🌿</div>
                    <p className="text-2xl font-heading font-semibold">Premium Selection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-semibold md:text-4xl mb-4">
              Why Choose Mede-Mede Spot?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your comfort and satisfaction are our priorities. Here's what makes us different.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Carefully curated cannabis strains sourced from trusted growers. 
                  Every product meets our strict quality standards.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Quick and discreet delivery throughout Area 25. 
                  Track your order in real-time from checkout to your door.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Safe & Secure</h3>
                <p className="text-muted-foreground">
                  Your privacy is our priority. Secure checkout process and 
                  confidential delivery ensure peace of mind.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="font-heading text-3xl font-semibold md:text-4xl">
              More Than Just a Shop
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Mede-Mede Spot is your comfort space in Area 25. Join us for sports viewing, 
              special events, and a welcoming community atmosphere. We're not just selling 
              products – we're building a neighborhood hub.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Open daily for your convenience</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="font-heading text-3xl font-semibold md:text-4xl">
                Ready to Experience Quality?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sign in to browse our full selection and place your first order today.
              </p>
              <a href="/api/login">
                <Button size="lg" className="gap-2" data-testid="button-cta-signin">
                  Get Started
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
