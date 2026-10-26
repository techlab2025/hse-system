/** Run: npx tsx scripts/equipment-rental-dates.test.ts */
import assert from 'node:assert/strict'
import { calculateRentalEndDate } from '../src/features/setting/Equipment/Core/utils/calculateRentalEndDate'
import { RentTypeEnum as Unit } from '../src/features/setting/Equipment/Core/enum/RentTypeEnum'

const parts = (date: Date | null) =>
  date && [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ]
assert.deepEqual(
  parts(calculateRentalEndDate('2026-10-26T23:30:00', '2', '1')),
  [2026, 10, 27, 1, 30],
)
assert.deepEqual(
  parts(calculateRentalEndDate('2026-10-26T10:00:00', 1.5, Unit.HOUR)),
  [2026, 10, 26, 11, 30],
)
assert.deepEqual(
  parts(calculateRentalEndDate('2026-12-30T09:00:00', 3, Unit.DAY)),
  [2027, 1, 2, 9, 0],
)
assert.deepEqual(
  parts(calculateRentalEndDate('2026-01-31T09:00:00', 1, Unit.MONTH)),
  [2026, 2, 28, 9, 0],
)
assert.deepEqual(
  parts(calculateRentalEndDate('2024-01-31T09:00:00', 1, Unit.MONTH)),
  [2024, 2, 29, 9, 0],
)
assert.deepEqual(
  parts(calculateRentalEndDate('2024-02-29T09:00:00', 1, Unit.YEAR)),
  [2025, 2, 28, 9, 0],
)
assert.deepEqual(
  parts(calculateRentalEndDate('2026-10-26T09:00:00', 3, Unit.MONTH)),
  [2027, 1, 26, 9, 0],
)
for (const period of [undefined, null, '', 'invalid', 0, -1, Infinity]) {
  assert.equal(calculateRentalEndDate('2026-10-26', period, Unit.DAY), null)
}
assert.equal(calculateRentalEndDate('bad-date', 1, Unit.DAY), null)
assert.equal(calculateRentalEndDate(null, 1, Unit.DAY), null)
assert.equal(calculateRentalEndDate('2026-10-26', 1, 99), null)
assert.equal(calculateRentalEndDate('2026-10-26', 1.5, Unit.MONTH), null)
const start = new Date('2026-10-26T09:00:00')
const original = start.getTime()
calculateRentalEndDate(start, 1, Unit.MONTH)
assert.equal(start.getTime(), original)
console.log(
  'PASS: hours, days, months, years, numeric strings, calendar boundaries, leap years, invalid inputs, and unchanged start dates.',
)
