// app/components/logo-upload.tsx
"use client";

import { useCallback, useState } from 'react';
import { Image as LucideImage } from 'lucide-react';
import Image from 'next/image';

interface LogoUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export default function LogoUpload({ value, onChange }: LogoUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploadWidget, setUploadWidget] = useState<any>(null);

  const showWidget = useCallback(() => {
    if (!uploadWidget) {
      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: "disnojobs_company_logos",
          maxFiles: 1,
          sources: ["local"],
          multiple: false,
          cropping: true,
          croppingShowDimensions: true,
          croppingAspectRatio: 1,
          showSkipCropButton: false,
          folder: "company_logos",
          resourceType: "image",
          clientAllowedFormats: ["png", "jpeg", "jpg", "svg"],
          maxFileSize: 2000000,
          showUploadMoreButton: false,
          singleUploadAutoClose: false,
          showFinishButton: true,
          showPoweredBy: false,
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#0078FF",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#0078FF",
              action: "#2563EB",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#0078FF",
              complete: "#20B832",
              sourceBg: "#E4EBF1"
            }
          }
        },
        (error: any, result: any) => {
          if (error) {
            setError('Error al subir la imagen');
            return;
          }

          if (result?.event === "success" && result.info?.secure_url) {
            onChange(result.info.secure_url);
            return false;
          }

          if (result?.event === "done" || result?.event === "close") {
            return false;
          }
        }
      );

      setUploadWidget(widget);
      widget.open();
    } else {
      uploadWidget.open();
    }
  }, [onChange, uploadWidget]);

  return (
    <div className="w-48 h-48 mx-auto">
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">
          {error}
        </div>
      )}
      
      {value ? (
        <button
          type="button"
          onClick={showWidget}
          className="relative w-48 h-48 group"
        >
          <div className="relative w-full h-full">
            <Image
              src={value}
              alt="Company logo"
              className="object-contain p-4 rounded-lg border-2 border-gray-200"
              fill
              sizes="(max-width: 200px) 100vw, 200px"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            Cambiar logo
          </div>
        </button>
      ) : (
        <button
          type="button"
          onClick={showWidget}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors flex flex-col items-center justify-center"
        >
          <LucideImage className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Subir logo</span>
          <span className="text-xs text-gray-400 mt-1">
            PNG, JPG o SVG (máx. 2MB)
          </span>
        </button>
      )}
    </div>
  );
}
