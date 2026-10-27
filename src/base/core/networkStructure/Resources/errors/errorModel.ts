import { translateMessage } from '@/localization/messages'
enum ErrorType {
  serviceSide,
  networkConnection,
  dataEmpty,
  dataDirty,
  unknown,
  badRequest = 5,
  unAuthorized = 6,
  methodNotAllowed = 7,
}

class ErrorModel {
  public title: string
  public type: ErrorType = ErrorType.unknown

  constructor(title: string, type: ErrorType) {
    this.title = title
    // ErrorModel contains system feedback, not user-entered record names.
    Object.defineProperty(this, 'title', {
      enumerable: true,
      configurable: true,
      get: () => translateMessage(title),
      set: (value: string) => {
        title = value
      },
    })
    this.type = type
  }
}

export { ErrorModel, ErrorType }
