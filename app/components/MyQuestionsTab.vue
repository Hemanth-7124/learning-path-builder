<template>
  <div>
    <!-- Header with Add Button -->
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-semibold text-gray-900">
        Custom Questions ({{ questions.length }})
      </h3>

    </div>



    <!-- Question Cards -->
    <div v-if="questions.length > 0" class="space-y-4">
      <div
        v-for="question in questions"
        :key="question.id"
        class="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <div class="flex gap-3 items-center mb-2">
              <span
                class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                :class="getDifficultyClass(question.difficulty)"
              >
                {{ question.difficulty }}
              </span>
              <span class="text-xs text-gray-500">
                Created {{ formatDate(question.createdAt) }}
              </span>
              <span v-if="question.updatedAt" class="text-xs text-gray-500">
                • Updated {{ formatDate(question.updatedAt) }}
              </span>
            </div>
            <h4 class="mb-2 font-medium text-gray-900">{{ question.text }}</h4>
          </div>
          <div class="flex gap-2 ml-4">
            <button
              @click="$emit('edit', question)"
              class="p-1 text-gray-400 hover:text-indigo-600"
              title="Edit question"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button
              @click="$emit('delete', question.id)"
              class="p-1 text-gray-400 hover:text-red-600"
              title="Delete question"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Options Preview -->
        <div class="space-y-2">
          <div
            v-for="(option, index) in question.options"
            :key="index"
            class="flex gap-3 items-center p-2 rounded-md"
            :class="{
              'bg-green-50 border border-green-200': index === question.correctAnswer,
              'bg-gray-50': index !== question.correctAnswer
            }"
          >
            <span class="text-sm font-medium text-gray-600">{{ String.fromCharCode(65 + index) }}.</span>
            <span class="text-sm text-gray-800">{{ option }}</span>
            <span v-if="index === question.correctAnswer" class="ml-auto text-xs font-medium text-green-700">
              Correct
            </span>
          </div>
        </div>

        <!-- Explanation (if exists) -->
        <div v-if="question.explanation" class="p-3 mt-3 bg-blue-50 rounded-md border border-blue-200">
          <p class="text-sm text-blue-800">
            <span class="font-medium">Explanation:</span> {{ question.explanation }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomQuestion } from '~/types'
import {
  QuestionMarkCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

interface Props {
  moduleId: string
  questions: CustomQuestion[]
}

defineProps<Props>()
defineEmits<{
  create: []
  edit: [question: CustomQuestion]
  delete: [questionId: string]
  import: []
}>()

// Helper functions
const getDifficultyClass = (difficulty: string) => {
  const classes = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800'
  }
  return classes[difficulty as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date: Date | string | number) => {
  try {
    let dateObj: Date

    if (date instanceof Date) {
      dateObj = date
    } else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date)
    } else {
      return 'Invalid date'
    }

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided:', date)
      return 'Invalid date'
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', date)
    return 'Invalid date'
  }
}
</script>