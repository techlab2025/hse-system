import { computed, ref } from 'vue'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import EmailIntegrationModel from '../../Data/models/EmailIntegrationModel'
import FetchEmailIntegrationUseCase from '../../Domain/useCase/FetchEmailIntegrationUseCase'
import SaveEmailIntegrationUseCase from '../../Domain/useCase/SaveEmailIntegrationUseCase'
import CheckSentCopyUseCase from '../../Domain/useCase/CheckSentCopyUseCase'
import RetrySentCopyUseCase from '../../Domain/useCase/RetrySentCopyUseCase'
import FetchEmailIntegrationParams from '../../Core/params/FetchEmailIntegrationParams'
import SaveEmailIntegrationParams from '../../Core/params/SaveEmailIntegrationParams'
import SentCopyActionParams from '../../Core/params/SentCopyActionParams'
import { validateEmailDraft } from '../../Core/params/validateEmailDraft'

export default class EmailIntegrationController extends ControllerInterface<EmailIntegrationModel> {
  // Each page owns its controller. Draft credentials never enter a singleton or Pinia.
  constructor() {
    super()
  }
  saved = ref<EmailIntegrationModel | null>(null)
  draft = ref(EmailIntegrationModel.fromMap({}).toDraft())
  enabled = ref(false)
  currentPassword = ref('')
  busy = ref(false)
  error = ref('')
  errorKey = ref('')
  noticeKey = ref('')
  checkedFolder = ref('')
  private baseline = ref('')
  private snapshot() {
    return JSON.stringify({ config: this.draft.value, enabled: this.enabled.value })
  }
  dirty = computed(() => !!this.saved.value && this.snapshot() !== this.baseline.value)
  canManage = computed(() => this.saved.value?.can_manage === true)
  canCheck = computed(
    () =>
      this.canManage.value &&
      !this.busy.value &&
      !this.dirty.value &&
      this.enabled.value &&
      this.draft.value.sent_copy.enabled &&
      !!this.currentPassword.value,
  )

  private accept(model: EmailIntegrationModel) {
    this.saved.value = model
    this.draft.value = model.toDraft()
    this.enabled.value = model.enabled
    this.baseline.value = this.snapshot()
    this.clearSecrets()
  }
  clearSecrets() {
    this.currentPassword.value = ''
    this.draft.value.password = ''
    this.draft.value.sent_copy.password = ''
  }
  private clearMessages() {
    this.error.value = ''
    this.errorKey.value = ''
    this.noticeKey.value = ''
    this.checkedFolder.value = ''
  }
  reset() {
    if (this.busy.value) return
    if (this.saved.value) this.accept(this.saved.value)
    this.clearMessages()
  }
  async load() {
    if (this.busy.value) return
    this.busy.value = true
    this.clearMessages()
    this.setLoading()
    try {
      const result = await new FetchEmailIntegrationUseCase().call(
        new FetchEmailIntegrationParams(),
      )
      this.setState(result)
      if (this.isDataSuccess() && result.data) this.accept(result.data)
      else {
        this.error.value = result.error?.title || ''
        this.errorKey.value = 'loadFailed'
      }
    } finally {
      this.busy.value = false
    }
  }
  async save() {
    if (!this.canManage.value || this.busy.value || !this.saved.value) return
    this.clearMessages()
    const validation = validateEmailDraft(this.draft.value, this.saved.value)
    if (validation) {
      this.errorKey.value = validation
      return
    }
    if (!this.currentPassword.value) {
      this.errorKey.value = 'confirmRequired'
      return
    }
    this.busy.value = true
    try {
      const result = await new SaveEmailIntegrationUseCase().call(
        new SaveEmailIntegrationParams(
          this.saved.value.version,
          this.enabled.value,
          this.currentPassword.value,
          this.draft.value,
        ),
      )
      this.setState(result)
      if (this.isDataSuccess() && result.data) {
        this.accept(result.data)
        this.noticeKey.value = 'savedNotice'
      } else {
        this.error.value = result.error?.title || ''
        this.errorKey.value = 'saveFailed'
      }
    } finally {
      this.clearSecrets()
      this.busy.value = false
    }
  }
  async sentAction(action: 'check' | 'retry') {
    if (!this.canCheck.value || (action === 'retry' && !this.saved.value?.sent_copies.failed))
      return
    this.clearMessages()
    this.busy.value = true
    try {
      const useCase = action === 'check' ? new CheckSentCopyUseCase() : new RetrySentCopyUseCase()
      const result = await useCase.call(new SentCopyActionParams(this.currentPassword.value))
      if (result.data) {
        this.checkedFolder.value = result.data.folder
        if (result.data.sent_copies && this.saved.value)
          this.saved.value.sent_copies = result.data.sent_copies
        this.noticeKey.value = action === 'check' ? 'checkNotice' : 'retryNotice'
      } else {
        this.error.value = result.error?.title || ''
        this.errorKey.value = 'actionFailed'
      }
    } finally {
      this.clearSecrets()
      this.busy.value = false
    }
  }
}
