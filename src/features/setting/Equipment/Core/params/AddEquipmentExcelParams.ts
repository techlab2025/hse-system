import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddEquipmentExcelParams implements Params {
  data: any[] = []

  public static readonly validation = new ClassValidation().setRules({})

  constructor(data: { data: any[] }) {
    Object.assign(this, data)
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /** Parse a date string into YYYY-MM-DD, returns null if invalid */
  private static parseDate(value: any): string | null {
    if (!value || String(value).trim() === '' || value === '--') return null

    const str = String(value).trim()

    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str

    // Handle Excel serial number dates (e.g., 45123)
    if (/^\d{5}$/.test(str)) {
      const excelEpoch = new Date(1900, 0, 1)
      const days = parseInt(str) - 2 // Excel's leap year bug offset
      const result = new Date(excelEpoch.getTime() + days * 86400000)
      if (!isNaN(result.getTime())) {
        return result.toISOString().split('T')[0]
      }
    }

    // Try native parsing (handles DD/MM/YYYY, MM/DD/YYYY, etc.)
    const parsed = new Date(str)
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0]
    }

    // Handle DD/MM/YYYY explicitly
    const ddmmyyyy = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/)
    if (ddmmyyyy) {
      const [, d, m, y] = ddmmyyyy
      const date = new Date(Number(y), Number(m) - 1, Number(d))
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]
      }
    }

    return null
  }

  /** Parse to integer, returns null if invalid/empty */
  private static parseInteger(value: any): number | null {
    if (value === null || value === undefined || value === '' || value === '--') return null
    const num = parseInt(String(value), 10)
    return isNaN(num) ? null : num
  }

  /** Clean a single row — strips invalid fields so the backend won't reject them */
  private static sanitizeRow(row: Record<string, any>): Record<string, any> {
    const cleaned: Record<string, any> = { ...row }

    // ── Date fields ──────────────────────────────────────────────────────────
    const dateFields = ['date', 'checkin_date', 'checkout_date']
    for (const field of dateFields) {
      if (field in cleaned) {
        const parsed = AddEquipmentExcelParams.parseDate(cleaned[field])
        if (parsed) {
          cleaned[field] = parsed
        } else {
          delete cleaned[field] // remove so backend doesn't reject it
        }
      }
    }

    // ── Integer fields ───────────────────────────────────────────────────────
    const intFields = ['status', 'period_type', 'period']
    for (const field of intFields) {
      if (field in cleaned) {
        const parsed = AddEquipmentExcelParams.parseInteger(cleaned[field])
        if (parsed !== null) {
          cleaned[field] = parsed
        } else {
          delete cleaned[field]
        }
      }
    }

    return cleaned
  }

  toMap(): Record<string, any> {
    return {
      equipments_data: this.data.map(AddEquipmentExcelParams.sanitizeRow),
    }
  }

  validate() {
    return AddEquipmentExcelParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddEquipmentExcelParams.validation.validateOrThrow(this)
  }
}
