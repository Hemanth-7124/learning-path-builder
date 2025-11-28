<template>
  <div>
    <NuxtRouteAnnouncer />
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 shadow-sm">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex gap-3 items-center">
              <div class="flex justify-center items-center w-8 h-8 bg-indigo-600 rounded-lg">
                <AcademicCapIcon class="w-5 h-5 text-white" />
              </div>
              <h1 class="text-xl font-bold text-gray-900">Learning Path Builder</h1>
            </div>
            <div class="flex gap-4 items-center">
              <span class="text-sm text-gray-600">
                Build your personalized learning journey
              </span>
            </div>
          </div>
        </div>
      </header>

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
        <div v-if="moduleCount > 0" class="p-4 mt-6 bg-white rounded-lg border border-gray-200 lg:hidden">
          <div class="flex justify-between items-center">
            <div class="flex gap-4 items-center text-sm text-gray-600">
              <div class="flex gap-1 items-center">
                <BookOpenIcon class="w-4 h-4" />
                <span>{{ moduleCount }} modules</span>
              </div>
              <div class="flex gap-1 items-center">
                <ClockIcon class="w-4 h-4" />
                <span>{{ formatDuration(totalDuration) }}</span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

// State
const activeTab = ref<'modules' | 'path'>('modules')
const showInstructions = ref(true)
const showModuleCreator = ref(false)

// Composables
const { moduleCount, totalDuration, formatDuration } = useLearningPath()

// Methods
const handleModuleCreated = (module: any) => {
  // Module is already added to available modules via the composable
  console.log('Module created:', module)
  // Optionally, you could show a success message or switch to modules tab
  activeTab.value = 'modules'
}

// Hide instructions if user has already started
onMounted(() => {
  if (moduleCount.value > 0) {
    showInstructions.value = false
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
