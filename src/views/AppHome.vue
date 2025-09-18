<script setup lang="ts">


// import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';

import { ref } from 'vue'
import Egy from '@/shared/icons/Egy.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import IconAdd from '@/shared/icons/IconAdd.vue'
import IconMinus from '@/shared/icons/IconMinus.vue'
import AppenInput from '@/shared/HelpersComponents/AppenInput.vue'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import FR from '@/shared/icons/FR.vue'
import IR from '@/shared/icons/IR.vue'
import De from '@/shared/icons/DE.vue'

const title = ref('')
const lang = ref('eg')

const inputs = ref([
  {
    title: '',
    lang: 'eg'
  }
])

const addInput = () => {
  inputs.value.push({
    title: '',
    lang: 'eg'
  })
}

const removeInput = (index: number) => {
  inputs.value.splice(index, 1)
}

const langs = [
  // { code: "eg", icon: Egy },
  { code: "us", icon: USA },
  { code: "sa", icon: SA },
  { code: "du", icon: De },
  { code: "ir", icon: IR },
  { code: "fr", icon: FR },
];

const titles = ref([])

const field = ref({ title: "", lang: "" });
</script>

<template>

  <LangTitleInput v-model="titles" :langs="langs" />
  <pre>{{ titles }}</pre>


  <div class="input-append" v-for="(input, index) in inputs" :key="index">
    <button type="button" class="btn-add" :class="{
      'added' : inputs.length > 1
    }" v-if="index === 0" @click="addInput">
      <IconAdd />
    </button>
    <button type="button" class="btn-minus" v-if="index !== 0" @click="removeInput(index)">
      <IconMinus />
    </button>
    <div class="input-wrapper">

      <label for="">Title</label>
      <input type="text" id="" v-model="input.title" placeholder="Enter Title" />

    </div>
  </div>

  <AppenInput :modelValue="inputs" />

  <!--  <div class="flex text-red-400">-->
  <!--    <div>asdfas</div>-->
  <!--    <div>asdfas</div>-->
  <!--  </div>-->



  <!-- <FileUpload />-->

<!--  <CustomSelectInput-->
<!--  :label="'Title'"-->
<!--  :static-options="[new TitleInterface({ id: 1, title: 'test' }), new TitleInterface({ id: 2, title: 'test 2' })]"-->
<!--  :type="2"-->
<!--  placeholder="Enter Title"-->
<!--  @update:modelValue="title = $event"-->
<!--  modelValue=""-->
<!--  -->
<!--  />-->
  <!-- <div class="input-wrapper">
    <label for="">Title</label>
    <input type="text" id="" v-model="title" placeholder="Enter Title" />
  </div> -->

</template>

<style scoped></style>
