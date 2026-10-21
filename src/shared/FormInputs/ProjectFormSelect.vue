<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import { computed, onMounted, ref, watch } from 'vue'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'

const props = withDefaults(
  defineProps<{
    modelValue: number | null
    id: string
    disabled?: boolean
    autoSelectFirst?: boolean
  }>(),
  { disabled: false, autoSelectFirst: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>()
const store = useProjectSelectStore()
const loading = ref(false)
const failed = ref(false)
const projects = computed(() => {
  const options: TitleInterface[] = store.AllProjects.filter((project) => project.id > 0)
  const selected = store.project
  if (selected && selected.id > 0 && !options.some((project) => project.id === selected.id)) {
    options.unshift(selected)
  }
  return options
})

watch(
  () => [props.autoSelectFirst, props.modelValue, projects.value[0]?.id] as const,
  ([autoSelectFirst, selectedId, firstId]) => {
    if (autoSelectFirst && !selectedId && firstId) emit('update:modelValue', firstId)
  },
  { immediate: true },
)

async function loadProjects() {
  loading.value = true
  failed.value = false
  try {
    const projects = await FetchMyProjectsController.getInstance().fetch(
      new FetchMyProjectsParams(true),
    )
    store.setAllProjects(projects)
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!projects.value.length) void loadProjects()
})
</script>

<template>
  <div class="hse-project-field project-form-select">
    <label :for="id" class="hse-project-field-label">
      {{ $t('project') }} <span aria-hidden="true" class="red">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue ?? ''"
      class="hse-project-input input"
      required
      :disabled="disabled || loading"
      :aria-describedby="failed ? `${id}-error` : undefined"
      @change="
        emit('update:modelValue', Number(($event.target as HTMLSelectElement).value) || null)
      "
    >
      <option value="" disabled>{{ $t('employeeProjectAction.selectProject') }}</option>
      <option
        v-if="modelValue && !projects.some((project) => project.id === modelValue)"
        :value="modelValue"
      >
        {{ $t('project') }} #{{ modelValue }}
      </option>
      <option v-for="project in projects" :key="project.id" :value="project.id">
        {{ project.title || project.name || `${$t('project')} #${project.id}` }}
      </option>
    </select>
    <p v-if="failed" :id="`${id}-error`" role="alert">
      {{ $t('employeeProjectAction.loadError') }}
      <button type="button" @click="loadProjects">{{ $t('employeeProjectAction.retry') }}</button>
    </p>
    <p v-else-if="!loading && !projects.length && !modelValue" role="status">
      {{ $t('employeeProjectAction.noProjects') }}
    </p>
  </div>
</template>

<style scoped>
.project-form-select {
  display: grid;
  gap: 10px;
  min-width: 0;
}
.project-form-select select {
  width: 100%;
  min-width: 0;
  min-height: 46px;
}
.red {
  color: red;
}
</style>
