// app/components/navigation.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { t } from "@/lib/translations/utils";

interface NavLink {
  href: string;
  label: string;
}

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string): boolean => {
    return pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-medium hover:text-blue-600 transition-colors">
            {t("site.name")}
          </Link>

          <Link href="/jobs/create">
            <Button>{t("site.navigation.post")}</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
