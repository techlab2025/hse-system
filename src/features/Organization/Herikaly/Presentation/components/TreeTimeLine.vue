<script lang="ts" setup>
import { computed } from 'vue'
import EmployeeIcon from '@/shared/icons/EmployeeIcon.vue'
import EmployeeLinkIcon from '../../../../../shared/icons/EmployeeLinkIcon.vue'
import type HerikalyModel from '../../Data/models/HerikalyModel'
import DeleteHerikalyController from '../controllers/deleteHerikalyController'
import DeleteHerikalyParams from '../../Core/params/deleteHerikalyParams'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import DeleteHierarchy from '../supcomponents/DeleteHierarchy.vue'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'

const emit = defineEmits(['delete-data'])

const props = defineProps<{
  Hierarchies: HerikalyModel[]
}>()

function flattenHierarchy(items: any[], level = 0): any[] {
  const result: any[] = []

  items.forEach((item) => {
    result.push({ ...item, level })

    if (item.children && item.children.length > 0) {
      result.push(...flattenHierarchy(item.children, level + 1))
    }
  })

  return result
}

const flattenedHierarchies = computed(() => {
  return props.Hierarchies.map((hierarchy) => ({
    root: hierarchy,
    flatItems: flattenHierarchy([hierarchy]),
  }))
})

const deleteHierarchy = async (Id: number) => {
  const deleteHerikalyParams = new DeleteHerikalyParams(Id)
  const deleteHerikalyController = DeleteHerikalyController.getInstance()
  await deleteHerikalyController.deleteHerikaly(deleteHerikalyParams)
  emit('delete-data')
}
</script>

<template>
  <div class="heirarchy-info">
    <div class="timeline-container">
      <div class="timeline-wrapper">
        <div class="timeline-line"></div>

        <div
          v-for="(hierarchyGroup, index) in flattenedHierarchies"
          :key="index"
          :class="{ active: index === 0 }"
          :style="{ animationDelay: `${index * 0.15}s` }"
          class="timeline-item"
        >
          <div class="timeline-marker">
            <div class="timeline-dot">
              <div class="timeline-dot-inner"></div>
              <div class="timeline-pulse"></div>
            </div>
            <div class="timeline-icon">
              <div class="circle"></div>
            </div>
          </div>

          <div class="timeline-content">
            <div v-for="(item, itemIndex) in hierarchyGroup.flatItems" :key="itemIndex">
              <div
                class="timeline-card-header"
                :class="{
                  'timeline-card': item.level === 0,
                  'timeline-card-header-2': item.level > 0,
                }"
                :style="{ marginLeft: `${item.level * 20}px` }"
              >
                <PermissionBuilder
                  v-if="PermissionHandler.Instance.handle([PermissionsEnum.HERIKALY_CREATE])"
                  :code="[
                    PermissionsEnum.ADMIN,
                    PermissionsEnum.HERIKALY_CREATE,
                    PermissionsEnum.HERIKALY_FETCH,
                  ]"
                >
                  <router-link v-if="itemIndex < 1" :to="`/organization/herikaly/add/${item.id}`">
                    <div class="heirarchy-container">
                      <div class="heirarchy-header">
                        <EmployeeIcon class="icon" />
                        <p class="heirarchy-title">{{ item.title }}</p>
                      </div>
                      <div class="heirarchy-details">
                        <!-- <p>Employees: <span>{{ item.employees || 100 }}</span></p> -->
                        <!-- <p>Certifications: <span>{{ item.certifications || 10 }}</span></p> -->
                      </div>
                    </div>
                  </router-link>

                  <div v-else>
                    <div class="heirarchy-container">
                      <div class="heirarchy-header">
                        <EmployeeIcon class="icon" />
                        <p class="heirarchy-title">{{ item.title }}</p>
                      </div>
                      <div class="heirarchy-details">
                        <!-- <p>Employees: <span>{{ item.employees || 100 }}</span></p> -->
                        <!-- <p>Certifications: <span>{{ item.certifications || 10 }}</span></p> -->
                      </div>
                    </div>
                  </div>
                </PermissionBuilder>
                <PermissionBuilder
                  v-else
                  :code="[PermissionsEnum.ADMIN, PermissionsEnum.HERIKALY_FETCH]"
                >
                  <div class="heirarchy-container">
                    <div class="heirarchy-header">
                      <EmployeeIcon class="icon" />
                      <p class="heirarchy-title">{{ item.title }}</p>
                    </div>
                    <div class="heirarchy-details">
                      <!-- <p>Employees: <span>{{ item.employees || 100 }}</span></p> -->
                      <!-- <p>Certifications: <span>{{ item.certifications || 10 }}</span></p> -->
                    </div>
                  </div>
                </PermissionBuilder>

                <div class="actions">
                  <PermissionBuilder
                    :code="[PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE]"
                  >
                    <router-link
                      class="btn edit-btn flex"
                      :to="`/organization/organization-employee?heirarchy_id=${item.id}`"
                    >
                      <span>{{ $t('employees') }}</span>
                      <EmployeeLinkIcon class="w-[15px] h-[15px]" />
                    </router-link>
                  </PermissionBuilder>
                  <PermissionBuilder
                    :code="[PermissionsEnum.ADMIN, PermissionsEnum.HERIKALY_UPDATE]"
                  >
                    <router-link :to="`/organization/herikaly/${item.id}`" class="btn add-btn">{{
                      $t('edit')
                    }}</router-link>
                  </PermissionBuilder>
                  <PermissionBuilder
                    :code="[PermissionsEnum.ADMIN, PermissionsEnum.HERIKALY_UPDATE]"
                  >
                    <router-link
                      :to="`/organization/employee-certificate/${item.id}`"
                      class="btn add-btn"
                      >{{ $t('training_matrix') }}</router-link
                    >
                  </PermissionBuilder>
                  <PermissionBuilder
                    :code="[PermissionsEnum.ADMIN, PermissionsEnum.HERIKALY_DELETE]"
                  >
                    <DeleteHierarchy @delete:data="deleteHierarchy(item.id)" />
                  </PermissionBuilder>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.timeline-card-header {
  position: relative;
  overflow: hidden;
  min-height: 88px;
  padding: 16px 18px !important;
  gap: 18px !important;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 15%, var(--surface-1)) !important;
  border-radius: 18px !important;
  background:
    radial-gradient(circle at 94% 8%, color-mix(in srgb, var(--brand-primary-500) 10%, transparent) 0 72px, transparent 73px),
    linear-gradient(135deg, var(--surface-1), color-mix(in srgb, var(--brand-primary-50) 42%, var(--surface-1))) !important;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;

  &:hover {
    border-color: color-mix(in srgb, var(--brand-primary-500) 38%, var(--surface-1)) !important;
    background:
      radial-gradient(circle at 94% 8%, color-mix(in srgb, var(--brand-primary-500) 13%, transparent) 0 72px, transparent 73px),
      linear-gradient(135deg, var(--surface-1), color-mix(in srgb, var(--brand-primary-50) 55%, var(--surface-1))) !important;
    box-shadow: 0 14px 32px color-mix(in srgb, var(--brand-primary-900) 12%, transparent);
    transform: translateY(-2px);
  }

  > a,
  > div:not(.actions) {
    min-width: 0;
    flex: 1 1 auto;
    text-decoration: none;
  }

  .heirarchy-container,
  .heirarchy-header {
    min-width: 0;
  }

  .heirarchy-header {
    gap: 13px;
  }

  .heirarchy-header .icon {
    box-sizing: border-box;
    width: 42px !important;
    height: 42px !important;
    padding: 9px;
    border: 1px solid color-mix(in srgb, var(--brand-primary-500) 15%, transparent);
    border-radius: 13px;
    background: color-mix(in srgb, var(--brand-primary-500) 9%, var(--surface-1));
    object-fit: contain;
    flex: 0 0 auto;
  }

  .heirarchy-title {
    margin: 0 !important;
    color: var(--text-strong) !important;
    font-size: clamp(15px, 1.4vw, 18px) !important;
    font-weight: 700;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .actions {
    flex: 0 1 auto;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px !important;
    position: relative;
    z-index: 1;

    :deep(.btn) {
      min-height: 34px;
      padding: 7px 11px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 650;
      line-height: 1.1;
      transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 5px 12px color-mix(in srgb, var(--brand-primary-900) 12%, transparent);
      }
    }

    :deep(.add-btn) {
      background: color-mix(in srgb, var(--brand-primary-500) 8%, var(--surface-1));
      border: 1px solid color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
      color: var(--brand-primary-700);
    }
  }

  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px !important;

    .actions {
      justify-content: flex-start;
    }
  }

  .actions {
    @media (max-width: 1000px) {
      width: 100%;
      flex-wrap: wrap;
    }
  }
}

.timeline-card-header-2 {
  margin-top: 12px;
  margin-inline-start: 28px !important;
  border-radius: 14px !important;
  background: color-mix(in srgb, var(--surface-1) 88%, var(--brand-primary-50)) !important;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);

  &::before {
    content: '';
    position: absolute;
    top: -13px;
    inset-inline-start: -19px;
    width: 11px;
    height: 25px;
    border-inline-start: 2px solid color-mix(in srgb, var(--brand-primary-500) 48%, transparent);
    border-bottom: 2px solid color-mix(in srgb, var(--brand-primary-500) 48%, transparent);
    border-bottom-inline-start-radius: 8px;
    opacity: 1;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset-inline-start: -22px;
    top: 50%;
    width: 7px;
    height: 7px;
    border: 2px solid var(--surface-1);
    border-radius: 50%;
    background: var(--brand-primary-500);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
    transform: translateY(-50%);
    pointer-events: none;
  }
}

@media (max-width: 640px) {
  .timeline-card-header {
    padding: 13px !important;
    border-radius: 15px !important;

    .actions :deep(.btn) {
      min-height: 32px;
      padding: 6px 9px;
    }
  }

  .timeline-card-header-2 {
    margin-inline-start: 16px !important;

    &::before {
      inset-inline-start: -12px;
      width: 7px;
    }

    &::after {
      inset-inline-start: -15px;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .timeline-card-header,
  .timeline-card-header :deep(.btn) {
    transition: none;
  }
}
</style>
