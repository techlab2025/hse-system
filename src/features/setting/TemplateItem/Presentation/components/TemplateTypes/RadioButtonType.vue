<script setup lang="ts">
import { onMounted, ref } from 'vue';
const emit = defineEmits(['update:data'])

const GreenValue = ref("Yes")
const RedValue = ref("No")
const RandomValue = ref("N/A")

const UpdateData = () => {
  const params = {
    green: GreenValue.value,
    red: RedValue.value,
    random: RandomValue.value
  }
  emit('update:data', params)
}
onMounted(() => {
  const params = {
    green: GreenValue.value,
    red: RedValue.value,
    random: RandomValue.value
  }
  emit('update:data', params)
})
</script>
<template>
  <div class="template-container">
    <div class="dropdwon-title">
      <p class="title">you can change you checks name</p>
      <p class="subtitle">just re-type the name</p>
    </div>
    <div class="radio-btns ">
      <input type="text" v-model="GreenValue" class="input green" @input="UpdateData" />
      <input type="text" v-model="RedValue" class="input red" @input="UpdateData" />
      <input type="text" v-model="RandomValue" class="input random" @input="UpdateData" />
    </div>
  </div>
</template>
