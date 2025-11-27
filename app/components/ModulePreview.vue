<template>
  <div class="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50" @click="$emit('close')">
    <div
      class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all"
      @click.stop
    >
      <!-- Header -->
      <div class="sticky top-0 p-6 bg-white rounded-t-xl border-b border-gray-200">
        <div class="flex justify-between items-start">
          <div class="flex gap-4 items-start">
            <div class="flex justify-center items-center w-12 h-12 bg-indigo-100 rounded-lg">
             
              <span class="text-2xl">{{ module.icon }}</span>
            </div>
            <div>
              <h2 class="mb-1 text-2xl font-bold text-gray-900">{{ module.title }}</h2>
              <div class="flex gap-3 items-center text-sm">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full"
                  :class="getDifficultyClass(module.difficulty)"
                >
                  {{ module.difficulty }}
                </span>
                <span class="text-gray-500">{{ module.category }}</span>
              </div>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 transition-colors hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Description -->
        <div>
          <h3 class="mb-2 text-lg font-semibold text-gray-900">Description</h3>
          <p class="leading-relaxed text-gray-600">{{ module.description }}</p>
        </div>

        <!-- Duration & Info -->
        <div class="grid grid-cols-3 gap-4 md:grid-cols-3">
          <div class="flex gap-2 items-center p-3 bg-gray-50 rounded-lg">
            <ClockIcon class="w-5 h-5 text-indigo-600" />
            <div>
              <p class="text-xs text-gray-500">Duration</p>
              <p class="text-sm font-medium text-gray-900">{{ formatDuration(module.duration) }}</p>
            </div>
          </div>
          <div class="flex gap-2 items-center p-3 bg-gray-50 rounded-lg">
            <BookOpenIcon class="w-5 h-5 text-green-600" />
            <div>
              <p class="text-xs text-gray-500">Category</p>
              <p class="text-sm font-medium text-gray-900">{{ module.category }}</p>
            </div>
          </div>
          <div class="flex gap-2 items-center p-3 bg-gray-50 rounded-lg">
            <AcademicCapIcon class="w-5 h-5 text-purple-600" />
            <div>
              <p class="text-xs text-gray-500">Level</p>
              <p class="text-sm font-medium text-gray-900">{{ module.difficulty }}</p>
            </div>
          </div>
      
        </div>

        <!-- Prerequisites -->
        <div v-if="module.prerequisites && module.prerequisites.length > 0">
          <h3 class="mb-3 text-lg font-semibold text-gray-900">Prerequisites</h3>
          <ul class="space-y-2">
            <li
              v-for="prerequisite in module.prerequisites"
              :key="prerequisite"
              class="flex gap-2 items-center text-gray-600"
            >
              <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
              {{ prerequisite }}
            </li>
          </ul>
        </div>

        <!-- Learning Objectives -->
        <div v-if="module.learningObjectives && module.learningObjectives.length > 0">
          <h3 class="mb-3 text-lg font-semibold text-gray-900">Learning Objectives</h3>
        
          <ul class="space-y-3">
            <li
              v-for="objective in module.learningObjectives"
              :key="objective"
              class="flex gap-3 items-start"
            >
              <CheckCircleIcon class="flex-shrink-0 mt-0.5 w-5 h-5 text-green-500" />
              <span class="text-gray-600">{{ objective }}</span>
            </li>
          </ul>
        </div>

        <!-- Topics -->
        <div v-if="module.topics && module.topics.length > 0">
          <h3 class="mb-3 text-lg font-semibold text-gray-900">Topics Covered</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="topic in module.topics"
              :key="topic"
              class="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-full"
            >
              {{ topic }}
            </span>
          </div>
        </div>

        <!-- Resources -->
        <div v-if="module.resources && module.resources.length > 0">
          <h3 class="mb-3 text-lg font-semibold text-gray-900">Resources</h3>
          <div class="space-y-3">
            <a
              v-for="resource in module.resources"
              :key="resource.id"
              :href="resource.url"
              target="_blank"
              class="flex gap-3 items-center p-3 rounded-lg border border-gray-200 transition-colors hover:bg-gray-50"
            >
              <div class="flex justify-center items-center w-10 h-10 bg-indigo-100 rounded-lg">
                <component :is="getResourceIcon(resource.type)" class="w-5 h-5 text-indigo-600" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ resource.title }}</p>
                <p v-if="resource.description" class="text-xs text-gray-500">{{ resource.description }}</p>
              </div>
              <ArrowTopRightOnSquareIcon class="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </div>

     
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 p-6 bg-white rounded-b-xl border-t border-gray-200">
        <div class="flex justify-between items-center">
          <button
            @click="$emit('close')"
            class="px-6 py-2.5 font-medium text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200"
          >
            Close
          </button>
       
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Module } from '~/types'
import {
  XMarkIcon,
  ClockIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  PlayIcon,
  DocumentTextIcon,
  CodeBracketIcon
} from '@heroicons/vue/24/outline'

interface Props {
  module: Module
  showProgressControls?: boolean
  isInLearningPath?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showProgressControls: false,
  isInLearningPath: false
})

const emit = defineEmits<{
  close: []
  'add-to-path': [module: Module]
  'remove-from-path': [moduleId: string]
  'update-status': [moduleId: string, status: 'not-started' | 'in-progress' | 'completed']
}>()

const { formatDuration, isInLearningPath, addToLearningPath, removeFromLearningPath, updateModuleStatus } = useLearningPath()

const getDifficultyClass = (difficulty: string) => {
  const classes = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-red-100 text-red-800'
  }
  return classes[difficulty as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getResourceIcon = (type: string) => {
  const icons = {
    'video': PlayIcon,
    'article': DocumentTextIcon,
    'documentation': DocumentTextIcon,
    'book': BookOpenIcon,
    'course': AcademicCapIcon,
    'tool': CodeBracketIcon
  }
  return icons[type as keyof typeof icons] || DocumentTextIcon
}

const addToPath = () => {
  emit('add-to-path', props.module)
}

const removeFromPath = () => {
  emit('remove-from-path', props.module.id)
}
</script>

<style scoped>
/* Custom scrollbar for the modal content */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>