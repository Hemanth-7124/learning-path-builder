export interface Module {
  id: string
  title: string
  description: string
  duration: number // in minutes
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  icon?: string
  // Progress Tracking fields
  status?: 'not-started' | 'in-progress' | 'completed'
  progress?: number // 0-100 percentage
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