# NMG × Roodito Revision Portal

A comprehensive education revision portal designed for Kenyan students, supporting both CBC (Competency Based Curriculum) and 8-4-4 education systems.

## 🎯 Overview

The NMG × Roodito Revision Portal is a modern, responsive web application that provides students with access to curriculum-aligned quizzes, progress tracking, and achievement systems. Built with Next.js 15, TypeScript, and Tailwind CSS, it offers a seamless learning experience across all devices.

## Features

- **Dual Curriculum Support**: CBC and 8-4-4 education systems
- **Interactive Quizzes**: Subject-specific quizzes with real-time feedback
- **Progress Tracking**: Comprehensive achievement and progress monitoring
- **Search Functionality**: Advanced quiz search across subjects and grades
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Performance Optimized**: Fast loading with Next.js 15 and optimized images

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom Components
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Zod
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 8+ or pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/brooke2384/nmg
cd nmg-roodito-revision-portal
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Run the development server
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000] in your browser

## 📁 Project Structure

```
nmg-roodito-revision-portal/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── quiz/[id]/         # Quiz detail pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Header.tsx        # Navigation header
│   ├── Hero.tsx          # Hero section
│   └── ...               # Other components
├── lib/                  # Utility functions
│   ├── data-service.ts   # Data management
│   └── utils.ts          # Helper functions
├── hooks/                # Custom React hooks
├── public/               # Static assets
└── styles/               # Additional styles
```

## 🎨 Design System

The application uses a custom design system based on Nation Media Group's brand colors:

- **Primary**: `#11116b` (NMG Blue)
- **Secondary**: `#c0c0ff` (Light Blue)
- **Accent**: `#4d4cc1` (Purple)
- **Success**: `#14BF96` (Green)
- **Warning**: `#F59E0B` (Yellow)
- **Error**: `#DC2626` (Red)

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js recommended rules
- **Prettier**: Code formatting
- **Pre-commit hooks**: Automated code quality checks

##  Deployment

The application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Environment Variables

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for all metrics
- **Bundle Size**: Optimized with Next.js 15
- **Image Optimization**: Automatic WebP/AVIF conversion

## 🔒 Security

- **Security Headers**: X-Frame-Options, X-Content-Type-Options
- **Content Security Policy**: Configured for production
- **Input Validation**: Zod schema validation
- **Error Boundaries**: Graceful error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software developed by Nation Media Group × Roodito.
