import { ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const { user, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-2 hover-elevate active-elevate-2 rounded-md px-3 py-2" data-testid="link-home">
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold text-foreground">Mede-Mede</span>
              <span className="text-xs text-muted-foreground">Area 25</span>
            </div>
          </a>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated && (
            <>
              <Link href="/shop">
                <a className="text-sm font-medium text-foreground hover-elevate active-elevate-2 rounded-md px-3 py-2" data-testid="link-shop">
                  Shop
                </a>
              </Link>
              <Link href="/orders">
                <a className="text-sm font-medium text-foreground hover-elevate active-elevate-2 rounded-md px-3 py-2" data-testid="link-orders">
                  My Orders
                </a>
              </Link>
            </>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link href="/admin">
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid="button-admin"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onCartClick}
                className="relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="badge-cart-count"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              <a href="/api/logout">
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="button-logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </a>
            </>
          ) : (
            <a href="/api/login">
              <Button data-testid="button-login" className="gap-2">
                <User className="h-4 w-4" />
                Sign In
              </Button>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
