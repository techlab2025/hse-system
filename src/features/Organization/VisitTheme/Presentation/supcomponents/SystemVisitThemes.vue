<script setup lang="ts">
import { ref, watch } from 'vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import Dialog from 'primevue/dialog'
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import DialogSystem from '@/assets/images/DialogSystem.png'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import SystemDialogEmptyState from '@/shared/DataStatues/SystemDialogEmptyState.vue'
import TitleSystemDataHeader from '@/shared/DataStatues/TitleSystemDataHeader.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexVisitThemeParams from '../../Core/params/indexVisitThemeParams'
import type VisitThemeModel from '../../Data/models/VisitThemeModel'
import IndexSystemVisitThemeController from '../controllers/indexSystemVisitThemeController'
import AddVisitThemeController from '../controllers/addVisitThemeController'

defineProps<{ isHeaderTap?: boolean }>()
const emit = defineEmits<{ added: [] }>()
const createPermissions = [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE]
const visible = ref(false)
const selectedIds = ref<number[]>([])
const controller = IndexSystemVisitThemeController.getInstance()
const state = ref(controller.state.value)

watch(() => controller.state.value, (value) => { state.value = value }, { deep: true })
watch(visible, (value) => {
  if (value) controller.getData(new IndexVisitThemeParams('', 1, 100, 0, true))
})

const toggleSelection = (id: number) => {
  const index = selectedIds.value.indexOf(id)
  if (index === -1) selectedIds.value.push(id)
  else selectedIds.value.splice(index, 1)
}

const addSystemVisitThemes = async () => {
  const items = (state.value.data ?? []).filter((item: VisitThemeModel) => selectedIds.value.includes(item.id))
  if (!items.length) return
  const added = await AddVisitThemeController.getInstance().addSystemVisitThemes(items)
  if (added) {
    selectedIds.value = []
    visible.value = false
    emit('added')
  }
}
</script>

<template>
  <PermissionBuilder :code="createPermissions">
    <li v-if="!isHeaderTap" class="list-item cursor-pointer" @click="visible = true">
      <button type="button">{{ $t('system_data') }}</button>
    </li>
    <TitleSystemDataHeader
      v-if="isHeaderTap"
      :title="$t('add_system_visit_themes')"
      :subtitle="$t('select_system_visit_themes')"
      @click="visible = true"
    />
    <Dialog v-model:visible="visible" modal :style="{ width: '60rem' }" @click.stop>
      <template #header>
        <HeaderSection :img="DialogSystem" :title="$t('add_system_visit_themes')" :subtitle="$t('select_system_visit_themes')" />
      </template>
      <DataStatus :controller="state">
        <template #success>
          <SystemDialogEmptyState v-if="!state.data?.length" />
          <div v-else class="system-dialog-content-container">
            <div v-for="item in state.data" :key="item.id" class="system-dialog-content">
              <div class="row-content" :class="{ active: selectedIds.includes(item.id) }" @click="toggleSelection(item.id)">
                <label :for="`${item.title}-${item.id}`" class="title">{{ item.title }}</label>
                <input :id="`${item.title}-${item.id}`" type="checkbox" :checked="selectedIds.includes(item.id)" @click.stop="toggleSelection(item.id)" />
              </div>
            </div>
          </div>
          <button v-if="state.data?.length" class="btn btn-primary w-full mt-5 confirm-btn" type="button" @click="addSystemVisitThemes">{{ $t('confirm') }}</button>
        </template>
        <template #empty><SystemDialogEmptyState /></template>
        <template #loader></template>
        <template #failed></template>
      </DataStatus>
    </Dialog>
  </PermissionBuilder>
</template>
