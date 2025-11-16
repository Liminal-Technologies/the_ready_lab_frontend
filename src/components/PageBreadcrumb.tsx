import { useLocation, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Route label mappings for better display names
const routeLabels: Record<string, string> = {
  'student-view': 'Student Dashboard',
  'educator': 'Educator Dashboard',
  'admin': 'Admin Dashboard',
  'courses': 'Courses',
  'lessons': 'Lesson',
  'certificates': 'Certificates',
  'community': 'Community',
  'settings': 'Settings',
  'products': 'Products',
  'onboarding': 'Onboarding',
  'browse': 'Browse',
  'explore': 'Explore',
  'pricing': 'Pricing',
  'overview': 'Overview',
  'users': 'Users',
  'communities': 'Communities',
  'payments': 'Payments',
  'institutions': 'Institutions',
  'legal': 'Legal',
  'ai': 'AI',
  'audit-logs': 'Audit Logs',
};

interface PageBreadcrumbProps {
  customSegments?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function PageBreadcrumb({ customSegments, className }: PageBreadcrumbProps) {
  const location = useLocation();

  // If custom segments provided, use those instead
  if (customSegments) {
    return (
      <Breadcrumb className={className}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" data-testid="breadcrumb-home">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {customSegments.map((segment, index) => (
            <span key={index} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {segment.href && index < customSegments.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link to={segment.href} data-testid={`breadcrumb-${segment.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {segment.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage data-testid={`breadcrumb-${segment.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    {segment.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Auto-generate breadcrumbs from path
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Skip breadcrumbs for homepage
  if (pathSegments.length === 0) {
    return null;
  }

  // Build breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === pathSegments.length - 1;

    return {
      label,
      path,
      isLast,
    };
  });

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" data-testid="breadcrumb-home">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.map((item, index) => (
          <span key={index} className="contents">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage data-testid={`breadcrumb-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path} data-testid={`breadcrumb-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
