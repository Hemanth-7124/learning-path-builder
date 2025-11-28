<template>
  <div class="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50" @click="$emit('close')">
    <div
      class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all"
      @click.stop
    >
      <!-- Header -->
      <div class="sticky top-0 p-6 bg-white rounded-t-xl border-b border-gray-200">
        <div class="flex justify-between items-start">
          <div class="flex gap-4 items-start">
            <div class="flex justify-center items-center w-12 h-12 bg-indigo-100 rounded-lg">
              <TrophyIcon class="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 class="mb-1 text-2xl font-bold text-gray-900">Certificate of Completion</h2>
              <p class="text-gray-600">{{ module.title }}</p>
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
        <!-- Certificate Preview -->
        <div class="overflow-hidden rounded-lg border-2 border-gray-200">
          <div
            id="certificate-preview"
            class="relative p-8 text-center bg-gradient-to-br from-indigo-50 to-purple-50"
            style="min-height: 600px;"
          >
            <!-- Certificate Border -->
            <div class="absolute inset-4 rounded-lg border-4 border-indigo-200 border-double"></div>

            <!-- Certificate Content -->
            <div class="flex relative z-10 flex-col justify-center items-center p-8 h-full">
              <!-- Header -->
              <div class="mb-8">
                <TrophyIcon class="mx-auto mb-4 w-16 h-16 text-yellow-500" />
                <h1 class="mb-2 text-3xl font-bold text-gray-800">Certificate of Completion</h1>
                <div class="mx-auto w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              </div>

              <!-- Recipient Name -->
              <div class="mb-8">
                <p class="mb-2 text-lg text-gray-600">This is to certify that</p>
                <div v-if="!isEditingName" class="cursor-pointer" @click="startEditingName">
                  <h2 class="pb-1 text-3xl font-bold text-indigo-600 border-b-2 border-indigo-300 border-dashed">
                    {{ learnerName || 'Your Name' }}
                  </h2>
                </div>
                <input
                  v-else
                  ref="nameInput"
                  v-model="tempLearnerName"
                  type="text"
                  class="px-4 py-2 text-3xl font-bold text-center text-indigo-600 rounded border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your name"
                  @blur="finishEditingName"
                  @keydown.enter="finishEditingName"
                  @keydown.escape="cancelEditingName"
                >
                <p class="mt-2 text-sm text-gray-700">
                  <template v-if="!isEditingName">Click name to edit</template>
                  <template v-else>Press Enter to save or Escape to cancel</template>
                </p>
              </div>

              <!-- Achievement Description -->
              <div class="mb-8 max-w-2xl">
                <p class="leading-relaxed text-gray-700">
                  has successfully completed the module
                </p>
                <h3 class="mt-2 text-2xl font-bold text-gray-800">{{ module.title }}</h3>
                <p class="mt-1 text-gray-600">{{ module.category }} • {{ module.difficulty }}</p>
              </div>

              <!-- Details -->
              <div class="grid grid-cols-2 gap-8 mx-auto mb-8 max-w-md text-left">
                <div>
                  <p class="text-sm text-gray-600">Duration</p>
                  <p class="font-semibold text-gray-800">{{ formatDuration(module.duration) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Score</p>
                  <p class="font-semibold text-green-600">{{ quizResult?.score || 100 }}%</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Completion Date</p>
                  <p class="font-semibold text-gray-800">{{ formatDate(new Date()) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Certificate ID</p>
                  <p class="font-semibold text-gray-800">{{ certificateId }}</p>
                </div>
              </div>

              <!-- Signature Lines -->
              <div class="grid grid-cols-2 gap-8 mx-auto mt-12 max-w-md">
                <div class="text-center">
                  <div class="mb-2 border-b-2 border-gray-400"></div>
                  <p class="text-sm text-gray-600">Learning Path Builder</p>
                  <p class="text-xs text-gray-500">Platform</p>
                </div>
                <div class="text-center">
                  <div class="mb-2 border-b-2 border-gray-400"></div>
                  <p class="text-sm text-gray-600">{{ learnerName || 'Recipient' }}</p>
                  <p class="text-xs text-gray-500">Learner</p>
                </div>
              </div>

              <!-- Verification Note -->
              <div class="mt-8 text-xs text-gray-500">
                <p>Verify this certificate at: learning-path-builder.app/verify/{{ certificateId }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-4 justify-center items-center sm:flex-row">
          <button
            @click="handleDownloadPDF"
            :disabled="!learnerName || isGeneratingPDF"
            class="flex gap-2 justify-center items-center px-6 py-3 font-medium text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon v-if="!isGeneratingPDF" class="w-5 h-5" />
            <div v-else class="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
            {{ isGeneratingPDF ? 'Generating...' : 'Download PDF' }}
          </button>

          <button
            @click="handlePrint"
            :disabled="!learnerName"
            class="flex gap-2 justify-center items-center px-6 py-3 font-medium text-white bg-gray-600 rounded-lg transition-colors hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PrinterIcon class="w-5 h-5" />
            Print Certificate
          </button>

          <button
            @click="handleShare"
            :disabled="!learnerName"
            class="flex gap-2 justify-center items-center px-6 py-3 font-medium text-white bg-purple-600 rounded-lg transition-colors hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShareIcon class="w-5 h-5" />
            Share
          </button>
        </div>

        <!-- Instructions -->
        <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex gap-3">
            <InformationCircleIcon class="flex-shrink-0 mt-0.5 w-5 h-5 text-blue-600" />
            <div class="text-sm">
              <h4 class="mb-1 font-semibold text-blue-900">Certificate Instructions</h4>
              <ul class="space-y-1 text-blue-800">
                <li>• Click on the name field to personalize your certificate</li>
                <li>• Enter your name and press Enter to save it</li>
                <li>• Download, Print, or Share your certificate</li>
                <li>• The module will be marked as completed after you download/share</li>
                <li>• Each certificate has a unique ID for verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Module, QuizAttempt, Certificate } from '~/types'
import {
  XMarkIcon,
  TrophyIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  module: Module
  quizResult?: QuizAttempt
}>()

const emit = defineEmits<{
  close: []
  'certificate-generated': [certificate: Certificate]
}>()

// State
const learnerName = ref('')
const tempLearnerName = ref('')
const isEditingName = ref(false)
const isGeneratingPDF = ref(false)
const certificateId = ref('')
const nameInput = ref<HTMLInputElement | null>(null)

// Generate certificate ID
const generateCertificateId = (): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 9)
  return `CERT-${timestamp}-${random}`.toUpperCase()
}

// Initialize certificate ID
certificateId.value = generateCertificateId()

// Name editing functions
const startEditingName = () => {
  tempLearnerName.value = learnerName.value
  isEditingName.value = true
  nextTick(() => {
    nameInput.value?.focus()
    nameInput.value?.select()
  })
}

const finishEditingName = () => {
  if (tempLearnerName.value.trim()) {
    learnerName.value = tempLearnerName.value.trim()
    isEditingName.value = false
    generateAndSaveCertificate()
  }
}

const cancelEditingName = () => {
  tempLearnerName.value = learnerName.value
  isEditingName.value = false
}

// Certificate generation (saves data but doesn't emit or close modal)
const generateAndSaveCertificate = async () => {
  if (!learnerName.value) return

  const certificate: Certificate = {
    id: `cert-${Date.now()}`,
    moduleId: props.module.id,
    moduleName: props.module.title,
    learnerName: learnerName.value,
    completionDate: new Date(),
    score: props.quizResult?.score || 100,
    certificateId: certificateId.value
  }

  // Save certificate using useLearningPath but don't emit (user hasn't downloaded yet)
  const { addCertificate } = useLearningPath()
  addCertificate(certificate)

  console.log('Certificate saved but modal staying open for user to download')
}

// PDF generation using useCertificate composable
const handleDownloadPDF = async () => {
  if (!learnerName.value) return

  const { downloadCertificate, generateCertificate } = useCertificate()

  // Generate certificate object
  const certificate = generateCertificate(props.module, props.quizResult!, learnerName.value)

  try {
    await downloadCertificate(certificate, props.module)

    // Only emit certificate-generated after successful download
    console.log('PDF downloaded successfully, emitting certificate-generated event')
    emit('certificate-generated', certificate)

    // Show success message
    alert('Certificate downloaded successfully! You can close this window now.')
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF. Please try again.')
  }
}

// Print functionality
const handlePrint = () => {
  if (!learnerName.value) return

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    const certificateElement = document.getElementById('certificate-preview')
    if (certificateElement) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificate - ${props.module.title}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: 'Georgia', serif; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            ${certificateElement.innerHTML}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()

      // Emit certificate-generated after successful print
      const certificate = {
        id: `cert-${Date.now()}`,
        moduleId: props.module.id,
        moduleName: props.module.title,
        learnerName: learnerName.value,
        completionDate: new Date(),
        score: props.quizResult?.score || 100,
        certificateId: certificateId.value
      }
      emit('certificate-generated', certificate)
      console.log('Certificate printed successfully, emitting certificate-generated event')

      printWindow.close()
    }
  }
}

// Share functionality
const handleShare = async () => {
  if (!learnerName.value) return

  const shareText = `I've completed the ${props.module.title} module! 🎉`
  const shareUrl = `learning-path-builder.app/verify/${certificateId.value}`

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Certificate of Completion',
        text: shareText,
        url: shareUrl
      })

      // Emit certificate-generated after successful share
      const certificate = {
        id: `cert-${Date.now()}`,
        moduleId: props.module.id,
        moduleName: props.module.title,
        learnerName: learnerName.value,
        completionDate: new Date(),
        score: props.quizResult?.score || 100,
        certificateId: certificateId.value
      }
      emit('certificate-generated', certificate)
      console.log('Certificate shared successfully, emitting certificate-generated event')
    } catch (error) {
      console.log('Share cancelled or failed:', error)
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}\nVerify: ${shareUrl}`)

      // Emit certificate-generated after successful copy
      const certificate = {
        id: `cert-${Date.now()}`,
        moduleId: props.module.id,
        moduleName: props.module.title,
        learnerName: learnerName.value,
        completionDate: new Date(),
        score: props.quizResult?.score || 100,
        certificateId: certificateId.value
      }
      emit('certificate-generated', certificate)
      console.log('Certificate link copied successfully, emitting certificate-generated event')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }
}

// Helper functions
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins} minutes`
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
#certificate-preview {
  background-image:
    linear-gradient(45deg, rgba(99, 102, 241, 0.05) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(99, 102, 241, 0.05) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(99, 102, 241, 0.05) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(99, 102, 241, 0.05) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>