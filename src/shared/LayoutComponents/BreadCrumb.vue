<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BackIcon from '../icons/BackIcon.vue'
import FastRoutes from './FastrRoutes/FastRoutes.vue'
import { buildBreadcrumb } from './Helper/RouteHelper'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

const route = useRoute()
const router = useRouter()

const RouterBack = () => {
  router.back()
}

const IsHome = computed(
  () => route.path === '/organization' || route.path === '/admin'
)
const IsHomeSetting = computed(
  () => route.path === '/organization/setting' || route.path === '/admin' || route.path === '/organization'
)


// const items = computed(() =>
//   buildBreadcrumb(route, router)
// )
const getUrlWithParams = () => {
  if (route.path.includes("add")) {
    const Params = Object.values(route.params)[0]
    return Params
  }
  else {
    const Params = Object.values(route.query)[1]
    return Params

  }
}
const items = computed(() => {
  const breadcrumb = buildBreadcrumb(route, router)

  // If Route Type Shared
  if (route.meta.type === 'Shared') {
    // If Shared But Special Hazard Routes
    // Make Parent SubParent Not Parent
    if (route.meta.subType && (route.params.parent_id || route.query.hazard == 1)) {

      const parentRoute = allRoutes.find(
        (pr) =>
          pr.name ===
          `${route.meta.subParent} ${user?.type == OrganizationTypeEnum.ADMIN ? 'Admin' : 'Organization'
          }`
      )
      if (parentRoute) {
        breadcrumb.splice(breadcrumb.length - 1, 0, {
          label: parentRoute.meta?.breadcrumb as string,
          url: parentRoute.path.replace(/\/:[^/]+(\?)?/g, `/${String(getUrlWithParams())}`),
        })
      }
    }
    // If Shared But Normal Routes
    // Parent Is Parent
    else {
      const parentRoute = allRoutes.find(
        (pr) =>
          pr.name ===
          `${route.meta.parent} ${user?.type == OrganizationTypeEnum.ADMIN ? 'Admin' : 'Organization'
          }`
      )
      if (parentRoute) {
        breadcrumb.splice(breadcrumb.length - 1, 0, {
          label: parentRoute.meta?.breadcrumb as string,
          url: parentRoute.path.replace(/\/:[^/]+(\?)?/g, ``),
        })
      }
    }
  }

  return breadcrumb
})


const allRoutes = router.getRoutes()

const { user } = useUserStore()

const HandleSharedRoutes = () => {
  const parentRoute = allRoutes.find(
    (pr) =>
      pr.name ===
      (route.meta.parent as string) + " " +
      (user?.type == OrganizationTypeEnum.ADMIN ? 'Admin' : 'Organization'),
  )


  items.value.push({
    label: parentRoute?.meta?.breadcrumb as string,
    url: parentRoute?.path as string,
  })

}


watch(() => route, () => {
  // if (route.meta.type == 'Shared') {
  // console.log(route.meta.type, "route.meta.type")
  // HandleSharedRoutes()
  // }
  // else {
  buildBreadcrumb(route, router)
  // }
}, { immediate: true, deep: true })

</script>

<template>
  <div class="breadcrump-container">
    <div class="breadcrump">
      <button class="sidebar-back" @click="RouterBack" v-if="!IsHome">
        <BackIcon class="icon" />
        <span>back</span>
      </button>

      <Breadcrumb :model="items" />
    </div>

    <FastRoutes v-if="!IsHomeSetting" />
  </div>
</template>
