<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BackIcon from '../icons/BackIcon.vue'
// import BreadCrumpIcon from '../icons/BreadCrumpIcon.vue'

const route = useRoute()
const router = useRouter()
const fullPath = ref<string[]>([])
const items = ref<{ label: string; url: string }[]>([])

const GetFullPath = () => {
  fullPath.value = route.fullPath.split('/').filter(Boolean)
  let currentPath = ''
  items.value = []

  fullPath.value.forEach((item) => {
    currentPath += `/${item}`
    items.value.push({
      label: item.includes('?')
        ? item.slice(0, item.indexOf('?'))
        : item == "organization" ? "Home" : item,
      url: currentPath
    })
  })
}

onMounted(() => {
  GetFullPath();
})

watch(
  () => route.fullPath,
  () => {
    GetFullPath()
  }
)

const RouterBack = () => {
  router.back()
}
</script>


<template>
  <div class="breadcrump">
    <button class="sidebar-back" @click="RouterBack">
      <BackIcon class="icon" />
      <span>back</span>
    </button>
    <Breadcrumb :model="items" />
  </div>
</template>
