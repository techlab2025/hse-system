<script setup lang="ts">
import { ref, useId } from 'vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type TitleInterface from '@/base/Data/Models/title_interface'
import CustomCheckbox from './CustomCheckbox.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import type { LookupIndustrySelection } from '@/shared/utils/lookupIndustryScope'

const model = defineModel<LookupIndustrySelection>({ required: true })
const user = useUserStore()
const scopeId = `lookup-industries-${useId()}`
const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industry = ref<TitleInterface[]>([])
const updateAllIndustries = (value: boolean) => {
  model.value = { ...model.value, allIndustries: value }
}
const setIndustry = (value: TitleInterface | TitleInterface[] | null) => {
  industry.value = Array.isArray(value) ? value : value ? [value] : []
  model.value = { ...model.value, industryIds: industry.value.map((item) => item.id) }
}
</script>

<template>
  <div v-if="user.user?.type === OrganizationTypeEnum.ADMIN" class="lookup-excel-industry-scope">
    <div class="input-wrapper">
      <CustomCheckbox
        :index="scopeId"
        :title="$t('all_industries')"
        :checked="model.allIndustries"
        @update:checked="updateAllIndustries"
      />
    </div>
    <div v-if="!model.allIndustries" class="input-wrapper">
      <CustomSelectInput
        :model-value="industry"
        :controller="industryController"
        :params="industryParams"
        :label="$t('industry')"
        :id="scopeId"
        :placeholder="$t('Select industry')"
        :required="true"
        :type="2"
        @update:model-value="setIndustry"
      />
    </div>
  </div>
</template>

<style scoped>
.lookup-excel-industry-scope {
  display: grid;
  gap: 16px;
  margin-bottom: 20px;
}
</style>
