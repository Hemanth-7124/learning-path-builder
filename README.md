# Learning Path Builder

[![Multi-Path Learning System](https://img.shields.io/badge/Feature-Multi--Path-Informational?style=for-the-badge)](https://github.com/yourusername/learning-path-builder)
[![Vue 3](https://img.shields.io/badge/Vue-3.5.25-4FC08D?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.2.1-00DC82?style=for-the-badge&logo=nuxt.js)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## 🎯 Project Overview

**Learning Path Builder** is a comprehensive educational platform that allows users to create, manage, and track **multiple personalized learning journeys**. This web application empowers learners to build structured educational paths by selecting from a rich library of modules or creating custom content tailored to their specific needs.

### 🆕 NEW: Multi-Path Support
- **✅ Multiple Learning Paths**: Create unlimited learning paths with independent progress tracking
- **✅ Path Switching**: Seamlessly switch between different learning journeys
- **✅ Data Isolation**: Each path has its own modules, progress, quizzes, and certificates
- **✅ Visual Organization**: Color-coding and tags for better path management
- **✅ Import/Export**: Share learning paths between devices or with others
- **✅ Automatic Migration**: Existing single-path data automatically converted

## 🚀 Quick Start

### For New Users
1. **Create Your First Path**: Click "Manage Paths" → "Create New Path"
2. **Add Modules**: Drag modules from the left panel to your path
3. **Track Progress**: Complete modules and take quizzes to earn certificates
4. **Organize**: Create multiple paths for different learning goals

### For Existing Users
1. **Automatic Migration**: Your existing data is automatically converted
2. **Explore New Features**: Click "Manage Paths" to see the new interface
3. **Create Additional Paths**: Organize different learning journeys
4. **Customize**: Add colors and tags to better organize your paths

### For Developers
```bash
# Clone the repository
git clone https://github.com/yourusername/learning-path-builder.git

# Install dependencies
cd learning-path-builder
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### What is the purpose of this project?

The Learning Path Builder serves as an interactive educational management system designed to:

- **Democratize Learning**: Provide a user-friendly interface for creating personalized educational experiences
- **Track Progress**: Monitor learning advancement with detailed progress tracking and quiz assessments
- **Certify Achievement**: Generate certificates upon successful completion of learning modules
- **Enable Customization**: Allow educators and learners to create custom modules with targeted content
- **Facilitate Assessment**: Implement comprehensive quiz systems with custom question banks

### Real-World Use Cases

- **Corporate Training**: Organizations can create custom learning paths for employee onboarding and skill development
- **Educational Institutions**: Schools and universities can design structured curricula with progress monitoring
- **Individual Learning**: Self-directed learners can organize their educational goals with structured modules
- **Professional Development**: Career changers can plan skill acquisition paths for new industries
- **Online Course Creation**: Educators can build comprehensive courses with assessments and certifications

## 🚀 Current Features

### 🆕 Multi-Path Learning System
- **Multiple Learning Paths**: Create unlimited learning paths with custom names, colors, and tags
- **Path Switching**: Desktop dropdown and mobile modal for easy path switching
- **Independent Progress**: Each path maintains separate module progress and completion status
- **Path-Specific Data**: Isolated quiz attempts, certificates, and custom modules per path
- **Visual Organization**: Color-coded paths with custom tags for categorization
- **Path Management**: Create, edit, duplicate, archive, and delete learning paths
- **Search & Filter**: Find paths by name, description, or tags; sort by various criteria
- **Import/Export**: Share learning paths as JSON files for backup or sharing
- **Automatic Migration**: Seamless upgrade from single-path to multi-path format

### 🎓 Enhanced Learning Path Management
- **Drag-and-Drop Interface**: Intuitive module ordering with visual feedback
- **Progress Tracking**: Real-time monitoring of learning advancement (0-100% completion)
- **Status Management**: Track module status (not-started, in-progress, quiz-required, quiz-passed, completed)
- **Duration Calculation**: Automatic computation of total learning path duration
- **Persistent Storage**: Automatic browser-based storage using localStorage with path isolation

### 📚 Module System
- **Pre-built Library**: 12+ sample modules across various technology domains
- **Custom Module Creation**: Full-featured module creator with validation
- **Categories**: Support for 10+ categories (Web Development, Backend, DevOps, Mobile, Data Science, etc.)
- **Difficulty Levels**: Beginner, Intermediate, and Advanced classification
- **Rich Metadata**: Learning objectives, prerequisites, topics, and resource links
- **Icon Support**: Visual representation for each module

### 🧪 Quiz & Assessment System
- **Comprehensive Quiz Engine**: Randomized question selection with configurable parameters
- **Custom Question Banks**: Create module-specific questions or import from existing banks
- **Question Import**: Import questions from the main question bank to custom modules
- **Detailed Statistics**: Track quiz attempts, scores, time spent, and pass rates
- **Attempt Limits**: Configurable cooldown periods and maximum attempt restrictions
- **100% Passing Score**: Ensures thorough understanding before certification

### 🏆 Certification & Achievement
- **PDF Certificate Generation**: Automated certificate creation using jsPDF
- **Customizable Templates**: Include learner name, module title, completion date, and scores
- **Certificate Storage**: Persistent storage of earned certificates
- **Export Capabilities**: Download learning paths and certificates for external use

### 📱 User Interface
- **Responsive Design**: Fully mobile-optimized with adaptive layouts
- **Tabbed Mobile Interface**: Efficient space utilization on smaller screens
- **Real-time Search**: Instant module filtering by title and description
- **Advanced Filtering**: Filter by category, difficulty, and status
- **Visual Feedback**: Progress indicators, status badges, and interactive elements
- **Accessibility**: Semantic HTML and keyboard navigation support

### 💾 Data Management
- **Local Storage**: Complete offline functionality with browser-based persistence
- **Import/Export**: JSON-based data portability
- **Question Bank Management**: Comprehensive CRUD operations for custom questions
- **Validation**: Input validation for all user-generated content
- **Error Handling**: Graceful error management with user feedback

## Future Enhancements & Scalability Plan

### 🚀 New Features Pipeline

#### Phase 1: Collaboration & Social Features
- **Multi-user Support**: User authentication and profile management
- **Collaborative Learning Paths**: Share and co-create learning journeys
- **Community Modules**: User-generated content marketplace
- **Leaderboards & Gamification**: Points, badges, and achievement systems
- **Discussion Forums**: Module-specific Q&A and discussions

#### Phase 2: Advanced Assessment
- **AI-Powered Questions**: Intelligent question generation and adaptation
- **Video Assessments**: Upload and evaluate video-based assignments
- **Project-Based Learning**: Hands-on project submissions and peer reviews
- **Adaptive Learning Paths**: Dynamic module recommendations based on performance
- **Plagiarism Detection**: Content similarity checking for submissions

#### Phase 3: Enterprise Features
- **Team Management**: Organization dashboards and team analytics
- **LMS Integration**: Compatibility with popular Learning Management Systems
- **SCORM Compliance**: Standardized content packaging
- **Advanced Analytics**: Detailed learning analytics and reporting
- **API Access**: RESTful APIs for third-party integrations

#### Phase 4: Advanced Media & Content
- **Interactive Content**: Support for interactive simulations and labs
- **Video Integration**: Embedded video content with tracking
- **Audio Learning**: Podcast and audio content support
- **Virtual Reality**: Immersive learning experiences
- **Live Sessions**: Real-time virtual classrooms and webinars

### 📈 Scalability Architecture

#### Performance Optimization
- **Lazy Loading**: Progressive content loading for improved performance
- **Caching Strategy**: Intelligent caching for frequently accessed data
- **Database Optimization**: Indexed queries and efficient data structures
- **CDN Integration**: Content delivery for global performance
- **Microservices Architecture**: Modular backend services for scalability

#### Infrastructure Scaling
- **Cloud Deployment**: Multi-region cloud infrastructure (AWS, GCP, Azure)
- **Load Balancing**: Auto-scaling based on user traffic
- **Database Sharding**: Horizontal scaling for large user bases
- **Container Orchestration**: Docker and Kubernetes for deployment
- **Monitoring & Observability**: Comprehensive logging and performance monitoring

#### Data Security & Compliance
- **GDPR Compliance**: Full data privacy regulation adherence
- **SOC 2 Certification**: Enterprise-grade security standards
- **Data Encryption**: End-to-end encryption for sensitive data
- **Backup & Recovery**: Automated backup and disaster recovery systems
- **Audit Trails**: Comprehensive activity logging and reporting

## Technical Architecture

### 🏗️ Overall Architecture

The Learning Path Builder follows a **modern single-page application (SPA)** architecture built on the **Nuxt.js framework**, providing server-side rendering capabilities with Vue 3's composition API for optimal performance and user experience.

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
├─────────────────────────────────────────────────────────────┤
│  Vue 3 + Nuxt.js + TypeScript + Tailwind CSS               │
│  • Client-side routing & state management                   │
│  • Component-based architecture                             │
│  • Responsive design & mobile optimization                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Business Logic Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Composables & Utilities                                    │
│  • useLearningPath - Core state management                   │
│  • useQuiz - Quiz engine & scoring                          │
│  • useCertificate - PDF generation                          │
│  • usePdfExport - Export functionality                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Data Management Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Local Storage + Question Banks                             │
│  • Browser-based persistence                                │
│  • JSON data serialization                                  │
│  • Question bank management                                 │
│  • Progress tracking & certificates                         │
└─────────────────────────────────────────────────────────────┘
```

### 🔧 Key Components

#### Core Composables
1. **useLearningPath** (`app/composables/useLearningPath.ts:11`)
   - Central state management for learning paths and modules
   - Progress tracking and status management
   - CRUD operations for custom modules and questions

2. **useQuiz** (Referenced in components)
   - Quiz generation and scoring engine
   - Attempt tracking and statistics
   - Question randomization and selection

3. **useCertificate** (`app/composables/useCertificate.ts`)
   - PDF certificate generation using jsPDF
   - Customizable template management
   - Certificate storage and retrieval

4. **usePdfExport** (`app/composables/usePdfExport.ts`)
   - Export functionality for learning paths
   - Data formatting and document generation

#### Vue Components Architecture
- **Modular Design**: Each component is self-contained with clear responsibilities
- **Composition API**: Utilizes Vue 3's composition API for reusable logic
- **Prop-based Communication**: Clean data flow between parent and child components
- **Event-driven Updates**: Reactive updates through event emitters

### 📊 Data Handling Strategies

#### State Management
- **Pinia-style Composables**: Nuxt 3's built-in state management
- **Reactive Data**: Vue's reactivity system for automatic UI updates
- **Local Persistence**: localStorage integration for data durability
- **Type Safety**: Full TypeScript integration with strict typing

#### Data Models
- **TypeScript Interfaces**: Comprehensive type definitions in `app/types/index.ts:1`
- **Immutable Updates**: Functional approach to state updates
- **Validation Logic**: Built-in data validation for all user inputs
- **Error Handling**: Graceful error management with user feedback

#### Storage Architecture
- **Multi-key Storage**: Organized localStorage keys for different data types
- **JSON Serialization**: Efficient data storage and retrieval
- **Data Migration**: Backward compatibility for data structure changes
- **Offline Functionality**: Complete offline capability with synchronization

### 🔄 Workflows

#### Learning Path Creation Workflow
1. **Module Selection**: Browse or search available modules
2. **Filtering**: Apply category and difficulty filters
3. **Custom Module Creation**: Use module creator for custom content
4. **Path Assembly**: Drag-and-drop modules into learning path
5. **Ordering**: Reorganize modules based on prerequisites
6. **Progress Tracking**: Start learning with automatic progress updates

#### Assessment Workflow
1. **Module Completion**: Complete learning content (75% progress)
2. **Quiz Unlock**: Access quiz after minimum progress threshold
3. **Question Generation**: Random selection from question bank
4. **Quiz Attempt**: Complete assessment within time limits
5. **Result Processing**: Score calculation and pass/fail determination
6. **Certificate Generation**: PDF certificate creation upon success
7. **Progress Update**: Mark module as completed (100% progress)

#### Custom Content Workflow
1. **Module Creation**: Use ModuleCreator component
2. **Question Bank Setup**: Create custom questions or import existing ones
3. **Resource Management**: Add learning materials and references
4. **Validation**: Input validation and error correction
5. **Publication**: Add module to available library
6. **Usage Tracking**: Monitor module adoption and completion rates

### 🛡️ Security & Performance Considerations

#### Security Measures
- **Input Sanitization**: Prevention of XSS attacks through proper input handling
- **Data Validation**: Client-side validation for all user inputs
- **Safe Storage**: Encrypted localStorage for sensitive data
- **CSP Compatibility**: Content Security Policy ready architecture

#### Performance Optimizations
- **Lazy Loading**: Progressive component loading
- **Efficient Rendering**: Vue's optimized virtual DOM
- **Memory Management**: Proper cleanup and garbage collection
- **Bundle Optimization**: Tree shaking and code splitting
- **Responsive Images**: Optimized asset loading

The Learning Path Builder represents a robust, scalable foundation for modern educational experiences, combining cutting-edge web technologies with thoughtful user experience design and comprehensive functionality for learners and educators alike.