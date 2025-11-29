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
  // Custom Question Bank fields
  hasCustomQuestions?: boolean // Quick check for UI
  customQuestionCount?: number // Cache count for performance
  // Multi-path support
  pathId: string // Association to specific learning path
  addedAt: Date // When module was added to path
  position: number // Order within the path
}

export interface LearningPath {
  id: string // Unique identifier for the path
  name: string
  description?: string
  createdAt: Date
  lastUpdated: Date
  modules: Module[]
  totalDuration: number
  isActive: boolean // Currently selected path
  isArchived: boolean // For completed/old paths
  color?: string // Visual distinction for UI
  tags?: string[] // Categorization and filtering
  // Progress Tracking fields
  completedModules: string[]
  lastProgressUpdate?: Date
  overallProgress: number // Calculated overall progress percentage
}

export interface LearningPathManager {
  paths: LearningPath[]
  activePathId: string
  defaultPathId: string
  settings: {
    autoSave: boolean
    showArchived: boolean
    defaultColor: string
  }
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

// Custom Question Bank interfaces
export interface CustomQuestion extends Question {
  moduleId: string // Links to specific custom module
  pathId?: string // Optional: available to specific paths
  isCustom: true // Distinguishes from predefined questions
  createdAt: Date
  updatedAt?: Date
}

// Question bank management interfaces
export interface CustomQuestionBank {
  [pathId: string]: {
    [moduleId: string]: CustomQuestion[] // Map of pathId -> moduleId -> questions
  }
}

// Question import tracking
export interface ImportedQuestion {
  originalQuestionId: string
  targetModuleId: string
  targetPathId: string // Which path this question was imported for
  importedAt: Date
}

export interface QuizAttempt {
  id: string
  moduleId: string
  pathId: string // Which learning path this attempt belongs to
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
  pathId: string // Which learning path this certificate belongs to
  moduleName: string
  pathName: string // Name of the learning path at time of completion
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

// Storage Key Constants for Multi-Path Support
export const STORAGE_KEYS = {
  // Path Management
  LEARNING_PATHS: 'learning-paths', // Array of LearningPath
  ACTIVE_PATH_ID: 'active-path-id', // Currently selected path ID
  PATH_MANAGER: 'path-manager', // Path management settings

  // Path-specific data (function to generate keys)
  CUSTOM_MODULES: (pathId: string) => `custom-modules-${pathId}`,
  QUIZ_ATTEMPTS: (pathId: string) => `quiz-attempts-${pathId}`,
  CERTIFICATES: (pathId: string) => `certificates-${pathId}`,
  CUSTOM_QUESTIONS: (pathId: string) => `custom-questions-${pathId}`,

  // Global data (shared across all paths)
  IMPORTED_QUESTIONS: 'imported-questions',
  GLOBAL_SETTINGS: 'global-settings',

  // Legacy keys (for migration)
  LEGACY_LEARNING_PATH: 'learning-path',
  LEGACY_CUSTOM_MODULES: 'custom-modules',
  LEGACY_QUIZ_ATTEMPTS: 'quiz-attempts',
  LEGACY_CERTIFICATES: 'certificates',
  LEGACY_CUSTOM_QUESTIONS: 'custom-module-questions'
} as const

export type StorageKey = typeof STORAGE_KEYS

// Migration interfaces
export interface MigrationData {
  legacyPath: any
  migratedPaths: LearningPath[]
  migrationDate: Date
  version: string
}

export interface MigrationResult {
  success: boolean
  pathsCreated: number
  dataMigrated: {
    modules: number
    quizAttempts: number
    certificates: number
    customQuestions: number
  }
  errors?: string[]
  warnings?: string[]
}

// Path creation interface
export interface CreatePathData {
  name: string
  description?: string
  color?: string
  tags?: string[]
  copyFromPathId?: string // Optional: copy modules from existing path
}

// Path statistics interface
export interface PathStatistics {
  totalModules: number
  completedModules: number
  totalDuration: number
  overallProgress: number
  quizAttempts: number
  certificates: number
  averageScore: number
  lastActivity?: Date
}