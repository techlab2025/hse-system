import { DataFailed } from "@/base/core/networkStructure/Resources/dataState/data_state";
import {
  ErrorModel,
  ErrorType,
} from "@/base/core/networkStructure/Resources/errors/errorModel";

class ErrorHandler {
  static handleError<T>(e: any) {
    let errorMessage: string | null = null;
    if (e.response != null) {
      if (e.response.data != null) {
        errorMessage = e.response.data.message ?? null;
      }
      if (e.response.status == 400) {
        return new DataFailed<T>(
          new ErrorModel(
            errorMessage ?? "تاكد من البيانات المدخلة",
            ErrorType.dataDirty
          )
        );
      } else if (e.response.status == 401) {
        return new DataFailed<T>(
          new ErrorModel(
            errorMessage ?? "يجب عليكم تسجيل الدخول",
            ErrorType.unknown
          )
        );
      } else if (e.response.status == 302) {
        return new DataFailed<T>(
          new ErrorModel(
            errorMessage ?? "يجب عليكم تسجيل الدخول",
            ErrorType.unknown
          )
        );
      } else if (e.response.status == 500) {
        return new DataFailed<T>(
          new ErrorModel(
            errorMessage ?? "حدث خطأ ما حاول مره اخري",
            ErrorType.serviceSide
          )
        );
      } else if (e.response.status == 404) {
        return new DataFailed<T>(
          new ErrorModel(
            errorMessage ?? "حدث خطأ تاكد من المسار",
            ErrorType.unknown
          )
        );
      } else {
        return new DataFailed<T>(
          new ErrorModel(
            errorMessage ?? "حدث خطأ ما حاول مره اخري",
            ErrorType.unknown
          )
        );
      }
    }
    return new DataFailed<T>(
      new ErrorModel(
        errorMessage ?? "حدث خطأ ما حاول مره اخري",
        ErrorType.serviceSide
      )
    );
  }
}

export { ErrorHandler };
