<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Image from 'primevue/image'
import type EquipmentDetailsModel from '../../../Data/models/equipmentDetailsModel'
import { EquipmentStatus } from '../../../Core/enum/equipmentStatus'
import { EquipmentCondition } from '../../../Core/enum/equipmentConditionEnum'
import { EquipmentUsed } from '../../../Core/enum/EquipemntUsedENum'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { PermissionsEnum as P } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useUserStore } from '@/stores/user'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import ProjectIcon from '@/features/Organization/Project/Presentation/components/ProjectUtils/ProjectIcon.vue'
import DeleteEquipmentParams from '../../../Core/params/deleteEquipmentParams'
import DeleteEquipmentController from '../../controllers/deleteEquipmentController'
import placeholder from '@/assets/images/EmptyEquipment.png'

const props = defineProps<{ equipmentData: EquipmentDetailsModel }>()
const { t } = useI18n()
const userStore = useUserStore()
const ownershipStatus = computed(() => Number(props.equipmentData.status))
const actions = computed(() => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${userStore.user?.type === OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipment/${props.equipmentData.id}`,
    permission: [
      P.ADMIN,
      P.ORGANIZATION_EMPLOYEE,
      P.EQUIPMENT_ALL,
      P.EQUIPMENT_UPDATE,
      P.ORG_EQUIPMENT_ALL,
      P.ORG_EQUIPMENT_UPDATE,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    isDelete: true,
    action: () =>
      DeleteEquipmentController.getInstance().deleteEquipment(
        new DeleteEquipmentParams(props.equipmentData.id),
      ),
    permission: [
      P.ADMIN,
      P.ORGANIZATION_EMPLOYEE,
      P.EQUIPMENT_ALL,
      P.EQUIPMENT_DELETE,
      P.ORG_EQUIPMENT_ALL,
      P.ORG_EQUIPMENT_DELETE,
    ],
  },
])
const specs = computed(() => {
  const d = props.equipmentData
  return [
    { label: 'serial name', value: d.serial_name, icon: 'equipment' as const },
    {
      label: 'License number',
      value: d.licensePlateNumber || d.licenseNumber,
      icon: 'equipment' as const,
    },
    { label: 'Vehicle Kilometer', value: d.kilometer, icon: 'gauge' as const },
    {
      label: 'ivms',
      value: d.ivms == null ? null : t(d.ivms ? 'yes' : 'no'),
      icon: 'pulse' as const,
    },
    { label: 'Mainfactury Year', value: d.mainfacturyDate, icon: 'clock' as const },
    {
      label: 'Equipment Worked Hours',
      value: d.equipmentWorkedHeavy || d.workedHoures || d.WorkedHours,
      icon: 'clock' as const,
    },
    {
      label: 'Equipment Used Status',
      value: d.equipmentUsedStatus == null ? null : t(EquipmentUsed[d.equipmentUsedStatus] || '—'),
      icon: 'gauge' as const,
    },
    {
      label: 'Equipment Condition',
      value:
        d.equipmentUsedStatus === EquipmentUsed.used && d.equipmentCondition != null
          ? t(EquipmentCondition[d.equipmentCondition] || '—')
          : null,
      icon: 'gauge' as const,
    },
    { label: 'inspection date', value: d.lastInspectoinDate, icon: 'clock' as const },
  ].filter((s) => s.value !== null && s.value !== undefined && s.value !== '')
})
function imageFallback(event: Event) {
  const image = event.target as HTMLImageElement
  image.onerror = null
  image.src = placeholder
}
</script>

<template>
  <article class="eq-summary eq-panel">
    <div class="eq-summary-image">
      <img
        :src="equipmentData.image || placeholder"
        :alt="equipmentData.title || $t('Equipment')"
        @error="imageFallback"
      />
    </div>
    <div class="eq-summary-content">
      <div class="eq-summary-topline">
        <p class="eq-category">
          <ProjectIcon name="equipment" /><span>{{
            $t(EquipmentTypesEnum[equipmentData.equipment_type?.type] || 'Equipment')
          }}</span
          ><span v-if="equipmentData.equipment_type?.title"
            >/ {{ equipmentData.equipment_type.title }}</span
          >
        </p>
        <DropList :action-list="actions" />
      </div>
      <div class="eq-summary-title">
        <h2>{{ equipmentData.title || '—' }}</h2>
        <span
          v-if="ownershipStatus === EquipmentStatus.RENT || ownershipStatus === EquipmentStatus.OWN"
          class="eq-badge"
          :class="{ 'eq-badge--rent': ownershipStatus === EquipmentStatus.RENT }"
          >{{ $t(ownershipStatus === EquipmentStatus.RENT ? 'Rent' : 'Owned') }}</span
        >
      </div>
      <dl class="eq-specs">
        <div v-for="spec in specs" :key="spec.label" class="eq-spec">
          <ProjectIcon :name="spec.icon" />
          <div>
            <dt>{{ $t(spec.label) }}</dt>
            <dd>{{ spec.value }}</dd>
          </div>
        </div>
      </dl>
      <div v-if="equipmentData.certificateImage || equipmentData.date" class="eq-certificate">
        <Image
          v-if="equipmentData.certificateImage"
          :src="equipmentData.certificateImage"
          :alt="$t('training_image')"
          preview
          image-class="eq-certificate-image"
        />
        <div>
          <span class="eq-muted">{{ $t('eq_certificate_expiry_date') }}</span
          ><strong>{{ equipmentData.date || '—' }}</strong>
        </div>
      </div>
    </div>
  </article>
</template>
