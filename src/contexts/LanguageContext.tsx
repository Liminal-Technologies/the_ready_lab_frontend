import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

const translations: Translations = {
  // Header
  "header.courses": { en: "Courses", es: "Cursos" },
  "header.about": { en: "About", es: "Acerca de" },
  "header.contact": { en: "Contact", es: "Contacto" },
  "header.signIn": { en: "Sign In", es: "Iniciar Sesión" },
  "header.getStarted": { en: "Get Started", es: "Comenzar" },
  "header.home": { en: "Home", es: "Inicio" },
  "header.dashboard": { en: "Dashboard", es: "Panel" },
  "header.signOut": { en: "Sign Out", es: "Cerrar Sesión" },

  // Hero Section
  "hero.title": {
    en: "Prepare & Get Funded",
    es: "Prepárate y Obtén Financiamiento",
  },
  "hero.subtitle": {
    en: "Build the fundable business that funders actually want to back. Real education, real results, real opportunity.",
    es: "Construye el negocio financiable que los inversionistas realmente quieren respaldar. Educación real, resultados reales, oportunidad real.",
  },
  "hero.startLearning": { en: "Start Your Journey", es: "Comienza Tu Viaje" },
  "hero.browseCourses": { en: "Watch Demo", es: "Ver Demo" },

  // Features
  "features.title": {
    en: "Why Choose The Ready Lab?",
    es: "¿Por Qué Elegir The Ready Lab?",
  },
  "features.subtitle": {
    en: "We provide everything you need to accelerate your learning journey and prepare for the future of work.",
    es: "Proporcionamos todo lo que necesitas para acelerar tu viaje de aprendizaje y prepararte para el futuro del trabajo.",
  },
  "features.expertLed": {
    en: "Expert-Led Courses",
    es: "Cursos Dirigidos por Expertos",
  },
  "features.expertLedDesc": {
    en: "Learn from industry professionals with real-world experience and proven track records.",
    es: "Aprende de profesionales de la industria con experiencia real y historiales comprobados.",
  },
  "features.handsOn": { en: "Hands-On Labs", es: "Laboratorios Prácticos" },
  "features.handsOnDesc": {
    en: "Practice with interactive coding environments and real-world project simulations.",
    es: "Practica con entornos de codificación interactivos y simulaciones de proyectos del mundo real.",
  },
  "features.community": {
    en: "Community Learning",
    es: "Aprendizaje Comunitario",
  },
  "features.communityDesc": {
    en: "Connect with fellow learners, share knowledge, and grow together in study groups.",
    es: "Conéctate con otros estudiantes, comparte conocimiento y crece junto a grupos de estudio.",
  },
  "features.career": {
    en: "Career Preparation",
    es: "Preparación Profesional",
  },
  "features.careerDesc": {
    en: "Get job-ready with portfolio projects, interview prep, and career guidance.",
    es: "Prepárate para el trabajo con proyectos de portafolio, preparación para entrevistas y orientación profesional.",
  },
  "features.flexible": { en: "Flexible Schedule", es: "Horario Flexible" },
  "features.flexibleDesc": {
    en: "Learn at your own pace with 24/7 access to courses and learning materials.",
    es: "Aprende a tu propio ritmo con acceso 24/7 a cursos y materiales de aprendizaje.",
  },
  "features.certified": {
    en: "Certified Learning",
    es: "Aprendizaje Certificado",
  },
  "features.certifiedDesc": {
    en: "Earn industry-recognized certificates to showcase your skills to employers.",
    es: "Obtén certificados reconocidos por la industria para mostrar tus habilidades a los empleadores.",
  },

  // Micro Learning
  "micro.title": { en: "Micro Learning Feed", es: "Feed de Micro Aprendizaje" },
  "micro.subtitle": {
    en: "2-8 minute lessons to build your fundability. Real education, real results.",
    es: "Lecciones de 2-8 minutos para construir tu capacidad de financiamiento. Educación real, resultados reales.",
  },
  "micro.hotTopics": { en: "Hot Topics", es: "Temas Populares" },
  "micro.allTracks": { en: "All Tracks", es: "Todas las Pistas" },
  "micro.startLesson": { en: "Start Lesson", es: "Comenzar Lección" },
  "micro.getCertified": {
    en: "Get Certified & Fundable",
    es: "Certificarse y Ser Financiable",
  },

  // Courses
  "courses.title": {
    en: "Get Fundable & Certified",
    es: "Certifícate y Vuélvete Financiable",
  },
  "courses.subtitle": {
    en: "Structured learning paths designed to make you investor-ready. Real education, real results, real opportunity.",
    es: "Rutas de aprendizaje estructuradas diseñadas para prepararte para inversionistas. Educación real, resultados reales, oportunidad real.",
  },
  "courses.certificationTracks": {
    en: "Certification Tracks",
    es: "Pistas de Certificación",
  },
  "courses.startCertification": {
    en: "Start Your Certification Journey",
    es: "Inicia Tu Viaje de Certificación",
  },
  "courses.paymentPlans": {
    en: "Payment plans available • Workforce sponsorships accepted • Scholarships for qualifying learners",
    es: "Planes de pago disponibles • Patrocinios laborales aceptados • Becas para estudiantes calificados",
  },

  // Learning Dashboard
  "dashboard.title": { en: "Learning Dashboard", es: "Panel de Aprendizaje" },
  "dashboard.subtitle": {
    en: "Track your progress, earn certifications, and build your fundability step by step.",
    es: "Rastrea tu progreso, obtén certificaciones y construye tu capacidad de financiamiento paso a paso.",
  },
  "dashboard.yourProgress": { en: "Your Progress", es: "Tu Progreso" },
  "dashboard.progress": { en: "Progress", es: "Progreso" },
  "dashboard.certifications": { en: "Certifications", es: "Certificaciones" },
  "dashboard.certificationBenefits": {
    en: "Certification Benefits",
    es: "Beneficios de Certificación",
  },
  "dashboard.credibilityBoost": {
    en: "Credibility Boost",
    es: "Impulso de Credibilidad",
  },
  "dashboard.credibilityDesc": {
    en: "Prove your expertise to funders and partners",
    es: "Demuestra tu experiencia a financiadores y socios",
  },
  "dashboard.portfolioReady": { en: "Portfolio Ready", es: "Portafolio Listo" },
  "dashboard.portfolioDesc": {
    en: "Showcase verified skills on LinkedIn & proposals",
    es: "Muestra habilidades verificadas en LinkedIn y propuestas",
  },
  "dashboard.readyLabNetwork": { en: "Ready Lab Network", es: "Red Ready Lab" },
  "dashboard.networkDesc": {
    en: "Access exclusive graduate services & events",
    es: "Accede a servicios exclusivos de graduados y eventos",
  },
  "dashboard.continueLearning": {
    en: "Continue Learning",
    es: "Continuar Aprendiendo",
  },

  // Footer
  "footer.description": {
    en: "Empowering learners worldwide with cutting-edge education and practical skills for the future.",
    es: "Empoderando a estudiantes de todo el mundo con educación de vanguardia y habilidades prácticas para el futuro.",
  },
  "footer.quickLinks": { en: "Quick Links", es: "Enlaces Rápidos" },
  "footer.pricing": { en: "Pricing", es: "Precios" },
  "footer.blog": { en: "Blog", es: "Blog" },
  "footer.support": { en: "Support", es: "Soporte" },
  "footer.helpCenter": { en: "Help Center", es: "Centro de Ayuda" },
  "footer.community": { en: "Community", es: "Comunidad" },
  "footer.termsOfService": {
    en: "Terms of Service",
    es: "Términos de Servicio",
  },
  "footer.privacyPolicy": {
    en: "Privacy Policy",
    es: "Política de Privacidad",
  },
  "footer.contact": { en: "Contact", es: "Contacto" },
  "footer.copyright": {
    en: "© 2024 The Ready Lab. All rights reserved.",
    es: "© 2024 The Ready Lab. Todos los derechos reservados.",
  },

  // Settings
  "settings.title": { en: "Settings", es: "Configuración" },
  "settings.profile": { en: "Profile", es: "Perfil" },
  "settings.security": { en: "Security", es: "Seguridad" },
  "settings.billing": { en: "Billing", es: "Facturación" },
  "settings.data": { en: "Data", es: "Datos" },
  "settings.language": { en: "Language", es: "Idioma" },
  "settings.languageDesc": {
    en: "Choose your preferred language",
    es: "Elige tu idioma preferido",
  },
  "settings.notifications": { en: "Notifications", es: "Notificaciones" },
  "settings.save": { en: "Save Changes", es: "Guardar Cambios" },
  "settings.cancel": { en: "Cancel", es: "Cancelar" },

  // Common
  "common.loading": { en: "Loading...", es: "Cargando..." },
  "common.error": { en: "Error", es: "Error" },
  "common.success": { en: "Success", es: "Éxito" },
  "common.english": { en: "English", es: "Inglés" },
  "common.spanish": { en: "Spanish", es: "Español" },
};

interface LanguageContextType {
  language: "en" | "es";
  setLanguage: (lang: "en" | "es") => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<"en" | "es">("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "en" | "es";
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: "en" | "es") => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
