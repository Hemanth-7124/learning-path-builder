<template>
  <div class="flex flex-col h-full bg-white rounded-lg border border-gray-200">
    <!-- Header -->
    <div class="p-6 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="mb-1 text-2xl font-bold text-gray-900">Your Learning Path</h2>
          <p class="text-sm text-gray-600">Build and organize your personalized learning journey</p>
        </div>
        <button
          v-if="moduleCount > 0"
          @click="clearPath"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm transition-all duration-200 hover:bg-red-700"
        >
          Clear All
        </button>
      </div>

      <!-- Stats -->
   <div class="flex flex-col gap-4 justify-between items-start p-4 bg-white rounded-xl border border-gray-100 shadow-sm sm:flex-row sm:items-center">
  
  <!-- Stats Section -->
  <div class="flex flex-wrap gap-4 items-center">
    
    <div class="flex gap-2 items-center px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      <BookOpenIcon class="w-5 h-5 text-indigo-600" />
      <span class="text-sm font-medium text-gray-900">
        {{ moduleCount }} Modules
      </span>
    </div>

    <div class="flex gap-2 items-center px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      <ClockIcon class="w-5 h-5 text-green-600" />
      <span class="text-sm font-medium text-gray-900">
        {{ formatDuration(totalDuration) }}
      </span>
    </div>

    <div
      v-if="getCompletedModulesCount() > 0"
      class="flex gap-2 items-center px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm"
    >
      <CheckCircleIcon class="w-5 h-5 text-green-600" />
      <span class="text-sm font-medium text-gray-900">
        {{ getCompletedModulesCount() }} Completed
      </span>
    </div>

  </div>

  <!-- Progress Section -->
  <div v-if="moduleCount > 0" class="flex gap-2 items-center">
    <span class="text-xs text-gray-600 whitespace-nowrap">
      Overall Progress
    </span>

    <div class="overflow-hidden w-32 h-2 bg-gray-200 rounded-full">
      <div
        class="h-full bg-green-500 rounded-full transition-all duration-500"
        :style="{ width: `${getOverallProgress()}%` }"
      ></div>
    </div>

    <span class="text-xs font-semibold text-gray-900">
      {{ getOverallProgress() }}%
    </span>
  </div>

</div>

    </div>

    <!-- Drop Zone -->
    <div
      class="overflow-y-auto flex-1 p-4 transition-all duration-200 scrollbar-thin"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      :class="{
        'drag-over': isDragOver,
        'bg-indigo-50 border-indigo-200 border-dashed': isDragOver
      }"
    >
      <!-- Empty state -->
    <div
  v-if="moduleCount === 0"
  class="flex flex-col gap-6 justify-center items-center px-8 py-16 h-full text-center"
>

  <!-- Icon -->
  <div class="flex justify-center items-center w-24 h-24 bg-indigo-100 rounded-full">
    <AcademicCapIcon class="w-12 h-12 text-indigo-600" />
  </div>

  <!-- Heading -->
  <h3 class="text-xl font-semibold text-gray-900">
    Your learning path is empty
  </h3>

  <!-- Subtext -->
  <p class="max-w-sm text-gray-600">
    Drag modules from the left panel to start building your personalized learning journey
  </p>

  <!-- Drag Instructions -->
  <div class="flex flex-col gap-2 text-sm text-gray-500">
    <div class="flex gap-2 justify-center items-center">
      <div class="w-4 h-4 rounded border-2 border-gray-300 border-dashed"></div>
      <span>Drag modules here</span>
    </div>
    <div class="flex gap-2 justify-center items-center">
      <div class="w-4 h-4 rounded border-2 border-gray-300 border-dashed"></div>
      <span>Reorder by dragging</span>
    </div>
  </div>

</div>

      <!-- Learning path modules -->
      <div v-else class="space-y-6 w-full">
        <div
          v-for="(module, index) in learningPath.modules"
          :key="module.id"
          class="relative transition-all duration-300 group/item hover:translate-x-2"
          :class="{
            'opacity-50': draggedModuleIndex === index,
            'border-t-4 border-indigo-400': draggedOverModuleIndex === index && draggedModuleIndex !== null
          }"
          draggable="true"
          @dragstart="handleModuleDragStart($event, index)"
          @dragover="handleModuleDragOver($event)"
          @dragenter="handleModuleDragEnter($event, index)"
          @drop="handleModuleDrop($event, index)"
          @dragend="handleModuleDragEnd"
        >
          <!-- Enhanced module number with animation -->
          <div class="absolute -left-4 top-6 z-20 transform -translate-y-1/2">
            <div class="relative">
              <div class="flex justify-center items-center w-10 h-10 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full ring-4 ring-white shadow-xl transition-all duration-300 group-hover:ring-indigo-200 group-hover:scale-110">
                {{ index + 1 }}
              </div>
              <!-- Pulse animation for active module -->
              <div class="absolute inset-0 w-10 h-10 bg-indigo-400 rounded-full opacity-0 animate-ping group-hover:opacity-20"></div>
            </div>
          </div>

          <!-- Enhanced connection line -->
          <div class="absolute top-0 bottom-0 left-0 w-0.5 bg-gradient-to-b from-indigo-300 via-purple-200 to-transparent opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:w-1"></div>

          <!-- Module card with premium styling -->
          <div class="relative ml-10">
            <!-- Background glow effect -->
            <div class="absolute -inset-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-70"></div>

            <!-- Drop zone indicator -->
            <div
              v-if="draggedOverModuleIndex === index && draggedModuleIndex !== null"
              class="flex absolute right-0 left-0 -inset-y-2 z-50 justify-center items-center bg-indigo-100 rounded-2xl border-2 border-indigo-400 border-dashed"
              @dragover="handleModuleDragOver($event)"
              @drop="handleModuleDrop($event, index)"
            >
              <span class="font-medium text-indigo-600">Drop here to reorder</span>
            </div>

            <!-- Module card container -->
            <div class="relative">
              <ModuleCard
                :module="module"
                :allow-duplicate="true"
                show-remove-button
                :show-add-button="false"
                draggable
                :index="index"
                :show-progress="true"
                :enable-preview="true"
                @remove="removeFromPath"
                @dragstart="handleModuleDragStart($event, index)"
                @dragend="handleModuleDragEnd"
                @update-status="updateModuleStatus"
                @preview="handleModulePreview"
                @start-quiz="handleStartQuiz"
                custom-class="rounded-2xl border-2 border-gray-200 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400 hover:shadow-2xl bg-white/95 group-hover:bg-white"
              />
            </div>

            <!-- Drag handle indicator -->
            <div class="flex absolute top-0 bottom-0 left-0 items-center opacity-0 transition-opacity duration-200 group-hover:opacity-60">
              <div class="flex flex-col gap-1 p-2">
                <div class="w-1 h-1 bg-indigo-400 rounded-full"></div>
                <div class="w-1 h-1 bg-indigo-400 rounded-full"></div>
                <div class="w-1 h-1 bg-indigo-400 rounded-full"></div>
              </div>
            </div>

            <!-- Hover indicator -->
            <div class="absolute -right-3 top-1/2 opacity-0 transition-all duration-300 transform -translate-y-1/2 group-hover:opacity-100">
              <div class="flex justify-center items-center w-6 h-6 bg-indigo-100 rounded-full">
                <svg class="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer with export options -->
    <div v-if="moduleCount > 0" class="p-6 bg-gradient-to-r from-gray-50 via-indigo-50 to-purple-50 border-t border-gray-200 backdrop-blur-sm">
      <div class="flex justify-between items-center">
        <!-- Enhanced timestamp -->
        <div class="flex gap-3 items-center">
          <div class="flex justify-center items-center w-8 h-8 bg-white rounded-full border border-gray-200 shadow-sm">
            <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500">Last updated</p>
            <p class="text-sm font-semibold text-gray-700">{{ formatDate(learningPath.lastUpdated) }}</p>
          </div>
        </div>

        <!-- Enhanced action buttons -->
        <div class="flex gap-3">
          <button
            @click="showExportModal = true"
            class="inline-flex relative gap-2 items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg transition-all duration-300 group hover:shadow-xl hover:scale-105 hover:from-indigo-700 hover:to-purple-700"
          >
            <span class="relative z-10">Export Learning Path</span>
            <svg class="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <!-- Button shine effect -->
            <div class="absolute inset-0 bg-gradient-to-r to-transparent rounded-xl opacity-0 transition-opacity duration-300 from-white/20 group-hover:opacity-100"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <ExportModal
      v-if="showExportModal"
      :learning-path="learningPath"
      @close="showExportModal = false"
      @error="handleExportError"
    />

    <!-- Module Preview Modal -->
    <ModulePreview
      v-if="showPreviewModal && previewModule"
      :module="previewModule"
      :show-progress-controls="true"
      :is-in-learning-path="isInLearningPath(previewModule.id)"
      @close="showPreviewModal = false"
      @add-to-path="addToLearningPath"
      @remove-from-path="removeFromLearningPath"
      @update-status="updateModuleStatus"
    />

    <!-- Quiz Modal -->
    <QuizModal
      v-if="showQuizModal && quizModule"
      :module="quizModule"
      :is-open="showQuizModal"
      @close="showQuizModal = false"
      @quiz-completed="handleQuizCompleted"
      @generate-certificate="handleGenerateCertificate"
    />

    <!-- Certificate Modal -->
    <CertificateModal
      v-if="showCertificateModal && certificateModule"
      :module="certificateModule"
      :quiz-result="certificateQuizResult || undefined"
      @close="showCertificateModal = false"
      @certificate-generated="handleCertificateGenerated"
    />
  </div>
</template>

<script setup lang="ts">
import type { Module, QuizAttempt, Certificate } from '../types'
import { useQuiz } from '~/composables/useQuiz'

import {
  BookOpenIcon,
  ClockIcon,
  AcademicCapIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

// Import ExportModal component
import ExportModal from './ExportModal.vue'
import ModulePreview from './ModulePreview.vue'
import QuizModal from './QuizModal.vue'
import CertificateModal from './CertificateModal.vue'

const {
  learningPath,
  totalDuration,
  moduleCount,
  removeFromLearningPath,
  clearLearningPath,
  formatDuration,
  reorderModules,
  updateModuleStatus,
  getCompletedModulesCount,
  getOverallProgress,
  isInLearningPath,
  completeQuiz,
  addCertificate,
  getCertificate
} = useLearningPath()

// Use quiz composable
const { canAttemptQuiz, getRemainingCooldown, getQuizAttemptStatus } = useQuiz()

const isDragOver = ref(false)
const draggedModuleIndex = ref<number | null>(null)
const draggedOverModuleIndex = ref<number | null>(null)

// Export modal state
const showExportModal = ref(false)

// Preview modal state
const showPreviewModal = ref(false)
const previewModule = ref<Module | null>(null)

// Quiz modal state
const showQuizModal = ref(false)
const quizModule = ref<Module | null>(null)

// Certificate modal state
const showCertificateModal = ref(false)
const certificateModule = ref<Module | null>(null)
const certificateQuizResult = ref<QuizAttempt | null>(null)

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  try {
    const moduleData = event.dataTransfer?.getData('application/json')
    if (moduleData) {
      const module: Module = JSON.parse(moduleData)
      addToLearningPath(module)
    }
  } catch (error) {
    console.error('Error parsing dropped module:', error)
  }
}

const addToLearningPath = (module: Module) => {
  const { addToLearningPath: addModule } = useLearningPath()
  addModule(module)
}

const removeFromPath = (moduleId: string) => {
  removeFromLearningPath(moduleId)
}

// Custom drag and drop for reordering
const handleModuleDragStart = (event: DragEvent, index: number) => {
  console.log('Drag started at index:', index)
  draggedModuleIndex.value = index
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('text/plain', index.toString())
}

const handleModuleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
  console.log('Drag over event triggered')
}

const handleModuleDragEnter = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (draggedModuleIndex.value !== null && draggedModuleIndex.value !== index) {
    draggedOverModuleIndex.value = index
    console.log('Drag enter index:', index)
  }
}

const handleModuleDrop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault()
  event.stopPropagation()
  console.log('Drop on index:', dropIndex, 'From index:', draggedModuleIndex.value)

  const dragIndex = draggedModuleIndex.value

  if (dragIndex !== null && dragIndex !== dropIndex) {
    console.log('Before reordering - dragIndex:', dragIndex, 'dropIndex:', dropIndex)
    console.log('Current modules before:', learningPath.value.modules.map((m, i) => `${i}: ${m.title}`))

    // Use the existing reorderModules function from the composable
    reorderModules(dragIndex, dropIndex)

    console.log('After reordering - new modules:', learningPath.value.modules.map((m, i) => `${i}: ${m.title}`))
    console.log('Reordering completed and saved')
  } else {
    console.log('No reordering needed - same index or null')
  }

  // Reset drag state
  draggedOverModuleIndex.value = null
  draggedModuleIndex.value = null
}

const handleModuleDragEnd = () => {
  console.log('Drag ended')
  draggedModuleIndex.value = null
  draggedOverModuleIndex.value = null
}

const clearPath = () => {
  if (confirm('Are you sure you want to clear your entire learning path?')) {
    clearLearningPath()
  }
}

const exportAsJSON = () => {
  const dataStr = JSON.stringify(learningPath.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'learning-path.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const handleModulePreview = (module: Module) => {
  previewModule.value = module
  showPreviewModal.value = true
}

const handleStartQuiz = (module: Module) => {
  // Always open the quiz modal - let the modal handle the lock UI
  quizModule.value = module
  showQuizModal.value = true
}

const handleQuizCompleted = (quizResult: QuizAttempt) => {
  console.log('=== handleQuizCompleted called ===')
  console.log('Quiz result passed:', quizResult.passed)

  if (quizModule.value) {
    // Complete the quiz in the learning path
    completeQuiz(quizModule.value.id, quizResult)

    // Only close quiz modal if quiz failed (certificate modal will handle closing if passed)
    if (!quizResult.passed) {
      console.log('Quiz failed, closing quiz modal')
      showQuizModal.value = false
      quizModule.value = null
    } else {
      console.log('Quiz passed, keeping quiz modal open for certificate handling')
    }
  }
}

const handleGenerateCertificate = (module: Module, quizResult: QuizAttempt) => {
  console.log('=== handleGenerateCertificate called ===')
  console.log('Module:', module.title)
  console.log('Quiz result:', quizResult)

  certificateModule.value = module
  certificateQuizResult.value = quizResult

  console.log('Setting showCertificateModal to true')
  console.log('Certificate module set to:', certificateModule.value)
  console.log('Certificate quiz result set to:', certificateQuizResult.value)

  // Close quiz modal and open certificate modal
  showQuizModal.value = false
  showCertificateModal.value = true

  console.log('showCertificateModal.value:', showCertificateModal.value)
  console.log('Should show certificate modal now')
}

const handleCertificateGenerated = (certificate: Certificate) => {
  // Save certificate using useLearningPath
  addCertificate(certificate)

  // Update module to completed status
  if (certificateModule.value) {
    updateModuleStatus(certificateModule.value.id, 'completed')
  }

  // Close certificate modal
  showCertificateModal.value = false
  certificateModule.value = null
  certificateQuizResult.value = null
}

const handleExportError = (message: string) => {
  // Show error to user (could be enhanced with a toast notification)
  alert(message)
  console.error('Export error:', message)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>


<style scoped>
.drag-over {
  background-color: rgba(99, 102, 241, 0.05);
  border-color: rgb(99, 102, 241);
  border-style: dashed;
}

.rotate-2 {
  transform: rotate(2deg);
}

/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.5); }
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-110 {
  animation: float 3s ease-in-out infinite;
}

/* ✔ FIXED: escaped slash */
.group\/item {
  animation: slide-in 0.4s ease-out;
  animation-fill-mode: both;
}

.group\/item:nth-child(1) { animation-delay: 0.1s; }
.group\/item:nth-child(2) { animation-delay: 0.2s; }
.group\/item:nth-child(3) { animation-delay: 0.3s; }
.group\/item:nth-child(4) { animation-delay: 0.4s; }
.group\/item:nth-child(5) { animation-delay: 0.5s; }
.group\/item:nth-child(n+6) { animation-delay: 0.6s; }

/* Enhanced transitions */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glass morphism */
.bg-white\/95 {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Enhanced scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #9ca3af, #6b7280);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #6b7280, #4b5563);
  background-clip: content-box;
}

/* Enhanced shadow */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(99, 102, 241, 0.1);
}

/* Animated gradient */
.bg-gradient-to-r.from-indigo-600.to-purple-600 {
  background-size: 200% 100%;
  animation: gradient-shift 3s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Pulse animation */
.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Hover shadow */
.group-hover\:shadow-2xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
              0 0 0 1px rgba(99, 102, 241, 0.2);
}

/* Scale transform */
.group-hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Custom drag and drop styling */
.dragging-item {
  opacity: 0.5;
  transform: scale(0.95);
  cursor: grabbing !important;
}

.drop-indicator {
  background-color: rgba(99, 102, 241, 0.1);
  border: 2px dashed rgb(99, 102, 241);
  border-radius: 12px;
}

/* Drag handle cursor */
.cursor-move {
  cursor: move;
}
</style>
