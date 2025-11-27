<template>
  <div
    class="module-card bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 relative"
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
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-2xl" v-if="module.icon">{{ module.icon }}</span>
        <h3 class="font-semibold text-gray-900">{{ module.title }}</h3>
      </div>
      <span
        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
        :class="getDifficultyClass(module.difficulty)"
      >
        {{ module.difficulty }}
      </span>
    </div>

    <!-- Progress Bar (if showProgress is true) -->
    <div v-if="showProgress" class="mb-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs text-gray-600">Progress</span>
        <span class="text-xs font-medium text-gray-900">{{ module.progress || 0 }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
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
    <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ module.description }}</p>

    <!-- Footer -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <!-- Category -->
        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {{ module.category }}
        </span>

        <!-- Duration -->
        <div class="flex items-center gap-1 text-xs text-gray-600">
          <ClockIcon class="w-3 h-3" />
          <span>{{ formatDuration(module.duration) }}</span>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-2">
        <!-- Status Toggle Button -->
        <button
          v-if="showProgress"
          @click.stop="handleStatusToggle"
          :class="getStatusClass()"
          class="p-1.5 rounded-full transition-all duration-200 hover:scale-110 border-2 shadow-sm"
          :title="`Status: ${module.status || 'not-started'} (Click to change)`"
        >
          <component :is="getStatusIcon()" class="w-4 h-4" v-if="getStatusIcon()" />
          <div v-else class="w-4 h-4 rounded-full border-2 border-current" />
        </button>

        <button
          v-if="showAddButton && !isInPath"
          @click="$emit('add', module)"
          class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Add
        </button>
        <button
          v-if="showRemoveButton"
          @click="$emit('remove', module.id)"
          class="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
        <button
          v-if="showDeleteButton"
          @click="$emit('delete', module.id)"
          class="text-orange-600 hover:text-orange-800 text-sm font-medium"
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
import { ClockIcon, TrashIcon, XMarkIcon, CheckCircleIcon, PlayIcon } from '@heroicons/vue/24/outline'

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
  'update-status': [moduleId: string, status: 'not-started' | 'in-progress' | 'completed']
}>()

const { formatDuration } = useLearningPath()

const getDifficultyClass = (difficulty: string) => {
  const classes = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-red-100 text-red-800'
  }
  return classes[difficulty as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

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
  let newStatus: 'not-started' | 'in-progress' | 'completed'

  if (currentStatus === 'not-started') {
    newStatus = 'in-progress'
  } else if (currentStatus === 'in-progress') {
    newStatus = 'completed'
  } else {
    newStatus = 'not-started'
  }

  emit('update-status', props.module.id, newStatus)
}

const getStatusIcon = () => {
  const status = props.module.status || 'not-started'
  if (status === 'completed') {
    return CheckCircleIcon
  } else if (status === 'in-progress') {
    return PlayIcon
  }
  return null
}

const getStatusClass = () => {
  const status = props.module.status || 'not-started'
  const classes = {
    'not-started': 'text-gray-400 bg-gray-100 hover:bg-gray-200 hover:text-gray-600',
    'in-progress': 'text-blue-600 bg-blue-100 hover:bg-blue-200 hover:text-blue-700',
    'completed': 'text-green-600 bg-green-100 hover:bg-green-200 hover:text-green-700'
  }
  return classes[status]
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