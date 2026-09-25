import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  showBackButton = false,
  action,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mt-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}
