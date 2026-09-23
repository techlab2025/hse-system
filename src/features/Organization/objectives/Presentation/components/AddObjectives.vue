<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ObjectivesForm from './ObjectivesForm.vue'
import type AddObjectivesParams from '../../Core/params/addObjectivesParams'
import AddObjectivesController from '../controllers/addObjectivesController'

const router = useRouter()
const route = useRoute()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<AddObjectivesParams | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof ObjectivesForm> | null>(null)

const addObjectivesController = AddObjectivesController.getInstance()

const routeProjectId = computed(() => {
  const routeValue = route.params.project_id ?? route.query.project_id
  const rawValue = Array.isArray(routeValue) ? routeValue[0] : routeValue
  const parsedValue = Number(rawValue)

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null
})

const redirectPath = computed(() =>
  routeProjectId.value
    ? `/organization/objectives/project/${routeProjectId.value}`
    : '/organization/objectives',
)

const addObjectives = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await addObjectivesController.addObjectives(
    params.value as AddObjectivesParams,
    router,
    false,
    redirectPath.value,
  )
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addObjectivesController.setLoading()
  await addObjectivesController.addObjectives(params.value as AddObjectivesParams, stayOnPageRouter)
  if (addObjectivesController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: AddObjectivesParams) => {
  params.value = data
}
</script>

<template>
  <form class="objective-editor-form" @submit.prevent="addObjectives">
    <ObjectivesForm :key="formKey" ref="formRef" @update:data="setParams" />

    <div class="objective-action-bar create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped>
.objective-editor-form {
  display: grid;
  gap: 14px;
  width: 100%;
}

.objective-action-bar {
  /* position: sticky;
  z-index: 5;
  bottom: 14px;
  grid-column: 1 / -1;
  max-width: 760px; */
  margin-inline: auto 0;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-1) 92%, transparent);
  box-shadow: 0 16px 32px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
  backdrop-filter: blur(12px);
  width: 100%;
}

.objective-action-bar .btn {
  min-height: 42px;
  border-radius: 12px !important;
  font-weight: 800;
}

@media (max-width: 768px) {
  .objective-action-bar {
    max-width: none;
    margin-inline: 0;
  }
}
</style>
