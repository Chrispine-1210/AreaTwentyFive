// Reference: javascript_log_in_with_replit blueprint
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Shop from "@/pages/Shop";
import Orders from "@/pages/Orders";
import Admin from "@/pages/Admin";
import DriverDashboard from "@/pages/DriverDashboard";
import Loyalty from "@/pages/Loyalty";
import Events from "@/pages/Events";
import Analytics from "@/pages/Analytics";
import AccountSettings from "@/pages/AccountSettings";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <Switch>
      {isLoading ? (
        <Route path="/" component={Landing} />
      ) : !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route component={NotFound} />
        </>
      ) : (
        <>
          {user?.role === "driver" && <Route path="/driver" component={DriverDashboard} />}
          {user?.role === "admin" && (
            <>
              <Route path="/admin" component={Admin} />
              <Route path="/analytics" component={Analytics} />
            </>
          )}
          <Route path="/" component={Shop} />
          <Route path="/shop" component={Shop} />
          <Route path="/orders" component={Orders} />
          <Route path="/loyalty" component={Loyalty} />
          <Route path="/events" component={Events} />
          <Route path="/settings" component={AccountSettings} />
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
