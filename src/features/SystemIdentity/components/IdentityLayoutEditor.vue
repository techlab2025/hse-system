<script setup lang="ts">
import {
  headerFields,
  headerActionFields,
  breadcrumbPositions,
  type Appearance,
} from '../appearance'
import IdentityOrderList from './IdentityOrderList.vue'
const model = defineModel<Appearance>({ required: true })
</script>
<template>
  <section class="identity-editor">
    <h2>Header layout</h2>
    <p>
      Move the controls container as one item. Inside it, drag Profile, Notifications, and Language
      to change their order. Arrow buttons also work with a keyboard or touch screen.
    </p>
    <IdentityOrderList v-model="model.headerOrder" :items="headerFields" label="Header order">
      <template #default="{ item }">
        <div v-if="item === 'actions'" class="identity-order-group">
          <p>Inside this container</p>
          <IdentityOrderList
            v-model="model.headerActionOrder"
            :items="headerActionFields"
            label="Header controls order"
          />
        </div>
      </template>
    </IdentityOrderList>
    <h2>Breadcrumb position</h2>
    <p>Drag the breadcrumb into a position, or select a position below.</p>
    <div class="identity-position-options">
      <button
        v-for="position in breadcrumbPositions"
        :key="position"
        type="button"
        :data-position="position"
        :aria-pressed="model.breadcrumbPosition === position"
        @click="model.breadcrumbPosition = position"
        @dragover.prevent
        @drop.prevent="model.breadcrumbPosition = position"
      >
        <span>{{ position }}</span>
        <span
          v-if="model.breadcrumbPosition === position"
          draggable="true"
          @dragstart="$event.dataTransfer?.setData('text/plain', 'breadcrumb')"
          >⠿ Home / Page</span
        >
      </button>
    </div>
  </section>
</template>
