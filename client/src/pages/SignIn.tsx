import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf } from "lucide-react";
import shopImage from '@assets/generated_images/welcoming_cannabis_shop_interior.png';

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormValues) {
    try {
      window.location.href = `/api/login?email=${encodeURIComponent(values.email)}`;
    } catch (error) {
      console.error("Sign in error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-2 items-center">
        {/* Left - Image Section */}
        <div className="hidden lg:flex flex-col justify-center items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={shopImage} 
              alt="Welcome to Mede-Mede Spot"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <h2 className="font-heading text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-lg text-white/90">Your comfort spot in Area 25 awaits</p>
            </div>
          </div>
        </div>

        {/* Right - Form Section */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-4 pb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Leaf className="h-8 w-8 text-primary" />
                <span className="font-heading text-2xl font-bold">Mede-Mede Spot</span>
              </div>
              <div>
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>Access your account and start shopping</CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                            data-testid="input-signin-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            data-testid="input-signin-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    data-testid="button-signin-submit"
                  >
                    Sign In
                  </Button>
                </form>
              </Form>

              <div className="mt-6 space-y-4 border-t pt-6">
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-primary font-semibold hover:underline" data-testid="link-to-signup">
                    Create one
                  </a>
                </p>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-signin-replit"
                >
                  Sign In with Replit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
