<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import factor from '@/assets/images/factor.png'
import FactorInvestigating from '../FactorInvestigating.vue'
import { onMounted, ref, watch } from 'vue'
import IndexFactoryParams from '@/features/setting/Factory/Core/params/indexFactoryParams'
import IndexFactoryController from '@/features/setting/Factory/Presentation/controllers/indexFactoryController'
import type FactoryModel from '@/features/setting/Factory/Data/models/FactoryModel'
import IndexFactoryItemParams from '@/features/setting/FactoryItem/Core/params/indexFactoryItemParams'
import IndexFactoryItemController from '@/features/setting/FactoryItem/Presentation/controllers/indexFactoryItemController'
import type FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel'
import InvestigationFactorParams from '@/features/Organization/Investigating/Core/params/investegationResult/InvestegationFactorParams'
import InvestigationFactorItemParams from '@/features/Organization/Investigating/Core/params/investegationResult/InvestegationFactorItemParams'

const descripe = ref<string>('')

const emit = defineEmits(['update:data'])

// Emit data in API shape
const UpdateData = () => {
  const payload = {
    description: descripe.value,
    factors: SelctedFactors.value.map(factor => ({
      factory_id: factor.factoryId,
      items: factor.items.map(item => ({
        factory_item_id: item.factoryItemId
      }))
    }))
  }
  emit('update:data', payload)
}

// Fetch all factors
const AllFactors = ref<FactoryModel[]>([])
const SelectedFactor = ref<number>()
const GetAllFators = async () => {
  const indexFactorParams = new IndexFactoryParams("", 1, 10, 1)
  const indexFactorController = IndexFactoryController.getInstance()
  const state = await indexFactorController.getData(indexFactorParams)
  if (state.value?.data) {
    AllFactors.value = state.value.data
  }
}

// Fetch factor items by selected factor
const AllFactorItems = ref<FactoryItemModel[]>()
const GetFatorItems = async (Id?: number) => {
  const indexFactorItemParams = new IndexFactoryItemParams("", 1, 10, 1, Id ?? SelectedFactor.value)
  const indexFactorItemController = IndexFactoryItemController.getInstance()
  const state = await indexFactorItemController.getData(indexFactorItemParams)
  if (state.value?.data) {
    AllFactorItems.value = state.value.data
  }
}

// On mount
onMounted(() => {
  GetAllFators()
})

// Watch selected factor to fetch its items
watch(() => SelectedFactor.value, (NewValue) =>
  GetFatorItems(NewValue)
)

// Selected factors with subitems
const SelctedFactors = ref<InvestigationFactorParams[]>([])
const GetSelectedFactors = (data: any[]) => {
  SelctedFactors.value = []
  data?.forEach(item => {
    const itemSubs = item.subs.map(el => new InvestigationFactorItemParams(el))
    SelctedFactors.value.push(new InvestigationFactorParams(item.factor, itemSubs))
  })
  UpdateData()
}

</script>

<template>
  <div class="cause-of-accidant">
    <HeaderPage :title="`Causes of the accident`"
      :subtitle="`Choose the reasons for the incident and write how to prevent it from happening again`" :img="factor"
      class="title-header" />

    <div class="cause-of-accidant-content">
      <FactorInvestigating :factors="AllFactors" @update:sub-factors="SelectedFactor = $event"
        :subfactors="AllFactorItems" @update:data="GetSelectedFactors" />

      <div class="input-wrapper">
        <label for="corrective_action">{{ $t('corrective_action') }}</label>
        <textarea id="corrective_action" class="input" placeholder="add your descripe" v-model="descripe"
          @input="UpdateData"></textarea>
      </div>
    </div>
  </div>
</template>
