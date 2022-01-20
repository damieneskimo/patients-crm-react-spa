import { baseURL } from "./constants";
import authService from '../services/auth';
import { useAuthContext } from "../contexts/auth-context";
import { useCallback } from "react";

interface Config extends RequestInit {
    data?: object,
    token?: string
}

export const http = async (
    endpoint: string,
    { data, token, headers, ...customConfig }: Config = {}
) => {
    const config = {
        method: 'GET',
        headers: {
            Authorisation: token? `Bearer ${token}` : '',
            "Content-Type": "application/json",
            ...headers
        },
        ...customConfig
    }

    if (config.method.toUpperCase() === 'GET') {
        if (data !== undefined) {
          endpoint += `?${JSON.stringify(data)}`
        }
    } else {
        config.body = JSON.stringify(data || {})
    }

    return window.fetch(`${baseURL}/${endpoint}`, config)
            .then(async (response) => {
              if (response.status === 401) {
                await authService.logout();
                window.location.reload();
                return Promise.reject({'message': 'Please login'})
              }
              
              let data;
              if (response.status == 204) {
                data = response
              } else {
                data = await response.json();
              }
              
              if (response.ok) {
                return data;
              } else {
                return Promise.reject(data);
              }
            })
}

export const useHttp = () => {
    const { user } = useAuthContext();

    return useCallback(
      (...[endpoint, config]: Parameters<typeof http>) => http(endpoint, {...config, token: user?.token}),
      [user?.token]
    );
}
