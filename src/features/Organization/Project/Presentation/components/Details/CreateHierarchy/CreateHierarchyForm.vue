<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import type ProjectLocationHierarchyModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationHierarchyModel'


const props = defineProps<{
  selectedHirarchy: TitleInterface[]
}>()

// const ConvertselectedHirarchyToTitleinterface = computed((): TitleInterface[] => {
//   return props.selectedHirarchy.map((item: ProjectLocationHierarchyModel) => {
//     return {
//       id: item.id,
//       title: item.title,
//       subtitle: "",
//       kpi: "",
//       decodedData: "",
//     }
//   })
// })

const indexHerikalyController = IndexHerikalyController.getInstance()
const HerikalyParams = new IndexHerikalyParams('', 0, 0, 0)

const emit = defineEmits(['update:herikaly'])

const herikaly = ref([])

const updateHerikaly = (value: TitleInterface[]) => {
  herikaly.value = value || []
  emit('update:herikaly', herikaly.value)
}
</script>

<template>
  <div class="equipment-form">
    <form>
      <div class="input-container">
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="herikaly" :params="HerikalyParams" :controller="indexHerikalyController"
            class="input" :label="$t('functional Hierarchy')" id="herikaly" :type="2"
            :placeholder="$t('functional Hierarchy')" @update:modelValue="updateHerikaly" />
        </div>
      </div>
    </form>
  </div>
</template>
