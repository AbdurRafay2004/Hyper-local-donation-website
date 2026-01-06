import { memo } from 'react';
import { DonationListing, CATEGORIES } from '@/lib/supabase-types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, MessageCircle, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DonationCardProps {
  listing: DonationListing;
  onContact?: (listing: DonationListing) => void;
  showActions?: boolean;
}

// Using React.memo to prevent unnecessary re-renders of the component
export const DonationCard = memo(({ listing, onContact, showActions = true }: DonationCardProps) => {
  const category = CATEGORIES.find(c => c.value === listing.category);
  const profile = listing.profiles;

  return (
    <Card className="overflow-hidden bg-card border-donation/20 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden bg-donation-light">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Package className="h-12 w-12 text-donation/40" />
          </div>
        )}

        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm shadow-sm text-foreground border-none">
            {category?.icon} <span className="ml-1">{category?.label}</span>
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <h3 className="font-display font-bold text-xl line-clamp-1 mb-2 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>
        
        {listing.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {listing.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {listing.location && (
            <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
              <MapPin className="h-3.5 w-3.5" />
              {listing.location}
            </span>
          )}
          <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
            <Clock className="h-3.5 w-3.5" />
            {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/50 mt-auto">
        <div className="flex items-center gap-2 mt-4">
          <Avatar className="h-8 w-8 ring-2 ring-background transition-transform group-hover:scale-105">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-donation/10 text-donation text-xs font-medium">
              {profile?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground/80">{profile?.username || 'User'}</span>
        </div>
        
        {showActions && onContact && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 hover:bg-donation/10 hover:text-donation transition-colors"
            onClick={() => onContact(listing)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});
