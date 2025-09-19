# WUKSY UI & Branding Guide

## Brand Identity & Philosophy

### Brand Name
**WUKSY** - AI-Powered Personalized Wellness Platform

### Brand Mission
"Transform your blood test confusion into a personalized wellness roadmap in minutes, not months."

### Brand Personality
- **Zen-inspired**: Calm, peaceful, mindful approach to health
- **Caring & Supportive**: Gentle guidance without overwhelming complexity
- **Science-based**: Trustworthy, evidence-driven insights
- **Accessible**: Simple, clear, and user-friendly

### Brand Voice & Tone
- **Gentle and reassuring**: "Find peace in your health journey"
- **Mindful language**: "Body's wisdom", "thoughtful recommendations", "caring support"
- **Non-overwhelming**: Avoids medical jargon, focuses on clarity
- **Encouraging**: "Begin your journey", "stories of tranquility"

---

## Color Palette

### Primary Colors
```css
primary: {
  50: '#f6f8f6',   /* Very light sage */
  100: '#e8f0e8',  /* Light sage background */
  200: '#d3e4d3',  /* Soft sage */
  300: '#b3d1b3',  /* Medium sage */
  400: '#8bb88b',  /* Sage accent */
  500: '#6b9d6b',  /* Main sage green - primary brand color */
  600: '#5a8a5a',  /* Darker sage */
  700: '#4a724a',  /* Deep sage */
  800: '#3d5d3d',  /* Very deep sage */
  900: '#334d33',  /* Darkest sage */
}
```

### Secondary Colors
```css
secondary: {
  50: '#fafafa',   /* Pure white backgrounds */
  100: '#f5f5f5',  /* Very light gray */
  200: '#eeeeee',  /* Light gray */
  300: '#e0e0e0',  /* Medium light gray */
  400: '#bdbdbd',  /* Medium gray */
  500: '#9e9e9e',  /* Warm gray - secondary accent */
  600: '#757575',  /* Dark gray */
  700: '#616161',  /* Darker gray */
  800: '#424242',  /* Very dark gray */
  900: '#212121',  /* Almost black */
}
```

### Neutral Colors
```css
neutral: {
  50: '#fafafa',   /* Background color */
  100: '#f7f7f7',  /* Light background */
  200: '#f0f0f0',  /* Subtle borders */
  300: '#e8e8e8',  /* Light borders */
  400: '#d1d1d1',  /* Medium borders */
  500: '#a3a3a3',  /* Text secondary */
  600: '#737373',  /* Text muted */
  700: '#525252',  /* Text dark */
  800: '#404040',  /* Primary text color */
  900: '#262626',  /* Darkest text */
}
```

### Accent Colors
```css
sage: {
  50: '#f6f8f6',   /* Light sage backgrounds */
  500: '#6b9d6b',  /* Sage accent */
  600: '#5a8a5a',  /* Darker sage accent */
}

stone: {
  50: '#fafaf9',   /* Warm white */
  100: '#f5f5f4',  /* Warm light gray */
  500: '#78716c',  /* Warm medium gray */
  600: '#57534e',  /* Warm dark gray */
}
```

### Health Status Colors
```css
/* Health Score Categories */
.health-score-poor { @apply bg-red-50 text-red-700 border-red-100; }
.health-score-fair { @apply bg-amber-50 text-amber-700 border-amber-100; }
.health-score-good { @apply bg-primary-50 text-primary-700 border-primary-100; }
.health-score-excellent { @apply bg-emerald-50 text-emerald-700 border-emerald-100; }

/* Biomarker Status Colors */
.biomarker-status-deficient { @apply bg-red-50 text-red-700; }
.biomarker-status-suboptimal { @apply bg-amber-50 text-amber-700; }
.biomarker-status-optimal { @apply bg-primary-50 text-primary-700; }
.biomarker-status-excess { @apply bg-orange-50 text-orange-700; }
.biomarker-status-concerning { @apply bg-red-50 text-red-700; }
```

---

## Typography

### Primary Font
**Inter** - Clean, modern, highly readable sans-serif font
```css
font-family: 'Inter', system-ui, sans-serif;
```

### Font Weights
- **Light (300)**: Large headings, hero text
- **Regular (400)**: Body text, descriptions
- **Medium (500)**: Subheadings, emphasized text
- **Semi-bold (600)**: Button text, important labels

### Typography Scale
```css
/* Hero Headings */
.text-4xl md:text-6xl font-light  /* 36px/64px, light weight */

/* Section Headings */
.text-3xl md:text-4xl font-light  /* 30px/36px, light weight */

/* Card Headings */
.text-xl font-medium             /* 20px, medium weight */

/* Body Text */
.text-lg md:text-xl              /* 18px/20px for hero descriptions */
.text-base                       /* 16px for regular body text */
.text-sm                         /* 14px for small text, labels */
.text-xs                         /* 12px for tiny text, badges */
```

### Typography Classes
```css
/* Zen-inspired text styling */
.zen-text {
  @apply text-primary-600;
}

/* Zen gradient backgrounds */
.zen-gradient {
  @apply bg-gradient-to-br from-primary-50 to-stone-50;
}
```

---

## Layout & Spacing

### Container Widths
```css
.max-w-4xl    /* Hero sections, centered content */
.max-w-5xl    /* Feature sections */
.max-w-6xl    /* Dashboard, main app layout */
.max-w-7xl    /* Footer, full-width sections */
```

### Padding & Margins
```css
/* Section Padding */
py-20         /* Large sections (80px vertical) */
py-12         /* Medium sections (48px vertical) */
py-8          /* Small sections (32px vertical) */

/* Container Padding */
px-4 sm:px-6 lg:px-8  /* Responsive horizontal padding */

/* Component Spacing */
space-y-8     /* Large vertical spacing between elements */
space-y-6     /* Medium vertical spacing */
space-y-4     /* Small vertical spacing */
gap-6         /* Grid gaps */
gap-8         /* Larger grid gaps */
```

### Grid Systems
```css
/* Main Layout Grids */
.grid.grid-cols-1.lg:grid-cols-3    /* Dashboard layout */
.grid.grid-cols-1.md:grid-cols-3    /* Feature cards */
.grid.grid-cols-2.md:grid-cols-4    /* Stats grid */

/* Responsive Breakpoints */
sm: 640px     /* Small screens */
md: 768px     /* Medium screens */
lg: 1024px    /* Large screens */
xl: 1280px    /* Extra large screens */
```

---

## Components

### Buttons

#### Primary Button
```tsx
<Button variant="primary" size="lg">
  Begin Your Journey
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>
```

**Styling:**
- Background: `bg-primary-500` (sage green)
- Text: `text-white`
- Hover: `hover:bg-primary-600`
- Shadow: `shadow-sm hover:shadow-md`
- Rounded: `rounded-lg`
- Transition: `transition-all duration-300`

#### Button Variants
```css
/* Primary */
bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md

/* Secondary */
bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200

/* Outline */
border border-primary-300 text-primary-600 hover:bg-primary-50 hover:border-primary-400

/* Ghost */
text-primary-600 hover:bg-primary-50 hover:text-primary-700
```

#### Button Sizes
```css
sm: px-4 py-2 text-sm      /* Small buttons */
md: px-6 py-2.5 text-sm    /* Default buttons */
lg: px-8 py-3 text-base    /* Large buttons */
```

### Cards

#### Basic Card
```tsx
<Card className="p-6 shadow-sm">
  {/* Card content */}
</Card>
```

**Styling:**
- Background: `bg-white`
- Border: `border border-neutral-200`
- Rounded: `rounded-xl`
- Transition: `transition-all duration-300`

#### Card Variants
```css
/* Padding Options */
padding="none": ''
padding="sm": 'p-4'
padding="md": 'p-6'    /* Default */
padding="lg": 'p-8'

/* Shadow Options */
shadow="none": ''
shadow="sm": 'shadow-sm'    /* Default */
shadow="md": 'shadow-md'
```

#### Interactive Cards
```css
.card-hover {
  @apply transition-all duration-300 hover:shadow-sm hover:translate-y-0;
}
```

### Input Fields

#### Basic Input
```tsx
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  helperText="We'll never share your email"
/>
```

**Styling:**
- Height: `h-12`
- Border: `border border-neutral-300`
- Focus: `focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20`
- Rounded: `rounded-lg`
- Padding: `px-4 py-2`

---

## Icons & Imagery

### Icon Library
**Lucide React** - Consistent, minimal line icons

#### Primary Icons
```tsx
import { 
  Leaf,        // Brand icon, nature/wellness
  Heart,       // Health, care, wellness
  Upload,      // File upload actions
  Sparkles,    // AI, magic, insights
  ArrowRight,  // Navigation, CTAs
  Shield,      // Security, trust
  Clock,       // Time, efficiency
  BookOpen,    // Learning, education
  Activity,    // Health metrics
  TrendingUp,  // Progress, improvement
} from 'lucide-react'
```

#### Icon Styling
```css
/* Small icons */
h-4 w-4       /* 16px - for buttons, inline elements */

/* Medium icons */
h-5 w-5       /* 20px - for navigation, cards */

/* Large icons */
h-6 w-6       /* 24px - for features, headers */

/* Extra large icons */
h-8 w-8       /* 32px - for hero sections, empty states */
```

### Icon Colors
```css
text-primary-500     /* Sage green for primary actions */
text-primary-600     /* Darker sage for emphasis */
text-neutral-400     /* Light gray for secondary icons */
text-neutral-600     /* Medium gray for inactive states */
text-stone-600       /* Warm gray for secondary actions */
```

---

## Animations & Transitions

### Motion Library
**Framer Motion** for smooth, performance-optimized animations

#### Common Animations
```tsx
// Fade in from bottom
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}

// Staggered animations
transition={{ duration: 0.8, delay: 0.1 * index }}
```

### CSS Animations
```css
/* Calm, zen-inspired animations */
@keyframes shimmer-calm {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.animate-shimmer-calm {
  animation: shimmer-calm 3s infinite linear;
}

/* Custom animation utilities */
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-400 { animation-delay: 0.4s; }
.animation-delay-600 { animation-delay: 0.6s; }
```

### Transition Classes
```css
transition-all duration-300        /* Smooth all-property transitions */
transition-colors duration-200     /* Color transitions */
hover:translate-y-0               /* Subtle hover lift */
hover:shadow-md                   /* Shadow on hover */
```

---

## Scrollbars & UI Details

### Custom Scrollbar
```css
/* Zen-inspired minimal scrollbar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f7f7f7;
}

::-webkit-scrollbar-thumb {
  background: #d1d1d1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a3a3a3;
}
```

---

## Layout Patterns

### Hero Section
```tsx
<section className="relative py-24 md:py-32">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <motion.div className="space-y-8">
      <h1 className="text-4xl md:text-6xl font-light text-neutral-800 leading-tight">
        Find Peace in Your
        <span className="block zen-text font-medium">Health Journey</span>
      </h1>
      <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
        Transform confusion into clarity with mindful, AI-powered insights 
        that help you understand your body's wisdom.
      </p>
    </motion.div>
  </div>
</section>
```

### Feature Cards Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
  {features.map((feature, index) => (
    <motion.div
      key={feature.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
      className="text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="bg-primary-50 p-4 rounded-full">
          <feature.icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
      <h3 className="text-xl font-medium text-neutral-800 mb-3">
        {feature.title}
      </h3>
      <p className="text-neutral-600 leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  ))}
</div>
```

### Dashboard Stats Grid
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  <div className="text-center">
    <div className="text-2xl font-light zen-text mb-2">
      {stats?.averageScore || 0}
    </div>
    <div className="text-sm text-neutral-600">Wellness Score</div>
  </div>
  {/* More stats... */}
</div>
```

---

## Header & Navigation

### Header Structure
```tsx
<header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200/50 sticky top-0 z-50">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-3">
        <div className="bg-primary-500/10 p-2 rounded-full">
          <Leaf className="h-5 w-5 text-primary-600" />
        </div>
        <span className="text-xl font-medium text-neutral-800">
          WUKSY
        </span>
      </Link>
      {/* Navigation & Actions */}
    </div>
  </div>
</header>
```

### Navigation Links
```css
text-neutral-600 hover:text-primary-600 transition-colors text-sm
```

---

## Footer

### Footer Structure
```tsx
<footer className="bg-neutral-900 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Brand, Product, Resources, Legal */}
    </div>
    <div className="border-t border-neutral-700 mt-12 pt-8 text-center">
      {/* Medical disclaimer and copyright */}
    </div>
  </div>
</footer>
```

---

## Content Guidelines

### Writing Style
- **Gentle and reassuring**: Use calming language
- **Clear and simple**: Avoid medical jargon
- **Empowering**: Focus on user's journey and growth
- **Mindful**: Incorporate zen-like wisdom and patience

### Key Phrases
- "Find peace in your health journey"
- "Transform confusion into clarity"
- "Your body's wisdom"
- "Mindful, AI-powered insights"
- "Thoughtful recommendations"
- "Caring support"
- "Begin your journey"
- "Stories of tranquility"

### Medical Disclaimer
Always include appropriate medical disclaimers:
> "WUKSY provides educational information only and is not intended to diagnose, treat, cure, or prevent any disease. Always consult with qualified healthcare professionals before making health decisions."

---

## Responsive Design

### Breakpoint Strategy
```css
/* Mobile First Approach */
/* Base styles: Mobile (320px+) */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Responsive Patterns
```css
/* Typography */
text-4xl md:text-6xl        /* Scale up headings */
text-lg md:text-xl          /* Scale up body text */

/* Layout */
grid-cols-1 md:grid-cols-3  /* Stack on mobile, grid on desktop */
flex-col sm:flex-row        /* Stack on mobile, row on larger */

/* Spacing */
py-24 md:py-32             /* Increase section padding */
px-4 sm:px-6 lg:px-8       /* Responsive container padding */

/* Navigation */
hidden md:flex             /* Hide on mobile, show on desktop */
md:hidden                  /* Show on mobile, hide on desktop */
```

---

## Accessibility

### Color Contrast
- Ensure all text meets WCAG 2.1 AA standards
- Primary text: `#404040` on white backgrounds
- Secondary text: `#737373` on white backgrounds

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2
```

### Semantic HTML
- Use proper heading hierarchy (h1, h2, h3)
- Include alt text for all images
- Use semantic elements (nav, main, section, article)
- Ensure keyboard navigation works properly

---

## Implementation Notes

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

### File Structure
```
src/
  app/
    globals.css           # Global styles and custom classes
    layout.tsx           # Root layout with header/footer
  components/
    ui/
      Button.tsx         # Reusable button component
      Card.tsx          # Reusable card component
      Input.tsx         # Reusable input component
    layout/
      Header.tsx        # Site header
      Footer.tsx        # Site footer
```

### Tailwind Configuration
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: { /* sage green palette */ },
      secondary: { /* warm gray palette */ },
      neutral: { /* neutral gray palette */ },
      sage: { /* sage accent colors */ },
      stone: { /* warm stone colors */ }
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    animation: {
      'fade-in': 'fadeIn 0.8s ease-out',
      'slide-up': 'slideUp 0.6s ease-out',
      'pulse-calm': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    }
  }
}
```

---

## Brand Assets

### Logo Usage
- Primary logo: Leaf icon + "WUKSY" wordmark
- Icon only: Use leaf icon in circular sage background
- Minimum size: 24px height for icon, 120px width for full logo
- Clear space: Minimum 16px around logo

### Brand Colors for External Use
- Primary Brand Color: `#6b9d6b` (Sage Green)
- Secondary Color: `#9e9e9e` (Warm Gray)
- Background Color: `#fafafa` (Neutral White)
- Text Color: `#404040` (Neutral Dark)

This comprehensive guide provides all the necessary information to maintain consistent branding and UI patterns across the WUKSY platform and any related projects.
