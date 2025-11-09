<script lang="ts" setup>
import { ref, computed } from 'vue';
import EmployeeIcon from '@/shared/icons/EmployeeIcon.vue'
import EmployeeLinkIcon from '../icons/EmployeeLinkIcon.vue';


const props = defineProps<{
  Hierarchies: any[]
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
            <router-link v-for="(item, itemIndex) in hierarchyGroup.flatItems" :key="itemIndex"
              :to="`/organization/herikaly/add/${item.status}`">
              <div class="timeline-card-header" :class="{
                'timeline-card': item.level === 0,
                'timeline-card-header-2': item.level > 0
              }" :style="{ marginLeft: `${item.level * 20}px` }">
                <div class="heirarchy-container">
                  <div class="heirarchy-header">
                    <EmployeeIcon class="icon" />
                    <p class="heirarchy-title">{{ item.status }}</p>
                  </div>
                  <div class="heirarchy-details">
                    <p>Employees: <span>{{ item.employees || 100 }}</span></p>
                    <p>Certifications: <span>{{ item.certifications || 10 }}</span></p>
                  </div>
                </div>
                <div class="actions">
                  <router-link class="btn edit-btn flex "
                    :to="{ name: 'Organization Employee', params: { parent_id: item.status } }">
                    <span>Employees</span>
                    <EmployeeLinkIcon class="w-[15px] h-[15px]" />
                  </router-link>
                  <button class="btn add-btn">Certificates</button>
                </div>
              </div>
            </router-link>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>
