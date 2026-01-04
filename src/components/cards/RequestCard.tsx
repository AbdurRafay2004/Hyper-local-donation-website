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

export function RequestCard({ request, onPledge, showActions = true }: RequestCardProps) {
  const category = CATEGORIES.find(c => c.value === request.category);
  const profile = request.profiles;
  const progress = Math.min((request.quantity_pledged / request.quantity_needed) * 100, 100);
  const isFulfilled = request.quantity_pledged >= request.quantity_needed;

  return (
    <Card className={`overflow-hidden card-hover bg-card group ${
      request.is_urgent 
        ? 'border-urgent/40 hover:border-urgent/60' 
        : 'border-request/20 hover:border-request/40'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {request.is_urgent && (
              <Badge variant="destructive" className="shrink-0 animate-pulse-soft">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Urgent
              </Badge>
            )}
            <Badge variant="secondary" className="shrink-0 bg-request-light text-request-foreground">
              {category?.icon} {category?.label}
            </Badge>
          </div>
          {isFulfilled && (
            <Badge className="bg-donation text-white">Fulfilled!</Badge>
          )}
        </div>

        <h3 className="font-display font-semibold text-lg mb-1">{request.title}</h3>
        <p className="text-sm font-medium text-request mb-2">
          Need: {request.quantity_needed} {request.item_name}
        </p>
        
        {request.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {request.description}
          </p>
        )}
        
        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {request.quantity_pledged} / {request.quantity_needed}
            </span>
          </div>
          <Progress 
            value={progress} 
            variant={request.is_urgent ? 'urgent' : 'request'} 
            className="h-3"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {request.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {request.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Link 
          to={`/profile/${request.ngo_id}`} 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-request/10 text-request text-xs">
              {profile?.organization_name?.[0]?.toUpperCase() || 'N'}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium hover:underline">{profile?.organization_name || 'NGO'}</span>
            {profile?.is_verified && (
              <BadgeCheck className="h-4 w-4 text-verified" />
            )}
          </div>
        </Link>
        
        {showActions && onPledge && !isFulfilled && (
          <Button
            variant="request-outline"
            size="sm"
            onClick={() => onPledge(request)}
          >
            <HandHeart className="h-4 w-4" />
            I Can Help
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
