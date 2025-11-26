<template>
  <div class="h-full flex flex-col bg-white rounded-lg border border-gray-200">
    <!-- Header with search and filters -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Available Modules</h2>
        <button
          @click="$emit('create-module')"
          class="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon class="w-4 h-4" />
          Create Module
        </button>
      </div>

      <!-- Search -->
      <div class="relative mb-4">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search modules..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-2">
        <!-- Category filter -->
        <select
          v-model="selectedCategory"
          class="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <!-- Difficulty filter -->
        <select
          v-model="selectedDifficulty"
          class="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Levels</option>
          <option v-for="difficulty in difficulties" :key="difficulty" :value="difficulty">
            {{ difficulty }}
          </option>
        </select>

        <!-- Clear filters -->
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Modules list -->
    <div class="flex-1 p-4 overflow-y-auto scrollbar-thin">
      <!-- Results count -->
      <div v-if="filteredModules.length > 0" class="mb-4 text-sm text-gray-600">
        Showing {{ filteredModules.length }} of {{ availableModules.length }} modules
      </div>

      <!-- No results -->
      <div
        v-if="filteredModules.length === 0"
        class="flex flex-col items-center justify-center py-12 text-gray-400"
      >
        <MagnifyingGlassIcon class="w-12 h-12 mb-3" />
        <p class="text-lg font-medium mb-1">No modules found</p>
        <p class="text-sm text-center">Try adjusting your search or filters</p>
      </div>

      <!-- Module grid -->
      <div v-else class="grid grid-cols-1 gap-4">
        <ModuleCard
          v-for="module in filteredModules"
          :key="module.id"
          :module="module"
          :is-in-path="isInPath(module.id)"
          :show-delete-button="isCustomModule(module.id)"
          @add="addToPath"
          @delete="deleteCustomModule"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Module } from '~/types'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { CATEGORIES, DIFFICULTY_LEVELS } from '~/types'

const emit = defineEmits<{
  'create-module': []
}>()

const {
  availableModules,
  addToLearningPath,
  isInLearningPath,
  removeCustomModule,
  isCustomModule
} = useLearningPath()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedDifficulty = ref('')

const categories = CATEGORIES
const difficulties = DIFFICULTY_LEVELS

// Computed filtered modules
const filteredModules = computed(() => {
  let modules = availableModules.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    modules = modules.filter(module =>
      module.title.toLowerCase().includes(query) ||
      module.description.toLowerCase().includes(query) ||
      module.category.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (selectedCategory.value) {
    modules = modules.filter(module => module.category === selectedCategory.value)
  }

  // Difficulty filter
  if (selectedDifficulty.value) {
    modules = modules.filter(module => module.difficulty === selectedDifficulty.value)
  }

  return modules
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value || selectedDifficulty.value
})

const isInPath = (moduleId: string) => {
  return isInLearningPath(moduleId)
}

const addToPath = (module: Module) => {
  addToLearningPath(module)
}

const deleteCustomModule = (moduleId: string) => {
  if (confirm('Are you sure you want to delete this custom module? This will also remove it from your learning path if it was added.')) {
    removeCustomModule(moduleId)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedDifficulty.value = ''
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>