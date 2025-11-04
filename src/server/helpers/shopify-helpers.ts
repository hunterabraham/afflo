import "@shopify/shopify-api/adapters/node";
import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import express from "express";
import { env } from "~/env";
const shopify = shopifyApi({
  apiKey: env.AUTH_SHOPIFY_ID,
  apiSecretKey: env.AUTH_SHOPIFY_SECRET,
  scopes: ["read_products"],
  hostName: "", // ngrok tunnel address
  apiVersion: ApiVersion.July25,
  isEmbeddedApp: true,
});
