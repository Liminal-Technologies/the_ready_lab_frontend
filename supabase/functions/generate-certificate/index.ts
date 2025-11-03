import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { trackId } = await req.json();

    // Check if user completed all lessons and quizzes in the track
    const { data: track, error: trackError } = await supabaseClient
      .from('tracks')
      .select(`
        *,
        modules (
          id,
          lessons (
            id,
            lesson_progress!inner (
              user_id,
              status
            )
          )
        )
      `)
      .eq('id', trackId)
      .single();

    if (trackError) throw trackError;

    // Get user profile with language preference
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('full_name, email, preferred_language')
      .eq('id', user.id)
      .single();

    const userName = profile?.full_name || profile?.email || 'Student';
    const preferredLanguage = profile?.preferred_language || 'en';

    // Check all lessons completed
    let allLessonsCompleted = true;
    for (const module of track.modules) {
      for (const lesson of module.lessons) {
        const progress = lesson.lesson_progress.find(p => p.user_id === user.id);
        if (!progress || progress.status !== 'completed') {
          allLessonsCompleted = false;
          break;
        }
      }
      if (!allLessonsCompleted) break;
    }

    if (!allLessonsCompleted) {
      return new Response(
        JSON.stringify({ error: 'Not all lessons completed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check all quizzes passed
    const { data: quizzes } = await supabaseClient
      .from('quizzes')
      .select(`
        id,
        quiz_attempts (
          user_id,
          passed
        )
      `)
      .in('lesson_id', track.modules.flatMap(m => m.lessons.map(l => l.id)));

    if (quizzes) {
      for (const quiz of quizzes) {
        const passed = quiz.quiz_attempts.some(a => a.user_id === user.id && a.passed);
        if (!passed) {
          return new Response(
            JSON.stringify({ error: 'Not all quizzes passed' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
      }
    }

    // Generate certificate serial
    const serial = `CERT-${Math.random().toString(36).substring(2, 14).toUpperCase()}`;
    const shareUrl = `${Deno.env.get('SUPABASE_URL')}/certificate/${serial}`;

    // Get certificate text based on preferred language
    const certificateTexts: Record<string, any> = {
      en: {
        title: 'Certificate of Completion',
        body: `This is to certify that ${userName} has successfully completed`,
        disclaimer: 'This certificate is issued as acknowledgment of professional development participation and does not represent an accredited academic degree or formal credential.'
      },
      es: {
        title: 'Certificado de Finalización',
        body: `Se certifica que ${userName} ha completado exitosamente`,
        disclaimer: 'Este certificado se emite como reconocimiento de participación en desarrollo profesional y no representa un título académico acreditado ni una credencial formal.'
      }
    };

    const certText = certificateTexts[preferredLanguage] || certificateTexts.en;

    // Create certificate record
    const { data: certificate, error: certError } = await supabaseClient
      .from('certifications')
      .insert({
        user_id: user.id,
        track_id: trackId,
        cert_type: 'completion',
        serial,
        share_url: shareUrl,
        status: 'approved',
        issued_at: new Date().toISOString(),
        disclaimer_text: certText.disclaimer
      })
      .select()
      .single();

    if (certError) throw certError;

    // Send certificate email with localized content
    try {
      const emailSubject = preferredLanguage === 'es' 
        ? `Tu Certificado de Finalización - ${track.title}`
        : `Your Certificate of Completion - ${track.title}`;
      
      const emailBody = preferredLanguage === 'es'
        ? `
          <h1>¡Felicitaciones, ${userName}!</h1>
          <p>Has completado exitosamente <strong>${track.title}</strong>.</p>
          <p>Tu número de serie del certificado es: <strong>${serial}</strong></p>
          <p><a href="${shareUrl}">Ver tu certificado</a></p>
          <br>
          <p><em>${certText.disclaimer}</em></p>
        `
        : `
          <h1>Congratulations, ${userName}!</h1>
          <p>You have successfully completed <strong>${track.title}</strong>.</p>
          <p>Your certificate serial number is: <strong>${serial}</strong></p>
          <p><a href="${shareUrl}">View your certificate</a></p>
          <br>
          <p><em>${certText.disclaimer}</em></p>
        `;

      await resend.emails.send({
        from: 'Ready Lab Launchpad <onboarding@resend.dev>',
        to: [profile?.email || user.email || ''],
        subject: emailSubject,
        html: emailBody,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    return new Response(
      JSON.stringify({ 
        certificate: {
          ...certificate,
          track_title: track.title,
          user_name: userName,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error generating certificate:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
