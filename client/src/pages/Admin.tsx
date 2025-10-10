import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Package, ShoppingBag } from "lucide-react";
import type { Product, Order } from "@shared/schema";

export default function Admin() {
  const { isAdmin, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAdmin) {
      toast({
        title: "Unauthorized",
        description: "You don't have admin access",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [isAdmin, isAuthLoading, toast]);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      toast({
        title: "Product created",
        description: "Product has been added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PATCH", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      toast({
        title: "Product updated",
        description: "Product has been updated successfully",
      });
    },
  });

  const toggleStockMutation = useMutation({
    mutationFn: async ({ id, isAvailable }: { id: string; isAvailable: boolean }) => {
      await apiRequest("PATCH", `/api/products/${id}`, { isAvailable });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Order updated",
        description: "Order status has been updated",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      strainType: formData.get("strainType") as string,
      pricePerGram: parseInt(formData.get("pricePerGram") as string),
      stockQuantity: parseInt(formData.get("stockQuantity") as string),
      imageUrl: formData.get("imageUrl") as string,
      isAvailable: true,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  if (isAuthLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="font-heading text-4xl font-bold md:text-5xl">Admin Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                Manage your inventory and orders
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold" data-testid="stat-total-products">{products.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Stock</p>
                    <p className="text-2xl font-bold" data-testid="stat-in-stock">
                      {products.filter(p => p.isAvailable).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold" data-testid="stat-total-orders">{orders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading text-2xl">Products</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingProduct(null)} data-testid="button-add-product">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingProduct ? "Update product details" : "Add a new product to your inventory"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue={editingProduct?.name}
                            required
                            data-testid="input-product-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="strainType">Strain Type</Label>
                          <Select name="strainType" defaultValue={editingProduct?.strainType || "Hybrid"} required>
                            <SelectTrigger data-testid="select-strain-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Indica">Indica</SelectItem>
                              <SelectItem value="Sativa">Sativa</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          defaultValue={editingProduct?.description}
                          required
                          data-testid="input-product-description"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="pricePerGram">Price per Gram (MWK)</Label>
                          <Input
                            id="pricePerGram"
                            name="pricePerGram"
                            type="number"
                            min="1000"
                            max="5000"
                            defaultValue={editingProduct?.pricePerGram}
                            required
                            data-testid="input-product-price"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stockQuantity">Stock Quantity (grams)</Label>
                          <Input
                            id="stockQuantity"
                            name="stockQuantity"
                            type="number"
                            min="0"
                            defaultValue={editingProduct?.stockQuantity}
                            required
                            data-testid="input-product-stock"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL (optional)</Label>
                        <Input
                          id="imageUrl"
                          name="imageUrl"
                          type="url"
                          defaultValue={editingProduct?.imageUrl || ""}
                          placeholder="https://example.com/image.jpg"
                          data-testid="input-product-image"
                        />
                      </div>

                      <Button type="submit" className="w-full" data-testid="button-submit-product">
                        {editingProduct ? "Update Product" : "Add Product"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="products-list">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover-elevate"
                    data-testid={`admin-product-${product.id}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-2xl">🌿</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{product.strainType}</Badge>
                          <span className="text-sm text-muted-foreground">
                            MWK {product.pricePerGram.toLocaleString()}/g
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • {product.stockQuantity}g
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`stock-${product.id}`} className="text-sm">
                          In Stock
                        </Label>
                        <Switch
                          id={`stock-${product.id}`}
                          checked={product.isAvailable}
                          onCheckedChange={(checked) =>
                            toggleStockMutation.mutate({ id: product.id, isAvailable: checked })
                          }
                          data-testid={`switch-stock-${product.id}`}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsDialogOpen(true);
                        }}
                        data-testid={`button-edit-${product.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders Section */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="admin-orders-list">
                {orders.slice(0, 10).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                    data-testid={`admin-order-${order.id}`}
                  >
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        MWK {order.totalAmount.toLocaleString()} • {order.deliveryLocation}
                      </p>
                    </div>
                    <Select
                      value={order.status}
                      onValueChange={(status) =>
                        updateOrderStatusMutation.mutate({ id: order.id, status })
                      }
                    >
                      <SelectTrigger className="w-40" data-testid={`select-order-status-${order.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
