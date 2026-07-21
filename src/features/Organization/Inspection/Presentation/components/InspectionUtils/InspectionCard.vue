<script setup lang="ts">
import type InspectionModel from '../../../Data/models/InspectionModel'
import InspectionTaskbg from '@/assets/images/InspectionTaskbg.png'
import EquipmentInspectionShowDialog from '@/features/setting/Equipment/Presentation/components/Dialogs/EquipmentInspectionShowDialog.vue'
import LastInspectionCard from './LastInspectionCard.vue'
import { AssignToTypeEnum } from '../../../Core/Enum/AssignToTypesEnum'
import InspectionStartTemplate from '../InspectionDialog/InspectionStartTemplate.vue'

import DurationBox from './DurationBox.vue'
import ButtonArrow from '../../../../../../shared/icons/ButtonArrow.vue'
import ChevronRight from '../../../../../../shared/icons/ChevronRight.vue'

import { InspectionTypeEnum } from '../../../Core/Enum/InspectionTypeEnum'
import image from '@/assets/images/onceimg.png'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image'
import { useThemeMode } from '@/composables/useThemeMode'

defineProps<{
  tasks: InspectionModel[]
  // perioddata: TaskPeriodModel[]
  isDrag?: boolean
  showresult?: boolean
  isEquipment?: boolean
}>()

const { isDarkMode } = useThemeMode()

const GetMorohType = (type: number) => {
  return AssignToTypeEnum[type]
}
const GetEquipmentType = (type: number) => {
  return EquipmentTypesEnum[type]
}
// if all (inspection form) 1  => !isDrag && !showresult
// if all (Drag inspection form) 2  => isDrag
// if all (Show inspection form) 3  => showresult
</script>
<template>
  <div :class="['inspection-card', { 'is-dark': isDarkMode }]">
    <div class="inspection-history-container">
      <article
        class="inspection-history w-full"
        v-for="(task, index) in tasks"
        :key="task?.id || index"
      >
        <img class="bg" :src="InspectionTaskbg" alt="" />
        <div class="card-accent" aria-hidden="true"></div>
        <div class="inspection-header">
          <div class="inspection-header-content">
            <div class="title-container">
              <div class="date-wrapper">
                <div class="title-copy">
                  <span class="inspection-symbol" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 6h6M9 10h6M9 14h3"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />
                      <path
                        d="M7 3.75h10A2.25 2.25 0 0 1 19.25 6v12A2.25 2.25 0 0 1 17 20.25H7A2.25 2.25 0 0 1 4.75 18V6A2.25 2.25 0 0 1 7 3.75Z"
                        stroke="currentColor"
                        stroke-width="1.8"
                      />
                    </svg>
                  </span>
                  <div>
                    <small>{{ $t('Inspection') }} #{{ task?.id || index + 1 }}</small>
                    <h3 class="title" v-if="task?.template?.title">{{ task?.template?.title }}</h3>
                    <h3 class="title" v-else>{{ $t('Inspection') }}</h3>
                  </div>
                </div>
                <span class="date">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M7 3v3M17 3v3M4.5 9h15M6.5 5h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                    />
                  </svg>
                  {{ task?.created_at }}
                </span>
              </div>
              <div class="count" v-if="task?.template?.templateItems?.length > 0">
                <h5>{{ task?.template?.templateItems?.length }}</h5>
                <span>{{ $t('items') }}</span>
              </div>
            </div>

            <div class="inspection-info">
              <div class="info-box" v-if="!showresult">
                <span class="info-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 8h4M19 6v4"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>
                <p class="assigned-by">{{ $t('Assigned by') }} :</p>
                <h5 class="position">
                  <span>{{ task?.createdBy?.name }}</span>
                </h5>
              </div>
              <div class="info-box" v-else>
                <span class="info-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 8h4M19 6v4"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>
                <p class="assigned-by">{{ $t('inspected_by') }} :</p>
                <h5 class="position">
                  <span>{{ task?.inspectedBy?.name }}</span>
                </h5>
              </div>

              <div class="arrow-img">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M14 7l5 5-5 5"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <div class="info-box">
                <span class="info-icon destination" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21s7-4.3 7-11a7 7 0 1 0-14 0c0 6.7 7 11 7 11Z"
                      stroke="currentColor"
                      stroke-width="1.7"
                    />
                    <circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.7" />
                  </svg>
                </span>
                <p class="assigned-by">{{ $t('Assigned To') }} :</p>
                <h5 class="position">
                  {{ GetMorohType(task?.morphType)?.slice(0, 3) }}_
                  <span>{{ task?.assigned_to?.name || task?.assigned_to?.title }}</span>
                </h5>
              </div>

              <div>
                <!-- {{ period }} -->
                <DurationBox
                  v-if="task?.periodType == InspectionTypeEnum.DAY"
                  :singleImage="image"
                  :data="task"
                  :isShow="showresult"
                  :isDrag="isDrag"
                />

                <DurationBox v-if="task?.periodType == InspectionTypeEnum.PERIOD" :data="task" />
              </div>

              <!-- <p>
                Inspection Type: <span>{{ getInspectionType(task?.morphType) }}</span>
              </p> -->

              <!-- <p v-if="!isDrag">
                Number of result: <span>{{ task?.numberOfResults }}</span>
              </p> -->
              <!-- <p>
                Date&Time : <span>{{ task?.date }}</span>
              </p> -->
            </div>
          </div>
        </div>

        <div class="tool-box" v-if="task?.equipment">
          <div class="tool-img">
            <img :src="task?.equipment?.image!" alt="" @error="setDefaultImage" />
          </div>
          <div class="contents">
            <div class="past">
              <!-- <pre>{{ task?.equipment }}</pre> -->
              <h4>{{ GetEquipmentType(task?.equipment?.equipment_type?.type) }}</h4>
              <ChevronRight />
              <h6>{{ task?.equipment?.equipment_type?.title }}</h6>
            </div>
            <h3>{{ task?.equipment?.title }}</h3>
          </div>
        </div>

        <!-- <LastInspectionCard class="mt" v-if="!isDrag && !showresult" :task="task?.lastInspectionResult" -->
        <LastInspectionCard
          class="mt"
          v-if="!isDrag && !showresult"
          :task="task?.lastInspectionResult"
          :fulltask="task"
        />

        <!-- <ShowInspectionDialog class="mt" v-if="isDrag" :taskId="task.id" /> -->

        <div class="mt w-full" v-if="isDrag">
          <InspectionStartTemplate
            :templateId="task?.template?.id"
            :taskId="task?.id"
            :status="task?.status"
            :showResult="false"
          />
        </div>

        <div class="mt w-full" v-if="showresult">
          <InspectionStartTemplate
            :templateId="task?.template?.id"
            :taskId="task?.task_id"
            :status="task?.status"
            :showResult="true"
          />
        </div>

        <router-link
          v-if="!isDrag && !showresult && !isEquipment"
          class="show-button w-full mt"
          :to="`/organization/equipment-mangement/inspection/result/${task.id}`"
        >
          <div class="button-text">
            <h5>{{ $t('Show all logs') }}</h5>
            <!-- <span>20</span> -->
          </div>
          <ButtonArrow />
        </router-link>

        <div v-if="isEquipment" class="show-button w-full mt">
          <!-- <div class="button-text">
            <h5>History Log</h5>
          </div>
          <ButtonArrow /> -->
          <EquipmentInspectionShowDialog :taskId="task.id" :isEquipment="true" />
        </div>
      </article>
    </div>
  </div>
</template>
<style scoped>
.inspection-card {
  width: 100%;
  max-width: none;
}

.inspection-history-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 20px;
  width: 100%;
  max-width: none;
}

.inspection-history {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  height: 100%;
  min-width: 0;
  padding: 18px !important;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 13%, var(--main-border)) !important;
  border-radius: 22px !important;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--PrimaryColor) 9%, transparent),
      transparent 34%
    ),
    var(--surface-1);
  box-shadow:
    0 1px 2px color-mix(in srgb, var(--text-strong) 5%, transparent),
    0 14px 34px color-mix(in srgb, var(--text-strong) 7%, transparent);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.inspection-history:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 34%, var(--main-border)) !important;
  box-shadow:
    0 2px 4px color-mix(in srgb, var(--text-strong) 6%, transparent),
    0 22px 46px color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
}

.inspection-history > .bg {
  inset: auto -25px -38px auto !important;
  width: 210px;
  max-width: 45%;
  opacity: 0.045;
  filter: grayscale(1);
  pointer-events: none;
}

.card-accent {
  position: absolute;
  z-index: 2;
  inset: 0 auto 0 0;
  width: 4px;
  background: linear-gradient(180deg, var(--PrimaryColor), var(--status-success));
}

[dir='rtl'] .card-accent {
  inset: 0 0 0 auto;
}

.inspection-header,
.inspection-header-content {
  position: relative;
  z-index: 1;
  width: 100%;
}

.title-container {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 12px !important;
  padding: 0 0 15px !important;
  border: 0 !important;
  border-bottom: 1px solid color-mix(in srgb, var(--main-border) 78%, transparent) !important;
}

.date-wrapper {
  display: flex !important;
  flex: 1;
  flex-wrap: wrap;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 12px !important;
  min-width: 0;
}

.title-copy {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.title-copy > div {
  min-width: 0;
}

.title-copy small {
  display: block;
  margin-bottom: 3px;
  color: var(--PrimaryColor);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.inspection-symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, transparent);
  border-radius: 14px;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--PrimaryColor) 15%, transparent),
    color-mix(in srgb, var(--PrimaryColor) 5%, transparent)
  );
  color: var(--PrimaryColor);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 72%, transparent);
}

.inspection-symbol svg {
  width: 23px;
  height: 23px;
}

.title-copy .title {
  display: block;
  max-width: 290px;
  margin: 0;
  overflow: hidden;
  color: var(--text-strong) !important;
  font-size: 1rem !important;
  font-weight: 900 !important;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date-wrapper .date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 6px 10px;
  border: 1px solid color-mix(in srgb, var(--main-border) 86%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-2) 52%, transparent);
  color: var(--text-soft) !important;
  font-size: 0.68rem !important;
  font-weight: 700 !important;
  white-space: nowrap;
}

.date svg {
  width: 14px;
  height: 14px;
  color: var(--PrimaryColor);
}

.title-container .count {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  flex: 0 0 auto;
  min-width: 52px;
  padding: 7px 10px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  text-align: center;
}

.title-container .count h5,
.title-container .count span {
  margin: 0;
}

.title-container .count h5 {
  color: var(--PrimaryColor) !important;
  font-size: 0.85rem !important;
  font-weight: 900 !important;
}

.title-container .count span {
  color: var(--text-soft) !important;
  font-size: 0.65rem !important;
  font-weight: 700 !important;
}

.inspection-info {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 34px minmax(0, 1fr) minmax(150px, auto);
  align-items: stretch !important;
  gap: 10px !important;
  width: 100%;
  padding: 14px 0 0 !important;
}

.inspection-info > * {
  min-width: 0;
}

.inspection-info .info-box {
  position: relative;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  grid-template-rows: auto auto;
  column-gap: 9px;
  align-content: center;
  min-height: 68px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--main-border) 76%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-2) 35%, transparent);
}

.info-icon {
  display: inline-flex;
  grid-row: 1 / 3;
  align-self: center;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
}

.info-icon.destination {
  background: color-mix(in srgb, var(--status-success) 11%, transparent);
  color: var(--status-success);
}

.info-icon svg {
  width: 18px;
  height: 18px;
}

.info-box .assigned-by {
  margin: 0;
  color: var(--text-soft) !important;
  font-size: 0.65rem !important;
  font-weight: 700 !important;
  line-height: 1.2;
}

.info-box .position {
  align-self: start;
  margin: 2px 0 0;
  overflow: hidden;
  color: var(--text-soft) !important;
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-box .position span {
  color: var(--text-strong) !important;
  font-size: 0.78rem !important;
  font-weight: 800 !important;
}

.arrow-img {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
  color: var(--PrimaryColor);
}

.arrow-img svg {
  width: 17px;
  height: 17px;
}

[dir='rtl'] .arrow-img svg {
  transform: rotate(180deg);
}

.inspection-info :deep(.session-box) {
  min-height: 68px;
  margin: 0;
  padding: 10px 12px !important;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, transparent) !important;
  border-radius: 14px !important;
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1)) !important;
}

.inspection-info :deep(.session-header h4) {
  color: var(--PrimaryColor) !important;
  font-weight: 800 !important;
}

.tool-box {
  position: relative;
  z-index: 1;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  width: 100%;
  padding: 10px !important;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 11%, var(--main-border));
  border-radius: 15px !important;
  background: linear-gradient(
    100deg,
    color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1)),
    var(--surface-1)
  ) !important;
}

.tool-img {
  width: 48px !important;
  height: 48px !important;
  flex: 0 0 48px;
}

.tool-img img {
  width: 100%;
  height: 100%;
  border: 1px solid color-mix(in srgb, var(--main-border) 85%, transparent) !important;
  border-radius: 12px !important;
  object-fit: cover;
}

.tool-box .contents h3 {
  margin: 3px 0 0;
  color: var(--text-strong) !important;
  font-size: 0.84rem !important;
  font-weight: 900 !important;
}

.tool-box .past h4,
.tool-box .past h6 {
  margin: 0;
  font-size: 0.68rem !important;
}

.inspection-card .show-button {
  position: relative;
  z-index: 1;
  min-height: 46px;
  margin-top: auto !important;
  padding: 10px 14px !important;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 24%, transparent) !important;
  border-radius: 14px !important;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--PrimaryColor) 10%, transparent),
    color-mix(in srgb, var(--PrimaryColor) 4%, transparent)
  ) !important;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.inspection-history > .mt:last-child {
  margin-top: auto !important;
}

.inspection-card .show-button:hover {
  transform: translateY(-2px);
  background: color-mix(in srgb, var(--PrimaryColor) 14%, transparent) !important;
  box-shadow: 0 10px 22px color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
}

.show-button .button-text h5 {
  margin: 0;
  color: var(--PrimaryColor) !important;
  font-size: 0.78rem !important;
  font-weight: 900 !important;
}

.inspection-history :deep(.last-inspection-card) {
  position: relative;
  z-index: 1;
  margin-top: 0 !important;
  border-radius: 15px !important;
}

.inspection-card.is-dark .inspection-history {
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--PrimaryColor) 13%, transparent),
      transparent 36%
    ),
    var(--surface-1) !important;
  border-color: color-mix(in srgb, var(--PrimaryColor) 22%, var(--main-border)) !important;
}

.inspection-card.is-dark .inspection-symbol {
  box-shadow: none;
}

@media (max-width: 1180px) {
  .inspection-info {
    grid-template-columns: minmax(0, 1fr) 30px minmax(0, 1fr);
  }

  .inspection-info > :last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 820px) {
  .inspection-history-container {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .inspection-history-container {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }

  .inspection-history {
    padding: 14px !important;
    border-radius: 18px !important;
  }

  .title-container,
  .date-wrapper {
    align-items: flex-start !important;
  }

  .date-wrapper {
    flex-direction: column;
  }

  .title-copy .title {
    max-width: min(65vw, 300px);
  }

  .inspection-info {
    grid-template-columns: minmax(0, 1fr);
  }

  .inspection-info > :last-child {
    grid-column: auto;
  }

  .arrow-img {
    justify-self: center;
    transform: rotate(90deg);
  }

  [dir='rtl'] .arrow-img svg {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .inspection-history,
  .inspection-card .show-button {
    transition: none;
  }

  .inspection-history:hover,
  .inspection-card .show-button:hover {
    transform: none;
  }
}

.mt {
  margin-top: 12px;
}

.btn-primary {
  margin-top: 20px;
}
</style>
