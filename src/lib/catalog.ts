export type ProductStatus = "ACTIVE" | "INACTIVE" | "REQUEST_ONLY" | "COMING_SOON";
export type CategoryStatus = "ACTIVE" | "REQUEST_ONLY" | "COMING_SOON" | "HIDDEN";

export type LaunchProductVariant = {
  id: string;
  name: string;
  slug: string;
  brand?: string;
  model?: string;
  processor?: string;
  ram?: string;
  storage?: string;
  operatingSystem?: string;
  screenSize?: string;
  condition?: string;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  availableQty: number;
};

export type LaunchProduct = {
  id: string;
  categorySlug: string;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  status: ProductStatus;
  rentable: boolean;
  sellable: boolean;
  image: string;
  imageAlt: string;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  availableQty: number;
  variants: LaunchProductVariant[];
  specs: {
    brand: string;
    model: string;
    processor: string;
    ram: string;
    storage: string;
    operatingSystem?: string;
    screenSize: string;
    condition: string;
  };
  seoTitle: string;
  seoDescription: string;
};

export type LaunchCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  seoTitle: string;
  seoDescription: string;
};

export type SeoLandingPage = {
  slug: string;
  title: string;
  eyebrow: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  links: Array<{
    href: string;
    label: string;
  }>;
};

export const launchCategories: LaunchCategory[] = [
  {
    id: "cat_laptops",
    name: "Laptops",
    slug: "laptops",
    description:
      "Business-ready Dell Latitude laptops for training, exams, events, field teams, and temporary staff.",
    status: "ACTIVE",
    seoTitle: "Laptop Rental in Nigeria | ITShop Equipment Leasing",
    seoDescription:
      "Rent verified Dell Latitude laptops in Nigeria with flexible daily pricing, delivery support, and bulk rental options."
  },
  {
    id: "cat_projectors",
    name: "Projectors",
    slug: "projectors",
    description: "Projectors for meetings, classes, and events. Available by request.",
    status: "REQUEST_ONLY",
    seoTitle: "Projector Rental in Nigeria | ITShop Equipment Leasing",
    seoDescription: "Request projectors for business meetings, classrooms, events, and presentations."
  },
  {
    id: "cat_networking",
    name: "Networking",
    slug: "networking-devices",
    description: "Routers, switches, and Wi-Fi equipment for temporary deployments.",
    status: "REQUEST_ONLY",
    seoTitle: "Networking Equipment Rental in Nigeria | ITShop Equipment Leasing",
    seoDescription: "Request networking equipment for temporary offices, training rooms, and events."
  }
];

export const launchProducts: LaunchProduct[] = [
  {
    id: "prod_dell_i5_8gb",
    categorySlug: "laptops",
    name: "Dell Latitude Core i5, 8GB RAM, 256GB SSD",
    slug: "dell-latitude-core-i5-8gb-256gb",
    shortDesc: "Reliable daily-use laptop for training rooms, offices, and field teams.",
    description:
      "A dependable Dell Latitude laptop suitable for browser-based work, Microsoft Office, CBT practice, training classes, and temporary business teams.",
    status: "ACTIVE",
    rentable: true,
    sellable: false,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Dell-style business laptop on a desk ready for rental use",
    dailyRate: 5000,
    weeklyRate: 31500,
    monthlyRate: 120000,
    availableQty: 24,
    variants: [
      {
        id: "var_dell_i5_8gb",
        name: "Dell Latitude Core i5, 8GB RAM, 256GB SSD",
        slug: "dell-latitude-core-i5-8gb-256gb",
        brand: "Dell",
        model: "Latitude",
        processor: "Intel Core i5",
        ram: "8GB",
        storage: "256GB SSD",
        operatingSystem: "Windows 10/11 Pro",
        screenSize: "14 inches",
        condition: "Verified business-grade",
        dailyRate: 5000,
        weeklyRate: 31500,
        monthlyRate: 120000,
        availableQty: 24
      }
    ],
    specs: {
      brand: "Dell",
      model: "Latitude",
      processor: "Intel Core i5",
      ram: "8GB",
      storage: "256GB SSD",
      operatingSystem: "Windows 10/11 Pro",
      screenSize: "14 inches",
      condition: "Verified business-grade"
    },
    seoTitle: "Dell Latitude Core i5 8GB Laptop Rental in Nigeria",
    seoDescription:
      "Rent Dell Latitude Core i5 laptops with 8GB RAM and 256GB SSD for training, office, and temporary business use in Nigeria."
  },
  {
    id: "prod_dell_i5_16gb",
    categorySlug: "laptops",
    name: "Dell Latitude Core i5, 16GB RAM, 256GB SSD",
    slug: "dell-latitude-core-i5-16gb-256gb",
    shortDesc: "Extra memory for heavier browsing, office tools, and productivity workflows.",
    description:
      "A stronger Core i5 rental laptop with 16GB RAM for teams that need smoother multitasking, training software, browser tabs, and admin tools.",
    status: "ACTIVE",
    rentable: true,
    sellable: false,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Open laptop with productivity software on a clean desk",
    dailyRate: 7500,
    weeklyRate: 47250,
    monthlyRate: 180000,
    availableQty: 18,
    variants: [
      {
        id: "var_dell_i5_16gb",
        name: "Dell Latitude Core i5, 16GB RAM, 256GB SSD",
        slug: "dell-latitude-core-i5-16gb-256gb",
        brand: "Dell",
        model: "Latitude",
        processor: "Intel Core i5",
        ram: "16GB",
        storage: "256GB SSD",
        operatingSystem: "Windows 11 Pro",
        screenSize: "14 inches",
        condition: "Verified business-grade",
        dailyRate: 7500,
        weeklyRate: 47250,
        monthlyRate: 180000,
        availableQty: 18
      }
    ],
    specs: {
      brand: "Dell",
      model: "Latitude",
      processor: "Intel Core i5",
      ram: "16GB",
      storage: "256GB SSD",
      operatingSystem: "Windows 11 Pro",
      screenSize: "14 inches",
      condition: "Verified business-grade"
    },
    seoTitle: "Dell Latitude Core i5 16GB Laptop Rental in Nigeria",
    seoDescription:
      "Rent Dell Latitude Core i5 laptops with 16GB RAM, 256GB SSD, and Windows 11 Pro for business and training in Nigeria."
  },
  {
    id: "prod_dell_i7_16gb",
    categorySlug: "laptops",
    name: "Dell Latitude Core i7, 16GB RAM, 512GB SSD",
    slug: "dell-latitude-core-i7-16gb-512gb",
    shortDesc: "Higher-performance laptop for demanding teams, labs, and technical sessions.",
    description:
      "A performance-focused Dell Latitude rental laptop for technical training, analytics sessions, advanced office tasks, and teams needing more processing headroom.",
    status: "ACTIVE",
    rentable: true,
    sellable: false,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "High performance laptop workstation used for technical work",
    dailyRate: 10000,
    weeklyRate: 63000,
    monthlyRate: 240000,
    availableQty: 12,
    variants: [
      {
        id: "var_dell_i7_16gb",
        name: "Dell Latitude Core i7, 16GB RAM, 512GB SSD",
        slug: "dell-latitude-core-i7-16gb-512gb",
        brand: "Dell",
        model: "Latitude",
        processor: "Intel Core i7",
        ram: "16GB",
        storage: "512GB SSD",
        operatingSystem: "Windows 11 Pro",
        screenSize: "14/15 inches",
        condition: "Verified business-grade",
        dailyRate: 10000,
        weeklyRate: 63000,
        monthlyRate: 240000,
        availableQty: 12
      }
    ],
    specs: {
      brand: "Dell",
      model: "Latitude",
      processor: "Intel Core i7",
      ram: "16GB",
      storage: "512GB SSD",
      operatingSystem: "Windows 11 Pro",
      screenSize: "14/15 inches",
      condition: "Verified business-grade"
    },
    seoTitle: "Dell Latitude Core i7 Laptop Rental in Nigeria",
    seoDescription:
      "Rent Dell Latitude Core i7 laptops with 16GB RAM and 512GB SSD for technical training, business teams, and events."
  },
  {
    id: "prod_special_spec",
    categorySlug: "laptops",
    name: "Special Laptop Specification Request",
    slug: "special-laptop-specification-request",
    shortDesc: "Request custom processors, RAM, storage, operating systems, and quantities.",
    description:
      "Use this option when your project needs MacBooks, workstations, unusual software requirements, large quantities, or custom billing terms.",
    status: "REQUEST_ONLY",
    rentable: true,
    sellable: false,
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Multiple laptops arranged for a custom equipment rental request",
    dailyRate: 0,
    availableQty: 0,
    variants: [
      {
        id: "var_special_spec",
        name: "Special Laptop Specification Request",
        slug: "special-laptop-specification-request",
        brand: "Custom",
        model: "By request",
        processor: "Custom",
        ram: "Custom",
        storage: "Custom",
        operatingSystem: "Windows, macOS, or Linux by request",
        screenSize: "Custom",
        condition: "Subject to availability",
        dailyRate: 0,
        availableQty: 0
      }
    ],
    specs: {
      brand: "Custom",
      model: "By request",
      processor: "Custom",
      ram: "Custom",
      storage: "Custom",
      operatingSystem: "Windows, macOS, or Linux by request",
      screenSize: "Custom",
      condition: "Subject to availability"
    },
    seoTitle: "Special Laptop Rental Specification Request in Nigeria",
    seoDescription:
      "Request custom laptop rental specifications, bulk quantities, operating systems, and project requirements from ITShop Equipment Leasing."
  }
];

export const staticSeoRoutes = [
  "/",
  "/equipment",
  "/equipment/laptops",
  "/laptop-rental-lagos",
  "/laptop-rental-for-training",
  "/bulk-laptop-rental",
  "/laptop-rental-for-cbt-exams",
  "/laptop-rental-price",
  "/it-equipment-rental-nigeria",
  "/how-it-works",
  "/faq",
  "/rental-agreement",
  "/delivery-return-policy",
  "/contact"
];

export const seoLandingPages: Record<string, SeoLandingPage> = {
  "laptop-rental-lagos": {
    slug: "laptop-rental-lagos",
    title: "Laptop Rental Lagos",
    eyebrow: "Lagos delivery and bulk support",
    h1: "Laptop rental in Lagos for teams, schools, and events",
    metaTitle: "Laptop Rental in Lagos | Rent Dell Laptops from ITShop",
    metaDescription:
      "Rent Dell laptops in Lagos for training, exams, offices, field teams, and events. Daily pricing, delivery support, and bulk rental options.",
    intro:
      "ITShop Equipment Leasing supplies verified business laptops for short-term and medium-term rental across Lagos. Choose standard laptop specs, request bulk quantities, and complete checkout without customer account creation.",
    primaryCta: "Rent a laptop",
    secondaryCta: "Request bulk rental",
    sections: [
      {
        title: "Built for Lagos operations",
        body:
          "Use the service for corporate training, temporary office setup, school programmes, event registration desks, and project teams that need reliable laptops without buying new assets."
      },
      {
        title: "Clear rental process",
        body:
          "Select a device, choose your dates, submit customer details, accept the rental agreement, then pay online or request bank transfer confirmation."
      }
    ],
    faqs: [
      {
        question: "Can you deliver laptops within Lagos?",
        answer:
          "Delivery support is available and the final delivery fee or deposit requirement is confirmed by the admin team after order review."
      },
      {
        question: "What is the minimum laptop rental period?",
        answer:
          "One laptop has a 7-day minimum. Bulk rentals of 10 laptops or more can be reviewed from 2 days upward."
      }
    ],
    links: [
      { href: "/equipment/laptops", label: "View laptop rental products" },
      { href: "/bulk-laptop-rental", label: "Bulk laptop rental" },
      { href: "/laptop-rental-price", label: "Laptop rental prices" }
    ]
  },
  "laptop-rental-for-training": {
    slug: "laptop-rental-for-training",
    title: "Laptop Rental for Training",
    eyebrow: "Training centres and corporate classes",
    h1: "Laptop rental for training in Nigeria",
    metaTitle: "Laptop Rental for Training in Nigeria | ITShop",
    metaDescription:
      "Rent laptops for corporate training, bootcamps, school programmes, NGO workshops, and short courses in Nigeria.",
    intro:
      "Equip training rooms quickly with verified laptops, consistent specifications, and rental periods matched to your programme schedule.",
    primaryCta: "Choose training laptops",
    secondaryCta: "Send training request",
    sections: [
      {
        title: "Consistent device specs",
        body:
          "Core i5 and Core i7 Dell Latitude options help you keep class participants on similar hardware for smoother facilitation."
      },
      {
        title: "Suitable for recurring programmes",
        body:
          "The system supports repeatable rental records, document review, order notes, and admin-managed delivery and return tracking."
      }
    ],
    faqs: [
      {
        question: "Can I rent laptops for a weekend training?",
        answer:
          "Bulk training rentals of 10 laptops or more can qualify for a shorter minimum rental period, subject to admin review."
      },
      {
        question: "Do you support training centres outside Lagos?",
        answer:
          "The platform is built for Lagos and major Nigerian cities. Delivery terms are confirmed per order."
      }
    ],
    links: [
      { href: "/equipment/laptops", label: "Laptop catalogue" },
      { href: "/solutions/training-centres", label: "Training centre solutions" },
      { href: "/how-it-works", label: "How rental works" }
    ]
  },
  "bulk-laptop-rental": {
    slug: "bulk-laptop-rental",
    title: "Bulk Laptop Rental",
    eyebrow: "10+ laptops and custom terms",
    h1: "Bulk laptop rental in Nigeria",
    metaTitle: "Bulk Laptop Rental in Nigeria | ITShop Equipment Leasing",
    metaDescription:
      "Rent 10 or more laptops for training, exams, onboarding, events, and temporary teams with ITShop Equipment Leasing.",
    intro:
      "For teams that need 10 or more laptops, ITShop can review quantity, duration, logistics, security deposit, and custom support requirements.",
    primaryCta: "Request bulk rental",
    secondaryCta: "View laptop prices",
    sections: [
      {
        title: "Bulk-ready rental rules",
        body:
          "Bulk orders can use a shorter minimum rental window and admin-adjusted discounts, subject to availability and project risk."
      },
      {
        title: "Admin-reviewed fulfilment",
        body:
          "Every bulk order is reviewed for inventory availability, delivery plan, documents, payment status, and return handling."
      }
    ],
    faqs: [
      {
        question: "What counts as bulk laptop rental?",
        answer: "The initial bulk threshold is 10 laptops or more."
      },
      {
        question: "Can I request mixed specifications?",
        answer:
          "Yes. Use the special request flow for mixed RAM, storage, processor, operating system, and software needs."
      }
    ],
    links: [
      { href: "/laptop-rental-for-training", label: "Training laptop rental" },
      { href: "/laptop-rental-for-cbt-exams", label: "CBT exam laptop rental" },
      { href: "/contact", label: "Contact ITShop" }
    ]
  },
  "laptop-rental-for-cbt-exams": {
    slug: "laptop-rental-for-cbt-exams",
    title: "Laptop Rental for CBT Exams",
    eyebrow: "Exam centres and assessment teams",
    h1: "Laptop rental for CBT exams in Nigeria",
    metaTitle: "Laptop Rental for CBT Exams in Nigeria | ITShop",
    metaDescription:
      "Rent laptops for CBT exams, assessments, registration desks, and temporary testing centres in Nigeria.",
    intro:
      "Support assessments with verified laptops, predictable specifications, and an order process that records quantities, dates, location, and admin review notes.",
    primaryCta: "Request CBT laptops",
    secondaryCta: "View laptop catalogue",
    sections: [
      {
        title: "Exam-period rentals",
        body:
          "Bulk CBT rentals can be reviewed for short exam windows while keeping document checks, payment status, and device return steps traceable."
      },
      {
        title: "Specification clarity",
        body:
          "Core i5 and Core i7 options help match browser-based testing, assessment portals, and exam support tools."
      }
    ],
    faqs: [
      {
        question: "Can the laptops be prepared for exam software?",
        answer:
          "Software and configuration requests should be submitted through the special request form for admin review."
      },
      {
        question: "Can you handle large CBT quantities?",
        answer:
          "The platform captures bulk demand and routes it to admin for inventory, delivery, and risk review."
      }
    ],
    links: [
      { href: "/bulk-laptop-rental", label: "Bulk laptop rental" },
      { href: "/equipment/laptops", label: "Available laptop specs" },
      { href: "/faq", label: "Rental FAQs" }
    ]
  },
  "laptop-rental-price": {
    slug: "laptop-rental-price",
    title: "Laptop Rental Price",
    eyebrow: "Transparent starting rates",
    h1: "Laptop rental price in Nigeria",
    metaTitle: "Laptop Rental Price in Nigeria | ITShop",
    metaDescription:
      "Compare laptop rental prices in Nigeria. Dell Latitude Core i5 starts from ₦5,000 daily and Core i7 starts from ₦10,000 daily.",
    intro:
      "Use the public catalogue and calculator to estimate rental totals. Security deposit and final delivery costs are reviewed separately by admin.",
    primaryCta: "Calculate rental cost",
    secondaryCta: "Request custom pricing",
    sections: [
      {
        title: "What affects the total?",
        body:
          "The total uses daily rate, quantity, rental days, discount, and estimated delivery fee. Security deposit is not included in checkout by default."
      },
      {
        title: "Standard launch rates",
        body:
          "Core i5 8GB starts at ₦5,000 daily, Core i5 16GB at ₦7,500 daily, and Core i7 16GB at ₦10,000 daily."
      }
    ],
    faqs: [
      {
        question: "Is the security deposit included?",
        answer: "No. The admin team calculates and communicates deposit requirements separately."
      },
      {
        question: "Can bulk orders get a discount?",
        answer: "Bulk discounts can apply from 10 laptops upward and are reviewed by admin."
      }
    ],
    links: [
      { href: "/equipment/laptops", label: "Laptop products" },
      { href: "/bulk-laptop-rental", label: "Bulk rental" },
      { href: "/rental-agreement", label: "Rental agreement" }
    ]
  },
  "it-equipment-rental-nigeria": {
    slug: "it-equipment-rental-nigeria",
    title: "IT Equipment Rental Nigeria",
    eyebrow: "Laptops first, broader IT equipment next",
    h1: "IT equipment rental in Nigeria",
    metaTitle: "IT Equipment Rental in Nigeria | ITShop Equipment Leasing",
    metaDescription:
      "Rent laptops and request other IT equipment including projectors, networking devices, monitors, printers, UPS units, and accessories.",
    intro:
      "ITShop Equipment Leasing starts with laptop rental and is structured to support wider equipment categories for organisations across Nigeria.",
    primaryCta: "Browse equipment",
    secondaryCta: "Request equipment",
    sections: [
      {
        title: "Built beyond laptops",
        body:
          "The catalogue supports request-only categories so customers can ask for projectors, monitors, networking devices, tablets, UPS devices, and accessories."
      },
      {
        title: "Operational controls",
        body:
          "The backend tracks products, variants, inventory status, orders, documents, payments, delivery, returns, and admin audit logs."
      }
    ],
    faqs: [
      {
        question: "Can I request equipment that is not listed?",
        answer: "Yes. Use the contact or special request form and admin will review availability."
      },
      {
        question: "Are customer accounts required?",
        answer: "No. Phase one uses guest checkout with backend customer profile creation."
      }
    ],
    links: [
      { href: "/equipment", label: "Equipment categories" },
      { href: "/equipment/laptops", label: "Laptop rental" },
      { href: "/contact", label: "Contact team" }
    ]
  }
};

export const solutionPages = {
  businesses: {
    title: "Laptop rental for businesses",
    body:
      "Equip temporary staff, project teams, onboarding classes, and branch activations without buying hardware."
  },
  "training-centres": {
    title: "Laptop rental for training centres",
    body:
      "Prepare classrooms with consistent Dell Latitude devices for bootcamps, corporate training, and certification programmes."
  },
  schools: {
    title: "Laptop rental for schools",
    body:
      "Support short-term school programmes, assessments, computer-based lessons, and temporary labs."
  },
  events: {
    title: "Laptop rental for events",
    body:
      "Rent laptops for registration desks, media teams, event operations, check-in stations, and exhibitor support."
  },
  ngos: {
    title: "Laptop rental for NGOs",
    body:
      "Support field projects, data collection, workshops, training, and temporary office operations."
  }
};

export const locationPages = {
  lagos: {
    title: "Laptop rental in Lagos",
    body:
      "Rent laptops for Lagos offices, schools, training centres, exam centres, events, and temporary teams."
  },
  abuja: {
    title: "Laptop rental in Abuja",
    body:
      "Request laptop rental support for Abuja teams, programmes, and business projects."
  },
  "port-harcourt": {
    title: "Laptop rental in Port Harcourt",
    body:
      "Request verified laptops for temporary teams, training, and events in Port Harcourt."
  }
};

export const guideArticles = [
  {
    slug: "how-to-rent-laptops-for-training-in-nigeria",
    title: "How to rent laptops for training in Nigeria",
    excerpt:
      "Plan laptop quantities, specifications, rental dates, documents, payment, delivery, and returns for a smooth training programme."
  },
  {
    slug: "bulk-laptop-rental-checklist",
    title: "Bulk laptop rental checklist",
    excerpt:
      "A practical checklist for teams renting 10 or more laptops for exams, training, and events."
  }
];

export function getActiveProducts() {
  return launchProducts.filter((product) => product.status === "ACTIVE");
}

export function getProductBySlug(slug: string) {
  return launchProducts.find((product) => product.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return launchCategories.find((category) => category.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return launchProducts.filter((product) => product.categorySlug === categorySlug);
}
