import { post } from "@/lib/request";
import { showToast } from "@/lib/toast";
import { AdminLoginInput, AdminLoginResponse } from "@/schema/admin.schema";
import { redirect } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

export const adminLogin: SubmitHandler<AdminLoginInput> = async (data) => {
  const response = await post<AdminLoginResponse>(
    '/api/admin/auth/login',
    data
  );

  if (response.status === 201 && 'data' in response.payload) {
    await post( 
      '/api/cookie/admin_access_token', 
      { value: response.payload.data.accessToken },
      { baseUrl: '/' }
    );
    showToast("success", response.payload.message);
    redirect('/admin/dashboard');
  } else {
    showToast("error", response.payload.message);
  }
}