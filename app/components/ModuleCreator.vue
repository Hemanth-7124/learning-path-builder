<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Create Custom Module</h3>
      <button
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-600"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Module Title *
        </label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., Advanced Vue.js Patterns"
          :class="{ 'border-red-300 focus:ring-red-500': errors.title }"
        />
        <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          v-model="formData.description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Describe what users will learn in this module..."
          :class="{ 'border-red-300 focus:ring-red-500': errors.description }"
        />
        <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
      </div>

      <!-- Duration and Category in grid -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Duration -->
        <div>
          <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes) *
          </label>
          <input
            id="duration"
            v-model.number="formData.duration"
            type="number"
            min="5"
            step="5"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="60"
            :class="{ 'border-red-300 focus:ring-red-500': errors.duration }"
          />
          <p v-if="errors.duration" class="mt-1 text-sm text-red-600">{{ errors.duration }}</p>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            v-model="formData.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            :class="{ 'border-red-300 focus:ring-red-500': errors.category }"
          >
            <option value="">Select a category</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
        </div>
      </div>

      <!-- Difficulty -->
      <div>
        <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-1">
          Difficulty Level *
        </label>
        <div class="flex gap-3">
          <label
            v-for="difficulty in difficulties"
            :key="difficulty"
            class="flex-1"
          >
            <input
              :id="difficulty"
              v-model="formData.difficulty"
              type="radio"
              :value="difficulty"
              class="sr-only peer"
            />
            <div
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md border-2 cursor-pointer text-center transition-colors',
                formData.difficulty === difficulty
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              ]"
            >
              {{ difficulty }}
            </div>
          </label>
        </div>
        <p v-if="errors.difficulty" class="mt-1 text-sm text-red-600">{{ errors.difficulty }}</p>
      </div>

      <!-- Icon (optional) -->
      <div>
        <label for="icon" class="block text-sm font-medium text-gray-700 mb-1">
          Icon (optional)
        </label>
        <input
          id="icon"
          v-model="formData.icon"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="🚀"
          maxlength="2"
        />
        <p class="mt-1 text-sm text-gray-500">
          Add an emoji to represent your module (optional)
        </p>
      </div>

      <!-- Preview -->
      <div v-if="formData.title" class="border-t pt-4">
        <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
        <div class="p-3 bg-gray-50 rounded-md">
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ previewIcon }}</span>
              <h4 class="font-medium text-gray-900">{{ formData.title || 'Module Title' }}</h4>
            </div>
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="getDifficultyClass(formData.difficulty)"
            >
              {{ formData.difficulty || 'Beginner' }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-2">{{ formData.description || 'Module description...' }}</p>
          <div class="flex items-center gap-4 text-xs text-gray-500">
            <span class="bg-gray-100 px-2 py-1 rounded">{{ formData.category || 'Category' }}</span>
            <span>{{ formatDuration(formData.duration || 60) }}</span>
          </div>
        </div>
      </div>

      <!-- Form Errors -->
      <div v-if="formErrors.length > 0" class="bg-red-50 border border-red-200 rounded-md p-3">
        <p class="text-sm font-medium text-red-800 mb-1">Please fix the following errors:</p>
        <ul class="text-sm text-red-700 space-y-1">
          <li v-for="error in formErrors" :key="error" class="flex items-start gap-1">
            <span>•</span>
            <span>{{ error }}</span>
          </li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-4">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">Creating...</span>
          <span v-else>Create Module</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Module } from '../types'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { CATEGORIES, DIFFICULTY_LEVELS } from '../types'

interface Props {
  isOpen?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  created: [module: Module]
}>()

// Composables
const { addCustomModule, validateModule, formatDuration, getDefaultIcon } = useLearningPath()

// Data
const formData = ref({
  title: '',
  description: '',
  duration: 60,
  category: '',
  difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
  icon: ''
})

const errors = ref<Record<string, string>>({})
const formErrors = ref<string[]>([])
const isSubmitting = ref(false)

const categories = CATEGORIES
const difficulties = DIFFICULTY_LEVELS

// Computed
const previewIcon = computed(() => {
  return formData.value.icon || getDefaultIcon(formData.value.category || 'Web Development')
})

// Methods
const getDifficultyClass = (difficulty: string) => {
  const classes = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-red-100 text-red-800'
  }
  return classes[difficulty as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const validateForm = (): boolean => {
  errors.value = {}
  formErrors.value = []

  // Basic field validation
  if (!formData.value.title || formData.value.title.trim().length < 3) {
    errors.value.title = 'Title must be at least 3 characters long'
  }

  if (!formData.value.description || formData.value.description.trim().length < 10) {
    errors.value.description = 'Description must be at least 10 characters long'
  }

  if (!formData.value.duration || formData.value.duration < 5) {
    errors.value.duration = 'Duration must be at least 5 minutes'
  }

  if (!formData.value.category) {
    errors.value.category = 'Please select a category'
  }

  if (!formData.value.difficulty) {
    errors.value.difficulty = 'Please select a difficulty level'
  }

  // Use composable validation for additional checks
  const validation = validateModule(formData.value)
  if (!validation.isValid) {
    formErrors.value = validation.errors
  }

  return Object.keys(errors.value).length === 0 && formErrors.value.length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const newModule = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      duration: formData.value.duration,
      category: formData.value.category,
      difficulty: formData.value.difficulty,
      icon: formData.value.icon || undefined
    }

    addCustomModule(newModule)

    // Reset form
    formData.value = {
      title: '',
      description: '',
      duration: 60,
      category: '',
      difficulty: 'Beginner',
      icon: ''
    }

    emit('close')
  } catch (error) {
    console.error('Error creating module:', error)
    formErrors.value = ['An error occurred while creating the module. Please try again.']
  } finally {
    isSubmitting.value = false
  }
}
</script>