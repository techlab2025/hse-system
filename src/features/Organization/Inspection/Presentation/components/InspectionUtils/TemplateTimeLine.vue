<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref, watch } from 'vue'
import TemplateItemTimeLine from './TemplateItemTimeLine.vue'
import TemplateImage from '@/features/setting/TemplateItem/Presentation/components/TemplateTypes/TemplateImage.vue'
import { ActionsEnum } from '@/features/setting/TemplateItem/Core/Enum/ActionsEnum'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  visable: boolean
}>()

// Helper to create a new empty answer object with a unique ID
const createNewAnswerObject = () => ({
  id: Math.random().toString(36).substring(2, 9),
  itemTitle: '',
  SelectedActionType: new TitleInterface({ id: ActionsEnum.CHECKBOX, title: 'Checkbox' }),
  TemplateItems: [],
  isUpdloadImage: false,
  ImageStatus: 0,
})

const Answers = ref([createNewAnswerObject()])

const addNewAnswer = () => {
  Answers.value.push(createNewAnswerObject())
  UpdateData()
}

const DeletedIndex = ref<number | null>(null)

const DeleteItem = (index: number) => {
  // Removing from Answers array automatically removes the nested TemplateItems
  Answers.value.splice(index, 1)
  DeletedIndex.value = index
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', Answers.value)
}

onMounted(() => {
  UpdateData()
})

const ActionsType = ref<TitleInterface[]>([
  new TitleInterface({ id: ActionsEnum.CHECKBOX, title: 'Checkbox', subtitle: '' }),
  new TitleInterface({ id: ActionsEnum.RADIOBUTTON, title: 'Radio', subtitle: '' }),
  new TitleInterface({ id: ActionsEnum.DROPDOWN, title: 'Dropdown', subtitle: '' }),
  new TitleInterface({ id: ActionsEnum.TEXTAREA, title: 'TextArea', subtitle: '' }),
])

const UpdateType = () => {
  UpdateData()
}

watch(() => props.visable, (newVal) => {
  console.log(newVal, "Newval");
  if (!newVal) {
    Answers.value = []
  }
})
</script>

<template>
  <div class="template-container col-span-4 w-full">
    <div class="heirarchy-info w-full">
      <div class="timeline-container col-span-3 w-full">
        <div class="timeline-wrapper">
          <div class="timeline-line"></div>

          <div v-for="(item, index) in Answers" :key="item.id" class="timeline-item" :class="{ active: index === 0 }"
            :style="{ animationDelay: `${index * 0.15}s` }">
            <div class="timeline-marker">
              <div class="timeline-dot">
                <div class="timeline-dot-inner"></div>
                <div class="timeline-pulse"></div>
              </div>

              <div class="timeline-icon">
                <!-- <DeleteItemAction v-if="Answers.length > 1" class="cursor-pointer" @click="DeleteItem(index)" />
                <AddAnswer v-if="index === Answers.length - 1" @click="addNewAnswer" class="cursor-pointer ml-2" /> -->
                <div class="timeline-icon">
                  <DeleteItemAction class="cursor-pointer" v-if="index >= 0 && index !== Answers.length - 1"
                    @click="DeleteItem(index)" />
                  <AddAnswer v-else @click="addNewAnswer" class="cursor-pointer" />
                </div>
              </div>
            </div>

            <div class="timeline-content template-timeline-content grid grid-cols-4 w-full">
              <div class="col-span-4 flex flex-col md:flex-row w-full items-center gap-3">
                <div class="timeline-content-text input-wrapper w-full">
                  <label for="text">{{ $t('item_title') }}</label>
                  <input type="text" v-model="item.itemTitle" class="input" :placeholder="$t('add your title')"
                    @input="UpdateData" />
                </div>

                <div class="input-wrapper type-select">
                  <CustomSelectInput :static-options="ActionsType" v-model="item.SelectedActionType"
                    :placeholder="$t('select template type..')" class="mt-4 mr-2 input" :label="$t('type')" :reload="false"
                    @update:modelValue="UpdateType" />
                </div>
              </div>

              <TemplateImage class="w-full col-span-4 md:col-span-4"
                @update:data="item.isUpdloadImage = $event.isUpdloadImage; item.ImageStatus = $event.ImageType"
                :IdIndex="`${item.id}`" />

              <TemplateItemTimeLine v-if="item.SelectedActionType.id !== ActionsEnum.TEXTAREA" :itemindex="index"
                :key="`timeline-${item.id}`" @update:data="item.TemplateItems = $event"
                :isRadio="item.SelectedActionType.id === ActionsEnum.RADIOBUTTON" :deletedIndex="DeletedIndex" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
