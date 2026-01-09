<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BackIcon from '../icons/BackIcon.vue'
import FastRoutes from './FastrRoutes/FastRoutes.vue'
import { buildBreadcrumb } from './Helper/RouteHelper'

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


const items = computed(() =>
  buildBreadcrumb(route, router)
)

const allRoutes = router.getRoutes()
// const GetCurrentRoute = () => {

//   console.log(allRoutes.find((el) => el.name === route.meta?.parent))
// }

watch(() => route, () => {
  // console.log(allRoutes.filter((item) => item.name?.includes('project')))
  console.log(allRoutes.map((item) => item.name))


  buildBreadcrumb(route, router)
}, { immediate: true })

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
