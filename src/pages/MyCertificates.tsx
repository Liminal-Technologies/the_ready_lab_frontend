import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/services/api';
import Header from '@/components/Header';
import { CertificateDisplay } from '@/components/certificates/CertificateDisplay';
import { CertificateSkeleton } from '@/components/skeletons/CertificateSkeleton';
import { EmptyCertificates } from '@/components/empty-states/EmptyCertificates';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award, Users, MessageSquare, TrendingUp, X } from 'lucide-react';

interface Certificate {
  id: string;
  track_id: string;
  cert_type: 'completion' | 'certified';
  issued_at: string;
  pdf_url: string | null;
  share_url: string | null;
  serial: string;
  disclaimer_text: string | null;
  track: {
    title: string;
  };
}

export const MyCertificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [showCommunityPrompt, setShowCommunityPrompt] = useState(true);

  useEffect(() => {
    fetchCertificates();
    // Check if user has dismissed the community prompt
    const dismissed = localStorage.getItem('communityPromptDismissed');
    if (dismissed) {
      setShowCommunityPrompt(false);
    }
  }, []);

  const handleDismissPrompt = () => {
    localStorage.setItem('communityPromptDismissed', 'true');
    setShowCommunityPrompt(false);
  };

  const fetchCertificates = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile via API
      const profile = await api.profiles.get(user.id);
      setUserName((profile as any)?.full_name || (profile as any)?.email || 'Student');

      // Get certificates via API
      const certsData = await api.certifications.list(user.id);

      // Map to expected format - filter for approved and map track data
      const mappedCerts = (certsData || [])
        .filter((cert: any) => cert.status === 'approved' || cert.status === 'issued')
        .map((cert: any) => ({
          id: cert.id,
          track_id: cert.track_id || cert.trackId,
          cert_type: (cert.certificate_type || cert.cert_type || 'completion') as 'completion' | 'certified',
          issued_at: cert.issue_date || cert.issued_at || cert.created_at,
          pdf_url: cert.certificate_url || cert.pdf_url,
          share_url: cert.shareable_url || cert.share_url,
          serial: cert.id?.slice(0, 8)?.toUpperCase() || 'N/A',
          disclaimer_text: null,
          track: cert.track || { title: 'Unknown Track' },
        }));

      setCertificates(mappedCerts);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Award className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">My Certificates</h1>
            </div>

            {/* Community Join Prompt Banner */}
            {!loading && certificates.length > 0 && showCommunityPrompt && (
              <Card className="mb-6 p-6 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          🎉 Congratulations on Your Achievement!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Join our community of certified professionals
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">
                      Connect with fellow learners, share insights, and continue growing together. 
                      Our communities are designed to help you apply what you've learned and build meaningful connections.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span>Engage in discussions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span>Network with peers</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span>Stay updated on trends</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate('/community/browse')}
                        data-testid="button-join-communities"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Explore Communities
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/explore')}
                        data-testid="button-discover-more"
                      >
                        Discover More Courses
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDismissPrompt}
                    className="flex-shrink-0"
                    data-testid="button-dismiss-prompt"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <CertificateSkeleton key={i} />
                ))}
              </div>
            ) : certificates.length === 0 ? (
              <EmptyCertificates />
            ) : (
              <div className="space-y-6">
                {certificates.map((cert) => (
                  <div key={cert.id} onClick={() => window.location.href = `/certificates/${cert.id}`} className="cursor-pointer">
                    <CertificateDisplay
                      certificateId={cert.id}
                      trackTitle={cert.track.title}
                      userName={userName}
                      issuedAt={cert.issued_at}
                      serial={cert.serial}
                      pdfUrl={cert.pdf_url}
                      shareUrl={cert.share_url}
                      certType={cert.cert_type}
                      disclaimerText={cert.disclaimer_text}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
