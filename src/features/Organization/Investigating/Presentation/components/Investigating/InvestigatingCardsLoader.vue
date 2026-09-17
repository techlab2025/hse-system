<script lang="ts" setup>
import Skeleton from 'primevue/skeleton'

withDefaults(
  defineProps<{
    rows?: number
  }>(),
  {
    rows: 5,
  },
)
</script>

<template>
  <div class="index-table-card-container" aria-hidden="true">
    <div class="index-table-card" v-for="i in rows" :key="i">
      <div class="card-header-container">
        <!-- first container -->
        <!-- <div class="first-container">
          <div class="first-card">
            <div class="first-card-header">
              <div class="header">
                <Skeleton width="9rem" height="1.6rem" borderRadius="999px" />
                <Skeleton width="5.5rem" height="1.6rem" borderRadius="999px" />
              </div>
              <Skeleton width="60%" height="1rem" />
              <div class="first-card-details">
                <Skeleton width="75%" height="0.85rem" />
                <Skeleton width="55%" height="0.85rem" />
              </div>
            </div>
          </div>
        </div> -->

        <!-- second container -->
        <div class="header-container">
          <div class="card-content">
            <div class="card-header">
              <Skeleton width="100%" height="0.85rem" />
            </div>
            <div class="card-details">
              <div class="project-details">
                <Skeleton height="3.5rem" borderRadius="14px" />
                <Skeleton height="3.5rem" borderRadius="14px" />
              </div>
            </div>
            <div class="btns-container">
              <Skeleton width="50%" height="44px" borderRadius="12px" />
              <Skeleton width="50%" height="44px" borderRadius="12px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.index-table-card-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.index-table-card {
  overflow: hidden;
  width: 100%;
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--BgWhite);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--text-strong) 8%, transparent);
}

.card-header-container {
  display: grid;
  grid-template-columns: minmax(280px, 0.85fr) minmax(0, 1.5fr);
  gap: 1rem;
  padding: 1rem;
}

.first-card,
.card-content {
  height: 100%;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--Gray-1);
  padding: 1rem;
}

.first-card-header {
  display: grid;
  gap: 12px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.first-card-details {
  display: grid;
  gap: 0.65rem;
}

.card-header {
  border-bottom: 1px solid var(--main-border);
  margin-bottom: 1rem;
  padding-bottom: 0.85rem;
}

.card-details {
  margin-bottom: 1rem;
}

.project-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.btns-container {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 1180px) {
  .card-header-container {
    grid-template-columns: 1fr;
  }

  .project-details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .card-header-container {
    padding: 0.75rem;
  }

  .header,
  .btns-container {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
