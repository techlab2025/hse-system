<script setup lang="ts">
import type { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'

interface Item {
  title: string
  addRoute?: string
  image: string
  indexRoute?: string
  overdueRoute?: string
  inspectionFormRoute?: string
  dragInspectionRoute?: string
  resultInspectionRoute?: string
  description: string
  AddPermissions?: PermissionsEnum[]
  indexPermissions?: PermissionsEnum[]
  inspectionFormPermissions?: PermissionsEnum[]
  DragInspectionPermissions?: PermissionsEnum[]
  inspectionsResultsPermissions?: PermissionsEnum[]
}
const { item } = defineProps<{
  item: Item
}>()

const cardTone = item.title.toLowerCase().replace(/\s+/g, '-')
</script>

<template>
  <div class="card observation-hub-card" :class="`observation-hub-card--${cardTone}`">
    <div class="card-visual">
      <div class="image">
        <img :src="item.image" :alt="item.title" loading="lazy" />
      </div>
      <!-- <span class="card-kicker">{{ $t('workspace') }}</span> -->
    </div>

    <div class="card-body">
      <div class="card-content">
        <h4 class="card-header-title">{{ item.title }}</h4>
        <p class="description">{{ item.description }}</p>
      </div>

      <div class="card-options">
        <permission-builder v-if="item.AddPermissions && item.addRoute" :code="item.AddPermissions">
          <RouterLink :to="item.addRoute" class="card-action card-action-primary">
            {{ $t('add') }}
          </RouterLink>
        </permission-builder>

        <permission-builder v-if="item.indexPermissions && item.indexRoute" :code="item.indexPermissions">
          <RouterLink :to="item.indexRoute" class="card-action">
            {{ $t('show') }}
          </RouterLink>
        </permission-builder>

        <RouterLink v-if="item.overdueRoute" :to="item.overdueRoute" class="card-action">
          {{ $t('over_due') }}
        </RouterLink>

        <permission-builder
          v-if="item.indexPermissions && item.inspectionFormRoute"
          :code="item.indexPermissions"
        >
          <RouterLink :to="item.inspectionFormRoute" class="card-action">
            {{ $t('inspection_form') }}
          </RouterLink>
        </permission-builder>

        <permission-builder
          v-if="item.DragInspectionPermissions && item.dragInspectionRoute"
          :code="item.DragInspectionPermissions"
        >
          <RouterLink :to="item.dragInspectionRoute" class="card-action">
            {{ $t('required_inspection') }}
          </RouterLink>
        </permission-builder>

        <permission-builder
          v-if="item.inspectionsResultsPermissions && item.resultInspectionRoute"
          :code="item.inspectionsResultsPermissions"
        >
          <RouterLink :to="item.resultInspectionRoute" class="card-action">
            {{ $t('inspections_records') }}
          </RouterLink>
        </permission-builder>

        <!-- <div class="card-arrow" aria-hidden="true">
          <span></span>
        </div> -->
      </div>
    </div>
  </div>
</template>
