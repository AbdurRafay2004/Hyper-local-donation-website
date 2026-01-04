import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Profile, NgoActivity } from '@/lib/supabase-types';
import { BadgeCheck, MapPin, ImageIcon, ArrowLeft, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

export default function PublicProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activities, setActivities] = useState<NgoActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const isNgo = profile?.role === 'ngo';
  const isOwnProfile = user?.id === id;

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData as Profile | null);

      if (profileData?.role === 'ngo') {
        const { data: activityData } = await supabase
          .from('ngo_activities')
          .select('*')
          .eq('ngo_id', id)
          .order('created_at', { ascending: false });

        if (activityData) {
          setActivities(activityData as NgoActivity[]);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-primary">Loading...</div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Profile not found</p>
            <Link to="/feed">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Feed
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl py-8">
        <Link to="/feed" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Feed
        </Link>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {isNgo 
                    ? profile.organization_name?.[0]?.toUpperCase() 
                    : profile.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-display text-2xl font-bold">
                    {isNgo ? profile.organization_name : profile.username}
                  </h1>
                  {isNgo && profile.is_verified && (
                    <Badge className="bg-verified text-white">
                      <BadgeCheck className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground capitalize mb-2">{profile.role}</p>
                {profile.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </p>
                )}
                {profile.bio && (
                  <p className="text-sm mt-3">{profile.bio}</p>
                )}
                
                {!isOwnProfile && user && (
                  <Link to={`/messages?contact=${id}`}>
                    <Button variant="outline" size="sm" className="mt-4">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NGO Activities Section */}
        {isNgo && (
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Activities</CardTitle>
              <CardDescription>Recent activities from this organization</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activities posted yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="border-b pb-6 last:border-0">
                      {activity.image_url && (
                        <img
                          src={activity.image_url}
                          alt="Activity"
                          className="w-full max-h-64 object-cover rounded-lg mb-4"
                        />
                      )}
                      <p className="mb-2">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
