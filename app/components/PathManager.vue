<template>
  <div class="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
    <div class="w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Manage Learning Paths</h2>
          <p class="mt-1 text-sm text-gray-600">
            Create, edit, and organize your learning paths
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Migration Notice -->
      <div v-if="needsMigration" class="p-4 m-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <div class="flex gap-3 items-start">
          <ExclamationTriangleIcon class="mt-0.5 w-5 h-5 text-yellow-600" />
          <div>
            <h3 class="text-sm font-medium text-yellow-800">Legacy Data Detected</h3>
            <p class="mt-1 text-sm text-yellow-700">
              We found data from the previous version. Would you like to migrate it to the new multi-path format?
            </p>
            <div class="flex gap-2 mt-3">
              <button
                @click="performMigration"
                :disabled="isMigrating"
                class="px-3 py-1.5 text-sm font-medium text-yellow-800 bg-yellow-100 rounded hover:bg-yellow-200 disabled:opacity-50"
              >
                {{ isMigrating ? 'Migrating...' : 'Migrate Now' }}
              </button>
              <button
                @click="skipMigration"
                class="px-3 py-1.5 text-sm font-medium text-yellow-800 bg-white rounded border border-yellow-300 hover:bg-yellow-50"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ summary?.totalPaths || 0 }}</div>
            <div class="text-xs text-gray-600">Total Paths</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ summary?.activePaths || 0 }}</div>
            <div class="text-xs text-gray-600">Active</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-600">{{ summary?.totalModules || 0 }}</div>
            <div class="text-xs text-gray-600">Total Modules</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-indigo-600">{{ summary?.averageProgress || 0 }}%</div>
            <div class="text-xs text-gray-600">Avg Progress</div>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex gap-4">
          <div class="relative flex-1">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
            <input
              v-model="searchQuery"
              placeholder="Search paths..."
              class="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            v-model="sortBy"
            class="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="name">Sort by Name</option>
            <option value="created">Sort by Created</option>
            <option value="updated">Sort by Updated</option>
            <option value="progress">Sort by Progress</option>
            <option value="modules">Sort by Modules</option>
          </select>
          <button
            @click="showArchived = !showArchived"
            class="px-4 py-2 font-medium rounded-lg transition-colors"
            :class="[
              showArchived
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ showArchived ? 'Hide' : 'Show' }} Archived
          </button>
        </div>
      </div>

      <!-- Path List -->
      <div class="overflow-y-auto flex-1">
        <div class="p-6 space-y-4">
          <div v-if="displayPaths.length === 0" class="py-12 text-center">
            <div class="mb-4 text-gray-400">
              <FolderIcon class="mx-auto w-12 h-12" />
            </div>
            <h3 class="mb-2 text-lg font-medium text-gray-900">
              {{ searchQuery ? 'No paths found' : 'No paths created yet' }}
            </h3>
            <p class="mb-4 text-gray-600">
              {{ searchQuery ? 'Try adjusting your search' : 'Create your first learning path to get started' }}
            </p>
            <button
              @click="handleStartCreatePath"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Create Path
            </button>
          </div>

          <div
            v-for="path in displayPaths"
            :key="path.id"
            class="p-4 rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
            :class="{
              'ring-2 ring-indigo-500 border-indigo-500': path.id === activePathId,
              'opacity-75': path.isArchived
            }"
          >
            <div class="flex justify-between items-start">
              <div class="flex flex-1 gap-3 items-start">
                <!-- Path Color Indicator -->
                <div
                  class="flex-shrink-0 mt-1 w-4 h-4 rounded-full"
                  :style="{ backgroundColor: path.color || '#6366f1' }"
                ></div>

                <!-- Path Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex gap-2 items-center mb-1">
                    <h3 class="text-lg font-medium text-gray-900 truncate">{{ path.name }}</h3>
                    <span v-if="path.id === activePathId" class="inline-flex items-center px-2 py-0.5 text-xs font-medium text-indigo-800 bg-indigo-100 rounded">
                      Active
                    </span>
                    <span v-if="path.isArchived" class="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                      Archived
                    </span>
                  </div>

                  <p v-if="path.description" class="mb-2 text-sm text-gray-600">{{ path.description }}</p>

                  <!-- Tags -->
                  <div v-if="path.tags && path.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
                    <span
                      v-for="tag in path.tags"
                      :key="tag"
                      class="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <!-- Stats -->
                  <div class="flex gap-4 items-center text-sm text-gray-500">
                    <div class="flex gap-1 items-center">
                      <BookOpenIcon class="w-4 h-4" />
                      <span>{{ path.modules.length }} modules</span>
                    </div>
                    <div class="flex gap-1 items-center">
                      <ClockIcon class="w-4 h-4" />
                      <span>{{ formatDuration(path.totalDuration) }}</span>
                    </div>
                    <div class="flex gap-1 items-center">
                      <CalendarIcon class="w-4 h-4" />
                      <span>Updated {{ formatDate(path.lastUpdated) }}</span>
                    </div>
                  </div>

                  <!-- Progress -->
                  <div v-if="path.modules.length > 0" class="mt-3">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs font-medium text-gray-700">Progress</span>
                      <span class="text-xs font-medium" :class="getPathProgressColor(path.overallProgress)">
                        {{ path.overallProgress }}%
                      </span>
                    </div>
                    <div class="overflow-hidden w-full h-2 bg-gray-200 rounded-full">
                      <div
                        class="h-full transition-all duration-300"
                        :class="getProgressBarColor(path.overallProgress)"
                        :style="{ width: `${path.overallProgress}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 items-center ml-4">
                <button
                  v-if="path.id !== activePathId"
                  @click="switchToPath(path.id)"
                  class="p-2 text-indigo-600 rounded-lg transition-colors hover:bg-indigo-50"
                  title="Switch to this path"
                >
                  <ArrowPathIcon class="w-4 h-4" />
                </button>

                <button
                  @click="editPath(path)"
                  class="p-2 text-gray-600 rounded-lg transition-colors hover:bg-gray-100"
                  title="Edit path"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>

                <button
                  @click="duplicatePath(path)"
                  class="p-2 text-gray-600 rounded-lg transition-colors hover:bg-gray-100"
                  title="Duplicate path"
                >
                  <DocumentDuplicateIcon class="w-4 h-4" />
                </button>

            

                <button
                  v-if="learningPaths.length > 1"
                  @click="deletePath(path)"
                  class="p-2 text-red-600 rounded-lg transition-colors hover:bg-red-50"
                  title="Delete path"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>

                <DropdownMenu>
                  <template #trigger>
                    <button class="p-2 text-gray-600 rounded-lg transition-colors hover:bg-gray-100">
                      <EllipsisVerticalIcon class="w-4 h-4" />
                    </button>
                  </template>
                  <template #content>
                    <button
                      @click="toggleArchive(path)"
                      class="px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      {{ path.isArchived ? 'Unarchive' : 'Archive' }}
                    </button>
                  </template>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-200">
        <div class="text-sm text-gray-600">
          {{ displayPaths.length }} of {{ learningPaths?.length || 0 }} paths
        </div>
        <div class="flex gap-3">
      
          <button
            @click="handleStartCreatePath"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Create New Path
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Path Modal -->
    <PathCreateEditModal
      v-if="showCreateEditModal"
      :path="editingPath"
      @close="closeCreateEditModal"
      @saved="handlePathSaved"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-if="showDeleteModal"
      :path="pathToDelete"
      @close="showDeleteModal = false"
      @confirmed="handleDeleteConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  BookOpenIcon,
  ClockIcon,
  CalendarIcon,
  ArrowPathIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils/formatting'

// Emits
const emit = defineEmits<{
  close: []
}>()

// State
const searchQuery = ref('')
const sortBy = ref('updated')
const showArchived = ref(false)
const isMigrating = ref(false)
const showCreateEditModal = ref(false)
const showDeleteModal = ref(false)
const editingPath = ref(null)
const pathToDelete = ref(null)

// Composables
const {
  learningPaths,
  activePathId,
  filteredPaths,
  formatDuration
} = useLearningPath()

const {
  needsMigration,
  summary,
  switchToPath,
  startCreatePath,
  searchPaths,
  sortPaths,
  duplicatePath,
  exportPath,
  importPath,
  toggleArchive,
  deleteLearningPath,
  performMigration: doMigration
} = usePathManager()

// Computed
const displayPaths = computed(() => {
  try {
    let paths = learningPaths?.value || []

    if (!showArchived?.value) {
      paths = paths.filter(path => !path.isArchived)
    }

    if (searchQuery?.value?.trim()) {
      paths = searchPaths(searchQuery.value) || []
    }

    return sortPaths(paths, sortBy?.value || 'updated') || []
  } catch (error) {
    console.warn('Error in displayPaths:', error)
    return []
  }
})

// Methods
const handleMigration = async () => {
  isMigrating.value = true
  try {
    await doMigration()
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    isMigrating.value = false
  }
}

const skipMigration = () => {
  // Skip migration for now
  console.log('Migration skipped')
}

const editPath = (path) => {
  editingPath.value = path
  showCreateEditModal.value = true
}

const deletePath = (path) => {
  pathToDelete.value = path
  showDeleteModal.value = true
}

const handleStartCreatePath = () => {
  // Call the imported function to set up form state
  startCreatePath()
  // Then show the modal
  showCreateEditModal.value = true
}

const handleDeleteConfirmed = () => {
  if (pathToDelete.value) {
    deleteLearningPath(pathToDelete.value.id)
    pathToDelete.value = null
    showDeleteModal.value = false
  }
}

const closeCreateEditModal = () => {
  showCreateEditModal.value = false
  editingPath.value = null
}

const handlePathSaved = () => {
  closeCreateEditModal()
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

</script>