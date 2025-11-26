export interface Module {
  id: string
  title: string
  description: string
  duration: number // in minutes
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  icon?: string
}

export interface LearningPath {
  modules: Module[]
  totalDuration: number
  lastUpdated: Date
  name: string
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