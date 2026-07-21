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
    :to="`/organization/organization-employee/show/${member?.organization_employee_id || member.employeeId}?type=3`"
    class="member-card"
    :class="{ isLeader: member.is_leader == 1 }"
  >
    <span v-if="member.is_leader == 1" class="leader-badge">{{ $t('Leader') }}</span>
    <DeleteEmployeeDialog
      @delete="
        UpdateData(
          member?.projectLocationHierarchyEmployeeId! || member?.projectLocationTeamEmployeeId!,
        )
      "
    />
    <span class="member-avatar-wrap">
      <img
        class="member-img"
        src="https://cyber.comolho.com/static/img/avatar.png"
        :alt="$t('Employee')"
        @error="setDefaultImage"
      />
      <i aria-hidden="true"></i>
    </span>

    <div class="member-data">
      <p class="name">{{ wordSlice(member?.name, 18) }}</p>
      <p class="position" v-if="member.hierarchy?.length > 0">
        <span>
          {{ member.hierarchy?.map((p) => p.title).join(', ') }}
        </span>
      </p>
      <span class="hierarchy-path">
        {{ hierarchy?.hierarchy?.map((p) => p.title).join(', ') }}
      </span>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
.member-card {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 210px;
  min-height: 76px;
  gap: 11px;
  margin: 0;
  padding: 12px;
  border: 1px solid var(--main-border) !important;
  border-radius: 14px;
  background: var(--surface-1);
  box-shadow: 0 7px 17px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);
  text-decoration: none;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.member-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 28%, var(--main-border)) !important;
  box-shadow: 0 11px 22px color-mix(in srgb, var(--brand-primary-900) 9%, transparent);
}

.member-card.isLeader {
  border-color: color-mix(in srgb, var(--PrimaryColor) 42%, var(--main-border)) !important;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--PrimaryColor) 7%, transparent), transparent),
    var(--surface-1);
}

.leader-badge {
  position: absolute;
  top: 7px;
  inset-inline-end: 34px;
  padding: 3px 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
  font-size: 0.56rem;
  font-weight: 900;
}

.member-avatar-wrap {
  position: relative;
  flex: 0 0 auto;
}

.member-avatar-wrap .member-img {
  width: 46px;
  height: 46px;
  border: 2px solid var(--surface-1);
  border-radius: 14px;
  background: var(--surface-2);
  object-fit: cover;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
}

.member-avatar-wrap i {
  position: absolute;
  right: -2px;
  bottom: -1px;
  width: 11px;
  height: 11px;
  border: 2px solid var(--surface-1);
  border-radius: 50%;
  background: var(--status-success);
}

.member-data {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.member-data .name {
  overflow: hidden;
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.78rem;
  font-weight: 850;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-data .position,
.hierarchy-path {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: var(--text-soft);
  font-size: 0.64rem;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.member-card :deep(.card-delete) {
  top: 8px;
  inset-inline-end: 8px;
  right: auto;
  width: 18px;
  height: 18px;
}
</style>
