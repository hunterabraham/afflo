/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AffiliateEventService {
    /**
     * Create a new affiliate event
     * @returns any Affiliate event created successfully
     * @throws ApiError
     */
    public static postApiAffiliateEvent({
        requestBody,
    }: {
        requestBody: {
            type: string;
            data?: any;
            affiliate_id: string;
        },
    }): CancelablePromise<{
        affiliate_event?: any;
        success: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/affiliate-event',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all affiliate events for current partner
     * @returns any[] List of affiliate events
     * @throws ApiError
     */
    public static getApiAffiliateEvent(): CancelablePromise<any[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/affiliate-event',
        });
    }
    /**
     * Get affiliate event by ID
     * @returns any Affiliate event found
     * @throws ApiError
     */
    public static getApiAffiliateEvent1({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/affiliate-event/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Affiliate event not found`,
            },
        });
    }
}
