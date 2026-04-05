<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import type ProjectLocationEmployeeModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationEmployeeModel'
import MemberDeleteIcon from '@/shared/icons/MemberDeleteIcon.vue'
import person from '@/assets/images/person.png'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image'
import wordSlice from '@/base/Presentation/utils/word_slice'
import DeleteEmployeeDialog from './DeleteEmployeeDialog.vue'
import type OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'
import { computed } from 'vue'

const emit = defineEmits(['update:data'])

const { member, hierarchy } = defineProps<{
  // member: ProjectLocationEmployeeModel
  member: OrganizatoinEmployeeDetailsModel | ProjectLocationEmployeeModel
  hierarchy?: OrganizatoinEmployeeDetailsModel | null
}>()

const UpdateData = (id: number) => {
  emit('update:data', id)
}
</script>
<template>
  <router-link
    :to="`/organization/organization-employee/show/${member?.organization_employee_id}?type=3`"
    class="member-card"
  >
    <DeleteEmployeeDialog
      @delete="
        UpdateData(
          member?.projectLocationHierarchyEmployeeId! || member?.projectLocationTeamEmployeeId!,
        )
      "
    />
    <img class="member-img" src="https://cyber.comolho.com/static/img/avatar.png" alt="employee" />

    <div class="member-data">
      <p class="name">{{ wordSlice(member?.name, 18) }}</p>
      <p class="position" v-if="member.hierarchy?.length > 0">
        <span>
          {{ member.hierarchy?.map((p) => p.title).join(', ') }}
        </span>
      </p>
      <span> {{ hierarchy?.hierarchy?.map((p) => p.title).join(', ') }}</span>
    </div>
  </router-link>
</template>
