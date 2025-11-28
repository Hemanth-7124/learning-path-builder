<template>
  <div
    class="relative p-4 bg-white rounded-lg border border-gray-200 transition-all duration-200 module-card hover:shadow-md"
    :class="[
      { 'opacity-50 cursor-not-allowed': isInPath && !allowDuplicate },
      { 'dragging': isDragging },
      { 'cursor-move': draggable && !(isInPath && !allowDuplicate) },
      { 'cursor-pointer': enablePreview && !isDragging },
      customClass
    ]"
    :draggable="draggable"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @click="handleCardClick"
  >
    <!-- Header -->
    <div class="flex justify-between items-start mb-3">
      <div class="flex gap-2 items-center">
        <span class="text-2xl" v-if="module.icon">{{ module.icon }}</span>
        <h3 class="font-semibold text-gray-900">{{ module.title }}</h3>
      </div>
      <span
        class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
        :class="getDifficultyClass(module.difficulty)"
      >
        {{ module.difficulty }}
      </span>
    </div>

    <!-- Progress Bar (if showProgress is true) -->
    <div v-if="showProgress" class="mb-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs text-gray-600">{{ module.status || 'not-started' }}</span>
        <span class="text-xs font-medium text-gray-900">{{ module.progress || 0 }}%</span>
      </div>
      <div class="w-full h-2 bg-gray-200 rounded-full">
        <div
          class="h-2 rounded-full transition-all duration-300"
          :class="{
            'bg-blue-500': (module.progress || 0) < 100,
            'bg-green-500': (module.progress || 0) === 100
          }"
          :style="{ width: `${module.progress || 0}%` }"
        ></div>
      </div>
    </div>

    <!-- Description -->
    <p class="mb-3 text-sm text-gray-600 line-clamp-2">{{ module.description }}</p>

    <!-- Footer -->
    <div class="flex justify-between items-center">
      <div class="flex gap-4 items-center">
        <!-- Category -->
        <span class="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded">
          {{ module.category }}
        </span>

        <!-- Duration -->
        <div class="flex gap-1 items-center text-xs text-gray-600">
          <ClockIcon class="w-3 h-3" />
          <span>{{ formatDuration(module.duration) }}</span>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-2 items-center">
        <!-- Status Toggle Button -->
        <button
          v-if="showProgress"
          @click.stop="handleStatusToggle"
          :class="getStatusClass()"
          class="p-1.5 rounded-full border-2 shadow-sm transition-all duration-200 hover:scale-110"
          :title="`Status: ${module.status || 'not-started'} (Click to change)`"
        >
          <component :is="getStatusIcon()" class="w-4 h-4" v-if="getStatusIcon()" />
          <div v-else class="w-4 h-4 rounded-full border-2 border-current" />
        </button>

        <button
          v-if="showAddButton && !isInPath"
          @click="$emit('add', module)"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Add
        </button>
        <button
          v-if="showRemoveButton"
          @click="$emit('remove', module.id)"
          class="text-sm font-medium text-red-600 hover:text-red-800"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
        <button
          v-if="showDeleteButton"
          @click="$emit('delete', module.id)"
          class="text-sm font-medium text-orange-600 hover:text-orange-800"
          title="Delete custom module"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Module } from '~/types'
import { getDifficultyClass } from '~/utils/formatting'
import {
  ClockIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  TrophyIcon
} from '@heroicons/vue/24/outline'

interface Props {
  module: Module
  isDragging?: boolean
  isInPath?: boolean
  allowDuplicate?: boolean
  showAddButton?: boolean
  showRemoveButton?: boolean
  showDeleteButton?: boolean
  customClass?: string
  draggable?: boolean
  index?: number
  showProgress?: boolean
  enablePreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDragging: false,
  isInPath: false,
  allowDuplicate: false,
  showAddButton: true,
  showRemoveButton: false,
  showDeleteButton: false,
  customClass: '',
  draggable: true,
  index: undefined,
  showProgress: false,
  enablePreview: true
})

const emit = defineEmits<{
  dragstart: [event: DragEvent, module: Module]
  dragend: [event: DragEvent]
  add: [module: Module]
  remove: [moduleId: string]
  delete: [moduleId: string]
  preview: [module: Module]
  'update-status': [moduleId: string, status: 'not-started' | 'in-progress' | 'quiz-required' | 'quiz-passed' | 'completed']
  'start-quiz': [module: Module]
}>()

const { formatDuration } = useLearningPath()

const handleDragStart = (event: DragEvent) => {
  if (!props.draggable || (props.isInPath && !props.allowDuplicate)) {
    event.preventDefault()
    return
  }

  event.dataTransfer?.setData('application/json', JSON.stringify(props.module))
  event.dataTransfer!.effectAllowed = 'copy'
  emit('dragstart', event, props.module)
}

const handleDragEnd = (event: DragEvent) => {
  emit('dragend', event)
}

const handleCardClick = () => {
  if (props.enablePreview && !props.isDragging) {
    emit('preview', props.module)
  }
}

const handleStatusToggle = () => {
  const currentStatus = props.module.status || 'not-started'

  switch (currentStatus) {
    case 'not-started':
      emit('update-status', props.module.id, 'in-progress')
      break
    case 'in-progress':
      // Change to quiz-required instead of directly to completed
      emit('update-status', props.module.id, 'quiz-required')
      // Emit start-quiz event to trigger the quiz modal
      emit('start-quiz', props.module)
      break
    case 'quiz-required':
      // If user clicks again during quiz-required, start the quiz
      emit('start-quiz', props.module)
      break
    case 'quiz-passed':
      // Allow moving from quiz-passed to completed
      emit('update-status', props.module.id, 'completed')
      break
    case 'completed':
      // Reset to not-started
      emit('update-status', props.module.id, 'not-started')
      break
    default:
      emit('update-status', props.module.id, 'not-started')
  }
}

const getStatusIcon = () => {
  const status = props.module.status || 'not-started'
  switch (status) {
    case 'completed':
      return CheckCircleIcon
    case 'in-progress':
      return PlayIcon
    case 'quiz-required':
      return QuestionMarkCircleIcon
    case 'quiz-passed':
      return TrophyIcon
    default:
      return null
  }
}

const getStatusClass = () => {
  const status = props.module.status || 'not-started'
  const classes = {
    'not-started': 'text-gray-400 bg-gray-100 hover:bg-gray-200 hover:text-gray-600',
    'in-progress': 'text-blue-600 bg-blue-100 hover:bg-blue-200 hover:text-blue-700',
    'quiz-required': 'text-orange-600 bg-orange-100 hover:bg-orange-200 hover:text-orange-700',
    'quiz-passed': 'text-purple-600 bg-purple-100 hover:bg-purple-200 hover:text-purple-700',
    'completed': 'text-green-600 bg-green-100 hover:bg-green-200 hover:text-green-700'
  }
  return classes[status] || classes['not-started']
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.module-card {
  transition: all 0.2s ease;
}

.module-card:hover {
  transform: translateY(-1px);
}

.module-card.dragging {
  opacity: 0.5;
  transform: rotate(2deg);
}
</style>