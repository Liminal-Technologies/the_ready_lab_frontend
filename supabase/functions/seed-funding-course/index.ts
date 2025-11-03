import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the Funding Readiness 101 track
    const { data: track, error: trackError } = await supabaseClient
      .from('tracks')
      .select('id')
      .eq('title', 'Funding Readiness 101')
      .single();

    if (trackError || !track) {
      throw new Error('Track not found');
    }

    const modules = [
      {
        title: 'Introduction to Funding',
        description: 'Understanding the funding landscape for educational initiatives',
        order_index: 1,
        lessons: [
          { title: 'Types of Educational Funding', description: 'Explore grants, donations, and investment opportunities', duration_minutes: 12 },
          { title: 'Building Your Funding Strategy', description: 'Create a comprehensive funding roadmap', duration_minutes: 15 },
          { title: 'Understanding Funder Expectations', description: 'Learn what funders look for in applicants', duration_minutes: 10 },
        ]
      },
      {
        title: 'Grant Writing Essentials',
        description: 'Master the art of compelling grant proposals',
        order_index: 2,
        lessons: [
          { title: 'Researching Grant Opportunities', description: 'Find the right grants for your mission', duration_minutes: 14 },
          { title: 'Crafting Your Narrative', description: 'Tell your story effectively', duration_minutes: 18 },
          { title: 'Budget Development', description: 'Create realistic and compelling budgets', duration_minutes: 16 },
        ]
      },
      {
        title: 'Pitch Deck Creation',
        description: 'Build presentations that capture investor attention',
        order_index: 3,
        lessons: [
          { title: 'Pitch Deck Fundamentals', description: 'Essential slides every pitch needs', duration_minutes: 13 },
          { title: 'Visual Storytelling', description: 'Design principles for compelling decks', duration_minutes: 15 },
          { title: 'Practice Your Delivery', description: 'Present with confidence and clarity', duration_minutes: 12 },
        ]
      },
      {
        title: 'Financial Modeling',
        description: 'Project your financial future with confidence',
        order_index: 4,
        lessons: [
          { title: 'Revenue Projections', description: 'Forecast income realistically', duration_minutes: 17 },
          { title: 'Expense Planning', description: 'Budget for all operational costs', duration_minutes: 14 },
          { title: 'Cash Flow Management', description: 'Maintain healthy financial operations', duration_minutes: 16 },
        ]
      },
      {
        title: 'Investor Relations',
        description: 'Build and maintain strong funder relationships',
        order_index: 5,
        lessons: [
          { title: 'Finding the Right Investors', description: 'Match your mission with aligned funders', duration_minutes: 13 },
          { title: 'The Pitch Meeting', description: 'Make a lasting impression', duration_minutes: 15 },
          { title: 'Follow-up Best Practices', description: 'Keep momentum after initial contact', duration_minutes: 11 },
        ]
      },
      {
        title: 'Compliance & Reporting',
        description: 'Meet obligations and maintain trust',
        order_index: 6,
        lessons: [
          { title: 'Grant Reporting Requirements', description: 'Submit accurate and timely reports', duration_minutes: 14 },
          { title: 'Financial Transparency', description: 'Build trust through open communication', duration_minutes: 12 },
          { title: 'Measuring Impact', description: 'Demonstrate your educational outcomes', duration_minutes: 16 },
        ]
      }
    ];

    // Insert modules and lessons
    for (const moduleData of modules) {
      const { data: module, error: moduleError } = await supabaseClient
        .from('modules')
        .insert({
          track_id: track.id,
          title: moduleData.title,
          description: moduleData.description,
          order_index: moduleData.order_index,
        })
        .select()
        .single();

      if (moduleError) {
        console.error('Error inserting module:', moduleError);
        continue;
      }

      // Insert lessons for this module
      for (let i = 0; i < moduleData.lessons.length; i++) {
        const lesson = moduleData.lessons[i];
        const { error: lessonError } = await supabaseClient
          .from('lessons')
          .insert({
            module_id: module.id,
            title: lesson.title,
            description: lesson.description,
            duration_minutes: lesson.duration_minutes,
            order_index: i + 1,
            content_type: 'video',
            content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          });

        if (lessonError) {
          console.error('Error inserting lesson:', lessonError);
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Course seeded successfully', trackId: track.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
