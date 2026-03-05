<script setup lang="ts">
import type CertificateModel from '@/features/setting/Certificate/Data/models/CertificateModel'
import { CertificateStatusEnum } from '../../../Core/Enum/CertificateStatusEnum'
import { computed, onMounted } from 'vue';
import { ref, watch } from 'vue';
const { state, employeeCertificates } = defineProps<{
  state: CertificateModel[]
  employeeCertificates: CertificateModel[]
}>()

const GetCertificateStatus = (status: number) => {
  return CertificateStatusEnum[status]
}

const Certificates = ref<CertificateModel[]>([])

const setCertificate = () => {
  state?.map((item: CertificateModel) => {
    Certificates.value.push(item)
    employeeCertificates?.map((el) => {
      if (item.id != el.id) {
        Certificates.value.push(el)
      }
    })
  })
}
onMounted(() => {
  setCertificate()
})

watch(() => state, () => {
  setCertificate()
})
watch(() => employeeCertificates, () => {
  setCertificate()
})

</script>

<template>
  <div class="section certifications-section">
    <div class="section-header">
      <img class="icon" src="/src/assets/images/certificate.png" alt="cert" />
      <div class="section-header-text">
        <h4>Certifications</h4>
        <p class="hint">These are all the certificates related to the employee's specialization</p>
      </div>
    </div>

    <!-- <pre>
      {{ state }}
    </pre> -->
    <!-- :class="{
              success: cert.status == CertificateStatusEnum.Valid,
              invalidCert: cert.status == CertificateStatusEnum.Invalid,
            }" -->

    <ul class="cert-list">
      <li v-for="cert in Certificates" :key="cert.id" class="cert-item">
        <div class="cert-content">
          <span :class="GetCertificateStatus(cert.status)" class="status-dot"></span>

          <div class="cert-text">
            <span class="cert-name">{{ cert.title }} </span>

            <div class="cert-date">
              <span> Exp Date : </span>
              <h6>{{ cert.expired_at }}</h6>
            </div>

            <span class="cert-missing" v-if="cert.status == CertificateStatusEnum.Invalid">Missing Certificate</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
