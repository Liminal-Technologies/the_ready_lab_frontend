import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { CertificateDisplay } from '@/components/certificates/CertificateDisplay';
import { CertificateSkeleton } from '@/components/skeletons/CertificateSkeleton';
import { EmptyCertificates } from '@/components/empty-states/EmptyCertificates';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';

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
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      // Get user name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.user.id)
        .single();

      setUserName(profile?.full_name || profile?.email || 'Student');

      // Get certificates
      const { data, error } = await supabase
        .from('certifications')
        .select(`
          *,
          track:tracks (
            title
          )
        `)
        .eq('user_id', user.user.id)
        .eq('status', 'approved')
        .order('issued_at', { ascending: false });

      if (error) throw error;
      setCertificates((data || []).map(cert => ({
        ...cert,
        cert_type: cert.cert_type as 'completion' | 'certified',
      })));
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
