/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AdminService {
  /**
   * Get admin by user ID
   * @returns any Admin information
   * @throws ApiError
   */
  public static getApiAdminUser({
    userId,
  }: {
    userId: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/admin/user/{user_id}",
      path: {
        user_id: userId,
      },
    });
  }
}
