import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, Check } from "lucide-react";
import appImage from '@assets/generated_images/user_enjoying_mobile_app.png';

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be valid"),
  location: z.string().min(1, "Please select your location"),
  role: z.enum(["customer", "admin", "driver"], {
    errorMap: () => ({ message: "Please select your account type" }),
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      role: "customer",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    try {
      const params = new URLSearchParams({
        email: values.email,
        name: values.name,
        role: values.role,
        phone: values.phone,
        location: values.location,
      });
      window.location.href = `/api/login?${params.toString()}`;
    } catch (error) {
      console.error("Sign up error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-2 items-center">
        {/* Left - Image Section */}
        <div className="hidden lg:flex flex-col justify-center items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={appImage} 
              alt="Join Mede-Mede Spot"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <h2 className="font-heading text-3xl font-bold mb-2">Join Our Community</h2>
              <p className="text-lg text-white/90">Start as a customer, seller, or driver</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 space-y-3 w-full">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground">Premium quality products</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground">Fast delivery in Area 25</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground">Earn as a driver or seller</span>
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
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription>Choose your role and join our platform</CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-signup-role">
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="customer">
                              <span>🛍️ Customer - Shop & Order</span>
                            </SelectItem>
                            <SelectItem value="admin">
                              <span>📊 Admin - Manage Store</span>
                            </SelectItem>
                            <SelectItem value="driver">
                              <span>🚚 Driver - Deliver Orders</span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            data-testid="input-signup-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            data-testid="input-signup-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+265 1 23 456 789"
                            {...field}
                            data-testid="input-signup-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-signup-location">
                              <SelectValue placeholder="Select your area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="area25">Area 25</SelectItem>
                            <SelectItem value="lilongwe-central">Lilongwe Central</SelectItem>
                            <SelectItem value="lilongwe-south">Lilongwe South</SelectItem>
                            <SelectItem value="lilongwe-north">Lilongwe North</SelectItem>
                          </SelectContent>
                        </Select>
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
                            data-testid="input-signup-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            data-testid="input-signup-confirmpassword"
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
                    data-testid="button-signup-submit"
                  >
                    Create Account
                  </Button>
                </form>
              </Form>

              <div className="mt-6 space-y-4 border-t pt-6">
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a href="/signin" className="text-primary font-semibold hover:underline" data-testid="link-to-signin">
                    Sign in
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
