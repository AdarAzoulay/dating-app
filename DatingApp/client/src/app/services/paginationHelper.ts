import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../models/pagination";

export function getPaginatedResult<T>(url:string, params: HttpParams, http:HttpClient) {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

  return http.get<T>(url,
    {
      observe: 'response',
      params
    }).pipe(
      map(response => {
        paginatedResult.result = response.body as T;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination') || '');
        }
        return paginatedResult;
      })
    );
}

export function getPaginationHeaders(pageNumber:number, pageSize:number) {
  let headers = new HttpParams();
  headers = headers.append('pageNumber', pageNumber.toString());
  headers = headers.append('pageSize', pageSize.toString());
  return headers;

}

//3. update members.service.ts to use this file, go to members.service.ts
