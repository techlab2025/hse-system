<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexFilterIcon from '@/shared/icons/IndexFilterIcon.vue'
import { ref } from 'vue'
const emit = defineEmits(['update:data'])

const props = defineProps<{
  filters: TitleInterface[]
  link:string
  linkTitle:string
}>()

const SelectedFilter = ref<number[]>([])

const UpdateData = (data: number, index: number) => {
  if (SelectedFilter.value.includes(data)) {
    SelectedFilter.value.splice(index, 1)
    return
  }
  SelectedFilter.value[index] = data
  emit('update:data', SelectedFilter.value)
}
</script>
<template>
  <div class="idnex-filter">
    <div class="filter-container">
      <p
        class="filter"
        :class="SelectedFilter.includes(item.id) ? 'active' : ''"
        v-for="(item, index) in filters"
        :key="index"
        @click="UpdateData(item.id, index)"
      >
        {{ item.title }}
      </p>
    </div>
    <div class="btns">
      <button class="btn btn-filter">
        <span>Filter</span>
        <IndexFilterIcon />
      </button>
      <router-link :to="link">
        <button class="btn btn-primary">{{ linkTitle }}</button>
      </router-link>
    </div>
  </div>
</template>
