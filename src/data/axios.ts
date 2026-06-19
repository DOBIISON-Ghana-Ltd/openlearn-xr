import primitiveAxios from 'axios';
import { environmentManager } from '@tanstack/react-query';
import { env } from '@/lib/config/env';

const isServer = environmentManager.isServer();

export const axios = primitiveAxios.create({
  baseURL: env.NEXT_PUBLIC_API_URL!,
  withCredentials: true, // Equivalent to credentials: 'include' for the client
});

// Interceptor to handle Server-Side header forwarding
axios.interceptors.request.use(async (config) => {
  if (isServer) {
    try {
      // Lazy import prevents 'next/headers' from being bundled for the client
      const { headers } = await import('next/headers');
      const requestHeaders = await headers();
      const cookie = requestHeaders.get('cookie');

      if (cookie) {
        config.headers.Cookie = cookie;
      }
    } catch (error) {
      console.warn("Failed to attach server-side headers", error);
    }
  }

  return config;
});

export const axiosPublic = primitiveAxios.create({
  baseURL: env.NEXT_PUBLIC_API_URL!,
  withCredentials: false, // No credentials for public instance
});

