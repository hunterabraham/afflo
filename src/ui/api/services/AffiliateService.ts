/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AffiliateService {
  /**
   * Create a new affiliate
   * @returns any Affiliate created successfully
   * @throws ApiError
   */
  public static postApiAffiliate({
    requestBody,
  }: {
    requestBody: {
      user_id: string;
    };
  }): CancelablePromise<{
    affiliate?: any;
    success: boolean;
  }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/affiliate",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Get affiliate by ID
   * @returns any Affiliate found
   * @throws ApiError
   */
  public static getApiAffiliate({
    id,
  }: {
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/affiliate/{id}",
      path: {
        id: id,
      },
      errors: {
        404: `Affiliate not found`,
      },
    });
  }
}
