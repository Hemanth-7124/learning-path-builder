export interface Module {
  id: string
  title: string
  description: string
  duration: number // in minutes
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  icon?: string
  // Progress Tracking fields
  status?: 'not-started' | 'in-progress' | 'quiz-required' | 'quiz-passed' | 'completed'
  progress?: number // 0-100 percentage
  // Quiz System fields
  quizCompleted?: boolean
  quizAttempts?: QuizAttempt[]
  certificate?: Certificate
  // Module Preview fields
  prerequisites?: string[]
  learningObjectives?: string[]
  topics?: string[]
  resources?: Resource[]
}

export interface LearningPath {
  modules: Module[]
  totalDuration: number
  lastUpdated: Date
  name: string
  // Progress Tracking fields
  completedModules?: string[]
  lastProgressUpdate?: Date
}

export interface DragItem {
  module: Module
  index: number
}

export const CATEGORIES = [
  'Web Development',
  'Backend Development',
  'DevOps',
  'Mobile Development',
  'Data Science',
  'Soft Skills',
  'Design',
  'Testing',
  'Security',
  'Database'
] as const

export const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced'
] as const

export const MODULE_STATUS = [
  'not-started',
  'in-progress',
  'quiz-required',
  'quiz-passed',
  'completed'
] as const

export type ModuleStatus = typeof MODULE_STATUS[number]

export interface Resource {
  id: string
  title: string
  type: 'video' | 'article' | 'documentation' | 'book' | 'course' | 'tool'
  url?: string
  description?: string
}

// Quiz System Interfaces
export interface Question {
  id: string
  text: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  moduleIds?: string[] // Optional: specific module IDs that can use this question
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface QuizAttempt {
  id: string
  moduleId: string
  questions: Question[]
  userAnswers: number[]
  score: number
  passed: boolean
  timestamp: Date
  timeSpent: number // in seconds
}

export interface Certificate {
  id: string
  moduleId: string
  moduleName: string
  learnerName: string
  completionDate: Date
  score: number
  certificateId: string
}

// Quiz Configuration Constants
export const QUIZ_CONFIG = {
  QUESTIONS_PER_QUIZ: 5,
  PASSING_SCORE: 100, // 100% required - all 5 questions must be correct
  ATTEMPT_COOLDOWN: 300000, // 5 minutes in milliseconds
  MAX_ATTEMPTS: 3
} as const