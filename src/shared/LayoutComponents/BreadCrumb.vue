<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BackIcon from '../icons/BackIcon.vue'
import { buildBreadcrumb } from './Helper/RouteHelper'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import ConditionHandler from '@/base/Presentation/utils/condition_handler'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const conditionHandler = ConditionHandler.getInstance()

const RouterBack = () => {
  router.back()
}

const IsHome = computed(
  () =>
    route.path === '/organization' ||
    route.path === '/admin' ||
    route.path === '/organization/employee-interface',
)
const IsHomeSetting = computed(
  () =>
    route.path === '/organization/setting' ||
    route.path === '/admin' ||
    route.path === '/organization',
)

// const items = computed(() =>
//   buildBreadcrumb(route, router)
// )
const getUrlWithParams = () => {
  if (route.path.includes('add')) {
    const Params = Object.values(route.params)[0]
    return Params
  } else {
    const Params = Object.values(route.query)[1]
    return Params
  }
}
const items = computed(() => {
  const breadcrumb = buildBreadcrumb(route, router)
  if (route.path.includes('/organization/equipment-mangement/inspection/add')) {
    const inspectionItem = breadcrumb.find((b) => b.label === 'Inspection')

    if (inspectionItem) {
      inspectionItem.url = '/organization/equipment-mangement/inspection?inspectionType=1'
    }
  }

  // If Route Type Shared
  if (route.meta.type === 'Shared') {
    // If Shared But Special Hazard Routes
    // Make Parent SubParent Not Parent
    if (route.meta.subType && (route.params.parent_id || route.query.hazard == 1)) {
      const parentRoute = allRoutes.find(
        (pr) =>
          pr.name ===
          `${route.meta.subParent} ${
            user?.type == OrganizationTypeEnum.ADMIN ? 'Admin' : 'Organization'
          }`,
      )
      if (parentRoute) {
        breadcrumb.splice(breadcrumb.length - 1, 0, {
          label: parentRoute.meta?.breadcrumb as string,
          url: parentRoute.path.replace(/\/:[^/]+(\?)?/g, `/${String(getUrlWithParams())}`),
        })
      }
    }
    if (route.name?.toString().includes('WarehouseType')) {
      const warehouseItems = breadcrumb.filter((b) => b.label === 'WarehouseType')

      if (warehouseItems.length > 1) {
        const firstIndex = breadcrumb.findIndex((b) => b.label === 'WarehouseType')

        breadcrumb.splice(firstIndex, 1)
      }
    }

    // If Shared But Normal Routes
    // Parent Is Parent
    else {
      const parentRoute = allRoutes.find(
        (pr) =>
          pr.name ===
          `${route.meta.parent} ${
            user?.type == OrganizationTypeEnum.ADMIN ? 'Admin' : 'Organization'
          }`,
      )
      if (parentRoute) {
        breadcrumb.splice(breadcrumb.length - 1, 0, {
          label: parentRoute.meta?.breadcrumb as string,
          url: parentRoute.path.replace(/\/:[^/]+(\?)?/g, ``),
        })
      }
    }
  }

  return breadcrumb.map((item) => ({
    ...item,
    label: t(item.label),
  }))
})

const allRoutes = router.getRoutes()

const { user } = useUserStore()

const HandleSharedRoutes = () => {
  const parentRoute = allRoutes.find(
    (pr) =>
      pr.name ===
      (route.meta.parent as string) +
        ' ' +
        (user?.type == OrganizationTypeEnum.ADMIN ? 'Admin' : 'Organization'),
  )

  items.value.push({
    label: parentRoute?.meta?.breadcrumb as string,
    url: parentRoute?.path as string,
  })
}

watch(
  () => route,
  () => {
    // if (route.meta.type == 'Shared') {
    // console.log(route.meta.type, "route.meta.type")
    // HandleSharedRoutes()
    // }
    // else {
    buildBreadcrumb(route, router)
    // }
  },
  { immediate: true, deep: true },
)

const ShowBackBtn = computed(() => {
  return (
    user?.type == OrganizationTypeEnum.ORGANIZATION && conditionHandler.shouldUseEmployeeInterface()
  )
})
</script>

<template>
  <div class="hse-identity hse-breadcrumb-bar">
    <div class="hse-breadcrumb-trail">
      <button
        v-if="(!IsHome || !ShowBackBtn) && route.path != '/admin' && route.path != '/organization'"
        class="hse-breadcrumb-back"
        type="button"
        :aria-label="$t('back')"
        @click="RouterBack"
      >
        <BackIcon aria-hidden="true" />
        <span>{{ $t('back') }}</span>
      </button>

      <Breadcrumb :model="items" class="hse-breadcrumb" aria-label="Breadcrumb">
        <template #item="{ item, props }">
          <a v-if="item.url" v-bind="props.action" :href="item.url" class="hse-breadcrumb-link">
            {{ item.label }}
          </a>
          <span v-else class="hse-breadcrumb-current" aria-current="page">
            {{ item.label }}
          </span>
        </template>
      </Breadcrumb>
    </div>
  </div>
</template>

<style scoped>
.hse-breadcrumb-bar {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  min-width: 0;
  margin-bottom: 16px;
}
/* Keep the whole trail on the left as requested, including in Arabic. */
.hse-breadcrumb-bar:dir(rtl) {
  justify-content: flex-end;
}
.hse-breadcrumb-trail {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 100%;
  min-width: 0;
  padding: 6px;
  border: 1px solid var(--hse-project-line);
  border-radius: 14px;
  background: var(--hse-project-surface);
  box-shadow: var(--hse-project-shadow-panel);
}
.hse-breadcrumb-back {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-control-radius);
  background: var(--hse-project-surface-soft);
  color: var(--hse-project-ink);
  font: 600 12px/1.5 var(--hse-project-font);
  cursor: pointer;
  transition:
    background var(--hse-project-motion),
    color var(--hse-project-motion);
}
.hse-breadcrumb-back:hover {
  color: var(--hse-project-blue);
  background: var(--hse-project-ice);
}
.hse-breadcrumb-back svg {
  width: 17px;
  height: 17px;
}
.hse-breadcrumb-back :deep(path) {
  stroke: currentColor;
}
.hse-breadcrumb-back:dir(rtl) svg {
  transform: scaleX(-1);
}
.hse-breadcrumb {
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
  font-family: var(--hse-project-font);
}
.hse-breadcrumb-back + .hse-breadcrumb {
  padding-inline-start: 12px;
  border-inline-start: 1px solid var(--hse-project-line);
}
.hse-breadcrumb :deep(.p-breadcrumb-list) {
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 5px;
  margin: 0;
  padding: 0;
}
.hse-breadcrumb :deep(.p-breadcrumb-item) {
  min-width: 0;
}
.hse-breadcrumb-link,
.hse-breadcrumb-current {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 38px;
  padding: 8px 10px;
  border-radius: var(--hse-control-radius);
  font: 500 12px/1.5 var(--hse-project-font);
  text-decoration: none;
  overflow-wrap: anywhere;
}
.hse-breadcrumb-link {
  color: var(--hse-project-muted);
  transition:
    background var(--hse-project-motion),
    color var(--hse-project-motion);
}
.hse-breadcrumb-link:hover {
  color: var(--hse-project-blue);
  background: var(--hse-project-surface-soft);
}
.hse-breadcrumb-current {
  color: var(--hse-project-blue);
  background: var(--hse-project-ice);
  font-weight: 700;
}
.hse-breadcrumb-current:where([data-theme='dark'] *) {
  color: var(--hse-project-blue2);
}
.hse-breadcrumb-current::before {
  content: '';
  width: 5px;
  height: 5px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: currentColor;
}
.hse-breadcrumb :deep(.p-breadcrumb-separator) {
  color: var(--hse-project-muted);
  opacity: 0.65;
}
.hse-breadcrumb :deep(.p-breadcrumb-separator svg) {
  width: 10px;
  height: 10px;
}
.hse-breadcrumb:dir(rtl) :deep(.p-breadcrumb-separator svg) {
  transform: scaleX(-1);
}
@media (max-width: 600px) {
  .hse-breadcrumb-trail {
    gap: 8px;
  }
  .hse-breadcrumb-back {
    width: 38px;
    padding: 8px;
  }
  .hse-breadcrumb-back span {
    display: none;
  }
  .hse-breadcrumb-back + .hse-breadcrumb {
    padding-inline-start: 8px;
  }
  .hse-breadcrumb-link,
  .hse-breadcrumb-current {
    padding-inline: 7px;
    font-size: 11px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hse-breadcrumb-back,
  .hse-breadcrumb-link {
    transition: none;
  }
}
</style>
