// app/components/jobs/job-details.tsx
"use client";

interface JobDetailsProps {
  job: {
    title: string;
    company: string;
    company_email: string;
    description: string;
    job_type: "remote" | "onsite" | "hybrid";
    location?: string;
    salary_min?: number;
    salary_max?: number;
    benefits?: string[];
    created_at: string;
  };
  variant?: "card" | "full";
}

export default function JobDetails({ job, variant = "full" }: JobDetailsProps) {
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const jobTypeLabels = {
    remote: "Remoto",
    hybrid: "Híbrido",
    onsite: "Presencial",
  };

  if (variant === "card") {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
            <p className="text-gray-600 mt-1">{job.company}</p>
          </div>
          <span
            className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${
              job.job_type === "remote"
                ? "bg-green-100 text-green-800"
                : job.job_type === "hybrid"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }
          `}
          >
            {jobTypeLabels[job.job_type]}
          </span>
        </div>

        {(job.salary_min || job.salary_max) && (
          <div className="mt-4 text-sm text-gray-600">
            <strong>Salario: </strong>
            {job.salary_min && job.salary_max
              ? `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`
              : job.salary_min
              ? `Desde ${formatSalary(job.salary_min)}`
              : `Hasta ${formatSalary(job.salary_max!)}`}
          </div>
        )}

        {job.location && (
          <div className="mt-2 text-sm text-gray-600">
            <strong>Ubicación: </strong>
            {job.location}
          </div>
        )}

        <div className="mt-4">
          <p className="text-gray-700 line-clamp-3">{job.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
            <p className="text-xl text-gray-600 mt-2">{job.company}</p>
          </div>
          <span
            className={`
            px-4 py-2 rounded-full text-sm font-medium
            ${
              job.job_type === "remote"
                ? "bg-green-100 text-green-800"
                : job.job_type === "hybrid"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }
          `}
          >
            {jobTypeLabels[job.job_type]}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {job.location && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ubicación</h3>
              <p className="mt-1 text-gray-900">{job.location}</p>
            </div>
          )}

          {(job.salary_min || job.salary_max) && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Salario</h3>
              <p className="mt-1 text-gray-900">
                {job.salary_min && job.salary_max
                  ? `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`
                  : job.salary_min
                  ? `Desde ${formatSalary(job.salary_min)}`
                  : `Hasta ${formatSalary(job.salary_max!)}`}
              </p>
            </div>
          )}
        </div>

        {job.benefits && job.benefits.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Beneficios</h3>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción</h3>
          <div className="prose max-w-none text-gray-700">
            {job.description.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
          Publicado el {formatDate(job.created_at)}
        </div>
      </div>
    </div>
  );
}
