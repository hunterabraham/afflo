/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AuthService {
  /**
   * Create a new user account
   * @returns any User created successfully
   * @throws ApiError
   */
  public static postApiAuthSignup({
    requestBody,
  }: {
    requestBody: {
      name: string;
      email: string;
      password: string;
    };
  }): CancelablePromise<{
    message: string;
    user: {
      id: string;
      email: string;
    };
  }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/signup",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `User already exists`,
      },
    });
  }
  /**
   * Setup company for authenticated user
   * @returns any Company setup completed successfully
   * @throws ApiError
   */
  public static postApiAuthSetupCompany({
    requestBody,
  }: {
    requestBody: {
      companyName: string;
      domain: string;
      shopifySecret?: string;
    };
  }): CancelablePromise<{
    message: string;
    partner: {
      id: string;
      name: string;
      domain: string;
    };
  }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/setup-company",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `User already has a company setup`,
        401: `Unauthorized`,
      },
    });
  }
}
