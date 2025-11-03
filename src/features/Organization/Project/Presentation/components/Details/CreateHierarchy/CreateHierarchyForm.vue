<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import { onMounted, ref, watch } from 'vue'

const indexHerikalyController = IndexHerikalyController.getInstance()
const HerikalyParams = new IndexHerikalyParams('', 0, 0, 0)
const emit = defineEmits(['update:herikaly'])

const herikaly = ref<TitleInterface | null>(null)

const updateHerikaly = (value: TitleInterface | null) => {
  herikaly.value = value
  emit('update:herikaly', value)
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
            id="employee"
            :type="2"
            :placeholder="$t('functional Hierarchy')"
            @update:modelValue="updateHerikaly"
          />
        </div>
      </div>
    </form>
  </div>
</template>
