import { getCookie } from "./cookie";

type CustomRequestOptions = Omit<RequestInit, 'method'> & {
  baseUrl: string | undefined;
}

export const isNextClient = typeof window !== 'undefined';

const request = async <Response>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  url: string,
  options: CustomRequestOptions | undefined
) => {
  const baseUrl = options?.baseUrl || process.env.NEXT_PUBLIC_API_URL;
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url.slice(1)}` : `${baseUrl}${url}`;

  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }

  const baseHeaders: Record<string, string> = body instanceof FormData ? {} : { 'Content-Type': 'application/json' };
  let accessToken: string | undefined = undefined;
  if (url.includes('/admin/')) {
    accessToken = await getCookie('admin_access_token');
  } else {
    accessToken = await getCookie('client_access_token');
  }
  
  try {
    const res = await fetch(fullUrl, {
      headers: {
        ...baseHeaders,
        ...options?.headers,
        Authorization: `Bearer ${accessToken}`
      },
      method,
      body, 
    });

    const payload: Response = await res.json();

    // Intercept response here
    console.log({
      status: res.status,
      payload
    })
    return {
      status: res.status,
      payload
    }
  } catch (error) {
    console.log("API Error", error)
    return {
      status: 500,
      payload: {
        message: error instanceof Error ? error.message : "An unknown error"
      }
    }
  }
}

type BodyType = FormData | Record<string, unknown> | undefined;
type OptionsType = Omit<CustomRequestOptions, 'body'> | undefined;

export const get = <Response>(
  url: string,
  params: Record<string, string> | undefined,
  options?: OptionsType,
) => {
  if (params) {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => queryString.append(key, v.toString()));
      } else if (value !== null && value !== undefined) {
        queryString.append(key, String(value));
      }
    });
    url += `?${queryString.toString()}`;
  }
  return request<Response>('GET', url, options);
}

export const post = <Response>(
  url: string,
  body: BodyType,
  options?: OptionsType,
) => {
  return request<Response>('POST', url, { ...options, body } as CustomRequestOptions);
}

export const patch = <Response>(
  url: string,
  body: BodyType,
  options?: OptionsType
) => {
  return request<Response>('PATCH', url, { ...options, body } as CustomRequestOptions);
}

export const del = <Response>(
  url: string,
  options?: OptionsType,
) => {
  return request<Response>('DELETE', url, options as CustomRequestOptions);
}