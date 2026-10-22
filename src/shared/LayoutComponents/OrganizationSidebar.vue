<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import PermissionBuilder from '@/components/DataStatus/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus'
import {
  organizationNavigation,
  orderByKeys,
  type SidebarRoute as Routes,
} from './organizationNavigation'
import { useSystemIdentity } from '@/composables/useSystemIdentity'
import { defaultAppearance } from '@/features/SystemIdentity/appearance'
import SidebarUnicon from '@/shared/icons/SidebarUnicon.vue'
import { useSidebarMode } from '@/composables/useSidebarMode'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
// import { EquipmentTypeEnum } from '@/features/Home/core/enums/SettingEnum/EquipmentTypeEnum'

const props = defineProps<{ open: boolean }>()
const { isExpandedSidebar } = useSidebarMode()

const route = useRoute()
const { t } = useI18n()

const { user } = useUserStore()
const projectAppStatusStore = useProjectAppStatusStore()

const shouldShowOverviewGroup = computed(() => {
  return projectAppStatusStore.getProjectAppStatus()?.progress !== 100
})

interface RouteGroup {
  key: string
  label: string
  eyebrow: string
  icon: string
  routes: Routes[]
  permissions: PermissionsEnum[]
  adminOnly?: boolean
}

const flattenPermissions = (routes: Routes[]): PermissionsEnum[] =>
  routes.flatMap((item) => [
    ...item.permissions,
    ...(item.children ? flattenPermissions(item.children) : []),
  ])

const { identity } = useSystemIdentity()
const appearance = computed(() =>
  identity.value.isActive ? identity.value.appearance : defaultAppearance(),
)
const routeGroups = computed<RouteGroup[]>(() => {
  const layout = appearance.value
  return orderByKeys(organizationNavigation, layout.sidebarOrder, (group) => group.key)
    .filter((group) => group.key !== 'overview' || shouldShowOverviewGroup.value)
    .map((group) => ({
      key: group.key,
      label: t(group.label),
      eyebrow: t(group.label),
      icon: group.icon,
      adminOnly: group.key === 'overview',
      permissions:
        group.key === 'locations'
          ? [PermissionsEnum.LOCATION_ORG_ALL]
          : flattenPermissions(group.routes),
      routes: orderByKeys(
        group.routes,
        layout.sidebarItemOrder[group.key] ?? [],
        (item) => item.name,
      ).map((item) => ({
        ...item,
        children: item.children
          ? orderByKeys(
              item.children,
              layout.sidebarItemOrder[`${group.key}/${item.name}`] ?? [],
              (child) => child.name,
            )
          : undefined,
      })),
    }))
})

const activeRouteGroupKey = ref('operations')
const paneGroupKey = ref('operations')
const searchTerm = ref('')
const isPaneVisible = ref(false)
const sidePaneRoutesRef = ref<HTMLElement | null>(null)
let closePaneTimer: number | undefined

const isLinkActive = (link: Routes['link']) => {
  if (typeof link !== 'string') return false

  const [pathOnly, queryString] = link.split('?')
  if (!queryString) return route.path === pathOnly

  const expectedQuery = new URLSearchParams(queryString)
  return (
    route.path === pathOnly &&
    [...expectedQuery.entries()].every(([key, value]) => String(route.query[key] ?? '') === value)
  )
}

const isRouteActive = (sidebarRoute: Routes) =>
  isLinkActive(sidebarRoute.link) ||
  Boolean(sidebarRoute.activePrefixes?.some((prefix) => route.path.startsWith(prefix)))

const isParentLinkActive = (sidebarRoute: Routes) =>
  isRouteActive(sidebarRoute) && !sidebarRoute.children?.some((child) => isLinkActive(child.link))

const groupHasActiveRoute = (group: RouteGroup) =>
  group.routes.some(
    (item) => isRouteActive(item) || item.children?.some((child) => isRouteActive(child)),
  )

const activeGroup = computed(() => {
  return routeGroups.value.find((group) => group.key === paneGroupKey.value) || routeGroups.value[0]
})

const isSearching = computed(() => searchTerm.value.trim().length > 0)

const clearSearch = () => {
  searchTerm.value = ''
}

const visibleRouteGroups = computed<RouteGroup[]>(() => {
  const query = searchTerm.value.trim().toLocaleLowerCase()
  const groups =
    query || isExpandedSidebar.value
      ? routeGroups.value
      : activeGroup.value
        ? [activeGroup.value]
        : []

  return groups
    .filter(
      (group) =>
        !group.adminOnly || user?.isMaster === 1 || user?.employeeType == EmployeeStatusEnum.Admin,
    )
    .map((group) => {
      const routes = query
        ? group.routes.filter((item) => {
            const routeName = t(item.name).toLocaleLowerCase()
            const groupName = group.label.toLocaleLowerCase()
            const hasMatchingChild = item.children?.some((child) =>
              t(child.name).toLocaleLowerCase().includes(query),
            )

            return routeName.includes(query) || groupName.includes(query) || hasMatchingChild
          })
        : group.routes

      return {
        ...group,
        routes,
      }
    })
    .filter((group) => group.routes.length > 0)
})

const selectGroup = (groupKey: string) => {
  paneGroupKey.value = groupKey
  searchTerm.value = ''
}

const activateRouteGroup = (groupKey: string) => {
  activeRouteGroupKey.value = groupKey
  paneGroupKey.value = groupKey
  hidePane()
}

const clearClosePaneTimer = () => {
  if (!closePaneTimer) return

  window.clearTimeout(closePaneTimer)
  closePaneTimer = undefined
}

const openGroup = (groupKey: string) => {
  clearClosePaneTimer()
  selectGroup(groupKey)
  isPaneVisible.value = true

  nextTick(() => {
    if (sidePaneRoutesRef.value) sidePaneRoutesRef.value.scrollTop = 0
  })
}

const keepPaneOpen = () => {
  clearClosePaneTimer()
}

const hidePane = () => {
  clearClosePaneTimer()
  isPaneVisible.value = false
  searchTerm.value = ''
}

const scheduleClosePane = () => {
  if (isExpandedSidebar.value) return
  clearClosePaneTimer()

  closePaneTimer = window.setTimeout(() => {
    hidePane()
  }, 160)
}

watch(
  () => props.open,
  (open) => {
    if (!open) {
      hidePane()
    }
  },
)

watch(
  () => route.fullPath,
  () => {
    const currentRouteGroup = routeGroups.value.find(
      (group) => group.key === activeRouteGroupKey.value && groupHasActiveRoute(group),
    )
    const routeGroup =
      currentRouteGroup || routeGroups.value.find((group) => groupHasActiveRoute(group))

    if (routeGroup) {
      activeRouteGroupKey.value = routeGroup.key

      if (!isPaneVisible.value) {
        paneGroupKey.value = routeGroup.key
      }
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearClosePaneTimer()
})
</script>

<template>
  <div class="modern-sidebar hse-identity" :class="{ 'expanded-navigation': isExpandedSidebar }">
    <nav v-if="!isExpandedSidebar" class="side-rail-nav" :aria-label="$t('main_sidebar_groups')">
      <template v-for="group in routeGroups" :key="group.key">
        <PermissionBuilder
          v-if="
            !group.adminOnly ||
            user?.isMaster === 1 ||
            user?.employeeType == EmployeeStatusEnum.Admin
          "
          :code="group.permissions"
        >
          <button
            type="button"
            :class="[
              'side-rail-btn',
              {
                'is-selected': isPaneVisible && paneGroupKey === group.key,
                'is-active': activeRouteGroupKey === group.key && groupHasActiveRoute(group),
              },
            ]"
            :title="group.label"
            :aria-expanded="isPaneVisible && paneGroupKey === group.key"
            aria-controls="organization-sidebar-pane"
            @click="openGroup(group.key)"
            @mouseenter="openGroup(group.key)"
            @mouseleave="scheduleClosePane"
            @focus="openGroup(group.key)"
            @blur="scheduleClosePane"
          >
            <SidebarUnicon :name="group.icon" class="strip-icon" />
            <span>{{ group.label }}</span>
          </button>
        </PermissionBuilder>
      </template>
    </nav>

    <Transition name="side-pane">
      <aside
        v-if="(isExpandedSidebar || isPaneVisible) && activeGroup"
        id="organization-sidebar-pane"
        class="side-pane"
        @mouseenter="keepPaneOpen"
        @mouseleave="scheduleClosePane"
        @focusin="keepPaneOpen"
        @focusout="scheduleClosePane"
      >
        <header class="side-pane-header">
          <div class="side-pane-heading">
            <span class="side-pane-icon">
              <SidebarUnicon :name="activeGroup.icon" />
            </span>
            <div>
              <strong>{{
                isExpandedSidebar ? $t('sidebar_navigation') : activeGroup.label
              }}</strong>
              <!-- <span>{{ activeGroup.eyebrow }}</span> -->
            </div>
          </div>

          <div class="sidebar-search" role="search">
            <span class="sidebar-search__icon-shell" aria-hidden="true">
              <SidebarUnicon name="search" class="sidebar-search__icon" />
            </span>
            <input
              v-model="searchTerm"
              type="search"
              class="sidebar-search__input"
              :placeholder="$t('search')"
              :aria-label="$t('search_all_sidebar_routes')"
              autocomplete="off"
              spellcheck="false"
              @keydown.esc="hidePane"
            />
            <button
              v-if="isSearching"
              type="button"
              class="sidebar-search__clear"
              :aria-label="$t('clear')"
              :title="$t('clear')"
              @click="clearSearch"
            >
              <SidebarUnicon name="times" />
            </button>
          </div>
        </header>

        <nav
          ref="sidePaneRoutesRef"
          class="side-pane-routes"
          :aria-label="$t('sidebar_group_routes', { group: activeGroup.label })"
        >
          <div class="side-pane-routes__inner">
            <template v-for="group in visibleRouteGroups" :key="group.key">
              <PermissionBuilder v-if="isSearching || isExpandedSidebar" :code="group.permissions">
                <p class="side-route-group-title">{{ group.label }}</p>
              </PermissionBuilder>

              <PermissionBuilder
                v-for="sidebarRoute in group.routes"
                :key="`${group.key}-${String(sidebarRoute.link)}`"
                :code="sidebarRoute.permissions"
              >
                <div class="side-route-entry">
                  <router-link
                    :to="sidebarRoute.link"
                    active-class=""
                    exact-active-class=""
                    :aria-current-value="isParentLinkActive(sidebarRoute) ? 'page' : 'false'"
                    :class="['side-btn', { active: isParentLinkActive(sidebarRoute) }]"
                    :title="$t(sidebarRoute.name)"
                    @click="activateRouteGroup(group.key)"
                  >
                    <SidebarUnicon :name="sidebarRoute.icon" class="side-icon" />
                    <span class="side-label-wrap">
                      <span class="side-label">{{ $t(sidebarRoute.name) }}</span>
                      <span v-if="isSearching" class="side-label-parent">{{ group.label }}</span>
                    </span>
                  </router-link>

                  <div v-if="sidebarRoute.children?.length" class="side-route-children">
                    <PermissionBuilder
                      v-for="childRoute in sidebarRoute.children"
                      :key="String(childRoute.link)"
                      :code="childRoute.permissions"
                    >
                      <router-link
                        :to="childRoute.link"
                        active-class=""
                        exact-active-class=""
                        :aria-current-value="isLinkActive(childRoute.link) ? 'page' : 'false'"
                        :class="[
                          'side-btn side-btn--child',
                          { active: isLinkActive(childRoute.link) },
                        ]"
                        :title="$t(childRoute.name)"
                        @click="activateRouteGroup(group.key)"
                      >
                        <SidebarUnicon :name="childRoute.icon" class="side-icon" />
                        <span class="side-label">{{ $t(childRoute.name) }}</span>
                      </router-link>
                    </PermissionBuilder>
                  </div>
                </div>
              </PermissionBuilder>
            </template>

            <p v-if="!visibleRouteGroups.length" class="side-pane-empty">
              {{ $t('No Data Found') }}
            </p>
          </div>
        </nav>
      </aside>
    </Transition>
  </div>
</template>

<style scoped src="./sidebar-navigation.css"></style>
