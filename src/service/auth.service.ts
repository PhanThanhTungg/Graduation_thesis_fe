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
    await post( // call API from src\app\api\cookie\[name]\route.ts
      '/api/cookie/client_access_token', 
      { value: response.payload.data.accessToken },
      { baseUrl: '/'}
    );
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
    await post( // call API from src\app\api\cookie\[name]\route.ts
      '/api/cookie/client_access_token', 
      { value: response.payload.data.accessToken },
      { baseUrl: '/'}
    );
    showToast("success", response.payload.message);
    redirect('/');
  } else {
    showToast("error", response.payload.message);
  }
}