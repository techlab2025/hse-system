<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import FetchNcrDetailsController from '@/features/Organization/InternalAudit/Presentation/controllers/ncrs/fetchNcrDetailsController'
import FetchNcrDetailsParams from '@/features/Organization/InternalAudit/Core/params/ncrs/fetchNcrDetailsParams'
import InternalAuditNcrForm from '@/features/Organization/InternalAudit/Presentation/components/ncrs/InternalAuditNcrForm.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

const route = useRoute()
const controller = FetchNcrDetailsController.getInstance()
const state = computed(() => controller.state.value)

watch(
  () => route.params.id,
  (id) => {
    controller.getData(new FetchNcrDetailsParams(Number(id)))
  },
  { immediate: true },
)
</script>

<template>
  <PermissionBuilder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.INTERNAL_AUDIT_DETAILS,
      PermissionsEnum.MY_INTERNAL_AUDIT_DETAILS,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <InternalAuditNcrForm
          v-if="state.data"
          :details="state.data"
          :internal-audit-plan-id="state.data.internalAuditId"
          :audit-serial-name="state.data.auditSerialName"
          :area-options="state.data.areaUnderReviews"
          readonly
        />
      </template>
      <template #loader><TableLoader :cols="3" :rows="5" /></template>
      <template #initial><TableLoader :cols="3" :rows="5" /></template>
      <template #empty
        ><DataEmpty
          title="No NCR details found"
          description="No details are available for this NCR."
      /></template>
      <template #failed
        ><DataFailed title="Could not load NCR details" description="Please try again."
      /></template>
    </DataStatus>
  </PermissionBuilder>
</template>
