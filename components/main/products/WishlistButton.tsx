import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md";
}

export function WishlistButton({
  productId,
  className,
  size = "md",
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist();

  const isWished = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      title={isWished ? "Wishlist (Added)" : "Wishlist"}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-all cursor-pointer group/wishlist",
        size === "sm" ? "w-8 h-8" : "w-10 h-10",
        isWished
          ? "text-destructive"
          : "text-muted-foreground hover:text-destructive",
        className,
      )}
      aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn(iconSize, isWished && "fill-current")} />

      {/* Small hover tooltip below */}
      <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/wishlist:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap z-40">
        Wishlist
      </span>
    </button>
  );
}
