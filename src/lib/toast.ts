"use client";
import { toast, ToastOptions } from "react-toastify";

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const showToast = (type: ToastType, message: string): void => {
  const options: ToastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  };
  toast[type](message, options);
};
