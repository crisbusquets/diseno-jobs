// app/components/navigation.tsx
"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="text-xl font-medium">DisñoJobs</div>
          <Link
            href="/jobs/create"
            className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Publicar Empleo
          </Link>
        </div>
      </div>
    </nav>
  );
}
