// Menu.tsx
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserButton from "./user-button";

const Menu = () => {
  return (
    // ml-auto pushes this group to the right when placed in a flex header row
    <nav className="ml-auto flex items-center gap-2">
      {/* Cart: icon-only on <md, labeled on md+ */}
      <Button asChild variant="ghost" size="icon" className="md:hidden">
        <Link href="/cart" aria-label="Open cart">
          <ShoppingCart className="h-5 w-5" />
        </Link>
      </Button>
      <Button asChild variant="ghost" className="hidden md:flex">
        <Link href="/cart">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart
        </Link>
      </Button>

      {/* User menu / auth button (visible at all sizes) */}
      <UserButton />
    </nav>
  );
};

export default Menu;
