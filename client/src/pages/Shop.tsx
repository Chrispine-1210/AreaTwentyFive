import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { CartSheet } from "@/components/CartSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product, CartItem } from "@shared/schema";
import { Search } from "lucide-react";

interface CartItemWithProduct extends CartItem {
  product?: Product;
}

export default function Shop() {
  const { toast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStrain, setSelectedStrain] = useState("all");

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest("POST", "/api/cart", { productId, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Product successfully added to your cart",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive",
      });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      await apiRequest("PATCH", `/api/cart/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest("DELETE", `/api/cart/${itemId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed from cart",
        description: "Product removed from your cart",
      });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (location: string) => {
      await apiRequest("POST", "/api/orders", { deliveryLocation: location });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setIsCartOpen(false);
      setDeliveryLocation("");
      toast({
        title: "Order placed successfully!",
        description: "Your order is being processed. Check My Orders for tracking.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Checkout failed",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStrain = selectedStrain === "all" || product.strainType === selectedStrain;
    return matchesSearch && matchesStrain;
  });

  const cartItemsForSheet = cartItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product?.name || "Product",
    pricePerGram: item.product?.pricePerGram || 0,
    quantity: item.quantity,
    imageUrl: item.product?.imageUrl,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.length} 
        onCartClick={() => setIsCartOpen(true)} 
      />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-bold md:text-5xl">Shop Our Selection</h1>
            <p className="text-lg text-muted-foreground">
              Premium cannabis strains, delivered to your door in Area 25
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-products"
              />
            </div>
            
            <Tabs value={selectedStrain} onValueChange={setSelectedStrain} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" data-testid="filter-all">All</TabsTrigger>
                <TabsTrigger value="Indica" data-testid="filter-indica">Indica</TabsTrigger>
                <TabsTrigger value="Sativa" data-testid="filter-sativa">Sativa</TabsTrigger>
                <TabsTrigger value="Hybrid" data-testid="filter-hybrid">Hybrid</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Products Grid */}
          {isLoadingProducts ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-heading text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-testid="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(id) => addToCartMutation.mutate(id)}
                  isAddingToCart={addToCartMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItemsForSheet}
        onUpdateQuantity={(itemId, quantity) => 
          updateCartMutation.mutate({ itemId, quantity })
        }
        onRemoveItem={(itemId) => removeFromCartMutation.mutate(itemId)}
        onCheckout={(location) => checkoutMutation.mutate(location)}
        deliveryLocation={deliveryLocation}
        setDeliveryLocation={setDeliveryLocation}
        isCheckingOut={checkoutMutation.isPending}
      />
    </div>
  );
}
