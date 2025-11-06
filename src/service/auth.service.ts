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
      country: data.country
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
    showToast('success', (response.payload as any)?.message || 'Verification email sent');
  } else {
    showToast('error', (response.payload as any)?.message || 'Failed to send verification email');
  }
}

export const verifyEmail = async (token: string) => {
  const response = await post<{ message: string }>(
    '/api/auth/verify-email',
    { token }
  );
  const ok = response.status === 200 || response.status === 201;
  if (ok) {
    showToast('success', (response.payload as any)?.message || 'Email verified successfully');
  } else {
    showToast('error', (response.payload as any)?.message || 'Email verification failed');
  }
  return { ok, message: (response.payload as any)?.message };
}