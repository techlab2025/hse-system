<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
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
const HerikalyParams = new IndexHerikalyParams('', 1, 10, 0, false)

const emit = defineEmits(['update:herikaly'])

const herikaly = ref<TitleInterface[]>(
  props?.selectedHirarchy?.map((item) => new TitleInterface({ id: item?.id, title: item?.title })) ||
    [],
)

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
watch(
  () => props.selectedHirarchy,
  (newvalue) => {
    herikaly.value = newvalue || []
    // updateHerikaly(herikaly.value)
  },
)
</script>

<template>
  <div class="equipment-form hierarchy-selector">
    <form>
      <div class="input-container">
        <div class="input-wrapper">
          <CustomSelectInput
            :modelValue="herikaly"
            :params="HerikalyParams"
            :controller="indexHerikalyController"
            class="input"
            :label="$t('functional Positions')"
            id="herikaly"
            :type="2"
            :placeholder="$t('functional Positions')"
            @update:modelValue="updateHerikaly"
            :onclick="ShowHeirarchyDialog"
          />
        </div>
      </div>

      <div class="selection-preview" v-if="herikaly.length">
        <div class="selection-preview-title">
          <span>{{ $t('Selected positions') }}</span>
          <strong>{{ herikaly.length }}</strong>
        </div>
        <div class="position-chips">
          <span v-for="position in herikaly" :key="position.id" class="position-chip">
            <i aria-hidden="true"></i>
            {{ position.title }}
          </span>
        </div>
      </div>

      <div class="selection-placeholder" v-else>
        <span class="placeholder-icon">+</span>
        <span>
          <strong>{{ $t('No positions selected') }}</strong>
          <small>{{ $t('Open the selector to add one or more functional positions.') }}</small>
        </span>
      </div>

      <HeirarchySelectDialog v-model:visible="HeirarchyVisable" />
    </form>
  </div>
</template>

<style scoped lang="scss">
.hierarchy-selector {
  width: 100%;
  padding: 15px 18px !important;
}

.hierarchy-selector form,
.input-container,
.input-wrapper {
  width: 100%;
}

.input-container {
  margin: 0 !important;
  padding: 0 !important;
}

.selection-preview,
.selection-placeholder {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid var(--main-border);
  border-radius: 13px;
  background: color-mix(in srgb, var(--surface-2) 42%, var(--surface-1));
}

.selection-preview-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 9px;
  color: var(--text-soft);
  font-size: 0.63rem;
  font-weight: 800;
}

.selection-preview-title strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 23px;
  padding: 0 7px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  font-family: 'Bold';
}

.position-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.position-chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  gap: 6px;
  padding: 6px 9px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 17%, var(--main-border));
  border-radius: 9px;
  background: var(--surface-1);
  color: var(--text-strong);
  font-size: 0.63rem;
  font-weight: 750;
}

.position-chip i {
  width: 6px;
  height: 6px;
  flex: 0 0 6px;
  border-radius: 50%;
  background: var(--status-success);
}

.selection-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 68px;
  gap: 9px;
  border-style: dashed;
  text-align: start;
}

.placeholder-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 29px;
  height: 29px;
  flex: 0 0 29px;
  border-radius: 9px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  font-size: 1rem;
}

.selection-placeholder > span:last-child {
  display: flex;
  flex-direction: column;
}

.selection-placeholder strong {
  color: var(--text-strong);
  font-size: 0.67rem;
}

.selection-placeholder small {
  color: var(--text-soft);
  font-size: 0.58rem;
  line-height: 1.4;
}

@media (max-width: 480px) {
  .hierarchy-selector {
    padding-inline: 14px !important;
  }
}
</style>
