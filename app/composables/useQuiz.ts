import type { Question, QuizAttempt, Module } from '~/types'
import { QUIZ_CONFIG } from '~/types'
import { getRandomQuestions, calculateScore } from '~/data/questionBank'
import { useLearningPath } from '~/composables/useLearningPath'
import { formatTime } from '~/utils/formatting'
import { storage, STORAGE_KEYS } from '~/utils/storage'

export const useQuiz = () => {
  // Quiz state management
  const currentQuiz = ref<QuizAttempt | null>(null)
  const quizAttempts = ref<QuizAttempt[]>([])
  const currentQuestionIndex = ref(0)
  const userAnswers = ref<number[]>([])
  const quizStartTime = ref<Date | null>(null)
  const quizTimer = ref<number>(0)
  const timerInterval = ref<NodeJS.Timeout | null>(null)

  // Enhanced load quiz attempts with bypass protection and manual reset detection
  const loadQuizAttempts = () => {
    if (typeof window !== 'undefined') {
      // Check if localStorage was manually cleared (no quiz attempts data exists)
      const stored = storage.get(STORAGE_KEYS.QUIZ_ATTEMPTS, null)
      const backupStored = storage.get(STORAGE_KEYS.QUIZ_ATTEMPTS_BACKUP, null)
      const timestampStored = storage.get(STORAGE_KEYS.QUIZ_ATTEMPTS_TIMESTAMP, null)

      // If no quiz data exists at all, assume manual reset and clear everything
      if (!stored && !backupStored && !timestampStored) {
        console.log('No quiz data found in localStorage - assuming manual reset, clearing all quiz state')
        quizAttempts.value = []

        // Clear any remaining quiz-related data
        storage.remove(STORAGE_KEYS.QUIZ_ATTEMPTS)
        storage.remove(STORAGE_KEYS.QUIZ_ATTEMPTS_BACKUP)
        storage.remove(STORAGE_KEYS.QUIZ_ATTEMPTS_TIMESTAMP)

        // Also clear any active quiz state
        currentQuiz.value = null
        currentQuestionIndex.value = 0
        userAnswers.value = []
        quizTimer.value = 0
        quizStartTime.value = null
        stopTimer()

        return
      }

      let attempts: any[] = []

      // Load from primary storage (already parsed by storage.get)
      if (stored && Array.isArray(stored)) {
        attempts = stored
      }

      // If primary is empty or invalid, try backup
      if ((attempts.length === 0) && backupStored && Array.isArray(backupStored)) {
        attempts = backupStored
        console.log('Recovered quiz attempts from backup storage')
      }

      // Validate and restore attempts
      quizAttempts.value = attempts.map((attempt: any) => ({
        ...attempt,
        timestamp: new Date(attempt.timestamp)
      }))

      // Save to maintain consistency
      saveQuizAttempts()
    }
  }

  // Enhanced save quiz attempts with backup storage
  const saveQuizAttempts = () => {
    if (typeof window !== 'undefined') {
      // Save to primary storage (storage.set() will handle JSON.stringify)
      storage.set(STORAGE_KEYS.QUIZ_ATTEMPTS, quizAttempts.value)

      // Create backup storage for bypass protection
      storage.set(STORAGE_KEYS.QUIZ_ATTEMPTS_BACKUP, quizAttempts.value)

      // Add timestamp to track last save
      storage.set(STORAGE_KEYS.QUIZ_ATTEMPTS_TIMESTAMP, new Date().toISOString())
    }
  }

  // Start a new quiz
  const startQuiz = async (module: Module): Promise<QuizAttempt | null> => {
    try {
      // Get composable instance
      const { isCustomModule, getAllQuestionsForModule } = useLearningPath()

      let questions: Question[] = []

      if (isCustomModule(module.id)) {
        // Use enhanced question retrieval for custom modules
        questions = await getAllQuestionsForModule(module.id, module.category, module.difficulty)

        if (questions.length > QUIZ_CONFIG.QUESTIONS_PER_QUIZ) {
          // Randomly select questions if we have more than needed
          const shuffled = [...questions].sort(() => 0.5 - Math.random())
          questions = shuffled.slice(0, QUIZ_CONFIG.QUESTIONS_PER_QUIZ)
        }
      } else {
        // Use existing system for predefined modules
        questions = getRandomQuestions(
          module.category,
          module.difficulty,
          QUIZ_CONFIG.QUESTIONS_PER_QUIZ,
          module.id
        )
      }

      if (questions.length === 0) {
        // Show user-friendly alert instead of console error
        const actionMessage = isCustomModule(module.id)
          ? `Please add questions for this custom module by clicking the question management icon in the modules panel.`
          : `Please try another module or contact an administrator to add questions for this module.`

        alert(`No quiz questions available for "${module.title}" at the ${module.difficulty} level.

This module doesn't have specific questions assigned yet.

${actionMessage}`)
        return null
      }

      // Create new quiz attempt
      const newAttempt: QuizAttempt = {
        id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        moduleId: module.id,
        questions,
        userAnswers: [],
        score: 0,
        passed: false,
        timestamp: new Date(),
        timeSpent: 0
      }

      // Initialize quiz state
      currentQuiz.value = newAttempt
      currentQuestionIndex.value = 0
      userAnswers.value = new Array(questions.length).fill(-1)
      quizStartTime.value = new Date()
      quizTimer.value = 0

      // Start timer
      startTimer()

      return newAttempt
    } catch (error) {
      console.error('Error starting quiz:', error)
      return null
    }
  }

  // Start quiz timer
  const startTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }

    timerInterval.value = setInterval(() => {
      quizTimer.value++
    }, 1000)
  }

  // Stop quiz timer
  const stopTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  // Answer current question
  const answerQuestion = (answerIndex: number) => {
    if (!currentQuiz.value) return false

    const questionIndex = currentQuestionIndex.value
    if (questionIndex >= currentQuiz.value.questions.length) return false

    // Update user answer
    userAnswers.value[questionIndex] = answerIndex

    return true
  }

  // Navigate to next question
  const nextQuestion = (): boolean => {
    if (!currentQuiz.value) return false

    if (currentQuestionIndex.value < currentQuiz.value.questions.length - 1) {
      currentQuestionIndex.value++
      return true
    }

    return false
  }

  // Navigate to previous question
  const previousQuestion = (): boolean => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
      return true
    }

    return false
  }

  // Submit quiz and calculate results
  const submitQuiz = (): QuizAttempt | null => {
    if (!currentQuiz.value || !quizStartTime.value) return null

    try {
      stopTimer()

      // Calculate score
      const score = calculateScore(currentQuiz.value.questions, userAnswers.value)
      const passed = score >= QUIZ_CONFIG.PASSING_SCORE

      // Update quiz attempt
      const completedQuiz: QuizAttempt = {
        ...currentQuiz.value,
        userAnswers: [...userAnswers.value],
        score,
        passed,
        timeSpent: quizTimer.value
      }

      // Add to attempts history
      quizAttempts.value.push(completedQuiz)
      saveQuizAttempts()

      // Clear current quiz
      currentQuiz.value = null
      currentQuestionIndex.value = 0
      userAnswers.value = []
      quizTimer.value = 0

      return completedQuiz
    } catch (error) {
      console.error('Error submitting quiz:', error)
      return null
    }
  }

  // Enhanced check if user can attempt quiz with 3-attempt continuous rule
  const canAttemptQuiz = (moduleId: string): boolean => {
    const attempts = quizAttempts.value.filter(attempt => attempt.moduleId === moduleId)

    // Check if user has exactly 3 continuous failed attempts
    const recentAttempts = attempts.slice(-3) // Get last 3 attempts
    const allThreeFailed = recentAttempts.length === 3 && recentAttempts.every(attempt => !attempt.passed)

    if (allThreeFailed) {
      // Check if cooldown period has expired
      const lastAttempt = recentAttempts[2] // The 3rd failed attempt
      if (lastAttempt) {
        const timestamp = typeof lastAttempt.timestamp === 'string'
          ? new Date(lastAttempt.timestamp)
          : lastAttempt.timestamp
        const cooldownEnd = new Date(timestamp.getTime() + QUIZ_CONFIG.ATTEMPT_COOLDOWN)

        if (new Date() < cooldownEnd) {
          return false // Still in cooldown period
        }
        // Cooldown expired, user can attempt again
        return true
      }
    }

    // If less than 3 attempts, or some attempts passed, allow normally
    return true
  }

  // Enhanced get remaining cooldown time with 3-attempt rule
  const getRemainingCooldown = (moduleId: string): number => {
    const attempts = quizAttempts.value.filter(attempt => attempt.moduleId === moduleId)

    // Check if user has exactly 3 continuous failed attempts
    const recentAttempts = attempts.slice(-3) // Get last 3 attempts
    const allThreeFailed = recentAttempts.length === 3 && recentAttempts.every(attempt => !attempt.passed)

    if (!allThreeFailed) {
      return 0 // No cooldown if not 3 continuous failures
    }

    // Calculate cooldown from the 3rd failed attempt
    const lastAttempt = recentAttempts[2] // The 3rd failed attempt
    if (!lastAttempt) return 0

    const timestamp = typeof lastAttempt.timestamp === 'string'
      ? new Date(lastAttempt.timestamp)
      : lastAttempt.timestamp
    const cooldownEnd = new Date(timestamp.getTime() + QUIZ_CONFIG.ATTEMPT_COOLDOWN)
    const remaining = cooldownEnd.getTime() - new Date().getTime()

    return Math.max(0, remaining)
  }

  // Get quiz attempts for a specific module
  const getQuizAttempts = (moduleId: string): QuizAttempt[] => {
    return quizAttempts.value.filter(attempt => attempt.moduleId === moduleId)
  }

  // Get quiz attempt status for UI messaging
  const getQuizAttemptStatus = (moduleId: string): {
    canAttempt: boolean
    remainingCooldown: number
    attemptsUsed: number
    failedAttempts: number
    maxAttempts: number
    isInCooldown: boolean
    message: string
  } => {
    const attempts = getQuizAttempts(moduleId)
    const failedAttempts = attempts.filter(attempt => !attempt.passed).length
    const passedAttempts = attempts.filter(attempt => attempt.passed).length
    const remainingCooldown = getRemainingCooldown(moduleId)
    const canAttempt = canAttemptQuiz(moduleId)

    // Check if user has exactly 3 continuous failed attempts
    const recentAttempts = attempts.slice(-3)
    const allThreeFailed = recentAttempts.length === 3 && recentAttempts.every(attempt => !attempt.passed)
    const isInCooldown = allThreeFailed && remainingCooldown > 0

    let message = ''

    if (isInCooldown) {
      const minutes = Math.ceil(remainingCooldown / 60000)
      message = `Maximum attempts reached. Try again after ${minutes} minute(s).`
    } else if (allThreeFailed && remainingCooldown === 0) {
      message = `You have failed 3 consecutive attempts. You may try again now.`
    } else if (failedAttempts >= 2) {
      message = `You have ${failedAttempts} failed attempt(s). One more failure will trigger a cooldown.`
    } else {
      message = `Quiz available. ${passedAttempts > 0 ? 'Previous attempts: ' + attempts.length : ''}`
    }

    return {
      canAttempt,
      remainingCooldown,
      attemptsUsed: attempts.length,
      failedAttempts,
      maxAttempts: QUIZ_CONFIG.MAX_ATTEMPTS,
      isInCooldown,
      message
    }
  }

  // Manual reset function for localStorage clearing
  const resetQuizSystem = () => {
    if (typeof window !== 'undefined') {
      // Clear all quiz-related localStorage data
      storage.remove(STORAGE_KEYS.QUIZ_ATTEMPTS)
      storage.remove(STORAGE_KEYS.QUIZ_ATTEMPTS_BACKUP)
      storage.remove(STORAGE_KEYS.QUIZ_ATTEMPTS_TIMESTAMP)

      // Force immediate reactive update by clearing array first
      const currentLength = quizAttempts.value.length
      quizAttempts.value.splice(0, currentLength)
      quizAttempts.value = []

      // Clear any active quiz
      currentQuiz.value = null
      currentQuestionIndex.value = 0
      userAnswers.value = []
      quizTimer.value = 0
      quizStartTime.value = null
      stopTimer()
    }
  }

  // Get quiz statistics
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

  // Get current question
  const getCurrentQuestion = (): Question | null => {
    if (!currentQuiz.value) {
      return null
    }

    const questionIndex = currentQuestionIndex.value
    if (questionIndex >= currentQuiz.value.questions.length) {
      return null
    }

    return currentQuiz.value.questions[questionIndex]
  }

  // Get quiz progress
  const getQuizProgress = () => {
    if (!currentQuiz.value) {
      return {
        current: 0,
        total: 0,
        progress: 0
      }
    }

    const current = currentQuestionIndex.value + 1
    const total = currentQuiz.value.questions.length
    const progress = Math.round((current / total) * 100)

    return { current, total, progress }
  }

  // Cancel current quiz
  const cancelQuiz = () => {
    stopTimer()
    currentQuiz.value = null
    currentQuestionIndex.value = 0
    userAnswers.value = []
    quizTimer.value = 0
    quizStartTime.value = null
  }

  // Check if quiz is active
  const isQuizActive = computed(() => currentQuiz.value !== null)

  // Initialize on mount
  onMounted(() => {
    loadQuizAttempts()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    stopTimer()
  })

  return {
    // State
    currentQuiz: readonly(currentQuiz),
    quizAttempts: readonly(quizAttempts),
    currentQuestionIndex: readonly(currentQuestionIndex),
    userAnswers: readonly(userAnswers),
    quizTimer: readonly(quizTimer),
    isQuizActive,

    // Methods
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    cancelQuiz,
    canAttemptQuiz,
    getRemainingCooldown,
    getQuizAttempts,
    getQuizStatistics,
    getCurrentQuestion,
    getQuizProgress,
    formatTime,
    getQuizAttemptStatus,
    loadQuizAttempts,
    resetQuizSystem,

    // Timer formatting
    formattedQuizTimer: computed(() => formatTime(quizTimer.value))
  }
}