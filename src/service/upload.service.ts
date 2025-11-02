"use client";

import { post } from "@/lib/request";
import { showToast } from "@/lib/toast";

export const uploadImages = async (formData: FormData): Promise<string[]> => {
  const res = await post<{ urls: string[] }>( // call API from src\app\api\upload\image\route.ts
    '/api/upload/image',
    formData,
    { baseUrl: '/' }
  )

  if (res.status === 200 && 'urls' in res.payload) {
    return res.payload.urls;
  } else {
    showToast("error", 'Failed to upload images');
    throw new Error('Failed to upload images');
  }
}