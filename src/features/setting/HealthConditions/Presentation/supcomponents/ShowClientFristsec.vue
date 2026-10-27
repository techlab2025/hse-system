<script setup lang="ts">
import type ShowClientModel from '../../Data/models/healthConditionsDetailsModel.ts'
import IconsSms from '@/components/icons/sms.vue'
import IconsWhatsApp from '@/components/icons/SocialIcons.vue'
import IconsNotification from '@/components/icons/notificationBing.vue'
import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'

const props = defineProps<{ data: ShowClientModel | null }>()

const getClientStatusLabel = (id: number): string => {
  return ClientStatusEnum[id] || 'Unknown'
}

// LangEnum
</script>

<template>
  <!-- {{ data }} -->
  <div class="information-section">
    <div class="all-deta">
      <div class="head mb-5">
        <h4>{{ $t('Customer information') }}</h4>
        <div class="personal flex items-center gap-4">
          <h4>{{ $t('Client type') }}</h4>
          <div class="flex items-center gap-2" v-if="data?.type === 1">
            <img src="@/assets/images/frame.png" alt="" />
            <span>{{ $t('person') }}</span>
          </div>
          <div class="flex items-center gap-2" v-if="data?.type === 2">
            <img src="@/assets/images/frame.png" alt="" />
            <span>{{ $t('Company') }}</span>
          </div>
        </div>
      </div>
      <div class="client-details grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div class="main-details lg:col-span-3">
          <div class="flex items-center gap-3">
            <img :src="data?.image || 'https://via.placeholder.com/150'" alt="" />

            <div class="flex flex-col">
              <h4>{{ $t('Client name') }}</h4>
              <p>{{ data?.name }}</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col lg:col-span-2">
          <h4>{{ $t('Client Code') }}</h4>
          <p>{{ data?.code }}</p>
        </div>
        <div class="card-client lg:col-span-2">
          <h4>{{ $t('Email') }}</h4>
          <p>{{ data?.email }}</p>
        </div>
        <div class="end-date lg:col-span-2">
          <h4>{{ $t('Phone number') }}</h4>
          <p>{{ data?.phone }}</p>
        </div>
        <div class="phone-number lg:col-span-2" v-if="data?.clientCategory">
          <h4>{{ $t('Customer category') }}</h4>
          <p>{{ data?.clientCategory?.title }}</p>
        </div>
        <div class="academic-degree lg:col-span-2">
          <h4>{{ $t('Client status') }}</h4>
          <p>{{ getClientStatusLabel(data?.clientStatus) }}</p>
        </div>
        <!-- <div class="marital-status col-span-2">
          <h4>marital status</h4>
          <p>{{ data?.maritalStatus }}</p>
        </div> -->
        <div class="kind lg:col-span-8">
          <h4>{{ $t('The date of the first interaction with the customer') }}</h4>
          <p>{{ data?.firstDate }}</p>
        </div>
      </div>
      <div class="grid lg:grid-cols-2 client-details mt-4 gap-5">
        <div class="kind flex flex-col" v-if="data?.reasonDeal">
          <h4>{{ $t('The first reason to deal with a customer') }}</h4>
          <p v-html="data?.reasonDeal"></p>
        </div>
        <div class="kind flex flex-col" v-if="data?.bio">
          <h4>{{ $t('A short overview of the client (his most important specifications)') }}</h4>
          <p>{{ data?.bio }}</p>
        </div>
        <div class="kind flex flex-col" v-if="data?.clientSatisfaction">
          <h4>{{ $t('Client satisfaction with the office') }}</h4>
          <p>{{ data?.clientSatisfaction?.title }}</p>
        </div>
        <div class="kind flex flex-col" v-if="data?.responsable">
          <h4>{{ $t('Responsible for the client in the office') }}</h4>
          <p>{{ data?.responsable?.title }}</p>
        </div>
      </div>
      <div class="client-details mt-4">
        <div class="grid lg:grid-cols-2 xl:gap-96 lg:gap-96">
          <div class="flex flex-col">
            <h4 class="">{{ $t('Login data to the system') }}</h4>
            <div class="flex items-center gap-24">
              <div class="kind flex flex-col">
                <h4>{{ $t('e-mail') }}</h4>
                <p>{{ data?.email }}</p>
              </div>
              <div class="kind flex flex-col">
                <h4>{{ $t('Password') }}</h4>
                <p>**********</p>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <h4 class="text-black">{{ $t('communication') }}</h4>
            <div class="flex items-center gap-6">
              <div class="flex items-center flex-col">
                <IconsSms />
                <p>{{ $t('Email') }}</p>
              </div>
              <div class="flex items-center flex-col">
                <IconsWhatsApp />
                <p>WhatsApp</p>
              </div>
              <div class="flex items-center flex-col">
                <IconsNotification />
                <p>{{ $t('notice') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
