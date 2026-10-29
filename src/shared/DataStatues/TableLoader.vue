<script lang="ts" setup>
import Skeleton from 'primevue/skeleton'

const { rows, cols } = defineProps<{
  rows: number
  cols: number
}>()
</script>

<template>
  <div
    class="table-responsive hse-table-scroll"
    role="status"
    aria-busy="true"
    :aria-label="$t('loading')"
  >
    <table v-table-identity class="main-table hse-data-table" aria-hidden="true">
      <thead>
        <tr>
          <th v-for="i in cols" :key="i" scope="col"><Skeleton width="4rem" height="0.65rem" /></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in rows" :key="i">
          <td v-for="j in cols" :key="j">
            <Skeleton></Skeleton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
