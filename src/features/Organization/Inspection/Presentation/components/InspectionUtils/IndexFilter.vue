<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel';
import IndexFilterIcon from '@/shared/icons/IndexFilterIcon.vue'
import { ref } from 'vue'
const emit = defineEmits(['update:data'])

const props = defineProps<{
  filters: MyZonesModel[]
  link: string
  linkTitle: string
}>()

const SelectedFilter = ref<number[]>([])

// const UpdateData = (data: number, index: number) => {
//   if (SelectedFilter.value.includes(data)) {
//     SelectedFilter.value.splice(index, 1)
//     return
//   }
//   SelectedFilter.value.push(data)
//   emit('update:data', SelectedFilter.value)
// }
const UpdateData = (data: number) => {

  if (SelectedFilter.value.includes(data)) {
    SelectedFilter.value = SelectedFilter.value.filter(i => i !== data)
    return
  }

  SelectedFilter.value.push(data)
  console.log(SelectedFilter.value, "SelectedFilter.value");
  emit('update:data', SelectedFilter.value)
}

</script>
<template>
  <div class="idnex-filter">
    <div class="filter-container">
      <!-- <p class="filter" :class="SelectedFilter.includes(item?.projectZoonId) ? 'active' : ''"
        v-for="(item, index) in filters" :key="index" @click="UpdateData(item?.projectZoonId)">
        <span v-if="item?.zoonTitle != null">
          {{ item?.zoonTitle }}
        </span>
      </p> -->
      <p class="filter" :class="SelectedFilter.includes(item.projectZoonId) ? 'active' : ''" v-for="item in filters"
        :key="item.projectZoonId" @click="UpdateData(item.projectZoonId)">

        <span v-if="item?.zoonTitle != null">
          {{ item?.zoonTitle }}
        </span>
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
