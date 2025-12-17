import { ReactNode } from 'react';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  showBreadcrumb?: boolean;
  className?: string;
}

export function DashboardHeader({
  title,
  description,
  badge,
  actions,
  showBreadcrumb = true,
  className = '',
}: DashboardHeaderProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {showBreadcrumb && <PageBreadcrumb />}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="text-muted-foreground text-base">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
