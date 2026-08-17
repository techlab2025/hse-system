import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export interface EquipmentExcelRow {
  name: string
  equipment_type_id: number
  date?: string | null
  status?: number | null
  inspection_duration?: string | null
  license_number?: string | null
  license_plate_number?: string | null
  image?: string | null
  certificate_image?: string | null
  all_industries?: number | null
  industry_ids?: number[]
  parent_id?: number | null
  contractor_id?: number | null
  description?: string | null
  period_type?: number | null
  period?: string | null
  checkin_date?: string | null
  checkout_date?: string | null
  kilometer?: string | null
  warehouse_id?: number | null
  serial_number?: string | null
  serial?: string | null
}

export default class AddEquipmentExcelParams implements Params {
  data: EquipmentExcelRow[] = []

  public static readonly validation = new ClassValidation().setRules({})

  constructor({ data }: { data: EquipmentExcelRow[] }) {
    this.data = data
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /** Parse a date string into YYYY-MM-DD, returns null if invalid */
  private static parseDate(value: unknown): string | null {
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

    // Handle DD/MM/YYYY explicitly
    const ddmmyyyy = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/)
    if (ddmmyyyy) {
      const [, d, m, y] = ddmmyyyy
      const date = new Date(Number(y), Number(m) - 1, Number(d))
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]
      }
    }

    const parsed = new Date(str)
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0]
    }

    return null
  }

  /** Parse to integer, returns null if invalid/empty */
  private static parseInteger(value: unknown): number | null {
    if (value === null || value === undefined || value === '' || value === '--') return null
    const num = parseInt(String(value), 10)
    return isNaN(num) ? null : num
  }

  /** Clean a single row — strips invalid fields so the backend won't reject them */
  private static sanitizeRow(row: EquipmentExcelRow): EquipmentExcelRow {
    const cleaned: EquipmentExcelRow = { ...row }

    for (const key of Object.keys(cleaned) as (keyof EquipmentExcelRow)[]) {
      if (cleaned[key] === null || cleaned[key] === undefined || cleaned[key] === '') {
        delete cleaned[key]
      }
    }

    // ── Date fields ──────────────────────────────────────────────────────────
    const dateFields: (keyof Pick<
      EquipmentExcelRow,
      'date' | 'checkin_date' | 'checkout_date'
    >)[] = ['date', 'checkin_date', 'checkout_date']
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
    const intFields: (keyof EquipmentExcelRow)[] = [
      'equipment_type_id',
      'status',
      'period_type',
      'parent_id',
      'contractor_id',
      'warehouse_id',
      'all_industries',
    ]
    for (const field of intFields) {
      if (field in cleaned) {
        const parsed = AddEquipmentExcelParams.parseInteger(cleaned[field])
        if (parsed !== null) {
          ;(cleaned[field] as number | null) = parsed
        } else {
          delete cleaned[field]
        }
      }
    }

    return cleaned
  }

  toMap(): { equipments_data: EquipmentExcelRow[] } {
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
