<script lang="ts" setup>
import IndexRootCausesParams from '@/features/setting/RootCauses/Core/params/indexRootCausesParams'
import IndexRootCausesController from '@/features/setting/RootCauses/Presentation/controllers/indexRootCausesController'

import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import Search from '@/shared/icons/Search.vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import IndexTicketController from '../controllers/indexTicketController'
import IndexTicketParams from '../../Core/params/indexTicketParams'
import DeleteTicketController from '../controllers/deleteTicketController'
import DeleteTicketParams from '../../Core/params/deleteTicketParams'
import { StatusEnum } from '../../Core/Enums/statusEnum'
import MultiImagesDialog from '@/shared/HelpersComponents/dialog/MultiImagesDialog.vue'
import DefaultTicketImage from '@/assets/images/ToDoLogo.png'
import type { TicketMedia } from '../../Data/models/TicketModel'

const { t } = useI18n()

// import DialogChangeStatusRootCauses from "@/features/setting/RootCausess/Presentation/components/RootCauses/DialogChangeStatusRootCauses.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexTicketController = IndexTicketController.getInstance()
const state = ref(indexTicketController.state.value)
const route = useRoute()

const id = ref(route.params.parent_id)

// const type = ref<RootCausesStatusEnum>(RootCausesStatusEnum[route.params.type as keyof typeof RootCausesStatusEnum])

const fetchTickets = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteTicketParams = new IndexTicketParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id.value ?? '',
  )
  await indexTicketController.getData(deleteTicketParams)
}

onMounted(() => {
  fetchTickets()
})

const searchTickets = debounce(() => {
  fetchTickets(word.value)
})

const deleteTicket = async (id: number) => {
  const deleteTicketParams = new DeleteTicketParams(id)
  await DeleteTicketController.getInstance().deleteTicket(deleteTicketParams)
  await fetchTickets()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchTickets('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchTickets('', currentPage.value, countPerPage.value)
}

watch(
  () => indexTicketController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      state.value = newState
    }
  },
  {
    deep: true,
  },
)

const { user } = useUserStore()

const actionList = (id: number, deleteTicket: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${
      user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
    }/root-causes/${id}`,
    permission: [
      PermissionsEnum.TICKET_TYPE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.TICKET_TYPE_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteTicket(id),
    permission: [
      PermissionsEnum.TICKET_TYPE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.TICKET_TYPE_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchTickets()
  },
)

const getStatusLabel = (status: StatusEnum | undefined) => {
  switch (status) {
    case StatusEnum.PENDING:
      return 'pending'
    case StatusEnum.OPEN:
      return 'opened'
    case StatusEnum.SOLVED:
      return 'solved'
    case StatusEnum.RESOLVED:
      return 'resolved'
    case StatusEnum.CLOSED:
      return 'closed'
    default:
      return 'unknown'
  }
}

const getStatusMeta = (status: StatusEnum | undefined) => {
  const label = getStatusLabel(status)

  switch (status) {
    case StatusEnum.PENDING:
      return {
        label,
        tone: 'warning',
        summary: 'Waiting for review and next assignment',
      }
    case StatusEnum.OPEN:
      return {
        label,
        tone: 'info',
        summary: 'Actively tracked by the operations team',
      }
    case StatusEnum.SOLVED:
      return {
        label,
        tone: 'success',
        summary: 'Issue handled and marked as solved',
      }
    case StatusEnum.RESOLVED:
      return {
        label,
        tone: 'resolved',
        summary: 'Resolution submitted and ready for closure',
      }
    case StatusEnum.CLOSED:
      return {
        label,
        tone: 'neutral',
        summary: 'Ticket closed and preserved in history',
      }
    default:
      return {
        label,
        tone: 'neutral',
        summary: 'Ticket status is currently unavailable',
      }
  }
}

const canOpenDescription = (status: StatusEnum | undefined) =>
  status == StatusEnum.SOLVED || status == StatusEnum.RESOLVED || status == StatusEnum.CLOSED

const getTicketImages = (media?: Array<string | TicketMedia> | null): string[] =>
  media
    ?.map((item) => (typeof item === 'string' ? item : item?.url))
    .filter((url): url is string => typeof url === 'string' && url.trim().length > 0) ?? []

const showDefaultTicketImage = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement
  image.onerror = null
  image.src = DefaultTicketImage
  image.classList.add('ticket-media-image--empty')
  image.parentElement?.classList.add('ticket-media-frame--empty')
}
</script>

<template>
  <section class="ticket-index-shell">
    <div class="ticket-index-glow ticket-index-glow-primary" aria-hidden="true"></div>
    <div class="ticket-index-glow ticket-index-glow-accent" aria-hidden="true"></div>

    <div class="ticket-index-toolbar">
      <div class="ticket-index-hero">
        <span class="ticket-index-kicker">{{ $t('tickets') }}</span>
        <h1 class="ticket-index-title">Support flow with a cleaner ticket overview</h1>
        <p class="ticket-index-subtitle">
          Review open requests, track progress by status, and jump into action from one branded
          workspace.
        </p>
      </div>

      <div class="ticket-index-controls">
        <label class="ticket-search" for="ticket-search">
          <span class="ticket-search-icon" @click=";((word = ''), searchTickets())">
            <Search />
          </span>
          <input
            id="ticket-search"
            v-model="word"
            :placeholder="$t('search')"
            class="ticket-search-input"
            type="text"
            @input="searchTickets"
          />
        </label>

        <div class="ticket-index-actions">
          <div class="ticket-action-export">
            <ExportPdf />
          </div>
          <PermissionBuilder
            :code="[
              PermissionsEnum.ADMIN,
              PermissionsEnum.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.TICKET_TYPE_CREATE,
            ]"
          >
            <router-link
              :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/ticket/add`"
              class="ticket-create-btn"
            >
              {{ $t('New_Ticket') }}
            </router-link>
          </PermissionBuilder>
        </div>
      </div>
    </div>

    <PermissionBuilder
      :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.TICKET_TYPE_ALL,
        PermissionsEnum.TICKET_TYPE_DELETE,
        PermissionsEnum.TICKET_TYPE_FETCH,
        PermissionsEnum.TICKET_TYPE_UPDATE,
        PermissionsEnum.TICKET_TYPE_CREATE,
      ]"
    >
      <DataStatus :controller="state">
        <template #success>
          <div class="ticket-grid">
            <article class="ticket-card" v-for="ticket in state.data" :key="ticket.id">
              <div class="ticket-card-noise" aria-hidden="true"></div>

              <div class="ticket-card-top">
                <div class="ticket-status-badge" :data-tone="getStatusMeta(ticket?.status).tone">
                  <span class="ticket-status-dot"></span>
                  {{ getStatusMeta(ticket?.status).label }}
                </div>
                <span class="ticket-type-chip">
                  {{ ticket?.ticketType?.title || 'General ticket' }}
                </span>
              </div>

              <router-link
                class="ticket-card-main"
                :to="`/${user?.type == OrganizationTypeEnum.ADMIN || user?.type == OrganizationTypeEnum.ORGANIZATION ? 'admin' : 'organization'}/ticket/${ticket?.id}`"
              >
                <div class="ticket-copy">
                  <h2 class="ticket-card-title">{{ ticket?.title }}</h2>
                  <p class="ticket-card-summary">
                    {{ getStatusMeta(ticket?.status).summary }}
                  </p>
                </div>
                <span class="ticket-open-arrow" aria-hidden="true">&#8599;</span>
              </router-link>
              <MultiImagesDialog
                v-if="getTicketImages(ticket?.media).length"
                :images="getTicketImages(ticket?.media)"
              >
                <div class="ticket-media-frame">
                  <img
                    class="ticket-media-image"
                    :src="getTicketImages(ticket?.media)[0]"
                    :alt="ticket?.title || 'ticket image'"
                    @error="showDefaultTicketImage"
                  />
                  <div class="ticket-media-overlay">
                    <span class="ticket-media-count">
                      {{ getTicketImages(ticket?.media).length }}
                      {{ getTicketImages(ticket?.media).length === 1 ? $t('photo') : $t('photos') }}
                    </span>
                    <span class="ticket-media-action">{{ $t('view') }} &#8594;</span>
                  </div>
                </div>
              </MultiImagesDialog>

              <div v-else class="ticket-media-frame ticket-media-frame--empty">
                <img
                  class="ticket-media-image ticket-media-image--empty"
                  :src="DefaultTicketImage"
                  alt="Default ticket image"
                />
                <span class="ticket-media-empty-label">{{ $t('no_photos') }}</span>
              </div>

              <component
                :is="canOpenDescription(ticket.status) ? 'RouterLink' : 'div'"
                class="ticket-description-panel"
                :to="canOpenDescription(ticket.status) ? `/ticket/${ticket?.id}` : undefined"
              >
                <span class="ticket-description-label">{{ $t('description') }}</span>
                <p class="ticket-description">
                  {{
                    ticket?.description || 'No additional description was added for this ticket.'
                  }}
                </p>
              </component>
            </article>
          </div>

          <Pagination
            :pagination="state.pagination"
            @changePage="handleChangePage"
            @countPerPage="handleCountPerPage"
          />
        </template>
        <template #loader>
          <TableLoader :cols="3" :rows="10" />
        </template>
        <template #initial>
          <TableLoader :cols="3" :rows="10" />
        </template>
        <template #empty>
          <PermissionBuilder
            :code="[
              PermissionsEnum.ADMIN,
              PermissionsEnum.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.TICKET_TYPE_CREATE,
            ]"
          >
            <DataEmpty
              :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/ticket-type/add`"
              addText="Add Ticket"
              description="Sorry .. You have no Tickets .. All your joined customers will appear here when you add your customer data"
              title="..ops! You have No Tickets"
            />
          </PermissionBuilder>
        </template>
        <template #failed>
          <PermissionBuilder
            :code="[
              PermissionsEnum.ADMIN,
              PermissionsEnum.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.TICKET_TYPE_CREATE,
            ]"
          >
            <DataFailed
              :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/ticket-type/add`"
              addText="Add Ticket"
              description="Sorry .. You have no Tickets .. All your joined customers will appear here when you add your customer data"
              title="..ops! You have No Tickets"
            />
          </PermissionBuilder>
        </template>
      </DataStatus>

      <template #notPermitted>
        <DataFailed
          addText="Have not  Permission"
          description="Sorry .. You have no RootCauses .. All your joined customers will appear here when you add your customer data"
        />
      </template>
    </PermissionBuilder>
  </section>
</template>

<style scoped>
.ticket-index-shell {
  position: relative;
  overflow: hidden;
  padding: 1.2rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-200) 70%, transparent);
  border-radius: 28px;
  background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--brand-primary-500) 12%, transparent),
      transparent 28%
    ),
    radial-gradient(
      circle at right center,
      color-mix(in srgb, var(--status-success) 10%, transparent),
      transparent 26%
    ),
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--surface-1) 99%, transparent),
      color-mix(in srgb, var(--brand-primary-50) 95%, transparent)
    );
  box-shadow:
    0 26px 64px color-mix(in srgb, var(--brand-primary-900) 8%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--surface-1) 92%, transparent);
}

.ticket-index-shell::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background-image:
    linear-gradient(
      color-mix(in srgb, var(--brand-primary-500) 4%, transparent) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--brand-primary-500) 4%, transparent) 1px,
      transparent 1px
    );
  background-size: 26px 26px;
  mask-image: linear-gradient(
    180deg,
    color-mix(in srgb, var(--text-strong) 72%, transparent),
    transparent 80%
  );
}

.ticket-index-glow {
  position: absolute;
  z-index: 0;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(6px);
}

.ticket-index-glow-primary {
  top: -60px;
  inset-inline-end: -70px;
  width: 210px;
  height: 210px;
  background: color-mix(in srgb, var(--brand-primary-500) 15%, transparent);
}

.ticket-index-glow-accent {
  inset-inline-start: -80px;
  bottom: 10%;
  width: 180px;
  height: 180px;
  background: color-mix(in srgb, var(--status-success) 14%, transparent);
}

.ticket-index-toolbar,
.ticket-grid,
:deep(.pagination-container) {
  position: relative;
  z-index: 1;
}

.ticket-index-toolbar {
  display: grid;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.ticket-index-hero {
  display: grid;
  gap: 0.55rem;
  max-width: 700px;
}

.ticket-index-kicker {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 0.35rem 0.8rem;
  border: 1px solid color-mix(in srgb, var(--status-success) 24%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--status-success) 10%, transparent);
  color: var(--status-success);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ticket-index-title {
  margin: 0;
  color: var(--brand-primary-900);
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 900;
  line-height: 1.08;
}

.ticket-index-subtitle {
  margin: 0;
  max-width: 650px;
  color: var(--text-soft);
  font-size: 0.98rem;
  line-height: 1.75;
}

.ticket-index-controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

.ticket-search {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-height: 64px;
  padding: 0.85rem 1rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-200) 80%, transparent);
  border-radius: 22px;
  background: color-mix(in srgb, var(--surface-1) 92%, transparent);
  box-shadow: 0 16px 32px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
}

.ticket-search-icon {
  display: inline-grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 15px;
  background: linear-gradient(135deg, var(--brand-primary-500), var(--brand-primary-700));
  color: var(--text-on-brand);
  cursor: pointer;
  box-shadow: 0 14px 24px color-mix(in srgb, var(--brand-primary-500) 22%, transparent);
}

.ticket-search-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.ticket-search-input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--brand-primary-900);
  font-size: 0.98rem;
  font-weight: 700;
}

.ticket-search-input::placeholder {
  color: var(--text-soft);
}

.ticket-index-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.85rem;
}

.ticket-action-export {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-200) 74%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
}

.ticket-create-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0.95rem 1.35rem;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--brand-primary-500), var(--brand-primary-800));
  color: var(--text-on-brand);
  font-size: 0.92rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 18px 28px color-mix(in srgb, var(--brand-primary-500) 22%, transparent);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.ticket-create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 34px color-mix(in srgb, var(--brand-primary-500) 28%, transparent);
}

.ticket-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.3rem;
}
@media (max-width: 768px) {
  .ticket-grid {
    grid-template-columns: repeat(1, minmax(280px, 1fr));
  }
}

.ticket-card {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto auto 180px 1fr;
  gap: 0.9rem;
  min-height: 440px;
  padding: 1.1rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 92%, transparent);
  border-radius: 26px;
  background:
    linear-gradient(
      160deg,
      color-mix(in srgb, var(--surface-1) 98%, transparent),
      color-mix(in srgb, var(--brand-primary-50) 95%, transparent)
    ),
    color-mix(in srgb, var(--surface-1) 92%, transparent);
  box-shadow:
    0 22px 44px color-mix(in srgb, var(--brand-primary-900) 7%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--surface-1) 96%, transparent);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.ticket-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--brand-primary-400) 38%, transparent);
  box-shadow:
    0 30px 54px color-mix(in srgb, var(--brand-primary-900) 10%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--surface-1) 96%, transparent);
}

.ticket-card-noise {
  position: absolute;
  inset: -80px -75px auto auto;
  width: 210px;
  height: 210px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
  filter: blur(4px);
  pointer-events: none;
}

.ticket-card-top,
.ticket-card-main,
.ticket-media-frame,
.ticket-description-panel {
  position: relative;
  z-index: 1;
}

.ticket-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.ticket-status-badge,
.ticket-type-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 34px;
  padding: 0.38rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: capitalize;
}

.ticket-status-badge {
  border: 1px solid color-mix(in srgb, var(--brand-primary-300) 70%, transparent);
  color: var(--brand-primary-700);
  background: color-mix(in srgb, var(--brand-primary-50) 88%, transparent);
}

.ticket-status-badge[data-tone='warning'] {
  color: var(--brand-accent-500);
  border-color: color-mix(in srgb, var(--brand-accent-500) 24%, transparent);
  background: color-mix(in srgb, var(--brand-accent-50) 88%, transparent);
}

.ticket-status-badge[data-tone='info'] {
  color: var(--brand-primary-500);
}

.ticket-status-badge[data-tone='success'] {
  color: var(--status-success);
  border-color: color-mix(in srgb, var(--status-success) 24%, transparent);
  background: color-mix(in srgb, var(--status-success) 10%, transparent);
}

.ticket-status-badge[data-tone='resolved'] {
  color: var(--status-danger);
  border-color: color-mix(in srgb, var(--status-danger) 22%, transparent);
  background: color-mix(in srgb, var(--status-danger) 9%, transparent);
}

.ticket-status-badge[data-tone='neutral'] {
  color: var(--brand-primary-800);
}

.ticket-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.ticket-type-chip {
  max-width: 58%;
  color: var(--text-soft);
  border: 1px solid color-mix(in srgb, var(--brand-primary-200) 76%, transparent);
  background: color-mix(in srgb, var(--surface-1) 78%, transparent);
  overflow-wrap: anywhere;
  text-align: end;
}

.ticket-card-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.15rem 0.15rem 0.3rem;
  text-decoration: none;
}

.ticket-copy {
  display: grid;
  gap: 0.45rem;
  min-width: 0;
}

.ticket-card-title {
  margin: 0;
  color: var(--brand-primary-900);
  font-size: clamp(1.15rem, 1.8vw, 1.5rem);
  font-weight: 900;
  line-height: 1.25;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.ticket-card-summary {
  margin: 0;
  color: var(--brand-primary-500);
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.65;
}

.ticket-open-arrow {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--brand-primary-300) 55%, transparent);
  border-radius: 14px;
  color: var(--brand-primary-600);
  background: color-mix(in srgb, var(--surface-1) 82%, transparent);
  font-size: 1.05rem;
  box-shadow: 0 10px 22px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.ticket-card:hover .ticket-open-arrow {
  transform: translate(2px, -2px);
  color: var(--text-on-brand);
  background: var(--brand-primary-600);
}

.ticket-media-frame {
  overflow: hidden;
  width: 100%;
  height: 180px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-200) 62%, transparent);
  border-radius: 20px;
  background: color-mix(in srgb, var(--brand-primary-50) 90%, var(--surface-1));
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--surface-1) 75%, transparent);
}

.ticket-media-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s ease;
}

.ticket-card:hover .ticket-media-image:not(.ticket-media-image--empty) {
  transform: scale(1.04);
}

.ticket-media-overlay {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 2.5rem 0.85rem 0.75rem;
  color: #fff;
  background: linear-gradient(transparent, rgb(8 15 35 / 78%));
}

.ticket-media-count,
.ticket-media-action,
.ticket-media-empty-label {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.ticket-media-count {
  padding: 0.34rem 0.62rem;
  border: 1px solid rgb(255 255 255 / 24%);
  border-radius: 999px;
  background: rgb(255 255 255 / 14%);
  backdrop-filter: blur(8px);
}

.ticket-media-frame--empty {
  display: grid;
  place-items: center;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--brand-primary-50) 94%, var(--surface-1)),
    color-mix(in srgb, var(--status-success) 10%, var(--surface-1))
  );
}

.ticket-media-image--empty {
  width: 112px;
  height: 112px;
  padding: 0.5rem;
  object-fit: contain;
}

.ticket-media-empty-label {
  position: absolute;
  inset: auto 0.75rem 0.7rem auto;
  padding: 0.34rem 0.62rem;
  border-radius: 999px;
  color: var(--brand-primary-700);
  background: color-mix(in srgb, var(--surface-1) 84%, transparent);
}

.ticket-description-panel {
  min-width: 0;
  padding: 0.9rem 1rem 1rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 88%, transparent);
  border-radius: 18px;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--surface-1) 88%, transparent),
    color-mix(in srgb, var(--brand-primary-50) 65%, transparent)
  );
  text-decoration: none;
}

.ticket-description-label {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--brand-primary-500);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ticket-description {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.92rem;
  line-height: 1.75;
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media (min-width: 992px) {
  .ticket-index-controls {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }

  .ticket-index-actions {
    justify-content: flex-end;
  }
}

@media (max-width: 767px) {
  .ticket-index-shell {
    padding: 1rem;
    border-radius: 22px;
  }

  .ticket-card {
    grid-template-rows: auto auto 165px auto;
    min-height: unset;
  }

  .ticket-card-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .ticket-type-chip {
    max-width: 100%;
    text-align: start;
  }

  .ticket-media-frame {
    height: 165px;
  }

  .ticket-index-actions {
    justify-content: stretch;
  }

  .ticket-create-btn {
    width: 100%;
  }
}
</style>
