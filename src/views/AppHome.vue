<script setup lang="ts">

import DataTable from '@/components/Tables/DataTable.vue';
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'

import {  ref } from 'vue'
import Egy from '@/shared/icons/Egy.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import IconAdd from '@/shared/icons/IconAdd.vue'
import IconMinus from '@/shared/icons/IconMinus.vue'

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



</script>

<template>

  <div class="input-wrapper">
    <div class="label-wrapper">
      <label for=""
        >Title
        <span class="text-red-500">*</span>
      </label>

      <div class="languages">
        <div class="input-lang">
          <input type="radio" id="eg" name="lang" value="eg" v-model="lang" />
          <label class="icon-lng" for="eg"><Egy /></label>
        </div>
        <div class="input-lang">
          <input type="radio" id="us" name="lang" value="us" v-model="lang" />
          <label class="icon-lng" for="us"><USA /></label>
        </div>
        <div class="input-lang">
          <input type="radio" id="sa" name="lang" value="sa" v-model="lang" />
          <label class="icon-lng" for="sa"><SA /></label>
        </div>
      </div>
    </div>

    <input type="text" id="" v-model="title" placeholder="Enter Title" />
    <span class="select-lang">
      {{ lang ? lang : "select language from the top" }}
    </span>
  </div>


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
      <input type="text" id="" v-model="title" placeholder="Enter Title" />

    </div>
  </div>

  <!--  <div class="flex text-red-400">-->
  <!--    <div>asdfas</div>-->
  <!--    <div>asdfas</div>-->
  <!--  </div>-->

  <!-- <FileUpload />-->
  <!-- <div class="input-wrapper">
    <label for="">Title</label>
    <input type="text" id="" v-model="title" placeholder="Enter Title" />
  </div> -->
</template>

<style scoped></style>
