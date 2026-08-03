<script lang="ts" setup>
import { ref } from 'vue'
// import TitleInterface from '@/base/Data/Models/title_interface'

// import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
// import type ShowObservationModel from '@/features/setting/Observation/Data/models/observationDetailsModel'
// import USA from '@/shared/icons/USA.vue'
// import SA from '@/shared/icons/SA.vue'
// import TranslationsParams from '@/base/core/params/translations_params.ts'
// import EditObservationParams from '@/features/setting/Observation/Core/params/editObservationParams.ts'
// import AddObservationParams from '@/features/setting/Observation/Core/params/addObservationParams.ts'
// import DatePicker from 'primevue/datepicker'

// import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
// import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
// import { LangsMap } from '@/constant/langs.ts'

// import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
// import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
// import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'

// import { useUserStore } from '@/stores/user'
// import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
// import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'

// import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
// import ToDoList from '@/assets/images/to-do-list.png'
// import FormPen from '@/shared/icons/FormPen.vue'
// import ObservationContainer from './ObservationContainer.vue'
// import ObservationLevel from './ObservationLevel.vue'
// import HazerdType from './HazerdType.vue'

const emit = defineEmits(['update:data', 'update:activeTab'])

// const props  = defineProps<{

// }>()

const activeTab = ref('Equipment')
const changeTab = (tab: string) => {
  activeTab.value = tab
  emit('update:activeTab', tab)
}


</script>

<template>
  <div class="tabs-div">
    <div class="tabs-title">
      <p>{{ $t('zones') }}</p>
      <div class="line">
        <p><span>{{ $t('main location is') }}</span> : {{ $t('cairo') }}</p>
      </div>
    </div>
    <div class="tabs-container">
      <button class="tab" @click="changeTab('Nasr City')" :class="{ activeTab: activeTab === 'Nasr City' }">
        {{ $t('Nasr City') }}
      </button>

      <button class="tab" @click="changeTab('Heliopolis')" :class="{ activeTab: activeTab === 'Heliopolis' }">
        {{ $t('Heliopolis') }}
      </button>

      <button class="tab" @click="changeTab('Zamalek')" :class="{ activeTab: activeTab === 'Zamalek' }">
        {{ $t('Zamalek') }}
      </button>

      <button class="tab" @click="changeTab('6th of October')" :class="{ activeTab: activeTab === '6th of October' }">
        {{ $t('6th of October') }}
      </button>

      <button class="tab" @click="changeTab('Obour City')" :class="{ activeTab: activeTab === 'Obour City' }">
        {{ $t('Obour City') }}
      </button>
    </div>
  </div>
</template>
