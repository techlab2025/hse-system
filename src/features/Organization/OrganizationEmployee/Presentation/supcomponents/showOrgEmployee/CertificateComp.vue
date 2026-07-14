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
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 78%, transparent);
  border-radius: 22px;
  background: linear-gradient(135deg, var(--surface-1), var(--brand-primary-50));
  box-shadow: 0 16px 36px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
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
  background: color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
}

.section-header-text h4 {
  color: var(--brand-primary-800);
  font-size: 17px;
  font-weight: 900;
}

.section-header-text .hint {
  color: var(--brand-primary-500);
  font-size: 11px;
  font-weight: 700;
}

.cert-list {
  gap: 9px;
}

.cert-content {
  gap: 10px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 82%, transparent);
  border-radius: 15px;
  background: var(--surface-1);
}

.status-dot {
  width: 10px;
  height: 10px;
  margin-top: 5px;
}

.cert-name {
  color: var(--brand-primary-900);
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
  border: 1px dashed color-mix(in srgb, var(--brand-primary-500) 22%, transparent);
  border-radius: 14px;
  color: var(--brand-primary-500);
  background: color-mix(in srgb, var(--brand-primary-500) 4%, transparent);
}
</style>
