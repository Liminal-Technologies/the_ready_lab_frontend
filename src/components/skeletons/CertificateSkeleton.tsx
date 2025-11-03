import { Skeleton } from "@/components/ui/skeleton";

export const CertificateSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};
