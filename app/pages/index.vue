<template>
  <div>
    <NuxtRouteAnnouncer />
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 shadow-sm">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Left Section - Logo and Title -->
            <div class="flex gap-3 items-center">
              <div class="flex justify-center items-center w-8 h-8 bg-indigo-600 rounded-lg">
                <AcademicCapIcon class="w-5 h-5 text-white" />
              </div>
              <h1 class="text-xl font-bold text-gray-900">Learning Path Builder</h1>
            </div>

            <!-- Center Section - Path Selector (Desktop) -->
            <div class="hidden md:block">
              <PathSelector />
            </div>

            <!-- Right Section - Actions -->
            <div class="flex gap-3 items-center">
              <!-- Path Management Button (Desktop) -->
              <button
                @click="showPathManager = true"
                class="flex gap-2 items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Cog6ToothIcon class="w-4 h-4" />
                <span class="hidden lg:inline">Manage Paths</span>
              </button>

              <!-- Mobile Path Selector -->
              <button
                @click="showMobilePathSelector = true"
                class="flex gap-2 items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 md:hidden"
              >
                <SwatchIcon class="w-4 h-4" />
                <span>{{ currentLearningPath?.name || 'Select Path' }}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Mobile Path Selector Bar -->
      <div v-if="currentLearningPath" class="md:hidden bg-gray-50 border-b border-gray-200">
        <div class="px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: currentLearningPath.color || '#6366f1' }"
              ></div>
              <div>
                <h3 class="text-sm font-medium text-gray-900">{{ currentLearningPath.name }}</h3>
                <p class="text-xs text-gray-500">{{ moduleCount || 0 }} modules • {{ formatDuration(totalDuration || 0) }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900">{{ overallProgress || 0 }}%</div>
              <div class="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-indigo-600 transition-all duration-300"
                  :style="{ width: `${overallProgress || 0}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <main class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <!-- Mobile view - tabs -->
        <div class="mb-6 lg:hidden">
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px">
              <button
                @click="activeTab = 'modules'"
                :class="[
                  activeTab === 'modules'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'w-1/2 py-2 px-1 text-center border-b-2 font-medium text-sm'
                ]"
              >
                Available Modules
              </button>
              <button
                @click="activeTab = 'path'"
                :class="[
                  activeTab === 'path'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'w-1/2 py-2 px-1 text-center border-b-2 font-medium text-sm'
                ]"
              >
                Your Learning Path
                <span v-if="moduleCount > 0" class="px-2 py-0.5 ml-2 text-xs text-indigo-600 bg-indigo-100 rounded-full">
                  {{ moduleCount }}
                </span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Mobile Panels -->
        <div class="lg:hidden">
          <!-- Available Modules Panel (Mobile) -->
          <div v-show="activeTab === 'modules'" class="h-[500px] mb-6">
            <ModuleListPanel @create-module="showModuleCreator = true" />
          </div>

          <!-- Learning Path Panel (Mobile) -->
          <div v-show="activeTab === 'path'" class="h-[500px] mb-6">
            <LearningPathPanel />
          </div>
        </div>

        <!-- Desktop view - two panels -->
        <div class="hidden lg:grid lg:grid-cols-2 lg:gap-6">
          <!-- Left Panel - Available Modules -->
          <div class="h-[600px] lg:h-[700px]">
            <ModuleListPanel @create-module="showModuleCreator = true" />
          </div>

          <!-- Right Panel - Learning Path -->
          <div class="h-[600px] lg:h-[700px]">
            <LearningPathPanel />
          </div>
        </div>

        <!-- Quick Stats (Mobile) -->
        <div v-if="(moduleCount || 0) > 0" class="p-4 mt-6 bg-white rounded-lg border border-gray-200 lg:hidden">
          <div class="flex justify-between items-center">
            <div class="flex gap-4 items-center text-sm text-gray-600">
              <div class="flex gap-1 items-center">
                <BookOpenIcon class="w-4 h-4" />
                <span>{{ moduleCount || 0 }} modules</span>
              </div>
              <div class="flex gap-1 items-center">
                <ClockIcon class="w-4 h-4" />
                <span>{{ formatDuration(totalDuration || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Instructions overlay for first-time users -->
      <div v-if="showInstructions" class="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
        <div class="p-6 w-full max-w-md bg-white rounded-lg">
          <h2 class="mb-4 text-xl font-bold text-gray-900">Welcome to Learning Path Builder! 🎓</h2>
          <div class="space-y-3 text-sm text-gray-600">
            <div class="flex gap-3 items-start">
              <span class="font-semibold text-indigo-600">1.</span>
              <p>Browse available modules in the left panel</p>
            </div>
            <div class="flex gap-3 items-start">
              <span class="font-semibold text-indigo-600">2.</span>
              <p>Create custom modules using the "Create Module" button</p>
            </div>
            <div class="flex gap-3 items-start">
              <span class="font-semibold text-indigo-600">3.</span>
              <p>Drag modules to the right panel or click "Add" to add them to your path</p>
            </div>
            <div class="flex gap-3 items-start">
              <span class="font-semibold text-indigo-600">4.</span>
              <p>Your progress is automatically saved in your browser</p>
            </div>
          </div>
          <button
            @click="showInstructions = false"
            class="px-4 py-2 mt-6 w-full text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700"
          >
            Get Started
          </button>
        </div>
      </div>

      <!-- Module Creator Modal -->
      <div v-if="showModuleCreator" class="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
        <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <ModuleCreator
            @close="showModuleCreator = false"
            @created="handleModuleCreated"
          />
        </div>
      </div>

      <!-- Path Manager Modal -->
      <PathManager
        v-if="showPathManager"
        @close="showPathManager = false"
      />

      <!-- Mobile Path Selector Modal -->
      <div v-if="showMobilePathSelector" class="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
        <div class="w-full max-w-md">
          <div class="p-4 bg-white rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Select Learning Path</h3>
              <button
                @click="showMobilePathSelector = false"
                class="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
            <div class="space-y-2">
              <button
                v-for="path in filteredPaths"
                :key="path.id"
                @click="selectPath(path.id)"
                class="w-full p-3 text-left border rounded-lg transition-colors"
                :class="[
                  path.id === activePathId
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:bg-gray-50'
                ]"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-3 h-3 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: path.color || '#6366f1' }"
                  ></div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ path.name }}</p>
                    <p class="text-xs text-gray-500">{{ path.modules.length }} modules</p>
                  </div>
                  <CheckIcon
                    v-if="path.id === activePathId"
                    class="w-5 h-5 text-indigo-600 flex-shrink-0"
                  />
                </div>
              </button>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
              <button
                @click="createNewPath"
                class="w-full px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
              >
                Create New Path
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  Cog6ToothIcon,
  SwatchIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

// State
const activeTab = ref<'modules' | 'path'>('modules')
const showInstructions = ref(true)
const showModuleCreator = ref(false)
const showPathManager = ref(false)
const showMobilePathSelector = ref(false)

// Composables
const {
  moduleCount,
  totalDuration,
  overallProgress,
  formatDuration,
  currentLearningPath,
  activePathId
} = useLearningPath()

const {
  switchToPath,
  startCreatePath,
  filteredPaths
} = usePathManager()

// Methods
const handleModuleCreated = (module: any) => {
  // Module is already added to available modules via the composable
  console.log('Module created:', module)
  // Optionally, you could show a success message or switch to modules tab
  activeTab.value = 'modules'
}

const selectPath = (pathId: string) => {
  switchToPath(pathId)
  showMobilePathSelector.value = false
}

const createNewPath = () => {
  startCreatePath()
  showMobilePathSelector.value = false
  showPathManager.value = true
}

// Hide instructions if user has already started
onMounted(() => {
  try {
    if (moduleCount?.value > 0 || (filteredPaths?.value?.length > 0 && filteredPaths.value[0]?.modules?.length > 0)) {
      showInstructions.value = false
    }
  } catch (error) {
    console.warn('Error in onMounted:', error)
    // Keep instructions visible if there's an error
  }
})

// Set page metadata
useHead({
  title: 'Learning Path Builder',
  meta: [
    {
      name: 'description',
      content: 'Build your personalized learning journey by selecting and arranging modules in your preferred order.'
    }
  ]
})

// Page layout meta
definePageMeta({
  layout: 'default'
})
</script>

<style>
/* Custom scrollbar styles */
@media (max-width: 1023px) {
  .lg\:h-\[700px\] {
    height: 500px;
  }
}
</style>
