<script setup lang="ts">
import type CertificateModel from '@/features/setting/Certificate/Data/models/CertificateModel'
import { CertificateStatusEnum } from '../../../Core/Enum/CertificateStatusEnum'
import { computed } from 'vue'
const { state, employeeCertificates } = defineProps<{
  state?: CertificateModel[]
  employeeCertificates?: CertificateModel[]
}>()

const GetCertificateStatus = (status: number) => {
  return CertificateStatusEnum[status]
}

const Certificates = computed(() => {
  const map = new Map<number, CertificateModel>()
  ;[...(state ?? []), ...(employeeCertificates ?? [])].forEach((item) => {
    if (item?.id) map.set(item.id, item)
  })
  return Array.from(map.values())
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

    <ul class="cert-list" v-if="Certificates.length">
      <li v-for="cert in Certificates" :key="cert.id" class="cert-item">
        <div class="cert-content">
          <span :class="GetCertificateStatus(cert.status)" class="status-dot"></span>

          <div class="cert-text">
            <span class="cert-name">{{ cert.title }} </span>

            <div class="cert-date">
              <span> Exp Date : </span>
              <h6>{{ cert.expired_at }}</h6>
            </div>

            <span class="cert-missing" v-if="cert.status == CertificateStatusEnum.Invalid"
              >Missing Certificate</span
            >
          </div>
        </div>
      </li>
    </ul>
    <p class="side-empty" v-else>No certifications attached yet.</p>
  </div>
</template>

<style scoped>
.certifications-section {
  overflow: hidden;
  padding: 16px;
  border: 1px solid rgba(221, 226, 237, 0.78);
  border-radius: 22px;
  background: linear-gradient(135deg, #ffffff, #f8fbff);
  box-shadow: 0 16px 36px rgba(15, 25, 39, 0.06);
}

.section-header {
  align-items: flex-start;
  margin-bottom: 14px;
}

.section-header .icon {
  width: 42px;
  height: 42px;
  padding: 8px;
  border-radius: 14px;
  background: rgba(29, 78, 216, 0.08);
}

.section-header-text h4 {
  color: #041953;
  font-size: 17px;
  font-weight: 900;
}

.section-header-text .hint {
  color: #607086;
  font-size: 11px;
  font-weight: 700;
}

.cert-list {
  gap: 9px;
}

.cert-content {
  gap: 10px;
  padding: 10px;
  border: 1px solid rgba(221, 226, 237, 0.82);
  border-radius: 15px;
  background: #fff;
}

.status-dot {
  width: 10px;
  height: 10px;
  margin-top: 5px;
}

.cert-name {
  color: #111827;
  font-size: 13px;
  font-weight: 900;
}

.cert-date span,
.cert-date h6,
.cert-missing,
.side-empty {
  font-size: 11px;
  font-weight: 800;
}

.side-empty {
  margin: 0;
  padding: 14px;
  border: 1px dashed rgba(29, 78, 216, 0.22);
  border-radius: 14px;
  color: #607086;
  background: rgba(29, 78, 216, 0.04);
}
</style>
