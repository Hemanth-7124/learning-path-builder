import type {
  LearningPath,
  CreatePathData,
  PathStatistics,
  MigrationResult
} from '~/types'
import { storage, migrationStorage } from '~/utils/storage'

export const usePathManager = () => {
  // Get the main learning path composable
  const {
    learningPaths,
    activePathId,
    currentLearningPath,
    createLearningPath,
    switchToPath,
    deleteLearningPath,
    archiveLearningPath,
    updateLearningPath,
    getPathStatistics,
    migrateFromSinglePath
  } = useLearningPath()

  // UI State for path management
  const showPathManager = ref(false)
  const showCreatePathModal = ref(false)
  const showDeleteConfirmation = ref(false)
  const pathToDelete = ref<string | null>(null)
  const editingPath = ref<LearningPath | null>(null)

  // Form state for creating/editing paths
  const pathForm = reactive({
    name: '',
    description: '',
    color: '#6366f1',
    tags: [] as string[],
    copyFromPathId: ''
  })

  // Available colors for paths
  const pathColors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Gray', value: '#6b7280' }
  ]

  // Common tags for paths
  const commonTags = [
    'Programming',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'DevOps',
    'Design',
    'Business',
    'Personal Growth',
    'Career Development',
    'Certification',
    'Beginner',
    'Advanced',
    'Quick Start',
    'Long-term',
    'Side Project'
  ]

  // === COMPUTED PROPERTIES ===

  /**
   * Filtered learning paths (excluding archived by default)
   */
  const filteredPaths = computed(() => {
    return learningPaths.value.filter(path => !path.isArchived)
  })

  /**
   * Archived learning paths
   */
  const archivedPaths = computed(() => {
    return learningPaths.value.filter(path => path.isArchived)
  })

  /**
   * Paths that can be copied (non-empty)
   */
  const copyablePaths = computed(() => {
    return learningPaths.value.filter(path => path.modules.length > 0)
  })

  /**
   * Current path statistics
   */
  const currentPathStats = computed(() => {
    if (!currentLearningPath.value) return null
    return getPathStatistics(currentLearningPath.value.id)
  })

  /**
   * Validate path form
   */
  const isFormValid = computed(() => {
    return pathForm.name.trim().length >= 3
  })

  /**
   * Check if migration is needed
   */
  const needsMigration = computed(() => {
    return migrationStorage.hasLegacyData()
  })

  // === PATH MANAGEMENT METHODS ===

  /**
   * Initialize creating a new path
   */
  const startCreatePath = () => {
    resetForm()
    editingPath.value = null
    showCreatePathModal.value = true
  }

  /**
   * Initialize editing an existing path
   */
  const startEditPath = (path: LearningPath) => {
    pathForm.name = path.name
    pathForm.description = path.description || ''
    pathForm.color = path.color || '#6366f1'
    pathForm.tags = [...(path.tags || [])]
    pathForm.copyFromPathId = ''
    editingPath.value = path
    showCreatePathModal.value = true
  }

  /**
   * Save path (create or update)
   */
  const savePath = (): boolean => {
    if (!isFormValid.value) return false

    try {
      if (editingPath.value) {
        // Update existing path
        const updates: Partial<LearningPath> = {
          name: pathForm.name.trim(),
          description: pathForm.description.trim() || undefined,
          color: pathForm.color,
          tags: pathForm.tags
        }
        updateLearningPath(editingPath.value.id, updates)
      } else {
        // Create new path
        const createData: CreatePathData = {
          name: pathForm.name.trim(),
          description: pathForm.description.trim() || undefined,
          color: pathForm.color,
          tags: pathForm.tags,
          copyFromPathId: pathForm.copyFromPathId || undefined
        }
        createLearningPath(createData)
      }

      resetForm()
      showCreatePathModal.value = false
      return true

    } catch (error) {
      console.error('Failed to save path:', error)
      return false
    }
  }

  /**
   * Initialize path deletion
   */
  const startDeletePath = (pathId: string) => {
    pathToDelete.value = pathId
    showDeleteConfirmation.value = true
  }

  /**
   * Confirm path deletion
   */
  const confirmDeletePath = (): boolean => {
    if (!pathToDelete.value) return false

    const success = deleteLearningPath(pathToDelete.value)
    if (success) {
      pathToDelete.value = null
      showDeleteConfirmation.value = false
    }
    return success
  }

  /**
   * Cancel path deletion
   */
  const cancelDeletePath = () => {
    pathToDelete.value = null
    showDeleteConfirmation.value = false
  }

  /**
   * Toggle path archive status
   */
  const toggleArchivePath = (pathId: string) => {
    const path = learningPaths.value.find(p => p.id === pathId)
    if (path) {
      archiveLearningPath(pathId, !path.isArchived)
    }
  }

  /**
   * Switch to a path and close manager
   */
  const selectAndClose = (pathId: string) => {
    switchToPath(pathId)
    showPathManager.value = false
  }

  /**
   * Duplicate a path
   */
  const duplicatePath = (path: LearningPath): LearningPath | null => {
    try {
      const newPath = createLearningPath({
        name: `${path.name} (Copy)`,
        description: path.description ? `${path.description} (Copy)` : undefined,
        color: path.color,
        tags: [...(path.tags || [])],
        copyFromPathId: path.id
      })
      return newPath
    } catch (error) {
      console.error('Failed to duplicate path:', error)
      return null
    }
  }

  /**
   * Reset form to default values
   */
  const resetForm = () => {
    pathForm.name = ''
    pathForm.description = ''
    pathForm.color = '#6366f1'
    pathForm.tags = []
    pathForm.copyFromPathId = ''
    editingPath.value = null
  }

  /**
   * Add tag to form
   */
  const addTag = (tag: string) => {
    if (tag && !pathForm.tags.includes(tag)) {
      pathForm.tags.push(tag)
    }
  }

  /**
   * Remove tag from form
   */
  const removeTag = (tagToRemove: string) => {
    pathForm.tags = pathForm.tags.filter(tag => tag !== tagToRemove)
  }

  /**
   * Get path by ID
   */
  const getPathById = (pathId: string): LearningPath | null => {
    return learningPaths.value.find(p => p.id === pathId) || null
  }

  /**
   * Get total paths count
   */
  const getTotalPathsCount = (): number => {
    return learningPaths.value.length
  }

  /**
   * Get active paths count (non-archived)
   */
  const getActivePathsCount = (): number => {
    return filteredPaths.value.length
  }

  /**
   * Get archived paths count
   */
  const getArchivedPathsCount = (): number => {
    return archivedPaths.value.length
  }

  /**
   * Export path data
   */
  const exportPath = (pathId: string): string | null => {
    const path = getPathById(pathId)
    if (!path) return null

    try {
      const exportData = {
        path,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }
      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error('Failed to export path:', error)
      return null
    }
  }

  /**
   * Import path data
   */
  const importPath = (jsonData: string): LearningPath | null => {
    try {
      const importData = JSON.parse(jsonData)

      if (!importData.path) {
        throw new Error('Invalid import data format')
      }

      // Create new path from imported data
      const newPath = createLearningPath({
        name: `${importData.path.name} (Imported)`,
        description: importData.path.description,
        color: importData.path.color || '#6366f1',
        tags: importData.path.tags || [],
        copyFromPathId: undefined // We'll handle modules differently
      })

      // If import data has modules, we need to add them manually
      if (importData.path.modules && Array.isArray(importData.path.modules)) {
        // This would need to be handled by the main composable
        // For now, we'll just create the path structure
        console.log('Path imported successfully. Modules need to be added manually.')
      }

      return newPath

    } catch (error) {
      console.error('Failed to import path:', error)
      return null
    }
  }

  /**
   * Perform migration from single path
   */
  const performMigration = (): MigrationResult => {
    try {
      const result = migrateFromSinglePath()

      if (result.success) {
        // Show success message or notification
        console.log('Migration completed successfully!')
      } else {
        // Show error message
        console.error('Migration failed:', result.errors)
      }

      return result

    } catch (error) {
      console.error('Migration error:', error)
      return {
        success: false,
        pathsCreated: 0,
        dataMigrated: {
          modules: 0,
          quizAttempts: 0,
          certificates: 0,
          customQuestions: 0
        },
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  /**
   * Get path summary for dashboard
   */
  const getPathSummary = () => {
    const totalPaths = learningPaths.value.length
    const activePathsCount = filteredPaths.value.length
    const archivedPathsCount = archivedPaths.value.length
    const totalModules = learningPaths.value.reduce((sum, path) => sum + path.modules.length, 0)
    const totalCompletedModules = learningPaths.value.reduce((sum, path) => sum + path.completedModules.length, 0)

    // Calculate average progress across all paths
    const averageProgress = totalPaths > 0
      ? Math.round(learningPaths.value.reduce((sum, path) => sum + path.overallProgress, 0) / totalPaths)
      : 0

    return {
      totalPaths,
      activePaths: activePathsCount,
      archivedPaths: archivedPathsCount,
      totalModules,
      totalCompletedModules,
      averageProgress,
      completionRate: totalModules > 0 ? Math.round((totalCompletedModules / totalModules) * 100) : 0
    }
  }

  // Computed summary for reactive usage
  const summary = computed(() => getPathSummary())

  /**
   * Search paths by name, description, or tags
   */
  const searchPaths = (query: string): LearningPath[] => {
    if (!query.trim()) return learningPaths.value

    const lowercaseQuery = query.toLowerCase()
    return learningPaths.value.filter(path =>
      path.name.toLowerCase().includes(lowercaseQuery) ||
      (path.description && path.description.toLowerCase().includes(lowercaseQuery)) ||
      (path.tags && path.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    )
  }

  /**
   * Sort paths by various criteria
   */
  const sortPaths = (paths: LearningPath[], sortBy: 'name' | 'created' | 'updated' | 'progress' | 'modules'): LearningPath[] => {
    return [...paths].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case 'progress':
          return b.overallProgress - a.overallProgress
        case 'modules':
          return b.modules.length - a.modules.length
        default:
          return 0
      }
    })
  }

  return {
    // State
    showPathManager,
    showCreatePathModal,
    showDeleteConfirmation,
    pathToDelete,
    editingPath,
    pathForm,
    pathColors,
    commonTags,

    // Computed
    learningPaths,
    currentLearningPath,
    activePathId,
    filteredPaths,
    archivedPaths,
    copyablePaths,
    currentPathStats,
    isFormValid,
    needsMigration,
    summary,

    // Path Management Methods
    startCreatePath,
    startEditPath,
    savePath,
    startDeletePath,
    confirmDeletePath,
    cancelDeletePath,
    toggleArchivePath,
    selectAndClose,
    duplicatePath,

    // Form Methods
    resetForm,
    addTag,
    removeTag,

    // Utility Methods
    getPathById,
    getTotalPathsCount,
    getActivePathsCount,
    getArchivedPathsCount,
    exportPath,
    importPath,
    performMigration,
    getPathSummary,
    searchPaths,
    sortPaths,

    // Core Methods (from main composable)
    switchToPath,
    deleteLearningPath,
    archiveLearningPath,
    updateLearningPath,
    getPathStatistics
  }
}