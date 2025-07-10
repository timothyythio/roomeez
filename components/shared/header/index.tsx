import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="w-full border-b bg-white">
      <div className="wrapper flex items-center justify-between py-3 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/roomeez-logo.png"
            alt={`${APP_NAME} logo`}
            width={140}
            height={60}
            priority
          />
        </Link>

        <Menu />

        <div className="hidden md:block">
          {/* Reserved space or future links */}
        </div>
      </div>
    </header>
  );
};

export default Header;
