<template>
  <div class="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
    <div class="w-full max-w-lg bg-white rounded-lg shadow-xl">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">
          {{ isEditing ? 'Edit Learning Path' : 'Create New Learning Path' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500',
                errors.name ? 'border-red-300' : 'border-gray-300'
              ]"
              placeholder="e.g., Web Development Fundamentals"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="What will you learn in this path?"
            ></textarea>
          </div>

          <!-- Color -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="color in pathColors"
                :key="color.value"
                type="button"
                @click="formData.color = color.value"
                class="h-10 rounded-lg border-2 transition-all"
                :class="[
                  formData.color === color.value
                    ? 'border-gray-900 ring-2 ring-offset-2 ring-indigo-500'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
                :style="{ backgroundColor: color.value }"
                :title="color.name"
              ></button>
            </div>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="tag in formData.tags"
                :key="tag"
                class="inline-flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
              >
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(tag)"
                  class="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </span>
            </div>
            <div class="flex gap-2">
              <select
                v-model="selectedTag"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a tag...</option>
                <option
                  v-for="tag in availableTags"
                  :key="tag"
                  :value="tag"
                  :disabled="formData.tags.includes(tag)"
                >
                  {{ tag }}
                </option>
              </select>
              <input
                v-model="customTag"
                @keyup.enter="addCustomTag"
                placeholder="Add custom tag..."
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                @click="addCustomTag"
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Add
              </button>
            </div>
          </div>

          <!-- Copy From Path (only for creation) -->
          <div v-if="!isEditing && copyablePaths.length > 0">
            <label for="copyFrom" class="block text-sm font-medium text-gray-700 mb-1">
              Copy Modules From
            </label>
            <select
              id="copyFrom"
              v-model="formData.copyFromPathId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Start with empty path</option>
              <option
                v-for="path in copyablePaths"
                :key="path.id"
                :value="path.id"
              >
                {{ path.name }} ({{ path.modules.length }} modules)
              </option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!localIsFormValid || isSubmitting"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Path' : 'Create Path') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  path?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

// Composables
const {
  pathColors,
  commonTags,
  copyablePaths,
  pathForm,
  savePath,
  startCreatePath,
  startEditPath,
  addTag: doAddTag,
  removeTag: doRemoveTag
} = usePathManager()

// State
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})
const selectedTag = ref('')
const customTag = ref('')

// Computed
const isEditing = computed(() => !!props.path)

// Local form validation based on formData (not pathForm from composable)
const localIsFormValid = computed(() => {
  return formData.name.trim().length >= 3
})

const availableTags = computed(() => {
  try {
    return commonTags.filter(tag => !pathForm.tags.includes(tag))
  } catch (error) {
    console.warn('Error in availableTags:', error)
    return []
  }
})

// Form data
const formData = reactive({
  name: props.path?.name || '',
  description: props.path?.description || '',
  color: props.path?.color || '#6366f1',
  tags: props.path?.tags ? [...props.path.tags] : [],
  copyFromPathId: ''
})

// Methods
const validateForm = () => {
  errors.value = {}

  if (!formData.name.trim()) {
    errors.value.name = 'Name is required'
  } else if (formData.name.trim().length < 3) {
    errors.value.name = 'Name must be at least 3 characters long'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    // Update the path form in composable
    pathForm.name = formData.name.trim()
    pathForm.description = formData.description.trim()
    pathForm.color = formData.color
    pathForm.tags = [...formData.tags]
    pathForm.copyFromPathId = formData.copyFromPathId

    const success = savePath()

    if (success) {
      emit('saved')
    } else {
      errors.value.name = 'Failed to save path. Please try again.'
    }
  } catch (error) {
    console.error('Error saving path:', error)
    errors.value.name = 'An unexpected error occurred.'
  } finally {
    isSubmitting.value = false
  }
}

const addCustomTag = () => {
  const tag = customTag.value.trim() || selectedTag.value.trim()
  if (tag) {
    doAddTag(tag)
    customTag.value = ''
    selectedTag.value = ''
  }
}

// Initialize form for editing
if (isEditing.value) {
  startEditPath(props.path)
}

// Watch for changes
watch(() => props.path, (newPath) => {
  if (newPath) {
    formData.name = newPath.name || ''
    formData.description = newPath.description || ''
    formData.color = newPath.color || '#6366f1'
    formData.tags = newPath.tags ? [...newPath.tags] : []
  }
}, { immediate: true })
</script>