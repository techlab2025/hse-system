<script setup lang="ts">
import BlueBack from '@/assets/images/BgGroup.png'
import yelloecircle from '@/assets/images/yelloecircle.png'
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone';
import { onMounted, ref } from 'vue'


const emit = defineEmits(['update:data'])
const props = defineProps<{
  zones: SohwProjectZoonModel[]
}>()
const updateData = (data) => {
  emit('update:data', data.target.value)
}
const SelectedLocation = ref(props.zones[0]?.projectZoonId)

onMounted(() => {
  emit('update:data', props.zones[0]?.projectZoonId)

})
</script>
<template>
  <div class="w-full">
    <div class="tabs-selction-container">
      <div class="tabs-selction-content">
        <div class="select-container">

          <div class="select-item" v-for="zoon in zones" :key="zoon.projectZoonId"
            :class="SelectedLocation === zoon.projectZoonId ? 'active' : ''">
            <div class="left-back-img">
              <img :src="BlueBack" alt="blue" />
              <img class="left-yellow" :src="yelloecircle" alt="yellow" />
            </div>
            <input type="radio" :id="`radio-${zoon.projectZoonId}`" name="radio" :value="zoon.projectZoonId"
              @change="updateData" />
            <label class="item" @click="SelectedLocation = zoon.projectZoonId" :for="`radio-${zoon.projectZoonId}`"
              v-if="zoon?.zoonTitle">{{
                zoon.zoonTitle || `--` }}</label>
            <div class="right-back-img">
              <img :src="BlueBack" alt="blue" />
              <img class="right-yellow" :src="yelloecircle" alt="blue" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
