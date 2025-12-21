<script lang="ts" setup>
import { ref, computed } from 'vue';
import EmployeeIcon from '@/shared/icons/EmployeeIcon.vue'
import EmployeeLinkIcon from '../../../../../shared/icons/EmployeeLinkIcon.vue';
import type HerikalyModel from '../../Data/models/HerikalyModel';
import DeleteHerikalyController from '../controllers/deleteHerikalyController';
import DeleteHerikalyParams from '../../Core/params/deleteHerikalyParams';

const emit = defineEmits(['delete-data']);

const props = defineProps<{
  Hierarchies: HerikalyModel[]
}>()


function flattenHierarchy(items: any[], level = 0): any[] {
  const result: any[] = []

  items.forEach(item => {
    result.push({ ...item, level })

    if (item.children && item.children.length > 0) {
      result.push(...flattenHierarchy(item.children, level + 1))
    }
  })

  return result
}

const flattenedHierarchies = computed(() => {
  return props.Hierarchies.map(hierarchy => ({
    root: hierarchy,
    flatItems: flattenHierarchy([hierarchy])
  }))
})

const DeleteHierarchy = async (Id: number) => {
  const deleteHerikalyParams = new DeleteHerikalyParams(Id);
  const deleteHerikalyController = DeleteHerikalyController.getInstance();
  await deleteHerikalyController.deleteHerikaly(deleteHerikalyParams);
  emit("delete-data");
}
</script>

<template>
  <div class="heirarchy-info">
    <div class="timeline-container">
      <div class="timeline-wrapper">
        <div class="timeline-line"></div>

        <div v-for="(hierarchyGroup, index) in flattenedHierarchies" :key="index" :class="{ active: index === 0 }"
          :style="{ animationDelay: `${index * 0.15}s` }" class="timeline-item">
          <div class="timeline-marker">
            <div class="timeline-dot">
              <div class="timeline-dot-inner"></div>
              <div class="timeline-pulse"></div>
            </div>
            <div class="timeline-icon">
              <div class="circle"></div>
            </div>
          </div>


          <div class="timeline-content">
            <div v-for="(item, itemIndex) in hierarchyGroup.flatItems" :key="itemIndex">
              <div class="timeline-card-header" :class="{
                'timeline-card': item.level === 0,
                'timeline-card-header-2': item.level > 0
              }" :style="{ marginLeft: `${item.level * 20}px` }">

                <router-link :to="`/organization/herikaly/add/${item.id}`">

                  <div class="heirarchy-container">
                    <div class="heirarchy-header">
                      <EmployeeIcon class="icon" />
                      <p class="heirarchy-title">{{ item.title }}</p>
                    </div>
                    <div class="heirarchy-details">
                      <!-- <p>Employees: <span>{{ item.employees || 100 }}</span></p> -->
                      <!-- <p>Certifications: <span>{{ item.certifications || 10 }}</span></p> -->
                    </div>
                  </div>
                </router-link>

                <div class="actions">
                  <router-link class="btn edit-btn flex "
                    :to="`/organization/organization-employee?heirarchy_id=${item.id}`">
                    <span>{{ $t('employees') }}</span>
                    <EmployeeLinkIcon class="w-[15px] h-[15px]" />
                  </router-link>
                  <router-link :to="`/organization/herikaly/${item.id}`" class="btn add-btn">{{ $t('edit') }}</router-link>
                  <button class="btn btn-delete" @click="DeleteHierarchy(item.id)"> {{ $t('delete') }} </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>
