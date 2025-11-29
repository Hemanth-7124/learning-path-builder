<template>
  <div class="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
    <div class="w-full max-w-md bg-white rounded-lg shadow-xl">
      <!-- Header -->
      <div class="p-6">
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
          <ExclamationTriangleIcon class="w-6 h-6 text-red-600" />
        </div>
        <h3 class="mt-4 text-lg font-bold text-center text-gray-900">
          Delete Learning Path?
        </h3>
        <p class="mt-2 text-sm text-center text-gray-600">
          Are you sure you want to delete "{{ path?.name }}"? This action cannot be undone.
        </p>
        <p v-if="path && path.modules.length > 0" class="mt-2 text-sm text-center text-red-600">
          This will also remove {{ path.modules.length }} modules and all associated progress.
        </p>
      </div>

      <!-- Actions -->
      <div class="px-6 pb-6">
        <div class="flex gap-3">
          <button
            @click="$emit('close')"
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Delete Path
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface Props {
  path?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirmed: []
}>()

const confirmDelete = () => {
  emit('confirmed')
}
</script>