import type {
  Module,
  LearningPath,
  LearningPathManager,
  ModuleStatus,
  QuizAttempt,
  Certificate,
  CustomQuestion,
  CustomQuestionBank,
  ImportedQuestion,
  CreatePathData,
  PathStatistics,
  MigrationResult
} from '~/types'
import { storage, pathStorage, migrationStorage } from '~/utils/storage'
import { formatDuration } from '~/utils/formatting'

export const useLearningPath = () => {
  // Multi-path state
  const learningPaths = useState<LearningPath[]>('learning-paths', () => [])
  const activePathId = useState<string>('active-path-id', () => '')
  const pathManager = useState<LearningPathManager>('path-manager', () => ({
    paths: [],
    activePathId: '',
    defaultPathId: '',
    settings: {
      autoSave: true,
      showArchived: false,
      defaultColor: '#6366f1'
    }
  }))

  // Current active learning path (reactive)
  const currentLearningPath = computed(() => {
    if (!learningPaths.value || !Array.isArray(learningPaths.value)) {
      return null
    }
    return learningPaths.value.find(path => path.id === activePathId.value) || null
  })

  // Sample modules data (global, shared across all paths)
  const sampleModules: Module[] = [
    {
      id: 'html-basics',
      title: 'HTML Fundamentals',
      description: 'Learn the basics of HTML including tags, attributes, and semantic markup.',
      duration: 120,
      category: 'Web Development',
      difficulty: 'Beginner',
      icon: '🌐',
      status: 'not-started',
      progress: 0,
      pathId: '', // Will be set when added to a path
      addedAt: new Date(),
      position: 0,
      prerequisites: [],
      learningObjectives: [
        'Understand HTML document structure',
        'Master common HTML tags and attributes',
        'Learn semantic HTML best practices',
        'Create accessible web content'
      ],
      topics: ['HTML Elements', 'Attributes', 'Semantic Markup', 'Accessibility', 'Forms'],
      resources: [
        {
          id: 'mdn-html',
          title: 'MDN HTML Documentation',
          type: 'documentation',
          url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
          description: 'Comprehensive HTML reference guide'
        }
      ]
    },
    {
      id: 'css-basics',
      title: 'CSS Essentials',
      description: 'Master CSS fundamentals including selectors, properties, and layout techniques.',
      duration: 180,
      category: 'Web Development',
      difficulty: 'Beginner',
      icon: '🎨',
      status: 'not-started',
      progress: 0,
      pathId: '',
      addedAt: new Date(),
      position: 0,
      prerequisites: ['HTML Fundamentals'],
      learningObjectives: [
        'Understand CSS syntax and selectors',
        'Master the box model and positioning',
        'Learn Flexbox and CSS Grid layouts',
        'Create responsive designs with media queries',
        'Apply modern CSS features and best practices'
      ],
      topics: ['CSS Selectors', 'Box Model', 'Flexbox', 'CSS Grid', 'Responsive Design', 'Transitions', 'Animations'],
      resources: [
        {
          id: 'mdn-css',
          title: 'MDN CSS Documentation',
          type: 'documentation',
          url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
          description: 'Comprehensive CSS reference guide'
        }
      ]
    },
    {
      id: 'javascript-basics',
      title: 'JavaScript Fundamentals',
      description: 'Learn JavaScript programming concepts, DOM manipulation, and basic algorithms.',
      duration: 240,
      category: 'Web Development',
      difficulty: 'Beginner',
      icon: '⚡',
      status: 'not-started',
      progress: 0,
      pathId: '',
      addedAt: new Date(),
      position: 0,
      prerequisites: ['HTML Fundamentals', 'CSS Essentials'],
      learningObjectives: [
        'Understand JavaScript syntax and data types',
        'Master functions, scope, and closures',
        'Learn DOM manipulation and event handling',
        'Implement asynchronous programming with promises',
        'Apply modern ES6+ features and best practices'
      ],
      topics: ['Variables & Data Types', 'Functions', 'DOM Manipulation', 'Events', 'Async Programming', 'ES6+', 'Error Handling'],
      resources: [
        {
          id: 'mdn-js',
          title: 'MDN JavaScript Guide',
          type: 'documentation',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
          description: 'Complete JavaScript learning guide'
        },
        {
          id: 'javascript-info',
          title: 'Modern JavaScript Tutorial',
          type: 'course',
          url: 'https://javascript.info/',
          description: 'Comprehensive JavaScript tutorial'
        }
      ]
    },
    {
      id: 'react-basics',
      title: 'React Fundamentals',
      description: 'Introduction to React, components, state management, and hooks.',
      duration: 300,
      category: 'Web Development',
      difficulty: 'Intermediate',
      icon: '⚛️',
      pathId: '',
      addedAt: new Date(),
      position: 0
    },
    {
      id: 'nodejs-basics',
      title: 'Node.js Fundamentals',
      description: 'Server-side JavaScript with Node.js, Express, and basic API development.',
      duration: 280,
      category: 'Backend Development',
      difficulty: 'Intermediate',
      icon: '🟢',
      pathId: '',
      addedAt: new Date(),
      position: 0
    },
    {
      id: 'database-basics',
      title: 'Database Fundamentals',
      description: 'Introduction to SQL, NoSQL databases, and data modeling concepts.',
      duration: 200,
      category: 'Backend Development',
      difficulty: 'Intermediate',
      icon: '🗄️',
      pathId: '',
      addedAt: new Date(),
      position: 0
    },
    {
      id: 'git-basics',
      title: 'Git Version Control',
      description: 'Master Git commands, branching, merging, and collaborative workflows.',
      duration: 150,
      category: 'DevOps',
      difficulty: 'Beginner',
      icon: '📦',
      pathId: '',
      addedAt: new Date(),
      position: 0
    },
    {
      id: 'docker-basics',
      title: 'Docker Fundamentals',
      description: 'Containerization with Docker, images, containers, and Docker Compose.',
      duration: 220,
      category: 'DevOps',
      difficulty: 'Intermediate',
      icon: '🐳',
      pathId: '',
      addedAt: new Date(),
      position: 0
    },
    {
      id: 'react-native-basics',
      title: 'React Native Fundamentals',
      description: 'Build mobile apps with React Native, components, and platform-specific code.',
      duration: 320,
      category: 'Mobile Development',
      difficulty: 'Intermediate',
      icon: '📱',
      pathId: '',
      addedAt: new Date(),
      position: 0
    },
    {
      id: 'python-basics',
      title: 'Python Programming',
      description: 'Learn Python fundamentals, data structures, and basic algorithms.',
      duration: 260,
      category: 'Data Science',
      difficulty: 'Beginner',
      icon: '🐍',
      pathId: '',
      addedAt: new Date(),
      position: 0
    },
    {
      id: 'communication-skills',
      title: 'Effective Communication',
      description: 'Develop verbal and written communication skills for technical professionals.',
      duration: 180,
      category: 'Soft Skills',
      difficulty: 'Beginner',
      icon: '💬',
      pathId: '',
      addedAt: new Date(),
      position: 0
    },
    {
      id: 'project-management',
      title: 'Agile Project Management',
      description: 'Learn Scrum, Kanban, and agile methodologies for software projects.',
      duration: 200,
      category: 'Soft Skills',
      difficulty: 'Intermediate',
      icon: '📋',
      pathId: '',
      addedAt: new Date(),
      position: 0
    }
  ]

  // Path-specific state
  const customModules = computed(() => {
    if (!activePathId.value || typeof window === 'undefined') return []
    try {
      return pathStorage.getPathData(activePathId.value, 'custom-modules', [])
    } catch (error) {
      console.error('Error loading custom modules:', error)
      return []
    }
  })

  const quizAttempts = computed(() => {
    if (!activePathId.value || typeof window === 'undefined') return []
    try {
      return pathStorage.getPathData(activePathId.value, 'quiz-attempts', [])
    } catch (error) {
      console.error('Error loading quiz attempts:', error)
      return []
    }
  })

  const certificates = computed(() => {
    if (!activePathId.value || typeof window === 'undefined') return []
    try {
      return pathStorage.getPathData(activePathId.value, 'certificates', [])
    } catch (error) {
      console.error('Error loading certificates:', error)
      return []
    }
  })

  const customQuestions = computed(() => {
    if (!activePathId.value || typeof window === 'undefined') return {}
    try {
      return pathStorage.getPathData(activePathId.value, 'custom-questions', {})
    } catch (error) {
      console.error('Error loading custom questions:', error)
      return {}
    }
  })

  const importedQuestions = useState<ImportedQuestion[]>('imported-questions', () => [])

  // Computed available modules that combines sample and custom modules
  const availableModules = computed(() => {
    try {
      const custom = Array.isArray(customModules.value) ? customModules.value : []
      return [...sampleModules, ...custom]
    } catch (error) {
      console.error('Error combining modules:', error)
      return sampleModules
    }
  })

  // Computed properties for current path
  const totalDuration = computed(() => {
    try {
      return currentLearningPath.value?.modules?.reduce((total, module) => total + (module.duration || 0), 0) || 0
    } catch (error) {
      console.error('Error calculating total duration:', error)
      return 0
    }
  })

  const moduleCount = computed(() => {
    try {
      return currentLearningPath.value?.modules?.length || 0
    } catch (error) {
      console.error('Error calculating module count:', error)
      return 0
    }
  })

  const overallProgress = computed(() => {
    try {
      return currentLearningPath.value?.overallProgress || 0
    } catch (error) {
      console.error('Error calculating overall progress:', error)
      return 0
    }
  })

  // === PATH MANAGEMENT METHODS ===

  /**
   * Create a new learning path
   */
  const createLearningPath = (pathData: CreatePathData): LearningPath => {
    const newPath: LearningPath = {
      id: `path-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: pathData.name,
      description: pathData.description,
      createdAt: new Date(),
      lastUpdated: new Date(),
      modules: [],
      totalDuration: 0,
      isActive: false,
      isArchived: false,
      color: pathData.color || pathManager.value.settings.defaultColor,
      tags: pathData.tags || [],
      completedModules: [],
      overallProgress: 0
    }

    // Copy modules from existing path if specified
    if (pathData.copyFromPathId) {
      const sourcePath = learningPaths.value.find(p => p.id === pathData.copyFromPathId)
      if (sourcePath) {
        newPath.modules = sourcePath.modules.map(module => ({
          ...module,
          pathId: newPath.id,
          addedAt: new Date(),
          position: module.position
        }))
        newPath.totalDuration = sourcePath.totalDuration
        newPath.overallProgress = 0 // Reset progress for new path
      }
    }

    learningPaths.value.push(newPath)
    saveLearningPaths()
    return newPath
  }

  /**
   * Switch to a different learning path
   */
  const switchToPath = (pathId: string): boolean => {
    const path = learningPaths.value.find(p => p.id === pathId)
    if (!path) return false

    // Deactivate current path
    if (activePathId.value) {
      const currentPath = learningPaths.value.find(p => p.id === activePathId.value)
      if (currentPath) {
        currentPath.isActive = false
      }
    }

    // Activate new path
    path.isActive = true
    activePathId.value = pathId
    pathManager.value.activePathId = pathId

    saveLearningPaths()
    return true
  }

  /**
   * Delete a learning path and all its data
   */
  const deleteLearningPath = (pathId: string): boolean => {
    const pathIndex = learningPaths.value.findIndex(p => p.id === pathId)
    if (pathIndex === -1) return false

    // Don't allow deletion of the only path
    if (learningPaths.value.length === 1) {
      console.warn('Cannot delete the only learning path')
      return false
    }

    // If deleting active path, switch to another
    if (pathId === activePathId.value) {
      const remainingPaths = learningPaths.value.filter(p => p.id !== pathId)
      if (remainingPaths.length > 0) {
        switchToPath(remainingPaths[0].id)
      }
    }

    // Remove path from array
    learningPaths.value.splice(pathIndex, 1)

    // Clear all path-specific data
    pathStorage.clearPathData(pathId)

    saveLearningPaths()
    return true
  }

  /**
   * Archive/unarchive a learning path
   */
  const archiveLearningPath = (pathId: string, archived: boolean = true): boolean => {
    const path = learningPaths.value.find(p => p.id === pathId)
    if (!path) return false

    path.isArchived = archived
    saveLearningPaths()
    return true
  }

  /**
   * Update learning path metadata
   */
  const updateLearningPath = (pathId: string, updates: Partial<LearningPath>): boolean => {
    const path = learningPaths.value.find(p => p.id === pathId)
    if (!path) return false

    Object.assign(path, updates, { lastUpdated: new Date() })
    saveLearningPaths()
    return true
  }

  /**
   * Get statistics for a learning path
   */
  const getPathStatistics = (pathId: string): PathStatistics | null => {
    const path = learningPaths.value.find(p => p.id === pathId)
    if (!path) return null

    const pathQuizAttempts = pathStorage.getPathData(pathId, 'quiz-attempts', [])
    const pathCertificates = pathStorage.getPathData(pathId, 'certificates', [])

    const totalModules = path.modules.length
    const completedModules = path.modules.filter(m => m.status === 'completed').length
    const totalDuration = path.modules.reduce((total, module) => total + module.duration, 0)
    const overallProgress = path.overallProgress
    const quizAttempts = pathQuizAttempts.length
    const certificates = pathCertificates.length
    const averageScore = quizAttempts > 0
      ? Math.round(pathQuizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts)
      : 0

    return {
      totalModules,
      completedModules,
      totalDuration,
      overallProgress,
      quizAttempts,
      certificates,
      averageScore,
      lastActivity: path.lastUpdated
    }
  }

  // === MODULE MANAGEMENT METHODS ===

  /**
   * Add module to current learning path
   */
  const addToLearningPath = (module: Module) => {
    if (!currentLearningPath.value) return

    // Check if module is already in the learning path
    if (currentLearningPath.value.modules.find(m => m.id === module.id)) return

    // Add module with path-specific values
    const moduleToAdd = {
      ...module,
      pathId: currentLearningPath.value.id,
      addedAt: new Date(),
      position: currentLearningPath.value.modules.length,
      status: module.status || 'not-started',
      progress: module.progress || 0
    }

    currentLearningPath.value.modules.push(moduleToAdd)
    currentLearningPath.value.totalDuration = calculateTotalDuration(currentLearningPath.value.modules)
    currentLearningPath.value.lastUpdated = new Date()
    updatePathProgress(currentLearningPath.value)
    saveLearningPaths()
  }

  /**
   * Remove module from current learning path
   */
  const removeFromLearningPath = (moduleId: string) => {
    if (!currentLearningPath.value) return

    const index = currentLearningPath.value.modules.findIndex(m => m.id === moduleId)
    if (index === -1) return

    currentLearningPath.value.modules.splice(index, 1)

    // Update positions
    currentLearningPath.value.modules.forEach((module, idx) => {
      module.position = idx
    })

    currentLearningPath.value.totalDuration = calculateTotalDuration(currentLearningPath.value.modules)
    currentLearningPath.value.lastUpdated = new Date()
    updatePathProgress(currentLearningPath.value)
    saveLearningPaths()
  }

  /**
   * Reorder modules in current learning path
   */
  const reorderModules = (oldIndex: number, newIndex: number) => {
    if (!currentLearningPath.value) return

    const [movedModule] = currentLearningPath.value.modules.splice(oldIndex, 1)
    currentLearningPath.value.modules.splice(newIndex, 0, movedModule)

    // Update positions
    currentLearningPath.value.modules.forEach((module, idx) => {
      module.position = idx
    })

    currentLearningPath.value.lastUpdated = new Date()
    saveLearningPaths()
  }

  /**
   * Clear current learning path
   */
  const clearLearningPath = () => {
    if (!currentLearningPath.value) return

    currentLearningPath.value.modules = []
    currentLearningPath.value.totalDuration = 0
    currentLearningPath.value.completedModules = []
    currentLearningPath.value.overallProgress = 0
    currentLearningPath.value.lastUpdated = new Date()
    saveLearningPaths()
  }

  /**
   * Check if module is in current learning path
   */
  const isInLearningPath = (moduleId: string): boolean => {
    return currentLearningPath.value?.modules.some(m => m.id === moduleId) || false
  }

  // === CUSTOM MODULE METHODS ===

  /**
   * Create a new custom module
   */
  const createModule = (moduleData: Omit<Module, 'id' | 'pathId' | 'addedAt' | 'position'>): Module => {
    const id = moduleData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now()

    const newModule: Module = {
      ...moduleData,
      id,
      icon: moduleData.icon || getDefaultIcon(moduleData.category),
      pathId: '', // Will be set when added to a path
      addedAt: new Date(),
      position: 0
    }

    return newModule
  }

  /**
   * Add custom module to current path
   */
  const addCustomModule = (moduleData: Omit<Module, 'id' | 'pathId' | 'addedAt' | 'position'>): Module => {
    if (!activePathId.value) throw new Error('No active path selected')

    const newModule = createModule(moduleData)

    // Add to custom modules for this path
    const customModulesList = [...customModules.value]
    customModulesList.push(newModule)
    pathStorage.setPathData(activePathId.value, 'custom-modules', customModulesList)

    // Add to current learning path
    addToLearningPath(newModule)

    return newModule
  }

  /**
   * Remove custom module
   */
  const removeCustomModule = (moduleId: string): void => {
    if (!activePathId.value) return

    const customModulesList = customModules.value.filter(m => m.id !== moduleId)
    pathStorage.setPathData(activePathId.value, 'custom-modules', customModulesList)

    // Also remove from learning path if it's there
    removeFromLearningPath(moduleId)
  }

  /**
   * Check if module is custom
   */
  const isCustomModule = (moduleId: string): boolean => {
    return customModules.value.some(m => m.id === moduleId)
  }

  /**
   * Validate module data
   */
  const validateModule = (moduleData: Partial<Module>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!moduleData.title || moduleData.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long')
    }

    if (!moduleData.description || moduleData.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long')
    }

    if (!moduleData.duration || moduleData.duration < 5) {
      errors.push('Duration must be at least 5 minutes')
    }

    if (!moduleData.category) {
      errors.push('Category is required')
    }

    if (!moduleData.difficulty) {
      errors.push('Difficulty level is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // === PROGRESS TRACKING METHODS ===

  /**
   * Update module status in current path
   */
  const updateModuleStatus = (moduleId: string, status: ModuleStatus): void => {
    if (!currentLearningPath.value) return

    const module = currentLearningPath.value.modules.find(m => m.id === moduleId)
    if (!module) return

    module.status = status

    if (status === 'completed') {
      module.progress = 100
      if (!currentLearningPath.value.completedModules.includes(moduleId)) {
        currentLearningPath.value.completedModules.push(moduleId)
      }
    } else {
      module.progress = status === 'quiz-passed' ? 90 :
                       status === 'quiz-required' ? 75 :
                       status === 'in-progress' ? 50 : 0
      // Remove from completed modules if status changed from completed
      currentLearningPath.value.completedModules = currentLearningPath.value.completedModules.filter(id => id !== moduleId)
    }

    currentLearningPath.value.lastProgressUpdate = new Date()
    currentLearningPath.value.lastUpdated = new Date()
    updatePathProgress(currentLearningPath.value)
    saveLearningPaths()
  }

  /**
   * Update module progress in current path
   */
  const updateModuleProgress = (moduleId: string, progress: number): void => {
    if (!currentLearningPath.value) return

    const module = currentLearningPath.value.modules.find(m => m.id === moduleId)
    if (!module) return

    module.progress = Math.max(0, Math.min(100, progress))

    if (module.progress === 100 && module.status !== 'completed') {
      updateModuleStatus(moduleId, 'completed')
    } else if (module.progress > 0 && module.status === 'not-started') {
      module.status = 'in-progress'
    } else if (module.progress === 0 && module.status !== 'not-started') {
      module.status = 'not-started'
    }

    currentLearningPath.value.lastProgressUpdate = new Date()
    currentLearningPath.value.lastUpdated = new Date()
    updatePathProgress(currentLearningPath.value)
    saveLearningPaths()
  }

  /**
   * Get module status
   */
  const getModuleStatus = (moduleId: string): ModuleStatus => {
    return currentLearningPath.value?.modules.find(m => m.id === moduleId)?.status || 'not-started'
  }

  /**
   * Get module progress
   */
  const getModuleProgress = (moduleId: string): number => {
    return currentLearningPath.value?.modules.find(m => m.id === moduleId)?.progress || 0
  }

  /**
   * Get completed modules count for current path
   */
  const getCompletedModulesCount = (): number => {
    return currentLearningPath.value?.modules.filter(m => m.status === 'completed').length || 0
  }

  /**
   * Get overall progress for current path
   */
  const getOverallProgress = (): number => {
    return currentLearningPath.value?.overallProgress || 0
  }

  // === QUIZ METHODS ===

  /**
   * Complete quiz and update path data
   */
  const completeQuiz = (moduleId: string, quizAttempt: QuizAttempt): void => {
    if (!activePathId.value) return

    // Add pathId to quiz attempt
    const pathQuizAttempt = { ...quizAttempt, pathId: activePathId.value }

    // Add to path-specific quiz attempts
    const attempts = [...quizAttempts.value, pathQuizAttempt]
    pathStorage.setPathData(activePathId.value, 'quiz-attempts', attempts)

    // Update module in current path
    const module = currentLearningPath.value?.modules.find(m => m.id === moduleId)
    if (module) {
      if (!module.quizAttempts) {
        module.quizAttempts = []
      }
      module.quizAttempts.push(pathQuizAttempt)

      if (pathQuizAttempt.passed) {
        updateModuleStatus(moduleId, 'quiz-passed')
      }
    }
  }

  /**
   * Get quiz attempts for current path
   */
  const getQuizAttempts = (moduleId: string): QuizAttempt[] => {
    return quizAttempts.value.filter(attempt => attempt.moduleId === moduleId)
  }

  /**
   * Get quiz statistics for current path
   */
  const getQuizStatistics = (moduleId: string) => {
    const attempts = getQuizAttempts(moduleId)

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        passedAttempts: 0,
        failedAttempts: 0,
        bestScore: 0,
        averageScore: 0,
        averageTimeSpent: 0,
        passRate: 0
      }
    }

    const passedAttempts = attempts.filter(attempt => attempt.passed)
    const scores = attempts.map(attempt => attempt.score)
    const timesSpent = attempts.map(attempt => attempt.timeSpent)

    return {
      totalAttempts: attempts.length,
      passedAttempts: passedAttempts.length,
      failedAttempts: attempts.length - passedAttempts.length,
      bestScore: Math.max(...scores),
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      averageTimeSpent: Math.round(timesSpent.reduce((a, b) => a + b, 0) / timesSpent.length),
      passRate: Math.round((passedAttempts.length / attempts.length) * 100)
    }
  }

  // === CERTIFICATE METHODS ===

  /**
   * Add certificate to current path
   */
  const addCertificate = (certificate: Certificate): void => {
    if (!activePathId.value || !currentLearningPath.value) return

    // Add pathId and pathName to certificate
    const pathCertificate = {
      ...certificate,
      pathId: activePathId.value,
      pathName: currentLearningPath.value.name
    }

    // Add to path-specific certificates
    const certs = [...certificates.value, pathCertificate]
    pathStorage.setPathData(activePathId.value, 'certificates', certs)

    // Update module with certificate information
    const module = currentLearningPath.value.modules.find(m => m.id === certificate.moduleId)
    if (module) {
      module.certificate = pathCertificate
    }
  }

  /**
   * Get certificates for current path
   */
  const getCertificates = (): Certificate[] => {
    return certificates.value
  }

  /**
   * Get certificate for specific module in current path
   */
  const getCertificate = (moduleId: string): Certificate | null => {
    return certificates.value.find(cert => cert.moduleId === moduleId) || null
  }

  /**
   * Check if module has certificate in current path
   */
  const hasCertificate = (moduleId: string): boolean => {
    return certificates.value.some(cert => cert.moduleId === moduleId)
  }

  // === CUSTOM QUESTIONS METHODS ===

  /**
   * Add custom question to current path
   */
  const addCustomQuestion = (moduleId: string, questionData: Omit<CustomQuestion, 'id' | 'isCustom' | 'createdAt' | 'pathId'>) => {
    if (!activePathId.value) throw new Error('No active path selected')

    if (!questionData.text || !questionData.options || questionData.options.length < 2) {
      throw new Error('Invalid question data: text, and at least 2 options are required')
    }

    const pathQuestions = { ...customQuestions.value }
    if (!pathQuestions[moduleId]) {
      pathQuestions[moduleId] = []
    }

    const newQuestion: CustomQuestion = {
      ...questionData,
      id: `custom-q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isCustom: true,
      createdAt: new Date(),
      pathId: activePathId.value,
      moduleId
    }

    pathQuestions[moduleId].push(newQuestion)
    pathStorage.setPathData(activePathId.value, 'custom-questions', pathQuestions)

    // Update module question count
    updateModuleQuestionCount(moduleId)

    return newQuestion
  }

  /**
   * Get custom questions for module in current path
   */
  const getModuleCustomQuestions = (moduleId: string): CustomQuestion[] => {
    return customQuestions.value[moduleId] || []
  }

  // === UTILITY METHODS ===

  /**
   * Calculate total duration for a set of modules
   */
  const calculateTotalDuration = (modules: Module[]): number => {
    return modules.reduce((total, module) => total + module.duration, 0)
  }

  /**
   * Update overall progress for a learning path
   */
  const updatePathProgress = (path: LearningPath): void => {
    if (path.modules.length === 0) {
      path.overallProgress = 0
      return
    }

    const totalProgress = path.modules.reduce((sum, module) => {
      return sum + (module.progress || 0)
    }, 0)

    path.overallProgress = Math.round(totalProgress / path.modules.length)
  }

  /**
   * Get default icon for category
   */
  const getDefaultIcon = (category: string): string => {
    const iconMap: Record<string, string> = {
      'Web Development': '🌐',
      'Backend Development': '⚙️',
      'DevOps': '🔧',
      'Mobile Development': '📱',
      'Data Science': '📊',
      'Soft Skills': '💡',
      'Design': '🎨',
      'Testing': '🧪',
      'Security': '🔒',
      'Database': '🗄️'
    }
    return iconMap[category] || '📚'
  }

  /**
   * Update module question count
   */
  const updateModuleQuestionCount = (moduleId: string) => {
    const module = availableModules.value.find(m => m.id === moduleId)
    if (module && isCustomModule(moduleId)) {
      const questions = getModuleCustomQuestions(moduleId)
      module.hasCustomQuestions = questions.length > 0
      module.customQuestionCount = questions.length
    }
  }

  /**
   * Save learning paths to storage
   */
  const saveLearningPaths = () => {
    if (!pathManager.value.settings.autoSave) return

    storage.set('learning-paths', learningPaths.value)
    storage.set('active-path-id', activePathId.value)
    storage.set('path-manager', pathManager.value)
  }

  /**
   * Load learning paths from storage
   */
  const loadLearningPaths = () => {
    // Check if migration is needed
    if (migrationStorage.hasLegacyData()) {
      console.log('Legacy data detected, performing migration...')
      migrateFromSinglePath()
      return
    }

    // Load multi-path data
    const savedPaths = storage.get('learning-paths', [])
    const savedActiveId = storage.get('active-path-id', '')
    const savedManager = storage.get('path-manager', {
      paths: [],
      activePathId: '',
      defaultPathId: '',
      settings: {
        autoSave: true,
        showArchived: false,
        defaultColor: '#6366f1'
      }
    })

    learningPaths.value = Array.isArray(savedPaths) ? savedPaths : []
    activePathId.value = savedActiveId || (learningPaths.value[0]?.id || '')
    pathManager.value = savedManager

    // If no paths exist, create a default one
    if (learningPaths.value.length === 0) {
      const defaultPath = createLearningPath({
        name: 'My Learning Path',
        description: 'Default learning path for your journey',
        color: '#6366f1'
      })
      switchToPath(defaultPath.id)
    }
  }

  /**
   * Migrate from single-path to multi-path structure
   */
  const migrateFromSinglePath = (): MigrationResult => {
    try {
      migrationStorage.backupLegacyData()

      const legacyData = migrationStorage.getLegacyData()
      const result: MigrationResult = {
        success: true,
        pathsCreated: 0,
        dataMigrated: {
          modules: 0,
          quizAttempts: 0,
          certificates: 0,
          customQuestions: 0
        }
      }

      if (legacyData.learningPath) {
        // Create new path from legacy data
        const newPath: LearningPath = {
          id: `path-${Date.now()}`,
          name: legacyData.learningPath.name || 'Migrated Learning Path',
          description: 'Migrated from previous version',
          createdAt: new Date(),
          lastUpdated: new Date(legacyData.learningPath.lastUpdated || Date.now()),
          modules: legacyData.learningPath.modules?.map((module: any, index: number) => ({
            ...module,
            pathId: `path-${Date.now()}`,
            addedAt: new Date(),
            position: index
          })) || [],
          totalDuration: legacyData.learningPath.totalDuration || 0,
          isActive: true,
          isArchived: false,
          color: '#6366f1',
          tags: [],
          completedModules: legacyData.learningPath.completedModules || [],
          overallProgress: 0
        }

        // Calculate overall progress
        updatePathProgress(newPath)

        learningPaths.value.push(newPath)
        activePathId.value = newPath.id
        result.pathsCreated = 1
        result.dataMigrated.modules = newPath.modules.length

        // Migrate custom modules
        if (legacyData.customModules && Array.isArray(legacyData.customModules)) {
          pathStorage.setPathData(newPath.id, 'custom-modules', legacyData.customModules)
        }

        // Migrate quiz attempts
        if (legacyData.quizAttempts && Array.isArray(legacyData.quizAttempts)) {
          const attemptsWithPath = legacyData.quizAttempts.map((attempt: any) => ({
            ...attempt,
            pathId: newPath.id
          }))
          pathStorage.setPathData(newPath.id, 'quiz-attempts', attemptsWithPath)
          result.dataMigrated.quizAttempts = attemptsWithPath.length
        }

        // Migrate certificates
        if (legacyData.certificates && Array.isArray(legacyData.certificates)) {
          const certsWithPath = legacyData.certificates.map((cert: any) => ({
            ...cert,
            pathId: newPath.id,
            pathName: newPath.name
          }))
          pathStorage.setPathData(newPath.id, 'certificates', certsWithPath)
          result.dataMigrated.certificates = certsWithPath.length
        }

        // Migrate custom questions
        if (legacyData.customQuestions && typeof legacyData.customQuestions === 'object') {
          const pathQuestions: { [moduleId: string]: CustomQuestion[] } = {}
          Object.entries(legacyData.customQuestions).forEach(([moduleId, questions]) => {
            if (Array.isArray(questions)) {
              pathQuestions[moduleId] = questions.map((q: any) => ({
                ...q,
                pathId: newPath.id
              }))
            }
          })
          pathStorage.setPathData(newPath.id, 'custom-questions', pathQuestions)
          result.dataMigrated.customQuestions = Object.values(pathQuestions).flat().length
        }

        // Migrate imported questions (global)
        if (legacyData.importedQuestions && Array.isArray(legacyData.importedQuestions)) {
          importedQuestions.value = legacyData.importedQuestions
        }

        // Save new structure
        saveLearningPaths()

        // Clear legacy data
        migrationStorage.clearLegacyData()

        console.log('Migration completed successfully', result)
        return result
      }

      result.success = false
      result.errors = ['No legacy data found']
      return result

    } catch (error) {
      console.error('Migration failed:', error)
      return {
        success: false,
        pathsCreated: 0,
        dataMigrated: {
          modules: 0,
          quizAttempts: 0,
          certificates: 0,
          customQuestions: 0
        },
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      }
    }
  }

  // Load data on initialization
  onMounted(() => {
    loadLearningPaths()
  })

  return {
    // State
    learningPaths: readonly(learningPaths),
    currentLearningPath: readonly(currentLearningPath),
    availableModules: readonly(availableModules),
    customModules: readonly(customModules),
    quizAttempts: readonly(quizAttempts),
    certificates: readonly(certificates),
    customQuestions: readonly(customQuestions),
    importedQuestions: readonly(importedQuestions),

    // Computed
    totalDuration,
    moduleCount,
    overallProgress,
    activePathId: readonly(activePathId),

    // Path Management Methods
    createLearningPath,
    switchToPath,
    deleteLearningPath,
    archiveLearningPath,
    updateLearningPath,
    getPathStatistics,
    loadLearningPaths,
    saveLearningPaths,
    migrateFromSinglePath,

    // Module Management Methods
    addToLearningPath,
    removeFromLearningPath,
    reorderModules,
    clearLearningPath,
    isInLearningPath,
    createModule,
    addCustomModule,
    removeCustomModule,
    isCustomModule,
    validateModule,

    // Progress Tracking Methods
    updateModuleStatus,
    updateModuleProgress,
    getModuleStatus,
    getModuleProgress,
    getCompletedModulesCount,
    getOverallProgress,

    // Quiz Methods
    completeQuiz,
    getQuizAttempts,
    getQuizStatistics,

    // Certificate Methods
    addCertificate,
    getCertificates,
    getCertificate,
    hasCertificate,

    // Custom Questions Methods
    addCustomQuestion,
    getModuleCustomQuestions,

    // Utility Methods
    formatDuration,
    getDefaultIcon
  }
}