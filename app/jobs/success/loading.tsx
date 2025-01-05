// app/jobs/success/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SuccessLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6 text-center">
              <div className="mx-auto">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-64 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
