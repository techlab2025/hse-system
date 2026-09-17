import DialogSelector from '../Dialogs/dialog_selector'
import warning from '@/assets/images/warning.png'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: unknown) => boolean | string
}

export interface ValidationFieldError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationFieldError[]
}

export class ClassValidation {
  private rules: Map<string, ValidationRule> = new Map()

  /**
   * Define validation rules for fields
   */
  setRule(field: string, rule: ValidationRule): this {
    this.rules.set(field, rule)
    return this
  }

  /**
   * Set multiple rules at once
   */
  setRules(rules: Record<string, ValidationRule>): this {
    Object.entries(rules).forEach(([field, rule]) => {
      this.rules.set(field, rule)
    })

    return this
  }

  /**
   * Mark a field as required
   */
  require(field: string): this {
    const existing = this.rules.get(field) || {}
    this.rules.set(field, { ...existing, required: true })
    return this
  }

  /**
   * Mark a field as optional
   */
  optional(field: string): this {
    const existing = this.rules.get(field) || {}
    this.rules.set(field, { ...existing, required: false })
    return this
  }

  /**
   * Validate an object against the defined rules
   */
  validate(obj: object | null | undefined): ValidationResult {
    const errors: ValidationFieldError[] = []

    this.rules.forEach((rule, field) => {
      const value = obj ? (obj as Record<string, unknown>)[field] : undefined

      if (rule.required && this.isEmpty(value)) {
        errors.push({ field, message: `${field} is required` })
        return
      }

      if (!rule.required && this.isEmpty(value)) {
        return
      }

      if (
        rule.minLength !== undefined &&
        typeof value === 'string' &&
        value.length < rule.minLength
      ) {
        errors.push({ field, message: `${field} must be at least ${rule.minLength} characters` })
      }

      if (
        rule.maxLength !== undefined &&
        typeof value === 'string' &&
        value.length > rule.maxLength
      ) {
        errors.push({ field, message: `${field} must be at most ${rule.maxLength} characters` })
      }

      if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
        errors.push({ field, message: `${field} must be at least ${rule.min}` })
      }

      if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
        errors.push({ field, message: `${field} must be at most ${rule.max}` })
      }

      if (rule.pattern && typeof value === 'string') {
        rule.pattern.lastIndex = 0

        if (!rule.pattern.test(value)) {
          errors.push({ field, message: `${field} format is invalid` })
        }
      }

      if (rule.custom) {
        const result = rule.custom(value)

        if (result !== true) {
          errors.push({
            field,
            message: typeof result === 'string' ? result : `${field} is invalid`,
          })
        }
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate and throw error if validation fails
   */
  validateOrThrow(obj: object | null | undefined): void {
    const { isValid, errors } = this.validate(obj)

    if (!isValid) {
      const validationError = new ValidationError(errors)
      validationError.openDialog()
    }
  }

  /**
   * Check if a value is empty
   */
  private isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true
    if (typeof value === 'string' && value.trim() === '') return true
    if (Array.isArray(value) && value.length === 0) return true
    return false
  }
}

export class ValidationError extends Error {
  constructor(public errors: ValidationFieldError[]) {
    super(`Validation failed: ${errors.map((e) => `${e.field}: ${e.message}`).join(', ')}`)
    this.name = 'ValidationError'
  }

  openDialog() {
    DialogSelector.instance.failedDialog.openDialog({
      dialogName: 'dialog-error',
      titleContent: ``, //Validation failed
      imageElement: warning,
      messageContent: `  ${this.errors.map((e) => `${e.field}: ${e.message}`).join(' - ')}`,
    })
  }
}
