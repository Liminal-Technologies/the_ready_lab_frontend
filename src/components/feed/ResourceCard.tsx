import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  description: string;
  resourceType: string;
  fileUrl: string;
  thumbnailUrl?: string;
}

export const ResourceCard = ({
  title,
  description,
  resourceType,
  fileUrl,
  thumbnailUrl,
}: ResourceCardProps) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-elegant transition-all">
      <div className="relative aspect-[9/16] md:aspect-video">
        <img
          src={thumbnailUrl || 'https://images.unsplash.com/photo-1554224311-beee180fc8e8?w=800'}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/95" />
        
        {/* Content */}
        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <Badge variant="secondary">{resourceType}</Badge>
          </div>
          
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{description}</p>
          
          <Button className="w-full" variant="secondary" asChild>
            <a href={fileUrl} download>
              <Download className="h-4 w-4 mr-2" />
              Download Resource
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
};
