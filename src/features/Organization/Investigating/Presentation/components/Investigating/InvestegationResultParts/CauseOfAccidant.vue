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

type SelectedFactor =
  | {
      factor: number
      subs: number[]
      isOther?: false
    }
  | {
      isOther: true
      factorText: string
    }

type InvestigationFactorPayload =
  | {
      factory_id: number
      items: Array<{ factory_item_id: number }>
    }
  | {
      factor_text: string
    }

const descripe = ref<string>('')
// const Preventive = ref<string>('')

const emit = defineEmits(['update:data'])

// Emit data in API shape
const UpdateData = () => {
  const factors: InvestigationFactorPayload[] = selectedFactors.value
    .map((factor) => {
      if ('factor_text' in factor) {
        const factorText = factor.factor_text.trim()
        return factorText ? { factor_text: factorText } : null
      }

      return {
        factory_id: factor.factoryId,
        items: factor.items.map((item) => ({
          factory_item_id: item.factoryItemId,
        })),
      }
    })
    .filter((factor): factor is InvestigationFactorPayload => factor !== null)

  const payload = {
    description: descripe.value,
    // preventive: Preventive.value,
    factors,
    hasEmptyOtherFactor: selectedFactors.value.some(
      (factor) => 'factor_text' in factor && !factor.factor_text.trim(),
    ),
  }
  emit('update:data', payload)
}

// Fetch all factors
const AllFactors = ref<FactoryModel[]>([])
const SelectedFactor = ref<number>()
const GetAllFators = async () => {
  const indexFactorParams = new IndexFactoryParams('', 1, 10, 0)
  const indexFactorController = IndexFactoryController.getInstance()
  const state = await indexFactorController.getData(indexFactorParams)
  if (state.value?.data) {
    AllFactors.value = state.value.data
  }
}

// Fetch factor items by selected factor
const AllFactorItems = ref<FactoryItemModel[]>([])
const GetFatorItems = async (Id?: number) => {
  const indexFactorItemParams = new IndexFactoryItemParams('', 1, 10, 0, Id ?? SelectedFactor.value)
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
watch(
  () => SelectedFactor.value,
  (NewValue) => GetFatorItems(NewValue),
)

// Selected factors with subitems
const selectedFactors = ref<Array<InvestigationFactorParams | { factor_text: string }>>([])
const GetSelectedFactors = (data: SelectedFactor[]) => {
  selectedFactors.value = data.map((item) => {
    if (item.isOther) {
      return { factor_text: item.factorText }
    }

    const itemSubs = item.subs.map((id) => new InvestigationFactorItemParams(id))
    return new InvestigationFactorParams(item.factor, itemSubs)
  })
  UpdateData()
}
</script>

<template>
  <div class="cause-of-accidant">
    <HeaderPage
      :title="`Root Cause Factors`"
      :subtitle="``"
      :img="factor"
      :showAll="false"
      class="title-header"
    />

    <div class="cause-of-accidant-content">
      <FactorInvestigating
        :factors="AllFactors"
        @update:sub-factors="SelectedFactor = $event"
        :subfactors="AllFactorItems"
        @update:data="GetSelectedFactors"
      />

      <!-- <div class="input-wrapper">
        <label for="corrective_action">{{ $t('corrective_action') }}</label>
        <textarea
          id="corrective_action"
          class="input"
          placeholder="add your corrective action"
          v-model="descripe"
          @input="UpdateData"
        ></textarea>
      </div> -->
      <!-- <div class="input-wrapper">
        <label for="description">{{ $t('description') }}</label>
        <textarea id="description" class="input" placeholder="add your description" v-model="Preventive"
          @input="UpdateData"></textarea>
      </div> -->
    </div>
  </div>
</template>
