import { Check, X } from "lucide-react";

// ============================================================================
// TIER DEFINITIONS
// Derived from SubscriptionTierEnum in schema.base.ts
// ============================================================================

export type TierKey = "FREE" | "PRO" | "DEPARTMENT" | "ENTERPRISE" | "UNLIMITED";

export interface LicenseTier {
  key: TierKey;
  name: string;
  tagline: string;
  audience: string;
  price: string;
  priceSub: string;
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  features: string[];
}

export const LICENSE_TIERS: LicenseTier[] = [
  {
    key: "FREE",
    name: "Free",
    tagline: "Start exploring XR learning",
    audience: "Students & individual learners",
    price: "$0",
    priceSub: "forever",
    cta: "Get Started Free",
    ctaHref: "/register",
    highlighted: false,
    features: [
      "Play published XR modules",
      "1 personal seat (no member invites)",
      "Cannot host live interactive sessions",
      "No checkpoint customization",
    ],
  },
  {
    key: "PRO",
    name: "Educator",
    tagline: "Host and run your live classes",
    audience: "Solo teachers & educators",
    price: "Contact Us",
    priceSub: "per month",
    cta: "Contact Sales",
    ctaHref: "/contact",
    highlighted: false,
    features: [
      "Host 1 concurrent active session",
      "Up to 30 connections per session",
      "1 personal seat (no member invites)",
      "Standard checkpoint settings only",
    ],
  },
  {
    key: "DEPARTMENT",
    name: "Team",
    tagline: "For collaborative teaching groups",
    audience: "Departments & teaching teams",
    price: "Contact Us",
    priceSub: "per month",
    cta: "Contact Sales",
    ctaHref: "/contact",
    highlighted: true,
    features: [
      "Host up to 3 concurrent active sessions",
      "Up to 100 connections per session",
      "Up to 5 collaborative seats",
      "Toggle checkpoints on/off in staging",
      "Shared organization module library",
    ],
  },
  {
    key: "ENTERPRISE",
    name: "School",
    tagline: "Scale XR learning across your school",
    audience: "Schools, universities & institutions",
    price: "Custom",
    priceSub: "tailored billing",
    cta: "Contact Sales",
    ctaHref: "/contact",
    highlighted: false,
    features: [
      "Unlimited concurrent active sessions",
      "Up to 300 connections per session",
      "Up to 50 collaborative seats",
      "Toggle checkpoints on/off in staging",
      "Custom branding & SSO / SAML integration",
    ],
  },
];

// ============================================================================
// FEATURE COMPARISON TABLE
// ============================================================================

export interface ComparisonRow {
  feature: string;
  FREE: string | boolean;
  PRO: string | boolean;
  DEPARTMENT: string | boolean;
  ENTERPRISE: string | boolean;
  UNLIMITED: string | boolean;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Play XR Modules",
    FREE: true, PRO: true, DEPARTMENT: true, ENTERPRISE: true, UNLIMITED: true,
  },
  {
    feature: "Module Builder / Editor",
    FREE: false, PRO: true, DEPARTMENT: true, ENTERPRISE: true, UNLIMITED: true,
  },
  {
    feature: "Host Live Sessions",
    FREE: false, PRO: "Up to 30", DEPARTMENT: "Up to 150", ENTERPRISE: "Unlimited", UNLIMITED: "Unlimited",
  },
  {
    feature: "Team Seats",
    FREE: "1", PRO: "1", DEPARTMENT: "Up to 15", ENTERPRISE: "Unlimited", UNLIMITED: "Unlimited",
  },
  {
    feature: "Session Analytics",
    FREE: false, PRO: "Basic", DEPARTMENT: "Advanced", ENTERPRISE: "Full", UNLIMITED: "Full",
  },
  {
    feature: "AI Content Creation",
    FREE: false, PRO: true, DEPARTMENT: true, ENTERPRISE: true, UNLIMITED: true,
  },
  {
    feature: "Custom Branding",
    FREE: false, PRO: false, DEPARTMENT: false, ENTERPRISE: true, UNLIMITED: true,
  },
  {
    feature: "API Access",
    FREE: false, PRO: false, DEPARTMENT: false, ENTERPRISE: false, UNLIMITED: true,
  },
  {
    feature: "SLA & Uptime Guarantee",
    FREE: false, PRO: false, DEPARTMENT: false, ENTERPRISE: true, UNLIMITED: true,
  },
  {
    feature: "White-labeling",
    FREE: false, PRO: false, DEPARTMENT: false, ENTERPRISE: false, UNLIMITED: true,
  },
];

// ============================================================================
// FAQ
// ============================================================================

export const LICENSE_FAQ = [
  {
    question: "Can I upgrade or downgrade my plan at any time?",
    answer:
      "Yes. You can upgrade your organization's license at any time from the /me/license page inside your dashboard. Downgrades take effect at the end of the current billing period.",
  },
  {
    question: "What exactly is an XR module?",
    answer:
      "An XR (Extended Reality) module is an interactive, immersive 3D simulation — covering topics like cell biology, chemical reactions, or physics experiments — that learners explore in real time inside their browser. No headset required.",
  },
  {
    question: "What is a 'live session'?",
    answer:
      "A live session lets a teacher or host run an XR module in real time with multiple players simultaneously. Players can be students in a classroom or learners joining remotely. The host controls the pace and can push checkpoints and quizzes.",
  },
  {
    question: "Do you offer discounts for educational institutions?",
    answer:
      "Yes, we have special pricing for verified schools, universities, and non-profit educational organizations. Contact our sales team at the link below to learn more.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "Paid plans include a 14-day free trial with no credit card required. You can explore all features before committing.",
  },
];
