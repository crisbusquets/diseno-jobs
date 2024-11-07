import React from 'react';
import { Building2, MapPin, Clock, BriefcaseIcon } from 'lucide-react';
import { ApplySection } from "@/components/apply-section";

type JobType = 'remote' | 'hybrid' | 'onsite';

interface Job {
  id: number;
  title: string;
  company: string;
  company_logo?: string;
  description: string;
  job_type: JobType;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  created_at: string;
  benefits?: string[];
  application_method_type: 'email' | 'url';
  application_method_value: string;
}

interface JobCardProps {
  job: Job;
  variant?: 'list' | 'detailed';
}

const getJobTypeLabel = (type: JobType): string => {
  const labels = {
    remote: "Remoto",
    hybrid: "Híbrido",
    onsite: "Presencial"
  };
  return labels[type];
};

const getJobTypeColor = (type: JobType): string => {
  const colors = {
    remote: "text-green-700 bg-green-50 border-green-100",
    hybrid: "text-amber-700 bg-amber-50 border-amber-100",
    onsite: "text-blue-700 bg-blue-50 border-blue-100"
  };
  return colors[type];
};

const JobCard = ({ job, variant = "list" }: JobCardProps) => {
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (variant === "list") {
    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-colors p-6">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            {job.company_logo ? (
              <img src={job.company_logo} alt={`${job.company} logo`} className="w-10 h-10 object-contain" />
            ) : (
              <Building2 className="w-6 h-6 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 leading-6">{job.title}</h2>
                <p className="text-base text-gray-600 mt-1">{job.company}</p>
              </div>
              <span className={`flex-shrink-0 text-sm px-3 py-1 rounded-full border ${getJobTypeColor(job.job_type)}`}>
                {getJobTypeLabel(job.job_type)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
              {job.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <BriefcaseIcon className="w-4 h-4" />
                <span>Jornada Completa</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Publicado hoy</span>
              </div>
            </div>

            {(job.salary_min || job.salary_max) && (
              <div className="mt-4 text-sm">
                <span className="font-medium text-gray-900">Salario: </span>
                <span className="text-gray-600">
                  {job.salary_min && job.salary_max
                    ? `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`
                    : job.salary_min
                    ? `Desde ${formatSalary(job.salary_min)}`
                    : `Hasta ${formatSalary(job.salary_max!)}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Detailed view (for individual job pages)
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="flex items-start justify-between">
        <div className="flex gap-6">
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
            {job.company_logo ? (
              <img src={job.company_logo} alt={`${job.company} logo`} className="w-14 h-14 object-contain" />
            ) : (
              <Building2 className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-600 mt-2">{job.company}</p>
          </div>
        </div>
        <span className={`text-sm px-4 py-2 rounded-full border ${getJobTypeColor(job.job_type)}`}>
          {getJobTypeLabel(job.job_type)}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Ubicación</h3>
            <p className="text-gray-600 mt-1">{job.location || "Sin especificar"}</p>
          </div>
        </div>

        {/* Salary */}
        {(job.salary_min || job.salary_max) && (
          <div className="flex items-start gap-2">
            <BriefcaseIcon className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Salario</h3>
              <p className="text-gray-600 mt-1">
                {job.salary_min && job.salary_max
                  ? `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`
                  : job.salary_min
                  ? `Desde ${formatSalary(job.salary_min)}`
                  : `Hasta ${formatSalary(job.salary_max!)}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Job Description */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Descripción del puesto</h2>
        <div className="mt-4 prose max-w-none text-gray-600">
          {job.description}
        </div>
      </div>

        {/* Benefits Section */}
        {job.benefits && job.benefits.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Beneficios</h2>
            <div className="mt-4 flex flex-wrap gap-2">
            {job.benefits.map((benefit, index) => (
                <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm"
                >
                {benefit.icon && <span>{benefit.icon}</span>}
                {benefit.name}
                </span>
            ))}
            </div>
        </div>
        )}

      {/* Apply Button */}
      <ApplySection 
            method={{
                type: job.application_method_type,
                value: job.application_method_value
            }}
        />
    </div>
  );
};

export default JobCard;
