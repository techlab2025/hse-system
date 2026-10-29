<script setup lang="ts">
import { translateNavigationLabel } from '@/localization/navigation'
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
    label: translateNavigationLabel(item.label),
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
        <BackIcon class="locale-directional-icon" aria-hidden="true" />
        <span>{{ $t('back') }}</span>
      </button>

      <div class="hse-breadcrumb-content">
        <!-- <h2 v-if="items.length" class="hse-breadcrumb-title">
          {{ items[items.length - 1].label }}
        </h2> -->
        <Breadcrumb :model="items" class="hse-breadcrumb" :aria-label="$t('Breadcrumb')">
          <template #item="{ item, props }">
            <a v-if="item.url" v-bind="props.action" :href="item.url" class="hse-breadcrumb-link">
              <svg
                v-if="item === items[0]"
                class="hse-breadcrumb-home"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
                <path d="M9 21v-8h6v8" />
              </svg>
              {{ item.label }}
            </a>
            <span v-else class="hse-breadcrumb-current" aria-current="page">
              {{ item.label }}
            </span>
          </template>
        </Breadcrumb>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hse-breadcrumb-bar {
  /* --breadcrumb-accent: var(--hse-project-blue, var(--identity-primary)); */
  /* --breadcrumb-banner: color-mix(in srgb, var(--breadcrumb-accent) 8%, transparent); */
  width: 100%;
  min-width: 0;
  margin-bottom: 16px;
  font-family: var(--hse-project-font, var(--font-family));
  /* background:white; */

}
.hse-breadcrumb-bar > .hse-breadcrumb-trail {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  gap: 14px;
  width: fit-content;
  min-width: 0;
  /* min-height: 96px; */
  padding: 7px 20px;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--breadcrumb-accent) 18%, var(--surface-1));
  border-radius: 16px;
    background:white;

  box-shadow: 0 4px 14px color-mix(in srgb, var(--breadcrumb-accent) 8%, transparent);
  color: var(--text-strong);
}
.hse-breadcrumb-trail::before,
.hse-breadcrumb-trail::after {
  content: '';
  position: absolute;
  z-index: -1;
  pointer-events: none;
  width: 260px;
  height: 260px;
  border: 1px solid color-mix(in srgb, var(--breadcrumb-accent) 18%, transparent);
  border-radius: 50%;
  inset-inline-end: -50px;
  inset-block-start: -150px;
}
.hse-breadcrumb-trail::after {
  width: 340px;
  height: 340px;
  inset-inline-end: -90px;
  inset-block-start: -190px;
  box-shadow: 0 0 0 40px color-mix(in srgb, var(--breadcrumb-accent) 5%, transparent);
}
.hse-breadcrumb-content {
  flex: 1 1 auto;
  min-width: 0;
}
.hse-breadcrumb-title {
  margin: 0 0 4px;
  color: var(--text-strong);
  font: 700 clamp(18px, 1.6vw, 22px) / 1.35 var(--hse-project-font, var(--font-family));
  overflow-wrap: anywhere;
}
.hse-breadcrumb-back {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--breadcrumb-accent) 18%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--breadcrumb-accent) 8%, var(--surface-1));
  color: var(--breadcrumb-accent);
  cursor: pointer;
  transition:
    background 180ms ease,
    border-color 180ms ease;
}
.hse-breadcrumb-back span {
  display: none;
}
.hse-breadcrumb-back:hover {
  background: color-mix(in srgb, var(--breadcrumb-accent) 15%, var(--surface-1));
  border-color: color-mix(in srgb, var(--breadcrumb-accent) 35%, transparent);
}
.hse-breadcrumb-back svg {
  width: 18px;
  height: 18px;
}
.hse-breadcrumb-back :deep(path) {
  stroke: currentColor;
}
.hse-breadcrumb-back:dir(rtl) svg {
  transform: scaleX(-1);
}
.hse-breadcrumb {
  min-width: 0;
  padding: 4px;
  margin-inline: -4px;
  border: 0;
  border-radius: 0;
  background: transparent;
  overflow: visible;
  font-family: inherit;
}
.hse-breadcrumb :deep(.p-breadcrumb-list) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 0;
}
.hse-breadcrumb :deep(.p-breadcrumb-item) {
  display: flex;
  min-width: 0;
  max-width: 100%;
}
.hse-breadcrumb :deep(.p-breadcrumb-separator) {
  color: color-mix(in srgb, var(--text-soft) 72%, transparent);
}
.hse-breadcrumb :deep(.p-breadcrumb-separator svg) {
  width: 10px;
  height: 10px;
}
.hse-breadcrumb:dir(rtl) :deep(.p-breadcrumb-separator svg) {
  transform: scaleX(-1);
}
.hse-breadcrumb-link,
.hse-breadcrumb-current {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 3px 8px;
  box-sizing: border-box;
  border-radius: 8px;
  color: var(--text-soft);
  font: 500 12px/1.6 var(--hse-project-font, var(--font-family));
  text-decoration: none;
  overflow-wrap: anywhere;
  transition:
    background 180ms ease,
    color 180ms ease;
}
.hse-breadcrumb-home {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
}
.hse-breadcrumb-link:hover {
  background: color-mix(in srgb, var(--breadcrumb-accent) 10%, transparent);
  color: var(--text-strong);
}
.hse-breadcrumb-current {
  background: color-mix(in srgb, var(--breadcrumb-accent) 14%, transparent);
  color: var(--text-strong);
  font-weight: 600;
}
.hse-breadcrumb-back:focus-visible,
.hse-breadcrumb-link:focus-visible {
  outline: 2px solid var(--breadcrumb-accent);
  outline-offset: 3px;
}
@media (max-width: 600px) {
  .hse-breadcrumb-bar > .hse-breadcrumb-trail {
    gap: 10px;
    min-height: 84px;
    padding: 12px 14px;
    border-radius: 14px;
  }
  .hse-breadcrumb-back {
    width: 36px;
    height: 36px;
  }
  .hse-breadcrumb-title {
    margin-bottom: 2px;
  }
  .hse-breadcrumb-link,
  .hse-breadcrumb-current {
    padding: 3px 6px;
    font-size: 12px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hse-breadcrumb-back,
  .hse-breadcrumb-link,
  .hse-breadcrumb-current {
    transition: none;
  }
}
</style>
