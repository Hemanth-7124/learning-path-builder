/**
 * Centralized localStorage management with multi-path support
 * Consolidates all storage keys and operations to eliminate code duplication
 */

// Import storage keys from types
import { STORAGE_KEYS } from '~/types'

// Re-export storage keys for convenience
export { STORAGE_KEYS }

export type StorageKey = string // Allow dynamic keys for path-specific data

// Legacy storage keys for migration compatibility
export const LEGACY_STORAGE_KEYS = {
  LEARNING_PATH: 'learning-path',
  CUSTOM_MODULES: 'custom-modules',
  QUIZ_ATTEMPTS: 'quiz-attempts',
  QUIZ_ATTEMPTS_BACKUP: 'quiz-attempts-backup',
  QUIZ_ATTEMPTS_TIMESTAMP: 'quiz-attempts-timestamp',
  CERTIFICATES: 'certificates',
  CUSTOM_QUESTIONS: 'custom-module-questions',
  IMPORTED_QUESTIONS: 'imported-questions'
} as const

/**
 * Generic localStorage operations with error handling
 */
export const storage = {
  /**
   * Get data from localStorage
   * @param key - Storage key
   * @param defaultValue - Default value if item doesn't exist
   * @returns Parsed data or default value
   */
  get<T>(key: StorageKey, defaultValue: T = null as T): T {
    if (typeof window === 'undefined') return defaultValue

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading from localStorage (key: ${key}):`, error)
      return defaultValue
    }
  },

  /**
   * Set data in localStorage
   * @param key - Storage key
   * @param value - Data to store
   */
  set<T>(key: StorageKey, value: T): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Error writing to localStorage (key: ${key}):`, error)
    }
  },

  /**
   * Remove item from localStorage
   * @param key - Storage key
   */
  remove(key: StorageKey): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Error removing from localStorage (key: ${key}):`, error)
    }
  },

  /**
   * Clear all app data from localStorage
   */
  clear(): void {
    if (typeof window === 'undefined') return

    // Clear all path-specific keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('learning-paths') ||
          key.startsWith('custom-modules-') ||
          key.startsWith('quiz-attempts-') ||
          key.startsWith('certificates-') ||
          key.startsWith('custom-questions-') ||
          Object.values(STORAGE_KEYS).includes(key as any)) {
        try {
          localStorage.removeItem(key)
        } catch (error) {
          console.warn(`Error clearing localStorage (key: ${key}):`, error)
        }
      }
    })
  },

  /**
   * Get all storage keys for the app (including path-specific ones)
   */
  getKeys(): string[] {
    if (typeof window === 'undefined') return []

    const allKeys: string[] = []

    // Global keys
    allKeys.push(...Object.values(STORAGE_KEYS).filter(k => typeof k === 'string'))

    // Path-specific keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('custom-modules-') ||
          key.startsWith('quiz-attempts-') ||
          key.startsWith('certificates-') ||
          key.startsWith('custom-questions-')) {
        allKeys.push(key)
      }
    })

    return allKeys
  },

  /**
   * Check if a key exists in localStorage
   */
  has(key: StorageKey): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(key) !== null
  }
}

/**
 * Path-specific storage utilities
 */
export const pathStorage = {
  /**
   * Get data for a specific learning path
   */
  getPathData<T>(pathId: string, dataType: 'custom-modules' | 'quiz-attempts' | 'certificates' | 'custom-questions', defaultValue: T = null as T): T {
    const key = STORAGE_KEYS.CUSTOM_MODULES(pathId)
    if (dataType === 'quiz-attempts') {
      return storage.get(STORAGE_KEYS.QUIZ_ATTEMPTS(pathId), defaultValue)
    } else if (dataType === 'certificates') {
      return storage.get(STORAGE_KEYS.CERTIFICATES(pathId), defaultValue)
    } else if (dataType === 'custom-questions') {
      return storage.get(STORAGE_KEYS.CUSTOM_QUESTIONS(pathId), defaultValue)
    }
    return storage.get(key, defaultValue)
  },

  /**
   * Set data for a specific learning path
   */
  setPathData<T>(pathId: string, dataType: 'custom-modules' | 'quiz-attempts' | 'certificates' | 'custom-questions', value: T): void {
    if (dataType === 'quiz-attempts') {
      storage.set(STORAGE_KEYS.QUIZ_ATTEMPTS(pathId), value)
    } else if (dataType === 'certificates') {
      storage.set(STORAGE_KEYS.CERTIFICATES(pathId), value)
    } else if (dataType === 'custom-questions') {
      storage.set(STORAGE_KEYS.CUSTOM_QUESTIONS(pathId), value)
    } else {
      storage.set(STORAGE_KEYS.CUSTOM_MODULES(pathId), value)
    }
  },

  /**
   * Remove data for a specific learning path
   */
  removePathData(pathId: string, dataType: 'custom-modules' | 'quiz-attempts' | 'certificates' | 'custom-questions'): void {
    if (dataType === 'quiz-attempts') {
      storage.remove(STORAGE_KEYS.QUIZ_ATTEMPTS(pathId))
    } else if (dataType === 'certificates') {
      storage.remove(STORAGE_KEYS.CERTIFICATES(pathId))
    } else if (dataType === 'custom-questions') {
      storage.remove(STORAGE_KEYS.CUSTOM_QUESTIONS(pathId))
    } else {
      storage.remove(STORAGE_KEYS.CUSTOM_MODULES(pathId))
    }
  },

  /**
   * Clear all data for a specific learning path
   */
  clearPathData(pathId: string): void {
    const dataTypes: Array<'custom-modules' | 'quiz-attempts' | 'certificates' | 'custom-questions'> =
      ['custom-modules', 'quiz-attempts', 'certificates', 'custom-questions']

    dataTypes.forEach(dataType => {
      this.removePathData(pathId, dataType)
    })
  },

  /**
   * Get all path IDs that have data stored
   */
  getAllPathIds(): string[] {
    if (typeof window === 'undefined') return []

    const pathIds = new Set<string>()

    Object.keys(localStorage).forEach(key => {
      const match = key.match(/^(custom-modules|quiz-attempts|certificates|custom-questions)-(.+)$/)
      if (match) {
        pathIds.add(match[2])
      }
    })

    return Array.from(pathIds)
  }
}

/**
 * Migration utilities for transitioning from single-path to multi-path
 */
export const migrationStorage = {
  /**
   * Get legacy data for migration
   */
  getLegacyData() {
    return {
      learningPath: storage.get(LEGACY_STORAGE_KEYS.LEARNING_PATH),
      customModules: storage.get(LEGACY_STORAGE_KEYS.CUSTOM_MODULES, []),
      quizAttempts: storage.get(LEGACY_STORAGE_KEYS.QUIZ_ATTEMPTS, []),
      certificates: storage.get(LEGACY_STORAGE_KEYS.CERTIFICATES, []),
      customQuestions: storage.get(LEGACY_STORAGE_KEYS.CUSTOM_QUESTIONS, {}),
      importedQuestions: storage.get(LEGACY_STORAGE_KEYS.IMPORTED_QUESTIONS, [])
    }
  },

  /**
   * Backup legacy data before migration
   */
  backupLegacyData(): void {
    const legacyData = this.getLegacyData()
    const backupKey = `legacy-backup-${Date.now()}`
    storage.set(backupKey, legacyData)
    console.log(`Legacy data backed up to: ${backupKey}`)
  },

  /**
   * Clear legacy data after successful migration
   */
  clearLegacyData(): void {
    Object.values(LEGACY_STORAGE_KEYS).forEach(key => {
      storage.remove(key)
    })
  },

  /**
   * Check if legacy data exists (needs migration)
   */
  hasLegacyData(): boolean {
    return storage.has(LEGACY_STORAGE_KEYS.LEARNING_PATH) ||
           storage.has(LEGACY_STORAGE_KEYS.CUSTOM_MODULES) ||
           storage.has(LEGACY_STORAGE_KEYS.QUIZ_ATTEMPTS) ||
           storage.has(LEGACY_STORAGE_KEYS.CERTIFICATES)
  }
}