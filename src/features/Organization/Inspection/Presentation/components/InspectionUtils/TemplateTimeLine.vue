<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref } from 'vue'
import TemplateItemTimeLine from './TemplateItemTimeLine.vue'
import TemplateImage from '@/features/setting/TemplateItem/Presentation/components/TemplateTypes/TemplateImage.vue'
import { ActionsEnum } from '@/features/setting/TemplateItem/Core/Enum/ActionsEnum'

const emit = defineEmits(['update:data'])

const Answers = ref([
  {
    itemTitle: ' ',
    SelectedActionType: new TitleInterface({ id: ActionsEnum.CheckBox, title: 'Checkbox' }),
    TemplateItems: [],
    isUpdloadImage: false,
    ImageStatus: 0,
  },
])

const addNewAnswer = () => {
  Answers.value.push({
    itemTitle: '',
    SelectedActionType: new TitleInterface({ id: ActionsEnum.CheckBox, title: 'Checkbox' }),
    TemplateItems: [],
    isUpdloadImage: false,
    ImageStatus: 0,

  })
  UpdateData()
}

const DeleteItem = (index: number) => {
  Answers.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  console.log(Answers.value, "Answers.value")
  emit('update:data', Answers.value)
}
onMounted(() => {
  emit('update:data', Answers.value)
})



const ActionsType = ref<TitleInterface[]>([
  new TitleInterface({ id: ActionsEnum.CHECKBOX, title: 'Checkbox', subtitle: '' }),
  new TitleInterface({ id: ActionsEnum.RADIOBUTTON, title: 'Radio', subtitle: '' }),
  new TitleInterface({ id: ActionsEnum.DROPDOWN, title: 'Dropdown', subtitle: '' }),
  new TitleInterface({ id: ActionsEnum.TEXTAREA, title: 'TextArea', subtitle: '' }),
])

// const TemplateItems = ref()

const UpdateType = (data) => {
  UpdateData()
}

// watch(
//   () => item.SelectedActionType,
//   (val) => {
//     UpdateType(val)
//   }
// )

</script>
<template>
  <div class="template-container col-span-4 w-full">
    <div class="heirarchy-info w-full">
      <div class="timeline-container col-span-3 w-full">
        <div class="timeline-wrapper ">
          <div class="timeline-line"></div>

          <div class="timeline-item" v-for="(item, index) in Answers" :key="index" :class="{ active: index === 0 }"
            :style="{ animationDelay: `${index * 0.15}s` }">
            <div class="timeline-marker">
              <div class="timeline-dot">
                <div class="timeline-dot-inner"></div>
                <div class="timeline-pulse"></div>
              </div>

              <div class="timeline-icon">
                <DeleteItemAction class="cursor-pointer" v-if="index >= 0 && index !== Answers.length - 1"
                  @click="DeleteItem(index)" />
                <AddAnswer v-else @click="addNewAnswer" class="cursor-pointer" />
              </div>
            </div>

            <div class="timeline-content template-timeline-content  grid grid-cols-4  w-full">
              <div class="col-span-4 flex w-full items-center gap-3">
                <div class="timeline-content-text input-wrapper w-full">
                  <label for="text">{{ $t('item_title') }} </label>
                  <input type="text" id="text" v-model="item.itemTitle" class="input" placeholder="add your title"
                    @input="UpdateData" />
                </div>
                <div class="input-wrapper type-select">
                  <CustomSelectInput :static-options="ActionsType" v-model="item.SelectedActionType"
                    placeholder="select templet type.." class="mt-4 mr-2 input" label="type"
                    @update:modelValue="UpdateType" />
                </div>
              </div>
              <TemplateImage class="w-full col-span-4 md:col-span-4" @update:data="
                item.isUpdloadImage = $event.isUpdloadImage; item.ImageStatus = $event.ImageType
                " :IdIndex="`${index}`" />

              <TemplateItemTimeLine v-if="item.SelectedActionType.id != ActionsEnum.TextArea" :itemindex="index"
                @update:data="item.TemplateItems = $event" :isRadio="item.SelectedActionType.id == ActionsEnum.Radio" />



            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
