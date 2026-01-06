import { memo } from 'react';
import { Link } from 'react-router-dom';
import { NgoRequest, CATEGORIES } from '@/lib/supabase-types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { MapPin, Clock, HandHeart, AlertTriangle, BadgeCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RequestCardProps {
  request: NgoRequest;
  onPledge?: (request: NgoRequest) => void;
  showActions?: boolean;
}

export const RequestCard = memo(({ request, onPledge, showActions = true }: RequestCardProps) => {
  const category = CATEGORIES.find(c => c.value === request.category);
  const profile = request.profiles;
  const progress = Math.min((request.quantity_pledged / request.quantity_needed) * 100, 100);
  const isFulfilled = request.quantity_pledged >= request.quantity_needed;

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card group flex flex-col h-full ${
      request.is_urgent 
        ? 'border-urgent/40 hover:border-urgent/60' 
        : 'border-request/20 hover:border-request/40'
    }`}>
      <CardContent className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            {request.is_urgent && (
              <Badge variant="destructive" className="shrink-0 animate-pulse shadow-sm ring-1 ring-destructive/30">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Urgent
              </Badge>
            )}
            <Badge variant="secondary" className="shrink-0 bg-request-light text-request-foreground border-transparent">
              {category?.icon} <span className="ml-1">{category?.label}</span>
            </Badge>
          </div>
          {isFulfilled && (
            <Badge className="bg-donation text-white shadow-sm">Fulfilled!</Badge>
          )}
        </div>

        <h3 className="font-display font-bold text-xl mb-1 group-hover:text-request transition-colors line-clamp-2">
          {request.title}
        </h3>
        <p className="text-sm font-semibold text-request mb-3">
          Need: {request.quantity_needed} {request.item_name}
        </p>
        
        {request.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
            {request.description}
          </p>
        )}
        
        {/* Progress Bar */}
        <div className="space-y-2 mb-5">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>Progress</span>
            <span className={isFulfilled ? "text-donation" : "text-foreground"}>
              {request.quantity_pledged} of {request.quantity_needed} pledged
            </span>
          </div>
          <Progress 
            value={progress} 
            variant={request.is_urgent ? 'urgent' : 'request'} 
            className="h-2.5 rounded-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {request.location && (
            <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
              <MapPin className="h-3.5 w-3.5" />
              {request.location}
            </span>
          )}
          <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
            <Clock className="h-3.5 w-3.5" />
            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/50 mt-auto">
        <Link 
          to={`/profile/${request.ngo_id}`} 
          className="flex items-center gap-2 mt-4 hover:opacity-80 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="h-8 w-8 ring-2 ring-background">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-request/10 text-request text-xs font-medium">
              {profile?.organization_name?.[0]?.toUpperCase() || 'N'}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium hover:underline text-foreground/80">{profile?.organization_name || 'NGO'}</span>
            {profile?.is_verified && (
              <BadgeCheck className="h-4 w-4 text-verified" />
            )}
          </div>
        </Link>
        
        {showActions && onPledge && !isFulfilled && (
          <Button
            variant="request-outline"
            size="sm"
            className="mt-4 shadow-sm hover:shadow transition-all"
            onClick={() => onPledge(request)}
          >
            <HandHeart className="h-4 w-4 mr-2" />
            I Can Help
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});
