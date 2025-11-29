<template>
  <div class="relative path-selector-container">
    <button
      @click="showDropdown = !showDropdown"
      class="flex gap-2 items-center px-3 py-2 min-w-0 max-w-xs text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <div
        v-if="currentLearningPath"
        class="flex-shrink-0 w-2 h-2 rounded-full"
        :style="{ backgroundColor: currentLearningPath.color || '#6366f1' }"
      ></div>
      <span class="truncate">{{ currentLearningPath?.name || 'Select Path' }}</span>
      <ChevronDownIcon
        class="w-4 h-4 text-gray-400 transition-transform"
        :class="{ 'rotate-180': showDropdown }"
      />
    </button>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="overflow-hidden absolute right-0 z-50 mt-1 w-72 max-h-96 bg-white rounded-lg border border-gray-200 shadow-lg"
    >
      <!-- Search Bar -->
      <div class="p-3 border-b border-gray-200">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
          <input
            v-model="searchQuery"
            @click.stop
            placeholder="Search paths..."
            class="py-2 pr-4 pl-10 w-full text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Path List -->
      <div class="overflow-y-auto max-h-64">
        <div v-if="filteredPathsList.length === 0" class="p-4 text-sm text-center text-gray-500">
          {{ searchQuery ? 'No paths found' : 'No paths created yet' }}
        </div>

        <div
          v-for="path in filteredPathsList"
          :key="path.id"
          @click="selectPath(path.id)"
          class="p-3 w-full text-left border-b border-gray-100 transition-colors cursor-pointer"
          :class="{
            'bg-indigo-50 border-indigo-200': path.id === activePathId
          }"
        >
          <div class="flex gap-3 items-center">
            <div
              class="flex-shrink-0 w-3 h-3 rounded-full"
              :style="{ backgroundColor: path.color || '#6366f1' }"
            ></div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center">
                <p class="text-sm font-medium text-gray-900 truncate">{{ path.name }}</p>
             
              </div>
              <div class="flex gap-2 items-center mt-1">
                <span class="text-xs text-gray-500">{{ path.modules?.length || 0 }} modules</span>
                <span class="text-xs text-gray-400">•</span>
                <span class="text-xs text-gray-500">{{ formatDuration(path.totalDuration || 0) }}</span>
                <span v-if="path.overallProgress > 0" class="text-xs text-gray-400">•</span>
                <span v-if="path.overallProgress > 0" class="text-xs font-medium" :class="getPathProgressColor(path.overallProgress)">
                  {{ path.overallProgress }}%
                </span>
              </div>
              <div v-if="path.tags && path.tags.length > 0" class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="tag in path.tags.slice(0, 2)"
                  :key="tag"
                  class="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded"
                >
                  {{ tag }}
                </span>
                <span v-if="path.tags.length > 2" class="text-xs text-gray-500">
                  +{{ path.tags.length - 2 }}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-1 items-end">
              <CheckIcon
                v-if="path.id === activePathId"
                class="w-5 h-5 text-indigo-600"
              />
              <div class="text-xs text-gray-400">
                {{ formatDate(path.lastUpdated) }}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>

    <!-- Overlay -->
    <div
      v-if="showDropdown"
      @click="showDropdown = false"
      class="fixed inset-0 z-40"
    ></div>

    <!-- Path Details Panel -->
    <div
      v-if="selectedPathDetails"
      class="absolute right-0 left-0 top-full z-50 p-4 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg"
    >
      <div class="flex justify-between items-start mb-3">
        <div class="flex gap-3 items-center">
          <div
            class="flex-shrink-0 w-4 h-4 rounded-full"
            :style="{ backgroundColor: selectedPathDetails.color || '#6366f1' }"
          ></div>
          <div>
            <h4 class="font-semibold text-gray-900">{{ selectedPathDetails.name }}</h4>
            <p v-if="selectedPathDetails.description" class="mt-1 text-sm text-gray-600">{{ selectedPathDetails.description }}</p>
          </div>
        </div>
        <button
          @click="selectedPathDetails = null"
          class="text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>

      <!-- Path Stats -->
      <div class="grid grid-cols-3 gap-4 mb-4">
        <div class="p-2 text-center bg-gray-50 rounded">
          <div class="text-lg font-semibold text-gray-900">{{ selectedPathDetails.modules?.length || 0 }}</div>
          <div class="text-xs text-gray-600">Modules</div>
        </div>
        <div class="p-2 text-center bg-blue-50 rounded">
          <div class="text-lg font-semibold text-blue-600">{{ formatDuration(selectedPathDetails.totalDuration || 0) }}</div>
          <div class="text-xs text-gray-600">Duration</div>
        </div>
        <div class="p-2 text-center bg-green-50 rounded">
          <div class="text-lg font-semibold text-green-600">{{ selectedPathDetails.overallProgress || 0 }}%</div>
          <div class="text-xs text-gray-600">Progress</div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="selectedPathDetails.overallProgress > 0" class="mb-4">
        <div class="flex justify-between mb-1 text-xs text-gray-600">
          <span>Overall Progress</span>
          <span>{{ selectedPathDetails.overallProgress }}%</span>
        </div>
        <div class="overflow-hidden w-full h-2 bg-gray-200 rounded-full">
          <div
            class="h-full transition-all duration-300"
            :class="getProgressBarColor(selectedPathDetails.overallProgress)"
            :style="{ width: `${selectedPathDetails.overallProgress}%` }"
          ></div>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="selectedPathDetails.tags && selectedPathDetails.tags.length > 0" class="mb-4">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="tag in selectedPathDetails.tags"
            :key="tag"
            class="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Recent Modules -->
      <div v-if="selectedPathDetails.modules && selectedPathDetails.modules.length > 0">
        <h5 class="mb-2 text-sm font-medium text-gray-700">Recent Modules</h5>
        <div class="space-y-2">
          <div
            v-for="(module, index) in selectedPathDetails.modules.slice(0, 3)"
            :key="module.id"
            class="flex gap-2 items-center p-2 bg-gray-50 rounded"
          >
            <span class="text-xs font-medium text-gray-500">{{ index + 1 }}.</span>
            <span class="flex-1 text-sm text-gray-700 truncate">{{ module.title }}</span>
            <span
              v-if="module.status === 'completed'"
              class="text-xs text-green-600"
            >
              ✓
            </span>
          </div>
        </div>
        <div v-if="selectedPathDetails.modules.length > 3" class="mt-2 text-xs text-center text-gray-500">
          ... and {{ selectedPathDetails.modules.length - 3 }} more modules
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 pt-3 mt-4 border-t border-gray-200">
        <button
          @click="activatePath(selectedPathDetails.id)"
          class="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100"
        >
          Switch to Path
        </button>
        <button
          @click="selectedPathDetails = null"
          class="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronDownIcon,
  CheckIcon,
  PlusIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  InformationCircleIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils/formatting'

// State
const showDropdown = ref(false)
const searchQuery = ref('')
const selectedPathDetails = ref(null)

// Composables
const {
  currentLearningPath,
  activePathId,
  formatDuration
} = useLearningPath()

const {
  switchToPath,
  startCreatePath,
  searchPaths,
  filteredPaths
} = usePathManager()

// Computed
const filteredPathsList = computed(() => {
  try {
    if (!searchQuery?.value?.trim()) {
      return filteredPaths?.value || []
    }
    return searchPaths(searchQuery.value) || []
  } catch (error) {
    console.warn('Error in filteredPathsList:', error)
    return []
  }
})

// Methods
const selectPath = (pathId: string) => {
  switchToPath(pathId)
  showDropdown.value = false
}

const showPathDetails = (pathId: string) => {
  const path = filteredPaths.value?.find(p => p.id === pathId)
  if (path) {
    selectedPathDetails.value = path
  }
}

const activatePath = (pathId: string) => {
  switchToPath(pathId)
  selectedPathDetails.value = null
}

const createNewPath = () => {
  startCreatePath()
  showDropdown.value = false
}

const managePaths = () => {
  // Emit event to parent or use composable
  showDropdown.value = false
  navigateTo('#manage-paths')
}

const getPathProgressColor = (progress: number): string => {
  if (progress >= 80) return 'text-green-600'
  if (progress >= 50) return 'text-yellow-600'
  return 'text-gray-600'
}

const getProgressBarColor = (progress: number): string => {
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 50) return 'bg-yellow-500'
  return 'bg-gray-400'
}

const formatDate = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date'
    }

    const now = new Date()
    const diffTime = Math.abs(now.getTime() - dateObj.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
    return `${Math.floor(diffDays / 365)}y ago`
  } catch (error) {
    console.error('Error formatting relative date:', error, 'Input:', date)
    return 'Invalid date'
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.path-selector-container')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>