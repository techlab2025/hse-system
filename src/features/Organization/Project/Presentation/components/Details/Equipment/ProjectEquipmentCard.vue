<script setup lang="ts">
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'
import RentIcon from '@/shared/icons/RentIcon.vue'
import WareHouseIcon from '@/assets/images/WareHouseIcon.png'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { EquipmentStatus } from '@/features/setting/Equipment/Core/enum/equipmentStatus'
import EquipmentCardImgDialog from '@/features/setting/Equipment/Presentation/components/EquipmentUtils/EquipmentCardImgDialog.vue'
import type EquipmentDetailsModel from '@/features/setting/Equipment/Data/models/equipmentDetailsModel'
import EquipmentLastInspectionResultDialog from './EquipmentLastInspectionResultDialog.vue'
import type ProjectLocationEquipmentModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationEquipmentModel'

const { t } = useI18n()

const props = defineProps<{
  // tool: EquipmentDetailsModel
  tool: ProjectLocationEquipmentModel
  isSelect?: boolean
}>()

const GetEquipmentType = (type: number) => {
  return EquipmentTypesEnum[type]
}

const DialogVisable = ref(false)
const emit = defineEmits(['delete:data'])
const deleteEquipment = async (id: number) => {
  emit('delete:data', id)
}
</script>

<template>
  <div class="project-equipment-card">
    <div
      class="tool-card equipment-card w-full"
      :class="[
        isSelect ? 'is-select' : '',
        tool?.equipment?.status == EquipmentStatus.RENT ? 'is-rent' : 'is-owned',
      ]"
    >
      <div class="tool-card-header w-full">
        <div class="equipment-media">
          <img
            :src="tool?.equipment?.image || '/src/assets/images/logo.svg'"
            :alt="$t('tool')"
            @error="setDefaultImage"
          />
          <span class="equipment-ownership">
            <RentIcon v-if="tool?.equipment?.status == EquipmentStatus.RENT" />
            {{ tool?.equipment?.status == EquipmentStatus.RENT ? $t('Rent') : $t('Owned') }}
          </span>
        </div>
        <div class="tool-card-header-text w-full">
          <div class="flex gap-2 w-full items-center justify-between card-type">
            <div class="flex items-center gap-2">
              <span class="subtype" v-if="tool?.equipment?.equipment_type">
                <span class="subtype-title">
                  {{ t(GetEquipmentType(tool?.equipment?.equipment_type?.type) ?? '') }}
                </span>
                <span class="arrow">></span>
              </span>
              <p class="title" v-if="tool?.equipment?.equipment_type?.title">
                {{ tool?.equipment?.equipment_type?.title }}
              </p>
            </div>
            <EquipmentCardImgDialog
              :Visable="DialogVisable"
              :img="tool?.equipment?.certificateImage"
            />
            <p class="serial-number">
              <span>{{ $t('Serial') }}</span
              >#{{ tool?.equipment?.serial_name || '—' }}
            </p>
          </div>
          <p class="type flex gap-2">
            <router-link :to="`/organization/equipment-show/${tool?.equipment?.id || tool.id}`">
              <span class="main-type">{{ tool?.equipment?.title }}</span>
            </router-link>

            <!-- <img :src="Rent" alt="rent" > -->
          </p>

          <div class="license-plate" v-if="tool?.equipment?.licensePlateNumber">
            <span>{{ $t('License Plate Number') }}</span>
            <strong>{{ tool.equipment.licensePlateNumber }}</strong>
          </div>

          <!-- <div class="equipment-project-info" v-if="tool?.equipment?.project?.title">
            <img :src="Helmet" alt="helmet">
            <div class="project-data">
              <p class="project-name"><span class="project-name-title">{{ tool?.equipment?.project?.title }}</span>
              </p>
              <div class="project-zone-name">
                <div class="project-zone-name" v-if="tool?.equipment?.projectZoon?.zoon_title">
                  <img :src="mark" alt="">
                  <p> <span class="project-name-title">{{ tool?.equipment?.projectZoon?.zoon_title }}</span></p>
                </div>
              </div>
            </div>
          </div> -->
          <!-- <div
            class="equipment-project-info"
            v-if="tool?.equipment?.warehouse && !tool?.equipment?.project?.title"
          >
            <img :src="WareHouseIcon" alt="helmet" />
            <div class="project-data">
              <p class="project-name">
                <span class="project-name-title">{{ tool?.equipment?.warehouse?.name }}</span>
              </p>
            </div>
          </div> -->

          <div class="equipment-inspections-info">
            <p class="inspection-data">
              <small>{{ $t('inspections No') }}</small>
              <span>{{ tool?.equipment?.inspections_count }}</span>
            </p>
            <p class="inspection-data">
              <small>{{ $t('results No') }}</small>
              <span>{{ tool?.equipment?.inspections_with_result_count }}</span>
            </p>
          </div>

          <EquipmentLastInspectionResultDialog
            v-if="tool?.equipment?.last_inspection"
            :createdby="tool?.equipment?.last_inspection?.created_by?.name"
            :date="tool?.equipment?.last_inspection?.date"
            :time="tool?.equipment?.last_inspection?.time"
            :taskId="tool?.equipment?.last_inspection?.taskId"
            :lastinspection="true"
          />
          <router-link
            :to="`/organization/equipment-show/${tool?.equipment?.id || tool.id}`"
            class="equipment-details-link"
          >
            {{ $t('View Equipment Details') }} <span aria-hidden="true">→</span>
          </router-link>
        </div>
      </div>
    </div>
    <!-- </router-link> -->
  </div>
</template>

<style scoped lang="scss">
.project-equipment-card {
  height: 100%;
}

.project-equipment-card .tool-card {
  --equipment-accent: var(--PrimaryColor);
  position: relative;
  overflow: hidden;
  height: 100%;
  margin: 0;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--equipment-accent) 16%, var(--main-border));
  border-radius: 17px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--equipment-accent) 8%, transparent),
      transparent 34%
    ),
    var(--surface-1);
  box-shadow: 0 10px 25px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.project-equipment-card .tool-card.is-rent {
  --equipment-accent: var(--brand-accent-500);
}

.project-equipment-card .tool-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--equipment-accent) 34%, var(--main-border));
  box-shadow: 0 16px 34px color-mix(in srgb, var(--brand-primary-900) 11%, transparent);
}

.tool-card-header {
  display: grid;
  grid-template-columns: 116px minmax(0, 1fr);
  align-items: stretch;
  gap: 14px;
}

.equipment-media {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.equipment-media > img {
  width: 116px;
  height: 112px;
  padding: 8px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--surface-2);
  object-fit: contain;
}

.equipment-ownership {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 28px;
  padding: 5px 8px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--equipment-accent) 9%, transparent);
  color: var(--equipment-accent);
  font-size: 0.62rem;
  font-weight: 850;
}

.equipment-ownership :deep(svg) {
  width: 14px;
  height: 14px;
}

.tool-card-header-text {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 9px;
}

.card-type {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.card-type > div {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 5px;
}

.subtype,
.card-type .title {
  color: var(--text-soft);
  font-size: 0.63rem;
}

.subtype-title {
  color: var(--equipment-accent);
  font-weight: 850;
}

.serial-number {
  display: flex;
  flex-direction: column;
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.68rem;
  text-align: end;
  white-space: nowrap;
}

.serial-number span {
  color: var(--text-soft);
  font-family: 'Regular';
  font-size: 0.55rem;
  text-transform: uppercase;
}

.type {
  margin: 0;
}

.type .main-type {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.94rem;
  font-weight: 900;
}

.license-plate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 34px;
  gap: 8px;
  padding: 6px 9px;
  border: 1px solid var(--main-border);
  border-radius: 10px;
  background: var(--surface-2);
}

.license-plate span {
  color: var(--text-soft);
  font-size: 0.59rem;
}

.license-plate strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.7rem;
  overflow-wrap: anywhere;
  text-align: end;
}

.equipment-inspections-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
}

.equipment-inspections-info .inspection-data {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 43px;
  gap: 6px;
  margin: 0;
  padding: 7px 9px;
  border: 1px solid var(--main-border);
  border-radius: 11px;
  background: var(--surface-2);
}

.inspection-data small {
  color: var(--text-soft);
  font-size: 0.59rem;
  line-height: 1.3;
}

.inspection-data span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 25px;
  height: 25px;
  padding: 0 5px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--equipment-accent) 10%, transparent);
  color: var(--equipment-accent);
  font-family: 'Bold';
  font-size: 0.67rem;
}

.equipment-details-link {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  min-height: 38px;
  gap: 9px;
  margin-top: auto;
  padding: 7px 8px 7px 11px;
  border-radius: 11px;
  background: var(--equipment-accent);
  color: white;
  font-size: 0.67rem;
  font-weight: 900;
  text-decoration: none;
}

.equipment-details-link span {
  font-size: 0.9rem;
}

[dir='rtl'] .equipment-details-link span {
  transform: rotate(180deg);
}

@media (max-width: 560px) {
  .tool-card-header {
    grid-template-columns: 1fr;
  }

  .equipment-media > img {
    width: 100%;
    height: 145px;
  }
}
</style>
