<script setup lang="ts">
import { ref } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'

const indexHerikalyController = IndexHerikalyController.getInstance()
const HerikalyParams = new IndexHerikalyParams('', 0, 0, 0)
const emit = defineEmits(['update:herikaly'])

const herikaly = ref<TitleInterface[] | []>([])

const updateHerikaly = (value: TitleInterface[] | []) => {
  herikaly.value = value || []
  emit('update:herikaly', herikaly.value)
}
</script>

<template>
  <div class="equipment-form">
    <form>
      <div class="input-container">
        <div class="input-wrapper">
          <CustomSelectInput
            :modelValue="herikaly"
            :params="HerikalyParams"
            :controller="indexHerikalyController"
            class="input"
            :label="$t('functional Hierarchy')"
            id="herikaly"
            :type="2"
            :placeholder="$t('functional Hierarchy')"
            @update:modelValue="updateHerikaly"
          />
        </div>
      </div>
    </form>
  </div>
</template>
