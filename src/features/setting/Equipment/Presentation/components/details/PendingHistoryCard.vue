<script setup lang="ts">
import Clock from '@/shared/icons/clock.vue'
import InfoIcon from '@/shared/icons/infoIcon.vue'
</script>

<template>
  <div class="history-card">
    <div class="card-header">
      <InfoIcon />
      <div class="history-card-title">
        <div class="title">
          <div class="status">
            <span class="status-title">{{ $t('pending request') }}</span>
            <Clock />
          </div>
          <div class="date-title">
            <h5>inspection</h5>
            <span>22 july / 10 : 30 AM</span>
          </div>
          <div class="items">
            <div class="item" v-for="i in 3" :key="i">
              <span>false checks :</span>
              <p>2</p>
            </div>
          </div>
        </div>
        <div class="notes">
          <span>{{ $t('notes') }}: </span>
          <p>
            it is a long established fact that a reader will be distracted by the readable content
          </p>
        </div>
        <div class="buttons">
          <button class="assign">
            {{ $t('Assign') }}
          </button>
          <!--
          <button class="done">
            {{ $t('Done') }}
          </button>
          -->
          <!--
          <button class="delay">
            {{ $t('delay for now') }}
          </button>
          -->
          <button class="inspection-details">
            {{ $t('view inspection details') }}
          </button>
        </div>
      </div>
      <div class="user">
        <img src="@/assets/images/Rectangle 39930.png" alt="" />
        <div class="name">
          <p>Abdallah Mohamed</p>
          <span class="text-[#9CA3AF]">manager</span>
        </div>
      </div>
    </div>
  </div>
</template>
