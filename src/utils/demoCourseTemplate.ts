export interface DemoCourseTemplate {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  learningObjectives: string[];
  prerequisites: string[];
  language: string;
  tags: string[];
  pricing: {
    amount: number;
    discount: number;
    billingOptions: string[];
  };
  modules: Array<{
    title: string;
    description: string;
    lessons: Array<{
      title: string;
      type: 'video' | 'quiz';
      duration: number;
      description: string;
      videoUrl?: string;
      resources?: Array<{ title: string; url: string }>;
      quizQuestions?: Array<{
        question: string;
        options: string[];
        correctAnswer: number;
      }>;
    }>;
  }>;
}

export const DEMO_COURSE_TEMPLATE: DemoCourseTemplate = {
  title: "Grant Writing Masterclass: From Research to Funding",
  description: "Master the art of grant writing and secure funding for your projects. Learn proven strategies for researching opportunities, crafting compelling narratives, and navigating compliance requirements. This comprehensive course takes you from beginner to confident grant writer with real-world examples and templates.",
  category: "Funding & Grants",
  difficulty: "Beginner",
  learningObjectives: [
    "Identify and research relevant grant opportunities using advanced search strategies",
    "Write compelling grant proposals that tell powerful stories and demonstrate impact",
    "Navigate compliance requirements and meet submission deadlines with confidence",
    "Build sustainable relationships with funders and maximize approval rates",
  ],
  prerequisites: [
    "Basic understanding of nonprofit or project management",
    "Familiarity with Microsoft Word or Google Docs",
  ],
  language: "English",
  tags: ["grant writing", "fundraising", "nonprofit", "proposal writing", "funding"],
  pricing: {
    amount: 99,
    discount: 20,
    billingOptions: ["one-time", "subscription"],
  },
  modules: [
    {
      title: "Grant Prospecting Foundations",
      description: "Learn how to identify the right funding opportunities and build a sustainable grant pipeline.",
      lessons: [
        {
          title: "Welcome & Course Overview",
          type: "video",
          duration: 8,
          description: "Get acquainted with the course structure, your instructor, and what you'll achieve by the end of this masterclass.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        {
          title: "Understanding the Grant Landscape",
          type: "video",
          duration: 12,
          description: "Explore different types of grants (federal, foundation, corporate) and learn which ones align with your mission and capacity.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          resources: [
            { title: "Grant Types Comparison Chart", url: "#" },
            { title: "Top 50 Foundation Databases", url: "#" },
          ],
        },
        {
          title: "Research Strategies & Tools",
          type: "video",
          duration: 15,
          description: "Master advanced search techniques using Foundation Directory, Grants.gov, and other essential databases to build your pipeline.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          resources: [
            { title: "Research Checklist Template", url: "#" },
          ],
        },
        {
          title: "Knowledge Check: Grant Prospecting",
          type: "quiz",
          duration: 5,
          description: "Test your understanding of grant prospecting strategies and research tools.",
          quizQuestions: [
            {
              question: "Which type of grant typically has the most flexible requirements?",
              options: ["Federal grants", "Foundation grants", "Corporate grants", "Government contracts"],
              correctAnswer: 1,
            },
            {
              question: "What is the most important factor when selecting grants to pursue?",
              options: ["Grant amount", "Mission alignment", "Application deadline", "Competition level"],
              correctAnswer: 1,
            },
          ],
        },
      ],
    },
    {
      title: "Story-Driven Proposal Writing",
      description: "Craft compelling narratives that resonate with funders and demonstrate measurable impact.",
      lessons: [
        {
          title: "The Anatomy of a Winning Proposal",
          type: "video",
          duration: 18,
          description: "Break down successful grant proposals and identify the key elements that make them stand out from the competition.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          resources: [
            { title: "Sample Funded Proposals (3 examples)", url: "#" },
            { title: "Proposal Outline Template", url: "#" },
          ],
        },
        {
          title: "Storytelling for Impact",
          type: "video",
          duration: 14,
          description: "Learn how to weave compelling narratives that connect your mission to funder priorities using proven storytelling frameworks.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        {
          title: "Budget Development & Justification",
          type: "video",
          duration: 16,
          description: "Create realistic budgets that align with your narrative and demonstrate fiscal responsibility to funders.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          resources: [
            { title: "Budget Template with Formulas", url: "#" },
            { title: "Budget Justification Examples", url: "#" },
          ],
        },
      ],
    },
    {
      title: "Compliance & Submission Success",
      description: "Navigate the technical requirements and submission process to maximize your approval rates.",
      lessons: [
        {
          title: "Compliance Requirements Demystified",
          type: "video",
          duration: 13,
          description: "Understand common compliance requirements including audits, reporting, and documentation to avoid costly mistakes.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          resources: [
            { title: "Compliance Checklist", url: "#" },
          ],
        },
        {
          title: "Submission Best Practices",
          type: "video",
          duration: 10,
          description: "Master the submission process with proven strategies for beating deadlines and avoiding common technical errors.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        {
          title: "Final Knowledge Assessment",
          type: "quiz",
          duration: 8,
          description: "Demonstrate your mastery of grant writing principles and earn your course certificate.",
          quizQuestions: [
            {
              question: "When should you start preparing your grant submission?",
              options: ["1 week before deadline", "2 weeks before deadline", "1 month before deadline", "2-3 months before deadline"],
              correctAnswer: 3,
            },
            {
              question: "What is the most common reason grant proposals are rejected?",
              options: ["Poor budget", "Weak storytelling", "Misalignment with funder priorities", "Technical errors"],
              correctAnswer: 2,
            },
            {
              question: "What should you do after submitting a grant proposal?",
              options: ["Wait for results", "Follow up immediately", "Send a thank you note and track progress", "Start a new proposal"],
              correctAnswer: 2,
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Generate a complete demo course with unique IDs
 * This creates a fresh copy of the template with new UUIDs for modules and lessons
 */
export function generateDemoCourse() {
  const template = DEMO_COURSE_TEMPLATE;
  
  const modules = template.modules.map(module => ({
    id: crypto.randomUUID(),
    title: module.title,
    description: module.description,
    lessons: module.lessons.map(lesson => ({
      id: crypto.randomUUID(),
      title: lesson.title,
      type: lesson.type,
      duration: lesson.duration,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      resources: lesson.resources,
      quizQuestions: lesson.quizQuestions,
    })),
  }));

  return {
    title: template.title,
    description: template.description,
    category: template.category,
    difficulty: template.difficulty,
    learningObjectives: template.learningObjectives,
    prerequisites: template.prerequisites,
    language: template.language,
    tags: template.tags,
    pricing: template.pricing,
    modules,
  };
}
