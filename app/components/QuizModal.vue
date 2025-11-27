<template>
  <div class="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50" @click="$emit('close')">
    <div
      class="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all"
      @click.stop
    >
      <!-- Header -->
      <div class="sticky top-0 p-6 bg-white rounded-t-xl border-b border-gray-200">
        <div class="flex justify-between items-start">
          <div class="flex gap-4 items-start">
            <div class="flex justify-center items-center w-12 h-12 bg-indigo-100 rounded-lg">
              <QuestionMarkCircleIcon class="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 class="mb-1 text-2xl font-bold text-gray-900">{{ module.title }} Quiz</h2>
              <div class="flex gap-3 items-center text-sm">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full"
                  :class="getDifficultyClass(module.difficulty)"
                >
                  {{ module.difficulty }}
                </span>
                <span class="text-gray-500">{{ module.category }}</span>
                <span class="flex gap-1 items-center text-gray-500">
                  <ClockIcon class="w-4 h-4" />
                  {{ formattedQuizTimer }}
                </span>
              </div>
            </div>
          </div>
          <button
            @click="handleCancel"
            class="text-gray-400 transition-colors hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="mt-4">
          <div class="flex justify-between mb-2 text-sm text-gray-600">
            <span>Question {{ quizProgress.current }} of {{ quizProgress.total }}</span>
            <span>{{ quizProgress.progress }}% Complete</span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full">
            <div
              class="h-2 bg-indigo-600 rounded-full transition-all duration-300"
              :style="{ width: `${quizProgress.progress}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Quiz Content -->

        <!-- Debug Info -->
     

        <div v-if="!quizCompleted" class="space-y-6">
          <!-- Question -->
          <div v-if="currentQuestion">
         

            <div class="flex gap-3 items-start mb-4">
              <span class="flex justify-center items-center w-8 h-8 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                {{ currentQuestionIndex + 1 }}
              </span>
             
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900">{{ currentQuestion.text }}</h3>
              </div>
            </div>

            <!-- Answer Options -->
            <div class="ml-11 space-y-3">
              <label
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                class="flex items-center p-4 rounded-lg border transition-all cursor-pointer"
                :class="{
                  'border-indigo-500 bg-indigo-50': selectedAnswer === index,
                  'border-gray-200 hover:border-gray-300 hover:bg-gray-50': selectedAnswer !== index,
                  'border-green-500 bg-green-50': showFeedback && index === currentQuestion.correctAnswer,
                  'border-red-500 bg-red-50': showFeedback && selectedAnswer === index && index !== currentQuestion.correctAnswer
                }"
              >
                <input
                  :id="`option-${index}`"
                  v-model="selectedAnswer"
                  :value="index"
                  type="radio"
                  name="answer"
                  class="sr-only"
                  :disabled="showFeedback"
                  @change="handleAnswerSelect(index)"
                >
                <div class="flex items-center w-full">
                  <div
                    class="flex justify-center items-center mr-3 w-5 h-5 rounded-full border-2 transition-all"
                    :class="{
                      'border-indigo-600 bg-indigo-600': selectedAnswer === index && !showFeedback,
                      'border-green-600 bg-green-600': showFeedback && index === currentQuestion.correctAnswer,
                      'border-red-600 bg-red-600': showFeedback && selectedAnswer === index && index !== currentQuestion.correctAnswer,
                      'border-gray-300': selectedAnswer !== index && !showFeedback
                    }"
                  >
                    <div
                      v-if="selectedAnswer === index || (showFeedback && index === currentQuestion.correctAnswer)"
                      class="w-2 h-2 bg-white rounded-full"
                    />
                  </div>
                  <span class="flex-1 text-gray-700">{{ option }}</span>
                  <div v-if="showFeedback" class="flex items-center">
                    <CheckCircleIcon
                      v-if="index === currentQuestion.correctAnswer"
                      class="w-5 h-5 text-green-600"
                    />
                    <XCircleIcon
                      v-else-if="selectedAnswer === index && index !== currentQuestion.correctAnswer"
                      class="w-5 h-5 text-red-600"
                    />
                  </div>
                </div>
              </label>
            </div>

            <!-- Feedback -->
            <div
              v-if="showFeedback && currentQuestion.explanation"
              class="p-4 mt-4 rounded-lg"
              :class="{
                'bg-green-50 border border-green-200': isCorrectAnswer,
                'bg-red-50 border border-red-200': !isCorrectAnswer
              }"
            >
              <div class="flex gap-3 items-start">
                <InformationCircleIcon
                  class="mt-0.5 w-5 h-5"
                  :class="{
                    'text-green-600': isCorrectAnswer,
                    'text-red-600': !isCorrectAnswer
                  }"
                />
                <div>
                  <p class="font-medium" :class="{
                    'text-green-800': isCorrectAnswer,
                    'text-red-800': !isCorrectAnswer
                  }">
                    {{ isCorrectAnswer ? 'Correct!' : 'Incorrect' }}
                  </p>
                  <p class="mt-1 text-sm" :class="{
                    'text-green-700': isCorrectAnswer,
                    'text-red-700': !isCorrectAnswer
                  }">
                    {{ currentQuestion.explanation }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quiz Results -->
        <div v-else class="space-y-6 text-center">
          <div class="flex justify-center">
            <div
              class="flex justify-center items-center w-20 h-20 rounded-full"
              :class="{
                'bg-green-100': quizResults?.passed,
                'bg-red-100': !quizResults?.passed
              }"
            >
              <component
                :is="quizResults?.passed ? CheckCircleIcon : XCircleIcon"
                class="w-10 h-10"
                :class="{
                  'text-green-600': quizResults?.passed,
                  'text-red-600': !quizResults?.passed
                }"
              />
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-2xl font-bold text-gray-900">
              {{ quizResults?.passed ? 'Congratulations!' : 'Quiz Not Passed' }}
            </h3>
            <p class="text-gray-600">
              {{ quizResults?.passed
                ? 'You have successfully completed the quiz and can now mark this module as completed.'
                : `You need ${QUIZ_CONFIG.PASSING_SCORE}% to pass. Review the material and try again.`
              }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 p-6 mx-auto max-w-md bg-gray-50 rounded-lg">
            <div>
              <p class="text-sm text-gray-500">Score</p>
              <p class="text-2xl font-bold" :class="{
                'text-green-600': quizResults?.passed,
                'text-red-600': !quizResults?.passed
              }">
                {{ quizResults?.score }}%
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Time</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ formatTime(quizResults?.timeSpent || 0) }}
              </p>
            </div>
          </div>

          <div v-if="quizResults?.passed" class="space-y-3">
            <p class="text-lg font-medium text-gray-900">Ready for your certificate?</p>
            <button
              @click="handleCertificate"
              class="flex gap-2 justify-center items-center px-6 py-3 w-full font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg transition-colors hover:from-indigo-700 hover:to-purple-700"
            >
              <TrophyIcon class="w-5 h-5" />
              Generate Certificate
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="!quizCompleted" class="sticky bottom-0 p-6 bg-gray-50 rounded-b-xl border-t border-gray-200">
        <div class="flex justify-between items-center">
          <div class="flex gap-3">
            <button
              v-if="currentQuestionIndex > 0"
              @click="handlePrevious"
              class="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              v-if="currentQuestionIndex < quizProgress.total - 1"
              @click="handleNext"
              :disabled="selectedAnswer === -1"
              class="px-4 py-2 text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div class="flex gap-3">
            <button
              @click="handleCancel"
              class="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
            >
              Cancel Quiz
            </button>

            <button
              v-if="currentQuestionIndex === quizProgress.total - 1"
              @click="handleSubmit"
              :disabled="!allQuestionsAnswered"
              class="px-6 py-2 text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Module, QuizAttempt } from '~/types'
import { QUIZ_CONFIG } from '~/types'
import { useQuiz } from '~/composables/useQuiz'
import { nextTick } from 'vue'
import {
  XMarkIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  TrophyIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  module: Module
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  'quiz-completed': [result: QuizAttempt]
  'generate-certificate': [module: Module, quizResult: QuizAttempt]
}>()


// Use quiz composable
const {
  startQuiz,
  currentQuiz,
  currentQuestionIndex,
  userAnswers,
  quizTimer,
  getCurrentQuestion,
  getQuizProgress,
  answerQuestion,
  nextQuestion,
  previousQuestion,
  submitQuiz,
  cancelQuiz,
  formattedQuizTimer
} = useQuiz()

// Local state
const selectedAnswer = ref(-1)
const showFeedback = ref(false)
const quizCompleted = ref(false)
const quizResults = ref<QuizAttempt | null>(null)

// Computed properties
const currentQuestion = computed(() => getCurrentQuestion())
const quizProgress = computed(() => getQuizProgress())
const allQuestionsAnswered = computed(() =>
  userAnswers.value.every(answer => answer !== -1)
)
const isCorrectAnswer = computed(() => {
  if (!currentQuestion.value || selectedAnswer.value === -1) return false
  return selectedAnswer.value === currentQuestion.value.correctAnswer
})

// Initialize quiz when modal opens
watch(() => props.isOpen, (newVal, oldVal) => {
  console.log('QuizModal watch triggered - isOpen changed from', oldVal, 'to', newVal)
  if (newVal) {
    console.log('QuizModal is opening, calling startQuizForModule')
    // Use immediate execution for better reliability
    nextTick().then(() => {
      startQuizForModule()
    })
  }
}, { immediate: true })

// Also watch for module changes
watch(() => props.module, (newModule) => {
  console.log('Module changed:', newModule?.title)
  if (newModule && props.isOpen) {
    console.log('Module changed while open, restarting quiz')
    nextTick().then(() => {
      startQuizForModule()
    })
  }
})

// Start quiz for current module
const startQuizForModule = () => {
  console.log('=== startQuizForModule called ===')
  console.log('Module props:', props.module)
  console.log('Before startQuiz - currentQuiz:', currentQuiz.value)

  selectedAnswer.value = -1
  showFeedback.value = false
  quizCompleted.value = false
  quizResults.value = null

  console.log('Calling startQuiz...')
  const quiz = startQuiz(props.module)
  console.log('startQuiz returned:', quiz)
  console.log('After startQuiz - currentQuiz:', currentQuiz.value)

  if (!quiz) {
    console.error('Failed to start quiz')
    emit('close')
  } else {
    console.log('Quiz started successfully!')
  }
}

// Handle answer selection
const handleAnswerSelect = (answerIndex: number) => {
  if (showFeedback.value) return

  selectedAnswer.value = answerIndex
  answerQuestion(answerIndex)

  // Show immediate feedback but don't auto-advance
  showFeedback.value = true
  console.log('Answer selected:', answerIndex, 'Feedback shown:', showFeedback.value)
}

// Navigate to next question
const handleNext = () => {
  if (nextQuestion()) {
    selectedAnswer.value = userAnswers.value[currentQuestionIndex.value]
    showFeedback.value = false
  }
}

// Navigate to previous question
const handlePrevious = () => {
  if (previousQuestion()) {
    selectedAnswer.value = userAnswers.value[currentQuestionIndex.value]
    showFeedback.value = false
  }
}

// Submit quiz
const handleSubmit = () => {
  console.log('=== handleSubmit called ===')
  const result = submitQuiz()
  console.log('submitQuiz returned:', result)

  if (result) {
    quizCompleted.value = true
    quizResults.value = result

    console.log('Quiz result:', {
      score: result.score,
      passed: result.passed,
      userAnswers: result.userAnswers
    })

    // Automatically show certificate modal for passed quizzes
    if (result.passed) {
      console.log('Quiz passed! Emitting generate-certificate event')
      console.log('Emitting with module:', props.module)
      console.log('Emitting with result:', result)

      // Add delay to ensure state updates
      nextTick(() => {
        emit('generate-certificate', props.module, result)
        console.log('generate-certificate event emitted')
      })
    } else {
      console.log('Quiz failed. Showing results without certificate.')
    }

    emit('quiz-completed', result)
  }
}

// Cancel quiz
const handleCancel = () => {
  if (confirm('Are you sure you want to cancel the quiz? Your progress will be lost.')) {
    cancelQuiz()
    emit('close')
  }
}

// Handle certificate generation
const handleCertificate = () => {
  if (quizResults.value) {
    emit('generate-certificate', props.module, quizResults.value)
  }
}

// Format time helper
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Helper function to get difficulty class
const getDifficultyClass = (difficulty: string) => {
  const classes = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-red-100 text-red-800'
  }
  return classes[difficulty as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// Initialize on mount
onMounted(() => {
  console.log('QuizModal mounted with isOpen:', props.isOpen)
  if (props.isOpen && props.module) {
    console.log('QuizModal is open on mount, starting quiz')
    nextTick().then(() => {
      startQuizForModule()
    })
  }
})
</script>