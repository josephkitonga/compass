# NMG Quiz Revision Portal

A professional quiz revision portal for Kenyan students, integrating with the Roodito API to provide comprehensive educational content across CBC and 8-4-4 education systems.

## 🚀 Features

- **Curriculum-Aligned Content**: Quizzes designed according to official Kenyan curriculum standards
- **Multi-System Support**: CBC (Grades 4-12) and 8-4-4 (Forms 2-4) education systems
- **Progressive Loading**: Fast initial load with background data fetching
- **Professional API Integration**: Secure proxy to Roodito API with proper error handling
- **Responsive Design**: Modern UI optimized for all devices

## 🏗️ Architecture

### Backend API Integration
- **API Proxy**: `/api/quiz_table_data` - Secure proxy to Roodito API
- **Authentication**: Tutor ID integration (`62fa2e148efknmg`)
- **Caching**: 10-minute cache for improved performance
- **Error Handling**: Comprehensive error handling with retry logic
- **Pagination**: Efficient pagination with 50 items per page

### Frontend Structure
- **Next.js 14**: App Router with TypeScript
- **State Management**: React hooks with custom data service
- **UI Components**: Shadcn/ui components with Tailwind CSS
- **Progressive Enhancement**: Immediate UI rendering with background data loading

## 🛠️ Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **API**: Roodito API integration
- **Caching**: In-memory cache with TTL
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
nmg/
├── app/
│   ├── api/quiz_table_data/     # API proxy route
│   ├── data/                    # Static data files
│   └── page.tsx                 # Main application page
├── components/
│   ├── ui/                      # Shadcn/ui components
│   ├── AccordionSection.tsx     # Education system sections
│   ├── GradeSection.tsx         # Grade-level organization
│   └── SubjectBlock.tsx         # Subject-specific quiz display
├── lib/
│   ├── api-service.ts           # API integration layer
│   ├── data-service.ts          # Data management & caching
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## 🔧 API Integration

### Roodito API Endpoint
```
GET https://roodito.com/Api_controller/quiz_table_data
```

### Required Parameters
- `tutor_id`: `62fa2e148efknmg` (automatically included)
- `page`: Page number for pagination
- `per_page`: Items per page (default: 20)

### Optional Parameters
- `subject`: Filter by subject
- `grade`: Filter by grade level
- `level`: Filter by education level
- `quiz_type`: Filter by quiz type

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Access Application**
   ```
   http://localhost:3000
   ```

## 📊 Data Flow

1. **Initial Load**: Display cached data immediately (if available)
2. **Background Fetch**: Fetch fresh data from Roodito API
3. **Progressive Update**: Update UI as new data arrives
4. **Caching**: Cache results for 10 minutes to improve performance

## 🔒 Security Features

- **API Proxy**: All external API calls go through Next.js API routes
- **Input Validation**: Query parameter validation and sanitization
- **Error Handling**: Graceful error handling without exposing sensitive data
- **Rate Limiting**: Built-in request timeout (30 seconds)

## 🎯 Performance Optimizations

- **Progressive Loading**: Show first 50 quizzes immediately
- **Caching Strategy**: 10-minute cache with automatic invalidation
- **Pagination**: Efficient pagination to reduce payload size
- **Retry Logic**: Exponential backoff for failed requests
- **Background Processing**: Non-blocking data fetching

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive design for tablet screens
- **Desktop Experience**: Enhanced features for desktop users
- **Accessibility**: WCAG compliant design patterns

## 🔄 Development Workflow

1. **Feature Development**: Create feature branches
2. **Testing**: Test API integration and UI components
3. **Code Review**: Ensure code quality and standards
4. **Deployment**: Deploy to staging/production

## 📈 Monitoring & Analytics

- **API Performance**: Monitor response times and success rates
- **Error Tracking**: Track and resolve API errors
- **User Analytics**: Monitor user engagement and quiz completion
- **Cache Performance**: Track cache hit rates and efficiency

## 🤝 Contributing

1. Follow TypeScript best practices
2. Maintain clean architecture principles
3. Add proper error handling
4. Include TypeScript types for all interfaces
5. Test API integration thoroughly

## 📄 License

This project is proprietary to Nation Media Group.
