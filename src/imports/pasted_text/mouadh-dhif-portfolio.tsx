Build a highly slick, interactive, modern React + Motion UI portfolio landing page for "Mouadh Dhif", a Lead UI/UX Designer based in Helsinki, Finland.

### Visual Aesthetic & Theme:
- Theme: Modern Dark/Light Hybrid with Glassmorphic Card Accents, Vibrant Neon Blue (#0070F3), Cyan (#00C8FF), Accent Orange (#FF4D00), Soft White Background (#F8FAFC), and Charcoal Dark (#111827).
- Typography: Display Bold Sans-Serif (Montserrat) for headings, Ultra-clean Sans-Serif (Poppins) for body copy.
- Styling: Floating blur effects, rounded cards (16px), subtle border gradients, interactive custom cursor dot and ring trailing effect.

### Interactive Animations & Motion Specs (React / Motion):
1. Page Entrance: Staggered reveal animations (`motion.div` with initial opacity: 0, y: 30) for text, cards, and section titles.
2. Custom Cursor: Interactive trailing dot + expanded outer ring on hover over interactive elements.
3. Hover States: Cards elevate slightly on hover with subtle box-shadow glow and image scale-up (`scale: 1.03`).
4. Category Filter: Smooth layout spring transitions (`layout` prop in Motion) when toggling portfolio category buttons.
5. Interactive Skill Bars: Animated progress bars that fill up gracefully when scrolled into view.
6. Testimonials Carousel/Grid: Interactive slide-in or tabbed view with smooth fading transitions.

---

### Page Sections & Content Architecture:

#### 1. Sticky Glassmorphic Navbar:
- Logo: "MD." (Gradient text effect)
- Links: Home, About, Skills, Works, Experience, Testimonials, Contact
- CTA: "Hire Me" (Glowing gradient pill button with hover hover-lift animation)

#### 2. Hero Section (Dynamic Entrance):
- Left Side:
  - Sub-tag: "📍 Based in Finland • Working Worldwide"
  - Headline: "Crafting Digital Experiences That Matter"
  - Main Title: "Mouadh Dhif" (UI/UX Designer & Product Strategist)
  - CTA Buttons: Primary "View Works" (Gradient fill), Secondary "Get In Touch" (Glass border button).
  - Social Icons: LinkedIn, Behance, Dribbble, GitHub, Instagram with hover bounce animations.
- Right Side:
  - Glowing profile image frame with floating badges:
    - Top Floating Badge: "⚡ Available for Freelance"
    - Bottom Floating Badge: "⭐ 3+ Years Experience • 30+ Delivered Projects"

#### 3. About Me & Core Strengths:
- Bio: Narrative explaining Mouadh's user-centric design philosophy balancing pixel perfection, usability, and business outcomes.
- Personal Details Grid:
  - Full Name: Mouadh Dhif
  - Location: Helsinki, Finland
  - Email: dhif_mouadh@hotmail.fr
  - Phone: +358 44970 314 9
  - Status: Open for Global Projects & Remote Roles
- CTA: "Download Resume" button with icon transition.

#### 4. Interactive Skills & Proficiency Grid:
- Skill Bars with smooth animated width filling:
  - UI Design (95%), UX Research (90%), Wireframing & Information Architecture (95%), Interactive Prototyping (88%)
- Tool Stack Badges (Interactive cards with icons):
  - Figma (98%), Adobe XD (92%), Photoshop (85%), Illustrator (80%), Tailwind CSS, Motion React

#### 5. Portfolio Showcase (Filtered Interactive Grid):
- Filter Category Tabs: [All, Web Apps, Mobile Apps, Dashboards, Design Systems]
- 6 High-Impact Project Cards with interactive overlay popups:
  1. NextGen E-Commerce (Streamlined checkout flow and high-conversion UX)
  2. Pulse Fitness App (AI-driven workout & nutrition tracker)
  3. Apex FinTech Dashboard (Complex financial analytics simplified)
  4. Horizon Travel Guide (Immersive trip planning mobile UI)
  5. EduVerse Platform (Gamified online learning system)
  6. SmartHome OS (IoT device management UI & micro-interactions)

#### 6. Experience & Career Timeline:
- Vertical timeline with glowing line node markers:
  - 2021 – Present: Senior UI/UX Designer (Freelance Global) – UX research, design systems, and client delivery for fintech & SaaS.
  - 2018 – 2021: Product UI/UX Designer (Tech Solutions Inc.) – Led mobile app redesigns, conducted usability testing, and built reusable design tokens.
  - 2016 – 2018: Junior Digital Designer (Creative Agency) – Visual asset creation, responsive web layouts, and interactive wireframes.

#### 7. Fresh Client Reviews & Testimonials (Updated Reviewers):
- Review Card 1: 
  - Author: **Elena Rostova** (VP of Product at Veloce Fintech, Zurich)
  - Review: "Mouadh transformed our complex financial tools into a delightfully simple user experience. His UI designs directly increased our conversion rate by 34%."
  - Rating: 5/5 Stars ⭐⭐⭐⭐⭐
- Review Card 2:
  - Author: **Marcus Vance** (Founder & CEO at Pulse Health App, London)
  - Review: "Working with Mouadh was effortless. He delivers fast, listens carefully to business goals, and creates prototypes that leave stakeholders speechless."
  - Rating: 5/5 Stars ⭐⭐⭐⭐⭐
- Review Card 3:
  - Author: **Sofia Lindqvist** (Design Lead at Nordic Scaleup Lab, Helsinki)
  - Review: "Mouadh’s mastery of Figma, layout systems, and micro-interactions makes him one of the sharpest UI/UX designers I've collaborated with."
  - Rating: 5/5 Stars ⭐⭐⭐⭐⭐

#### 8. Contact & Project Inquiry Section:
- Left Side: Direct Info Cards
  - Phone: +358 44970 314 9
  - Email: dhif_mouadh@hotmail.fr
  - Location: Helsinki, Finland
  - Website: www.mouadhdhif.com
  - Social Links: LinkedIn, Behance, Figma Profile
- Right Side: Interactive Form Container
  - Form Fields: Name, Email, Project Category Dropdown, Budget Range, Message TextArea.
  - Animated Submit Button with active loading/sent state feedback.

#### 9. Footer:
- Minimalist dark footer with "MD." logo, quick smooth-scroll menu, copyright notice, and "Designed with Precision by Mouadh Dhif".