import assert from 'node:assert/strict'
import Model from '../src/features/Organization/InternalAudit/Data/models/ncrs/InternalAuditNcrDetailsModel'
import ListModel from '../src/features/Organization/InternalAudit/Data/models/ncrs/InternalAuditNcrModel'

const record = {
  id: 7,
  ncr: 'NCR-7',
  ncrs_category: 2,
  area_under_reviews: [{ area_under_review: { id: 3, title: 'Workshop' } }],
  audit_standard: { id: 4, title: 'ISO 45001' },
  rquiriment_refrence: '8.1',
  description: 'Saved finding',
  immediate_action: 'Saved correction',
  root_causes: [{ root_cause: { id: 5, title: 'Training' } }],
  internal_audit_tasks: [
    {
      correcive_action: {
        correction: 'Saved corrective action',
        assgined_to: { id: 6, name: 'Auditor' },
        target_date: '2026-10-15',
        actual_date: '',
      },
      preventive_action: {
        preventive: 'Saved preventive action',
        assgined_to: { id: 8, name: 'Manager' },
        target_date: '2026-10-16',
        actual_date: '',
      },
    },
  ],
  media: [{ id: 9, url: '/attachment.pdf', file_name: 'attachment.pdf' }],
  has_result: true,
}
const expected = Model.fromMap(record)
for (const response of [
  record,
  [record],
  { data: record },
  { data: [record] },
  { ncr: record },
  { ncr_details: record },
  { internal_audit_ncr: record },
  { data: { ncr: record } },
]) {
  assert.deepEqual(Model.fromMap(response), expected)
}
assert.equal(expected.description, record.description)
assert.equal(expected.tasks[0]?.corrective.assignedTo?.id, 6)
assert.equal(expected.tasks[0]?.preventive.text, 'Saved preventive action')
assert.deepEqual(expected.attachments, ['/attachment.pdf'])
for (const hasResult of [true, false]) {
  const listedNcr = ListModel.fromMap({ ...record, has_result: hasResult })
  assert.equal(listedNcr.hasResult, hasResult)
  assert.equal(listedNcr.details?.hasResult, hasResult)
  assert.equal(listedNcr.details?.id, record.id)
  assert.equal(listedNcr.details?.description, record.description)
  assert.equal(listedNcr.details?.immediateAction, record.immediate_action)
  assert.deepEqual(listedNcr.details?.areaUnderReviews, expected.areaUnderReviews)
  assert.deepEqual(listedNcr.details?.auditStandard, expected.auditStandard)
  assert.deepEqual(listedNcr.details?.rootCauses, expected.rootCauses)
  assert.deepEqual(listedNcr.details?.tasks, expected.tasks)
  assert.deepEqual(listedNcr.details?.attachments, expected.attachments)
}
assert.equal(Model.fromMap({ ...record, id: undefined, internal_audit_ncr_id: 7 }).id, 7)
for (const response of [null, {}, [], { data: [] }, { id: 0 }, { id: 'invalid' }]) {
  assert.throws(() => Model.fromMap(response), /valid NCR ID/)
}
console.log(
  'NCR hydration checks passed: saved fields, response wrappers, actions, attachments, and invalid responses.',
)
