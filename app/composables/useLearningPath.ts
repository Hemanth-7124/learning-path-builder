import type { Module, LearningPath } from '~/types'

const LEARNING_PATH_KEY = 'learning-path'
const CUSTOM_MODULES_KEY = 'custom-modules'

export const useLearningPath = () => {
  // Sample modules data
  const sampleModules: Module[] = [
    {
      id: 'html-basics',
      title: 'HTML Fundamentals',
      description: 'Learn the basics of HTML including tags, attributes, and semantic markup.',
      duration: 120,
      category: 'Web Development',
      difficulty: 'Beginner',
      icon: '🌐'
    },
    {
      id: 'css-basics',
      title: 'CSS Essentials',
      description: 'Master CSS fundamentals including selectors, properties, and layout techniques.',
      duration: 180,
      category: 'Web Development',
      difficulty: 'Beginner',
      icon: '🎨'
    },
    {
      id: 'javascript-basics',
      title: 'JavaScript Fundamentals',
      description: 'Learn JavaScript programming concepts, DOM manipulation, and basic algorithms.',
      duration: 240,
      category: 'Web Development',
      difficulty: 'Beginner',
      icon: '⚡'
    },
    {
      id: 'react-basics',
      title: 'React Fundamentals',
      description: 'Introduction to React, components, state management, and hooks.',
      duration: 300,
      category: 'Web Development',
      difficulty: 'Intermediate',
      icon: '⚛️'
    },
    {
      id: 'nodejs-basics',
      title: 'Node.js Fundamentals',
      description: 'Server-side JavaScript with Node.js, Express, and basic API development.',
      duration: 280,
      category: 'Backend Development',
      difficulty: 'Intermediate',
      icon: '🟢'
    },
    {
      id: 'database-basics',
      title: 'Database Fundamentals',
      description: 'Introduction to SQL, NoSQL databases, and data modeling concepts.',
      duration: 200,
      category: 'Backend Development',
      difficulty: 'Intermediate',
      icon: '🗄️'
    },
    {
      id: 'git-basics',
      title: 'Git Version Control',
      description: 'Master Git commands, branching, merging, and collaborative workflows.',
      duration: 150,
      category: 'DevOps',
      difficulty: 'Beginner',
      icon: '📦'
    },
    {
      id: 'docker-basics',
      title: 'Docker Fundamentals',
      description: 'Containerization with Docker, images, containers, and Docker Compose.',
      duration: 220,
      category: 'DevOps',
      difficulty: 'Intermediate',
      icon: '🐳'
    },
    {
      id: 'react-native-basics',
      title: 'React Native Fundamentals',
      description: 'Build mobile apps with React Native, components, and platform-specific code.',
      duration: 320,
      category: 'Mobile Development',
      difficulty: 'Intermediate',
      icon: '📱'
    },
    {
      id: 'python-basics',
      title: 'Python Programming',
      description: 'Learn Python fundamentals, data structures, and basic algorithms.',
      duration: 260,
      category: 'Data Science',
      difficulty: 'Beginner',
      icon: '🐍'
    },
    {
      id: 'communication-skills',
      title: 'Effective Communication',
      description: 'Develop verbal and written communication skills for technical professionals.',
      duration: 180,
      category: 'Soft Skills',
      difficulty: 'Beginner',
      icon: '💬'
    },
    {
      id: 'project-management',
      title: 'Agile Project Management',
      description: 'Learn Scrum, Kanban, and agile methodologies for software projects.',
      duration: 200,
      category: 'Soft Skills',
      difficulty: 'Intermediate',
      icon: '📋'
    }
  ]

  // State
  const learningPath = useState<LearningPath>('learning-path', () => ({
    modules: [],
    totalDuration: 0,
    lastUpdated: new Date(),
    name: 'My Learning Path'
  }))

  const customModules = ref<Module[]>([])

  // Computed available modules that combines sample and custom modules
  const availableModules = computed(() => [...sampleModules, ...customModules.value])

  // Computed properties
  const totalDuration = computed(() =>
    learningPath.value.modules.reduce((total, module) => total + module.duration, 0)
  )

  const moduleCount = computed(() => learningPath.value.modules.length)

  // Methods
  const calculateTotalDuration = (modules: Module[]): number => {
    return modules.reduce((total, module) => total + module.duration, 0)
  }

  const addToLearningPath = (module: Module) => {
    // Check if module is already in the learning path
    if (!learningPath.value.modules.find(m => m.id === module.id)) {
      learningPath.value.modules.push(module)
      learningPath.value.totalDuration = calculateTotalDuration(learningPath.value.modules)
      learningPath.value.lastUpdated = new Date()
      saveToLocalStorage()
    }
  }

  const removeFromLearningPath = (moduleId: string) => {
    const index = learningPath.value.modules.findIndex(m => m.id === moduleId)
    if (index > -1) {
      learningPath.value.modules.splice(index, 1)
      learningPath.value.totalDuration = calculateTotalDuration(learningPath.value.modules)
      learningPath.value.lastUpdated = new Date()
      saveToLocalStorage()
    }
  }

  const reorderModules = (oldIndex: number, newIndex: number) => {
    const [movedModule] = learningPath.value.modules.splice(oldIndex, 1)
    learningPath.value.modules.splice(newIndex, 0, movedModule)
    learningPath.value.lastUpdated = new Date()
    saveToLocalStorage()
  }

  const clearLearningPath = () => {
    learningPath.value.modules = []
    learningPath.value.totalDuration = 0
    learningPath.value.lastUpdated = new Date()
    saveToLocalStorage()
  }

  const saveToLocalStorage = () => {
    if (import.meta.client) {
      localStorage.setItem(LEARNING_PATH_KEY, JSON.stringify(learningPath.value))
      localStorage.setItem(CUSTOM_MODULES_KEY, JSON.stringify(customModules.value))
    }
  }

  const loadFromLocalStorage = () => {
    if (import.meta.client) {
      // Load learning path
      const savedPath = localStorage.getItem(LEARNING_PATH_KEY)
      if (savedPath) {
        try {
          const data = JSON.parse(savedPath)
          learningPath.value = {
            ...data,
            lastUpdated: new Date(data.lastUpdated)
          }
        } catch (error) {
          console.error('Error loading learning path from localStorage:', error)
        }
      }

      // Load custom modules
      const savedModules = localStorage.getItem(CUSTOM_MODULES_KEY)
      if (savedModules) {
        try {
          const modules = JSON.parse(savedModules)
          customModules.value = Array.isArray(modules) ? modules : []
        } catch (error) {
          console.error('Error loading custom modules from localStorage:', error)
          customModules.value = []
        }
      }
    }
  }

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) {
      return `${mins}m`
    } else if (mins === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${mins}m`
    }
  }

  const isInLearningPath = (moduleId: string): boolean => {
    return learningPath.value.modules.some(m => m.id === moduleId)
  }

  // Module Creation Methods
  const createModule = (moduleData: Omit<Module, 'id'>): Module => {
    const id = moduleData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now()

    const newModule: Module = {
      ...moduleData,
      id,
      icon: moduleData.icon || getDefaultIcon(moduleData.category)
    }

    return newModule
  }

  const addCustomModule = (moduleData: Omit<Module, 'id'>): void => {
    const newModule = createModule(moduleData)
    customModules.value.push(newModule)
    saveToLocalStorage()
  }

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

  const removeCustomModule = (moduleId: string): void => {
    const index = customModules.value.findIndex(m => m.id === moduleId)
    if (index > -1) {
      customModules.value.splice(index, 1)
      // Also remove from learning path if it's there
      removeFromLearningPath(moduleId)
      saveToLocalStorage()
    }
  }

  const isCustomModule = (moduleId: string): boolean => {
    return customModules.value.some(m => m.id === moduleId)
  }

  // Load from localStorage on initialization
  onMounted(() => {
    loadFromLocalStorage()
  })

  return {
    // State
    learningPath: readonly(learningPath),
    availableModules: readonly(availableModules),

    // Computed
    totalDuration,
    moduleCount,

    // Methods
    addToLearningPath,
    removeFromLearningPath,
    reorderModules,
    clearLearningPath,
    saveToLocalStorage,
    loadFromLocalStorage,
    formatDuration,
    isInLearningPath,

    // Module Creation Methods
    createModule,
    addCustomModule,
    removeCustomModule,
    isCustomModule,
    validateModule,
    getDefaultIcon
  }
}