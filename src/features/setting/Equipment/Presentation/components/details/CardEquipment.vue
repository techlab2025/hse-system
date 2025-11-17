<script setup lang="ts">
import BreadCrumb from '@/shared/HelpersComponents/BreadCrumb.vue'
import { useI18n } from 'vue-i18n'
import RentIcons from '@/shared/icons/RentIcons.vue'
import Car from '@/shared/icons/car.vue'
import DropdownIcons from '@/shared/icons/DropdownIcons.vue'
import Popover from 'primevue/popover'
import { ref } from 'vue'
import Edit from '@/shared/icons/edit.vue'
import DeleteIcon from '@/shared/icons/DeleteIcon.vue'
import EyeIcon from '@/shared/icons/EyeIcon.vue'

const { t } = useI18n()

const op = ref()

const actions = ref([
  {
    title: t('edit'),
    icon: Edit,
    id: 1,
  },
  {
    title: t('delete'),
    icon: DeleteIcon,
    id: 2,
  },
  {
    title: t('view'),
    icon: EyeIcon,
    id: 3,
  },
])

const toggle = (event) => {
  op.value.toggle(event)
}

const breadcrumbs = [
  {
    title: t('equipment'),
    link: '',
  },
  {
    title: t('heavy'),
    link: '',
  },
]
</script>

<template>
  <div class="card-equipment">
    <img src="@/assets/images/Rectangle 39933.png" alt="" class="img-equipment" />
    <div class="card-body">
      <div class="card-body-content-left">
        <BreadCrumb :BreadCramps="breadcrumbs" />
        <div class="card-body-title">
          <h3 class="title">Shale Shaker</h3>
          <RentIcons />
        </div>
        <div class="inspection">
          <span>{{ $t('inspection date') }} :</span>
          <p>
            22 june <span>({{ $t('per_week') }})</span>
          </p>
        </div>
        <div class="date-of-decommissioning">
          <span>{{ $t('Date of Decommissioning') }} :</span>
          <p>2026 / 10 / 10</p>
        </div>
        <div class="vehicle">
          <Car />

          <div class="items">
            <div class="item">
              <span>{{ $t('License number') }} : </span>
              <p>ABC - 4589</p>
            </div>
            <div class="item">
              <span>{{ $t('Vehicle License No') }} : </span>
              <p>2359874</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body-content-right">
        <div class="card flex justify-center">
          <button @click="toggle" type="button">
            <DropdownIcons />
          </button>

          <Popover ref="op">
            <div class="flex flex-col gap-4">
              <div>
                <ul class="list-none !px-3 !py-1 flex-col m-0 flex gap-3">
                  <li
                    v-for="action in actions"
                    :key="action.id"
                    class="flex flex-col items-start justify-start gap-2 px-2 py-1 hover:bg-emphasis cursor-pointer rounded-border"
                  >
                    <div class="flex items-center gap-3">
                      <component :is="action.icon" />
                      <div class="text-sm text-surface-500 dark:text-surface-400">
                        {{ action.title }}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Popover>
        </div>
        <div class="image-content">
          <div class="texts">
            <p>Lorem ipsum dolor</p>
            <span>{{ $t('EXP-Date') }} 12/5/2025</span>
          </div>
          <img src="@/assets/images/add_Hierarchy.png" alt="" class="" />
        </div>
      </div>
    </div>
  </div>
</template>
