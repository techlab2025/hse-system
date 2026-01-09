<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  itemindex: number
  isRadio?: boolean
}>()

const Answers = ref([
  {
    text: ' ',
    isTextarea: false,
    textareaType: 0,
    isUplaod: false,
    isObservation: false,
  },
])

const addNewAnswer = () => {
  Answers.value.push({
    text: '',
    isTextarea: false,
    textareaType: 0,
    isUplaod: false,
    isObservation: false,

  })
  UpdateData()
}

const DeleteItem = (index: number) => {
  Answers.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', Answers.value)
}
onMounted(() => {
  emit('update:data', Answers.value)
})
</script>
<template>
  <div class="template-container tempalte-item-conatainer">

    <div class="flex flex-col md:flex-row w-full items-center add-answer">
      <p class="items-title">add your answers</p>
      <hr class="w-full ">
    </div>
    <div class="timeline-item" v-for="(item, index) in Answers" :key="index" :class="{ active: index === 0 }"
      :style="{ animationDelay: `${index * 0.15}s` }" style="margin-bottom: 0px;">
      <div class="timeline-content ">

        <div class="timeline-contect-select timeline-templateitem-contect-select ">
          <div class="input-wrapper col-span-12 md:col-span-5 text-input">
            <!-- <label for="result">result</label> -->
            <input type="text" id="result" v-model="item.text" class="input" placeholder="add your Item"
              @input="UpdateData" />
          </div>
          <div class="text-area-type-container flex flex-col col-span-12 md:col-span-2"
            :class="item.isTextarea ? 'active' : ''">
            <div class="input-wrapper text-required  flex items-center">
              <label :for="`textarea-${index}-${itemindex}`">typing text</label>
              <input type="checkbox" :id="`textarea-${index}-${itemindex}`" v-model="item.isTextarea" class="input"
                placeholder="add your Item" @input="UpdateData" />
            </div>

            <div v-if="item?.isTextarea" class="text-area-type">
              <div class="input-wrapper" :class="item.textareaType == 2 ? 'active' : ''">
                <label :for="`required-${index}-${itemindex}`">required</label>
                <input type="radio" :id="`required-${index}-${itemindex}`" v-model="item.textareaType" :value=2
                  @input="UpdateData">
              </div>
              <div class="input-wrapper" :class="item.textareaType == 1 ? 'active' : ''">
                <label :for="`optional-${index}-${itemindex}`">optional</label>
                <input type="radio" :id="`optional-${index}-${itemindex}`" v-model="item.textareaType" :value=1
                  @input="UpdateData">
              </div>
            </div>
          </div>
          <div class="input-wrapper checkbox flex items-center col-span-12 md:col-span-2">
            <label :for="`Uplaod-${index}-${itemindex}`">Uplaod</label>
            <input type="checkbox" :id="`Uplaod-${index}-${itemindex}`" v-model="item.isUplaod" class="input"
              @input="UpdateData" />
          </div>
          <div class="input-wrapper checkbox flex items-center col-span-12 md:col-span-2">
            <label :for="`observation-${index}-${itemindex}`">observation</label>
            <input type="checkbox" :id="`observation-${index}-${itemindex}`" v-model="item.isObservation" class="input"
              @input="UpdateData" />
          </div>
          <button class="remove" @click.prevent="DeleteItem(index)"
            v-if="index >= 0 && index !== Answers.length - 1">Remove</button>
        </div>
      </div>

      <div class="tree-marker flex">
        <div>
          <div class="tree-dot">
            <div class="tree-dot-inner"></div>
            <div class="tree-pulse"></div>
          </div>

          <div class="tree-icon">
            <!-- <DeleteItemAction class="cursor-pointer" v-if="index >= 0 && index !== Answers.length - 1"
              @click="DeleteItem(index)" /> -->
            <!-- v-else -->
            <AddAnswer v-if="!(index >= 0 && index !== Answers.length - 1)" @click="addNewAnswer"
              class="cursor-pointer" />
            <!-- <span>aaaa</span> -->
          </div>
        </div>
        <span class="add-text" v-if="!(index >= 0 && index !== Answers.length - 1)" @click="addNewAnswer">Add another
          result</span>
      </div>
    </div>
  </div>
</template>
