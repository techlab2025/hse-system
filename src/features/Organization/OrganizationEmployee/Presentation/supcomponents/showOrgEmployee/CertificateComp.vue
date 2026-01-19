<template>
  <div class="section certifications-section">
    <div class="section-header">
      <img class="icon" src="/src/assets/images/certificate.png" alt="cert" />
      <div class="section-header-text">
        <h4>Certifications</h4>
        <p class="hint">These Are All The Certificates Related To The Employee's Specialization</p>
      </div>
    </div>

    <ul class="cert-list">
      <li v-for="cert in mockCertifications" :key="cert.id" class="cert-item">
        <div class="cert-content">
          <span class="status-dot" :class="{ success: cert.isValid, error: !cert.isValid }"></span>

          <div class="cert-text">
            <span class="cert-name">{{ cert.name }}</span>

            <span v-if="cert.isValid" class="cert-date">
              Exp Date : {{ cert.expiryYear }} - {{ cert.expiryMonth }}
            </span>
            <span v-else class="cert-missing">Missing Certificate</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// مثال على array جاهز للـ props أو للـ mock data
const mockCertifications = [
  {
    id: 1,
    name: 'OSHA 30-Hour General Industry',
    isValid: true,
    expiryYear: 2028,
    expiryMonth: 5,
    issuedBy: 'OSHA',
    issueDate: '2023-06-15',
  },
  {
    id: 2,
    name: 'NEBOSH International General Certificate',
    isValid: true,
    expiryYear: 2027,
    expiryMonth: 11,
    issuedBy: 'NEBOSH',
    issueDate: '2022-10-20',
  },
  {
    id: 3,
    name: 'First Aid & CPR (American Red Cross)',
    isValid: true,
    expiryYear: 2026,
    expiryMonth: 8,
    issuedBy: 'American Red Cross',
    issueDate: '2024-02-10',
  },
  {
    id: 4,
    name: 'IOSH Managing Safely',
    isValid: false,
    // مفيش expiry لأنه منتهي أو مش موجود أصلاً
    issuedBy: 'IOSH',
    issueDate: null,
    notes: 'Expired since 2024-03',
  },
  {
    id: 5,
    name: 'Confined Space Entry Training',
    isValid: true,
    expiryYear: 2025,
    expiryMonth: 12,
    issuedBy: 'OSHA Accredited',
    issueDate: '2023-11-05',
  },
  {
    id: 6,
    name: 'ISO 45001 Occupational Health & Safety',
    isValid: false,
    issuedBy: 'IRCA',
    issueDate: null,
    notes: 'Missing / Not yet obtained',
  },
]
</script>
