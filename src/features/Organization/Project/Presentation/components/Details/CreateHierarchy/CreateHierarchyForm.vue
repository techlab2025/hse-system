<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import type ProjectLocationHierarchyModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationHierarchyModel'
import HeirarchySelectDialog from '../../SelectDialogs/HeirarchySelectDialog.vue'


const props = defineProps<{
  selectedHirarchy: TitleInterface[]
}>()

const indexHerikalyController = IndexHerikalyController.getInstance()
const HerikalyParams = new IndexHerikalyParams('', 1, 10, 1, false)

const emit = defineEmits(['update:herikaly'])

const herikaly = ref<TitleInterface[]>(props.selectedHirarchy?.map((item) => new TitleInterface({ id: item?.id, title: item?.title })) || [])

const updateHerikaly = (value: TitleInterface[]) => {
  herikaly.value = value || []
  emit('update:herikaly', herikaly.value)
}

const HeirarchyVisable = ref<boolean>()
const ShowHeirarchyDialog = () => {
  HeirarchyVisable.value = true
}

onMounted(() => {
  updateHerikaly(herikaly.value)
})
watch(() => props.selectedHirarchy, (newvalue) => {
  herikaly.value = newvalue || []
  // updateHerikaly(herikaly.value)
})
</script>

<template>
  <div class="equipment-form">
    <form>
      <div class="input-container">
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="herikaly" :params="HerikalyParams" :controller="indexHerikalyController"
            class="input" :label="$t('functional Hierarchy')" id="herikaly" :type="2"
            :placeholder="$t('functional Hierarchy')" @update:modelValue="updateHerikaly"
            :onclick="ShowHeirarchyDialog" />
        </div>
      </div>
      <HeirarchySelectDialog v-model:visible="HeirarchyVisable" />
    </form>
  </div>
</template>
