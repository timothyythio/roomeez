import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="w-full border-b bg-white">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="grid h-16 grid-cols-3 items-center">
          {/* Left: Logo */}
          <div className="flex items-center justify-start">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.svg"
                alt={`${APP_NAME} logo`}
                width={48}
                height={48}
                priority
              />
            </Link>
          </div>

          {/* Center: Desktop nav */}

          {/* Center: Mobile — hamburger + centered search */}
          {/* <div className="md:hidden flex items-center justify-center gap-3">
              <MobileSheet />

              <div className="flex-1 max-w-[260px]">
                <Search />
              </div>
            </div> */}

          {/* Right: Cart/User (always shown), flush to viewport edge */}
          <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2">
            <Menu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
