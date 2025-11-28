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

      <!-- Prerequisites (optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Prerequisites (optional)
        </label>
        <div class="space-y-2 mb-3">
          <div v-for="(prerequisite, index) in formData.prerequisitesList" :key="index" class="flex gap-2">
            <input
              v-model="formData.prerequisitesList[index]"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Basic JavaScript knowledge"
            />
            <button
              type="button"
              @click="removePrerequisite(index)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
        <button
          type="button"
          @click="addPrerequisite"
          class="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          + Add Prerequisite
        </button>
        <p class="mt-1 text-sm text-gray-500">
          List any prior knowledge or skills needed for this module
        </p>
      </div>

      <!-- Learning Objectives (optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Learning Objectives (optional)
        </label>
        <div class="space-y-2 mb-3">
          <div v-for="(objective, index) in formData.learningObjectivesList" :key="index" class="flex gap-2">
            <input
              v-model="formData.learningObjectivesList[index]"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Understand Vue.js reactivity system"
            />
            <button
              type="button"
              @click="removeLearningObjective(index)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
        <button
          type="button"
          @click="addLearningObjective"
          class="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          + Add Learning Objective
        </button>
        <p class="mt-1 text-sm text-gray-500">
          What will learners be able to do after completing this module?
        </p>
      </div>

      <!-- Topics (optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Topics Covered (optional)
        </label>
        <div class="space-y-2 mb-3">
          <div v-for="(topic, index) in formData.topicsList" :key="index" class="flex gap-2">
            <input
              v-model="formData.topicsList[index]"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Vue.js Components"
            />
            <button
              type="button"
              @click="removeTopic(index)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
        <button
          type="button"
          @click="addTopic"
          class="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          + Add Topic
        </button>
        <p class="mt-1 text-sm text-gray-500">
          List the main topics that will be covered in this module
        </p>
      </div>

      <!-- Resources (optional) -->
      <div>
        <label for="resources" class="block text-sm font-medium text-gray-700 mb-1">
          Resources & Materials (optional)
        </label>
        <div class="space-y-2 mb-3">
          <div v-for="(resource, index) in formData.resourceList" :key="index" class="flex gap-2">
            <input
              v-model="resource.title"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Resource title (e.g., Vue.js Documentation)"
            />
            <select
              v-model="resource.type"
              class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="documentation">Documentation</option>
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="course">Course</option>
              <option value="book">Book</option>
              <option value="tool">Tool</option>
            </select>
            <input
              v-model="resource.url"
              type="url"
              class="w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="URL (optional)"
            />
            <button
              type="button"
              @click="removeResource(index)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
        <button
          type="button"
          @click="addResource"
          class="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          + Add Resource
        </button>
        <p class="mt-1 text-sm text-gray-500">
          Add helpful resources like documentation, tutorials, videos, or tools
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
import { getDifficultyClass } from '../utils/formatting'
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
const { addCustomModule, validateModule, formatDuration, getDefaultIcon, createModule } = useLearningPath()

// Data
const formData = ref({
  title: '',
  description: '',
  duration: 60,
  category: '',
  difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
  icon: '',
  prerequisitesList: [] as string[],
  learningObjectivesList: [] as string[],
  topicsList: [] as string[],
  resourceList: [] as { title: string; type: 'video' | 'article' | 'documentation' | 'book' | 'course' | 'tool'; url?: string }[]
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

const addPrerequisite = () => {
  formData.value.prerequisitesList.push('')
}

const removePrerequisite = (index: number) => {
  formData.value.prerequisitesList.splice(index, 1)
}

const addLearningObjective = () => {
  formData.value.learningObjectivesList.push('')
}

const removeLearningObjective = (index: number) => {
  formData.value.learningObjectivesList.splice(index, 1)
}

const addTopic = () => {
  formData.value.topicsList.push('')
}

const removeTopic = (index: number) => {
  formData.value.topicsList.splice(index, 1)
}

const addResource = () => {
  formData.value.resourceList.push({
    title: '',
    type: 'documentation',
    url: ''
  })
}

const removeResource = (index: number) => {
  formData.value.resourceList.splice(index, 1)
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
    const moduleData = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      duration: formData.value.duration,
      category: formData.value.category,
      difficulty: formData.value.difficulty,
      icon: formData.value.icon || undefined,
      prerequisites: formData.value.prerequisitesList.length > 0
        ? formData.value.prerequisitesList
            .filter(item => item.trim())
            .map(item => item.trim())
        : undefined,
      learningObjectives: formData.value.learningObjectivesList.length > 0
        ? formData.value.learningObjectivesList
            .filter(item => item.trim())
            .map(item => item.trim())
        : undefined,
      topics: formData.value.topicsList.length > 0
        ? formData.value.topicsList
            .filter(item => item.trim())
            .map(item => item.trim())
        : undefined,
      resources: formData.value.resourceList.length > 0
        ? formData.value.resourceList
            .filter(resource => resource.title.trim())
            .map((resource, index) => ({
              id: `resource-${Date.now()}-${index}`,
              title: resource.title.trim(),
              type: resource.type,
              url: resource.url?.trim() || undefined,
              description: undefined
            }))
        : undefined
    }

    // Create the module to get the complete module object with ID
    const newModule = createModule(moduleData)

    // Add to custom modules (this will update availableModules automatically)
    addCustomModule(moduleData)

    // Reset form
    formData.value = {
      title: '',
      description: '',
      duration: 60,
      category: '',
      difficulty: 'Beginner',
      icon: '',
      prerequisitesList: [],
      learningObjectivesList: [],
      topicsList: [],
      resourceList: []
    }

    // Emit the created module with full module data
    emit('created', newModule)
    emit('close')
  } catch (error) {
    console.error('Error creating module:', error)
    formErrors.value = ['An error occurred while creating the module. Please try again.']
  } finally {
    isSubmitting.value = false
  }
}
</script>