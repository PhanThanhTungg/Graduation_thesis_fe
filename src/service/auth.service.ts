import { post } from "@/lib/request";
import { showToast } from "@/lib/toast";
import { UserLoginType, UserAuthResponseType, UserRegisterType } from "@/schema/user.schema";
import { redirect } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

export const clientRegister: SubmitHandler<UserRegisterType> = async(data) => {
  const response = await post<UserAuthResponseType>(
    '/api/auth/register', 
    {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      country: data.country,
      recaptchaToken: data.recaptchaToken
    }
  );

  if (response.status === 201 && 'data' in response.payload) {
    document.cookie = `client_access_token=${response.payload.data.accessToken}; path=/`;
    showToast("success", response.payload.message);
    redirect('/');
  } else {
    showToast("error", response.payload?.message);
  }
}

export const clientLogin: SubmitHandler<UserLoginType> = async (data) => {
  const response = await post<UserAuthResponseType>(
    '/api/auth/login',
    data
  );

  if (response.status === 201 && 'data' in response.payload) {
    document.cookie = `client_access_token=${response.payload.data.accessToken}; path=/`;
    showToast("success", response.payload.message);
    redirect('/');
  } else {
    showToast("error", response.payload.message);
  }
}

export const sendVerificationEmail = async () => {
  const response = await post<{ message: string }>(
    '/api/auth/send-verification-email',
    {}
  );
  if (response.status === 201 || response.status === 200) {
    showToast('success', response.payload.message || 'Verification email sent');
  } else {
    showToast('error', response.payload.message || 'Failed to send verification email');
  }
}

export const verifyEmail = async (token: string) => {
  const response = await post<{ message: string }>(
    '/api/auth/verify-email',
    { token }
  );
  const ok = response.status === 200 || response.status === 201;
  if (ok) {
    showToast('success', response.payload.message || 'Email verified successfully');
  } else {
    showToast('error', response.payload.message || 'Email verification failed');
  }
  return { ok, message: response.payload.message };
}

export const forgotPassword = async (email: string) => {
  const response = await post<{ message: string }>(
    '/api/auth/forgot-password',
    { email }
  );
  const ok = response.status === 201;
  if (ok) {
    showToast('success', response.payload.message || 'Reset link sent to your email');
  } else {
    showToast('error', response.payload.message || 'Failed to send reset link');
  }
  return { ok, message: response.payload.message };
}

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await post<{ message: string }>(
    '/api/auth/reset-password',
    { token, newPassword }
  );
  const ok = response.status === 200 || response.status === 201;
  if (ok) {
    showToast('success', response.payload.message || 'Password reset successfully');
  } else {
    showToast('error', response.payload.message || 'Failed to reset password');
  }
  return { ok, message: response.payload.message };
}