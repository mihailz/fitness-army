import {HttpParams} from "@angular/common/http";

export const createHttpParams = (params: {[key: string]: string}): HttpParams => {
  const queryParams = new HttpParams();
  Object.keys(params).forEach((key: string) => {
    if (params[key]) {
      queryParams.append(key, params[key]);
    }
  });
  return queryParams;
}
