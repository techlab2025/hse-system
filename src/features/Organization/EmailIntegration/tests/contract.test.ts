import assert from 'node:assert/strict'
import EmailIntegrationModel from '../Data/models/EmailIntegrationModel'
import SaveEmailIntegrationParams from '../Core/params/SaveEmailIntegrationParams'
import SentCopyActionParams from '../Core/params/SentCopyActionParams'
import { validateEmailDraft } from '../Core/params/validateEmailDraft'

const saved = EmailIntegrationModel.fromMap({
  version: 3,
  has_password: true,
  has_imap_password: true,
  can_manage: true,
  password: 'must-not-survive',
  current_password: 'must-not-survive',
  config: {
    host: 'smtp.example.com',
    username: 'sender@example.com',
    from_email: 'sender@example.com',
    from_name: 'HSE',
    password: 'must-not-survive',
    translations: { from_name: { en: 'HSE' } },
    sent_copy: { password: 'must-not-survive' },
  },
})
assert.equal(JSON.stringify(saved).includes('must-not-survive'), false)
const draft = saved.toDraft()
assert.equal(validateEmailDraft(draft, saved), null)
const body = new SaveEmailIntegrationParams(3, true, 'confirm', draft).toMap()
assert.equal(body.current_password, 'confirm')
assert.equal(body.version, 3)
assert.equal('password' in body.config, false)
assert.equal('password' in body.config.sent_copy, false)
assert.equal(body.config.reply_to, null)
draft.host = 'new.example.com'
assert.equal(validateEmailDraft(draft, saved), 'smtpPasswordRequired')
draft.password = ' secret with spaces '
assert.equal(
  new SaveEmailIntegrationParams(3, true, 'confirm', draft).toMap().config.password,
  ' secret with spaces ',
)
draft.security = 'tls'
assert.equal(validateEmailDraft(draft, saved), 'invalidPort')
draft.port = 465
assert.equal(validateEmailDraft(draft, saved), null)
draft.sent_copy.enabled = true
assert.equal(validateEmailDraft(draft, saved), 'imapHostRequired')
draft.sent_copy.host = 'imap.example.com'
draft.sent_copy.use_smtp_credentials = false
assert.equal(validateEmailDraft(draft, saved), 'imapUserRequired')
draft.sent_copy.username = 'imap@example.com'
assert.equal(validateEmailDraft(draft, saved), 'imapPasswordRequired')
draft.sent_copy.password = 'independent'
assert.equal(validateEmailDraft(draft, saved), null)
assert.equal(
  new SaveEmailIntegrationParams(3, true, 'confirm', draft).toMap().config.sent_copy.password,
  'independent',
)
draft.sent_copy.use_smtp_credentials = true
assert.equal(
  'password' in new SaveEmailIntegrationParams(3, true, 'confirm', draft).toMap().config.sent_copy,
  false,
)
assert.deepEqual(new SentCopyActionParams('confirm').toMap(), { current_password: 'confirm' })
assert.equal(saved.config.host, 'smtp.example.com')
assert.equal(saved.config.translations.from_name.en, 'HSE')
assert.equal(EmailIntegrationModel.fromMap({}).can_manage, false)
console.log('Email integration contract checks passed')

const french = saved.toDraft()
french.translations.from_name = { fr: ' Alertes HSE ' }
french.from_name = 'Alertes HSE'
assert.equal(validateEmailDraft(french, saved), null)
assert.equal(
  new SaveEmailIntegrationParams(3, true, 'confirm', french).toMap().config.translations.from_name
    .fr,
  'Alertes HSE',
)
const frenchResponse = EmailIntegrationModel.fromMap({
  config: { translations: { from_name: { fr: 'Alertes HSE' } } },
})
assert.equal(frenchResponse.toDraft().translations.from_name.fr, 'Alertes HSE')
