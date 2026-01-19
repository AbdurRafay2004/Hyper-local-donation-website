import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Users, Building2, HandHeart, Package, ArrowRight, MapPin } from 'lucide-react';

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-donation/5 to-request/5 z-0" />
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-donation/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-request/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '4s' }} />
        </div>
        <div className="container relative py-6 z-10">
          <nav className="flex items-center justify-between mb-16">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
              <Heart className="h-6 w-6 fill-primary" />
              <span>DonateLocal</span>
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <Button asChild>
                  <Link to="/feed">Go to Feed</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth?mode=signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>

          <div className="max-w-3xl mx-auto text-center py-16 animate-fade-in">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Connect Donors with NGOs in Your{' '}
              <span className="text-primary">Community</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A hyper-local platform where generous donors meet verified NGOs. 
              Donate items you no longer need, or request what your community needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="donation" asChild>
                <Link to="/auth?mode=signup">
                  <Package className="h-5 w-5" />
                  I Want to Donate
                </Link>
              </Button>
              <Button size="xl" variant="request" asChild>
                <Link to="/auth?mode=signup">
                  <HandHeart className="h-5 w-5" />
                  I'm an NGO
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 rounded-full bg-donation-light flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-donation" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">For Donors</h3>
              <p className="text-muted-foreground">
                List items you want to donate. NGOs in your area can find and request your donations.
              </p>
            </div>
            <div className="text-center p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 rounded-full bg-request-light flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-request" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">For NGOs</h3>
              <p className="text-muted-foreground">
                Create requests with specific goals. Track pledges in real-time and connect with donors.
              </p>
            </div>
            <div className="text-center p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Hyper-Local</h3>
              <p className="text-muted-foreground">
                Find donations and requests near you. Location-based feeds make helping easy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join our community of donors and NGOs working together to help those in need.
          </p>
          <Button size="xl" asChild>
            <Link to="/auth?mode=signup">
              Join Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="h-5 w-5 fill-primary text-primary" />
            <span>DonateLocal</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 DonateLocal. Making communities stronger.
          </p>
        </div>
      </footer>
    </div>
  );
}
