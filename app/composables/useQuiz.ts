import type { Question, QuizAttempt, Module } from '~/types'
import { QUIZ_CONFIG } from '~/types'
import { getRandomQuestions, calculateScore } from '~/data/questionBank'

export const useQuiz = () => {
  // Quiz state management
  const currentQuiz = ref<QuizAttempt | null>(null)
  const quizAttempts = ref<QuizAttempt[]>([])
  const currentQuestionIndex = ref(0)
  const userAnswers = ref<number[]>([])
  const quizStartTime = ref<Date | null>(null)
  const quizTimer = ref<number>(0)
  const timerInterval = ref<NodeJS.Timeout | null>(null)

  // Load quiz attempts from localStorage
  const loadQuizAttempts = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('quiz-attempts')
      if (stored) {
        try {
          const attempts = JSON.parse(stored)
          quizAttempts.value = Array.isArray(attempts) ? attempts.map((attempt: any) => ({
            ...attempt,
            timestamp: new Date(attempt.timestamp)
          })) : []
        } catch (error) {
          console.error('Error loading quiz attempts from localStorage:', error)
          quizAttempts.value = []
        }
      }
    }
  }

  // Save quiz attempts to localStorage
  const saveQuizAttempts = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quiz-attempts', JSON.stringify(quizAttempts.value))
    }
  }

  // Start a new quiz
  const startQuiz = (module: Module): QuizAttempt | null => {
    try {
      console.log('=== useQuiz startQuiz ===')
      console.log('Module:', module.title)
      console.log('Category:', module.category)
      console.log('Difficulty:', module.difficulty)

      const questions = getRandomQuestions(
        module.category,
        module.difficulty,
        QUIZ_CONFIG.QUESTIONS_PER_QUIZ
      )

      console.log('Questions retrieved:', questions.length)

      if (questions.length === 0) {
        console.error(`No questions available for ${module.category} - ${module.difficulty}`)
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
      console.log('Set currentQuiz.value to:', currentQuiz.value)

      currentQuestionIndex.value = 0
      userAnswers.value = new Array(questions.length).fill(-1)
      quizStartTime.value = new Date()
      quizTimer.value = 0

      console.log('Final currentQuiz.value before return:', currentQuiz.value)

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

  // Check if user can attempt quiz
  const canAttemptQuiz = (moduleId: string): boolean => {
    const attempts = quizAttempts.value.filter(attempt => attempt.moduleId === moduleId)

    // Check max attempts
    if (attempts.length >= QUIZ_CONFIG.MAX_ATTEMPTS) {
      return false
    }

    // Check cooldown period
    const lastAttempt = attempts[attempts.length - 1]
    if (lastAttempt) {
      // Handle both Date objects and string timestamps
      const timestamp = typeof lastAttempt.timestamp === 'string'
        ? new Date(lastAttempt.timestamp)
        : lastAttempt.timestamp
      const cooldownEnd = new Date(timestamp.getTime() + QUIZ_CONFIG.ATTEMPT_COOLDOWN)
      if (new Date() < cooldownEnd) {
        return false
      }
    }

    return true
  }

  // Get remaining cooldown time in milliseconds
  const getRemainingCooldown = (moduleId: string): number => {
    const attempts = quizAttempts.value.filter(attempt => attempt.moduleId === moduleId)
    const lastAttempt = attempts[attempts.length - 1]

    if (!lastAttempt) return 0

    // Handle both Date objects and string timestamps
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

  // Format time for display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

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

    // Timer formatting
    formattedQuizTimer: computed(() => formatTime(quizTimer.value))
  }
}