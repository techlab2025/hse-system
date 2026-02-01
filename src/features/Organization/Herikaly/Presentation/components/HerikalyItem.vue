<script lang="ts" setup>
import { ref, computed } from 'vue';
import EmployeeIcon from '@/shared/icons/EmployeeIcon.vue'

const Hierarchies = ref([
  {
    status: "Hierarchy 1",
    children: [
      {
        status: "Level 2-A",
        children: [
          {
            status: "Level 3-A",
            children: [
              { status: "Level 4-A" }
            ]
          },
          { status: "Level 3-B" }
        ]
      },
      { status: "Level 2-B" }
    ]
  }
])

// Function to flatten hierarchy
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

// Computed property that flattens each hierarchy
const flattenedHierarchies = computed(() => {
  return Hierarchies.value.map(hierarchy => ({
    root: hierarchy,
    flatItems: flattenHierarchy([hierarchy])
  }))
})
</script>

<template>
  <div class="permit-info">
    <div class="timeline-container">
      <div class="timeline-wrapper">
        <div class="timeline-line"></div>

        <div
          v-for="(hierarchyGroup, index) in flattenedHierarchies"
          :key="index"
          :class="{ active: index === 0 }"
          :style="{ animationDelay: `${index * 0.15}s` }"
          class="timeline-item"
        >
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
            <!-- Loop through all flattened items -->
            <div
              v-for="(item, itemIndex) in hierarchyGroup.flatItems"
              :key="itemIndex"
            >
              <div
                class="timeline-card-header"
                :class="{
                  'timeline-card': item.level === 0,
                  'timeline-card-header-2': item.level > 0
                }"
                :style="{ marginLeft: `${item.level * 20}px` }"
              >
                <div class="heirarchy-header">
                  <EmployeeIcon class="icon" />
                  <p class="heirarchy-title">{{ item.status }}</p>
                </div>
                <div class="heirarchy-details">
                  <p>{{ $t('employees') }}: <span>{{ item.employees || 100 }}</span></p>
                  <p>{{ $t('certifications') }}: <span>{{ item.certifications || 10 }}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
