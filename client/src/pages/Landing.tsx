import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Shield, Truck, Users, TrendingUp, MapPin } from "lucide-react";
import shopImage from '@assets/generated_images/modern_e-commerce_storefront.png';
import driverImage from '@assets/generated_images/professional_delivery_driver.png';
import adminImage from '@assets/generated_images/admin_dashboard_analytics.png';
import paymentImage from '@assets/generated_images/mobile_payment_interface.png';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
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
                  comfort, and community at Mede-Mede Spot. Shop, sell, or earn as a driver.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a href="/signin">
                  <Button size="lg" className="w-full sm:w-auto gap-2" data-testid="button-hero-signin">
                    Shop Now
                  </Button>
                </a>
                <a href="/signup">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto backdrop-blur-sm" data-testid="button-hero-signup">
                    Join Us
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
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={shopImage}
                alt="Modern dispensary"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-semibold md:text-4xl mb-4">
              Choose Your Role
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you want to shop, manage inventory, or earn money delivering orders, 
              Mede-Mede Spot has a place for you.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Customer Card */}
            <Card className="hover-elevate overflow-hidden">
              <div className="aspect-video overflow-hidden bg-primary/5">
                <img 
                  src={shopImage}
                  alt="Customer shopping"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold">Customers</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Browse premium products, enjoy fast delivery, earn loyalty points, and join special events.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Premium flower varieties
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Pre-rolled packages
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Real-time order tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="hover-elevate overflow-hidden">
              <div className="aspect-video overflow-hidden bg-secondary/5">
                <img 
                  src={adminImage}
                  alt="Admin dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold">Store Managers</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Manage inventory, track analytics, set events, and grow your business.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Inventory management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Sales analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Event scheduling
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Driver Card */}
            <Card className="hover-elevate overflow-hidden">
              <div className="aspect-video overflow-hidden bg-accent/5">
                <img 
                  src={driverImage}
                  alt="Delivery driver"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold">Delivery Partners</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Earn money delivering orders with flexible hours and real-time tracking.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Flexible schedule
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Real-time tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Earn per delivery
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-semibold md:text-4xl mb-4">
              Why Choose Mede-Mede Spot?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your comfort and satisfaction are our priorities.
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
                  Carefully curated cannabis strains and products meeting strict quality standards.
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
                  Quick and discreet delivery throughout Area 25 with real-time tracking.
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
                  Secure checkout, confidential delivery, and encrypted transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Loyalty Program</h3>
                <p className="text-muted-foreground">
                  Earn points on every purchase and unlock exclusive rewards and discounts.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Community Hub</h3>
                <p className="text-muted-foreground">
                  More than shopping - join our community for events and special gatherings.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Flexible Payments</h3>
                <p className="text-muted-foreground">
                  Multiple payment options including cards, mobile money, and digital wallets.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={paymentImage}
                  alt="Secure payments"
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="space-y-4">
                <h2 className="font-heading text-3xl font-semibold md:text-4xl">
                  Flexible Payment Options
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We support multiple payment methods to make shopping convenient and secure.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Stripe Payment</h3>
                    <p className="text-sm text-muted-foreground">Secure card payments with international support</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Mobile Money</h3>
                    <p className="text-sm text-muted-foreground">Pay using your mobile phone wallet</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Cash on Delivery</h3>
                    <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </div>
              </div>

              <a href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started Today
                </Button>
              </a>
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
                Choose your role and join thousands of satisfied customers, sellers, and delivery partners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/signin">
                  <Button size="lg" data-testid="button-cta-signin">
                    Sign In
                  </Button>
                </a>
                <a href="/signup">
                  <Button size="lg" variant="outline" data-testid="button-cta-signup">
                    Create Account
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
