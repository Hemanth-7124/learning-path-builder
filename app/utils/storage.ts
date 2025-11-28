/**
 * Centralized localStorage management
 * Consolidates all storage keys and operations to eliminate code duplication
 */

export const STORAGE_KEYS = {
  LEARNING_PATH: 'learning-path',
  CUSTOM_MODULES: 'custom-modules',
  QUIZ_ATTEMPTS: 'quiz-attempts',
  QUIZ_ATTEMPTS_BACKUP: 'quiz-attempts-backup',
  QUIZ_ATTEMPTS_TIMESTAMP: 'quiz-attempts-timestamp',
  CERTIFICATES: 'certificates',
  CUSTOM_QUESTIONS: 'custom-module-questions',
  IMPORTED_QUESTIONS: 'imported-questions'
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]

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

    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.warn(`Error clearing localStorage (key: ${key}):`, error)
      }
    })
  },

  /**
   * Get all storage keys for the app
   */
  getKeys(): StorageKey[] {
    return Object.values(STORAGE_KEYS)
  }
}