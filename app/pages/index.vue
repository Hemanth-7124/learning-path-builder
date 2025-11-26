<template>
  <div>
    <NuxtRouteAnnouncer />
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon class="w-5 h-5 text-white" />
              </div>
              <h1 class="text-xl font-bold text-gray-900">Learning Path Builder</h1>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-600">
                Build your personalized learning journey
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Mobile view - tabs -->
        <div class="lg:hidden mb-6">
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
                <span v-if="moduleCount > 0" class="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs">
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
        <div class="lg:grid lg:grid-cols-2 lg:gap-6">
          <!-- Left Panel - Available Modules -->
          <div class="h-[600px] lg:h-[700px]" :class="{ 'hidden lg:block': activeTab !== 'modules' }">
            <ModuleListPanel @create-module="showModuleCreator = true" />
          </div>

          <!-- Right Panel - Learning Path -->
          <div class="h-[600px] lg:h-[700px]" :class="{ 'hidden lg:block': activeTab !== 'path' }">
            <LearningPathPanel />
          </div>
        </div>

        <!-- Quick Stats (Mobile) -->
        <div v-if="moduleCount > 0" class="lg:hidden mt-6 bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-1">
                <BookOpenIcon class="w-4 h-4" />
                <span>{{ moduleCount }} modules</span>
              </div>
              <div class="flex items-center gap-1">
                <ClockIcon class="w-4 h-4" />
                <span>{{ formatDuration(totalDuration) }}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Instructions overlay for first-time users -->
      <div v-if="showInstructions" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Welcome to Learning Path Builder! 🎓</h2>
          <div class="space-y-3 text-sm text-gray-600">
            <div class="flex items-start gap-3">
              <span class="text-indigo-600 font-semibold">1.</span>
              <p>Browse available modules in the left panel</p>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-indigo-600 font-semibold">2.</span>
              <p>Create custom modules using the "Create Module" button</p>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-indigo-600 font-semibold">3.</span>
              <p>Drag modules to the right panel or click "Add" to add them to your path</p>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-indigo-600 font-semibold">4.</span>
              <p>Your progress is automatically saved in your browser</p>
            </div>
          </div>
          <button
            @click="showInstructions = false"
            class="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>

      <!-- Module Creator Modal -->
      <div v-if="showModuleCreator" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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

<style scoped>
/* Custom scrollbar styles */
@media (max-width: 1023px) {
  .lg\\:h-\\[700px\\] {
    height: 500px;
  }
}
</style>