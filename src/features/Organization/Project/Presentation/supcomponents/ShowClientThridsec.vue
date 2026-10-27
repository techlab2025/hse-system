<script setup lang="ts">
import { vProjectPanels } from '../composables/projectPanels'

import PrimaryButton from '@/components/HelpersComponents/PrimaryButton.vue'
import type ShowClientModel from '../../Data/models/equipmentTypeDetailsModel.ts'

const props = defineProps<{ data: Array<ShowClientModel> | null }>()
</script>

<template>
  <div data-hse-project v-project-panels class="hse-project-root Practical-information">
    <div class="right">
      <div class="head">
        <h4>{{ $t('Practical employee information') }}</h4>
      </div>
      <div class="client-details grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
        <div class="main-details col-span-1">
          <h4>{{ $t('Name of sponsor') }}</h4>
          <p>{{ $t('Muhammad Hussein') }}</p>
        </div>
        <div class="card-client col-span-1">
          <h4>{{ $t('client sponsorship') }}</h4>
          <p>{{ $t('External warranty') }}</p>
        </div>
        <div class="end-date col-span-1">
          <h4>{{ $t('Employee status') }}</h4>
          <p>{{ $t('Active') }}</p>
        </div>
        <div class="end-date col-span-1">
          <h4>{{ $t('Specialization') }}</h4>
          <div class="all-btn">
            <PrimaryButton :title="$t('consultation')" :type="'submit'" />
            <PrimaryButton :title="$t('Finishes')" :type="'submit'" />
          </div>
        </div>
        <div class="end-date col-span-1">
          <h4>{{ $t('section') }}</h4>
          <p>{{ $t('Active') }}</p>
        </div>
        <div class="end-date col-span-1">
          <h4>{{ $t('Employee code') }}</h4>
          <p>{{ $t('Active') }}</p>
        </div>
      </div>
    </div>
    <div class="left">
      <div class="head">
        <h4>{{ $t('Login data to the system') }}</h4>
      </div>
      <div class="client-details grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
        <div class="main-details col-span-1">
          <h4>{{ $t('e-mail') }}</h4>
          <p>{{ data?.email }}</p>
        </div>
        <div class="card-client col-span-1">
          <h4>{{ $t('Password') }}</h4>
          <p>***********</p>
        </div>
        <div class="end-date col-span-1">
          <h4>{{ $t('User permissions') }}</h4>
          <div class="all-btn">
            <PrimaryButton :title="$t('Add a project')" :type="'submit'" />
            <PrimaryButton :title="$t('Add a client')" :type="'submit'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
