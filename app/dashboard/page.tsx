// app/dashboard/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  // Get user's job listings
  const { data: jobListings } = await supabase
    .from("job_listings")
    .select("*")
    .eq("employer_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">DisñoJobs</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/jobs/create"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent 
                         text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Publicar Trabajo
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 
                           text-sm font-medium rounded-md text-gray-700 bg-white 
                           hover:bg-gray-50"
                >
                  Cerrar Sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido, {session.user.email}</h2>
          <p className="mt-1 text-gray-600">Administra tus publicaciones de trabajo y perfil desde aquí.</p>
        </div>

        {/* Dashboard Sections */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
          {/* Job Listings Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">Tus Publicaciones</h3>
              <div className="mt-4 space-y-4">
                {jobListings?.length ? (
                  jobListings.map((job) => (
                    <div key={job.id} className="border-t pt-4">
                      <h4 className="text-base font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-500">{job.created_at}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No tienes publicaciones activas.
                    <Link href="/jobs/create" className="text-blue-600 hover:text-blue-500 ml-1">
                      Crear una publicación
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">Tu Perfil</h3>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Email: {session.user.email}</p>
                {/* Add more profile information as needed */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
