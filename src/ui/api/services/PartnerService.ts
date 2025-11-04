/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class PartnerService {
  /**
   * Create a new partner
   * @returns any Partner created successfully
   * @throws ApiError
   */
  public static postApiPartner({
    requestBody,
  }: {
    requestBody: {
      name: string;
      domain: string;
      shopify_secret: string;
    };
  }): CancelablePromise<{
    partner?: any;
    success: boolean;
  }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/partner",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Get current user's partner
   * @returns any Partner information
   * @throws ApiError
   */
  public static getApiPartner(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/partner",
    });
  }
  /**
   * Get partner by ID
   * @returns any Partner found
   * @throws ApiError
   */
  public static getApiPartner1({ id }: { id: string }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/partner/{id}",
      path: {
        id: id,
      },
      errors: {
        404: `Partner not found`,
      },
    });
  }
}
