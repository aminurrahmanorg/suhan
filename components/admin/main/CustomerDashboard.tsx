"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Calendar,
  Loader2,
  Package,
  Phone,
  ShoppingBag,
  User,
  ExternalLink,
  ClipboardList,
  UserCog,
  MapPin,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface Profile {
  full_name: string | null;
  phone: string | null;
  email: string | null;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

  // Fetch orders (RLS will automatically filter to this user's orders)
  const { data: rawOrders = [], isLoading: isLoadingOrders } = useOrders();

  // Filter out orders hidden by the customer client-side to prevent RLS update-select violation
  const orders = rawOrders.filter((o: any) => !o.hidden_by_customer);

  // Fetch profile
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["customer-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, email")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user?.id,
  });

  // Profile fields state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isProfileStateInitialized, setIsProfileStateInitialized] = useState(false);

  // Initialize fields once profile loads
  if (profile && !isProfileStateInitialized) {
    setFullName(profile.full_name || "");
    setPhone(profile.phone || "");
    setIsProfileStateInitialized(true);
  }

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async ({ name, phoneNum }: { name: string; phoneNum: string }) => {
      if (!user?.id) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: name,
          phone: phoneNum,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["customer-profile", user?.id] });
    },
    onError: (err: Error) => {
      toast.error("Failed to update profile: " + err.message);
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name: fullName, phoneNum: phone });
  };

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ hidden_by_customer: true })
        .eq("id", orderId)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Permission denied. Please ensure the database RLS UPDATE policy is executed in your Supabase SQL Editor.");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Order removed from your dashboard");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: Error) => {
      toast.error("Failed to remove order: " + err.message);
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 gap-1 flex items-center w-fit">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 gap-1 flex items-center w-fit">
            <Loader2 className="h-3 w-3 animate-spin" /> Processing
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50 gap-1 flex items-center w-fit">
            <Truck className="h-3 w-3" /> Shipped
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 gap-1 flex items-center w-fit">
            <CheckCircle className="h-3 w-3" /> Delivered
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50 gap-1 flex items-center w-fit">
            <XCircle className="h-3 w-3" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50 w-fit">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent/15 via-accent/5 to-card border border-border p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-accent">Customer Dashboard</span>
            <h1 className="text-2xl md:text-3xl font-black mt-1 text-foreground">
              Hello, {profile?.full_name || user?.email?.split("@")[0]}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your orders, track deliveries, and keep your contact details up to date.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-accent text-accent-foreground px-4 text-xs font-bold shadow-xs hover:bg-accent/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition-all cursor-pointer ${
            activeTab === "orders"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>My Orders</span>
          {orders.length > 0 && (
            <span className="ml-1 bg-accent/10 text-accent text-xs px-2 py-0.5 rounded-full font-bold">
              {orders.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition-all cursor-pointer ${
            activeTab === "profile"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCog className="h-4 w-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {isLoadingOrders ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border border-dashed rounded-2xl">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/45 mb-4" />
              <h3 className="text-lg font-bold text-foreground">No orders found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                You haven't placed any orders yet. Visit our store to find your favorite products.
              </p>
              <Link
                href="/shop"
                className="mt-5 inline-flex h-9 items-center justify-center rounded-xl bg-accent text-accent-foreground px-5 text-xs font-bold hover:bg-accent/90 transition-colors"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-2xl hover:border-accent/40 transition-all overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="p-5 border-b border-border/50 flex flex-wrap items-center justify-between gap-4 bg-secondary/15">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-sm text-foreground">
                          {order.order_number}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{format(new Date(order.created_at), "PPP p")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/track-order?orderId=${order.order_number}`}
                        className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-background px-4 text-xs font-bold text-foreground hover:bg-secondary transition-all gap-1.5 cursor-pointer"
                      >
                        <span>Track Order</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      {order.status === "delivered" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deleteOrderMutation.isPending}
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this completed order history? This action cannot be undone.")) {
                              deleteOrderMutation.mutate(order.id);
                            }
                          }}
                          className="h-9 px-4 rounded-xl text-red-500 border-red-200 hover:text-red-600 hover:bg-red-50/50 cursor-pointer flex items-center gap-1 text-xs font-bold"
                        >
                          {deleteOrderMutation.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          <span>Delete</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Order Items Info */}
                  <div className="p-5 space-y-4">
                    <div className="divide-y divide-border/60">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            {item.product_image ? (
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-12 h-12 object-cover rounded-lg border border-border/80 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                <Package className="h-5 w-5 text-muted-foreground/60" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-xs text-foreground truncate">
                                {item.product_name}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                Qty: {item.quantity} × {item.price}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-xs text-foreground shrink-0">
                            {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Summary row */}
                    <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{order.shipping_address}</span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2 sm:pt-0">
                        <span className="text-muted-foreground text-xs font-semibold">Total Amount:</span>
                        <span className="text-base font-black text-accent">
                          {Number(order.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Settings Tab */}
      {activeTab === "profile" && (
        <div className="max-w-2xl bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Contact Information</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Your details will be auto-filled during checkout to provide a faster shopping experience.
            </p>
          </div>

          {isLoadingProfile ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-secondary/40 text-muted-foreground border-border/60 text-xs h-10 rounded-xl"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-md font-semibold border">
                    Read-only
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs font-bold text-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/75" />
                  <Input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10 text-xs h-10 rounded-xl border-border/80 focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold text-foreground">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/75" />
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="pl-10 text-xs h-10 rounded-xl border-border/80 focus:border-accent"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full btn-accent font-bold text-xs h-10 rounded-xl mt-2 cursor-pointer"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
