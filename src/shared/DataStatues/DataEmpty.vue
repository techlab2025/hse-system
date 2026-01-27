<script setup lang="ts">
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type';
import { useUserStore } from '@/stores/user';
import EmptyData from "@/assets/images/EmptyData.png"
const {
  title,
  description,
  link = "/",
  addText = 'Home',
} = defineProps<{
  title?: string
  description?: string
  link?: string
  addText?: string
}>()

const { user } = useUserStore()
</script>

<template>
  <div class="data-empty ">
    <div class="data-empty-background">

    </div>

    <div class="data-empty-content">
      <div class="data-empty-content-text">
        <!-- <h2 class="oops-message">opps ! ...there is no data here</h2> -->
        <h2 class="oops-message">{{ title }}</h2>
        <router-link v-if="link" :to="link" class="btn btn-primary">
          {{ addText }}
        </router-link>
        <router-link v-else :to="user?.type == OrganizationTypeEnum?.ADMIN ? '/admin' : '/organization'"
          class="btn btn-primary">
          {{ addText }}
        </router-link>
      </div>
      <div class="data-empty-image-container">
        <img class="data-empty-image" :src="EmptyData" alt="empty-data">
      </div>

    </div>
    <!-- <img alt="imageFailed" class="data-empty-image" src="@/assets/images/DataFailed.gif" /> -->
    <!-- <p>{{ description }}</p> -->




  </div>
</template>

<style scoped></style>
