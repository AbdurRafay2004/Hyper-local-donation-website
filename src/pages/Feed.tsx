import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { DonationCard } from '@/components/cards/DonationCard';
import { RequestCard } from '@/components/cards/RequestCard';
import { PledgeModal } from '@/components/modals/PledgeModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DonationListing, NgoRequest, CATEGORIES, ListingCategory } from '@/lib/supabase-types';
import { Search, MapPin, Filter, Package, HandHeart } from 'lucide-react';
import { toast } from 'sonner';

export default function Feed() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [donations, setDonations] = useState<DonationListing[]>([]);
  const [requests, setRequests] = useState<NgoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedRequest, setSelectedRequest] = useState<NgoRequest | null>(null);
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);

  const isNgo = profile?.role === 'ngo';
  const currentTab = searchParams.get('tab') || (isNgo ? 'donations' : 'requests');
  const categoryFilter = searchParams.get('category') || 'all';

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Real-time subscription for requests updates
    const channel = supabase
      .channel('requests-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ngo_requests' },
        () => fetchRequests()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchDonations(), fetchRequests()]);
    setLoading(false);
  };

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('donation_listings')
      .select('*, profiles(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to load donations');
      return;
    }
    setDonations(data as DonationListing[]);
  };

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('ngo_requests')
      .select('*, profiles(*)')
      .eq('status', 'active')
      .order('is_urgent', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to load requests');
      return;
    }
    setRequests(data as NgoRequest[]);
  };

  const handleContactDonor = (listing: DonationListing) => {
    navigate(`/messages?user=${listing.user_id}&listing=${listing.id}`);
  };

  const handlePledge = (request: NgoRequest) => {
    setSelectedRequest(request);
    setPledgeModalOpen(true);
  };

  const filteredDonations = donations.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.item_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-primary">Loading feed...</div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6">
        {/* Header & Filters */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">
            {isNgo ? 'Available Donations' : 'NGO Requests'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isNgo 
              ? 'Browse items offered by donors in your area' 
              : 'See what NGOs need and help make a difference'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) {
                    searchParams.set('search', e.target.value);
                  } else {
                    searchParams.delete('search');
                  }
                  setSearchParams(searchParams);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                if (value === 'all') {
                  searchParams.delete('category');
                } else {
                  searchParams.set('category', value);
                }
                setSearchParams(searchParams);
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs for both views */}
        <Tabs
          value={currentTab}
          onValueChange={(value) => {
            searchParams.set('tab', value);
            setSearchParams(searchParams);
          }}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="requests" className="gap-2">
              <HandHeart className="h-4 w-4" />
              NGO Requests
            </TabsTrigger>
            <TabsTrigger value="donations" className="gap-2">
              <Package className="h-4 w-4" />
              Donations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <HandHeart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No requests found</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onPledge={handlePledge}
                    showActions={!isNgo}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="donations">
            {filteredDonations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No donations found</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDonations.map((donation) => (
                  <DonationCard
                    key={donation.id}
                    listing={donation}
                    onContact={handleContactDonor}
                    showActions={isNgo}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <PledgeModal
        request={selectedRequest}
        open={pledgeModalOpen}
        onOpenChange={setPledgeModalOpen}
        onSuccess={fetchRequests}
      />
    </div>
  );
}
