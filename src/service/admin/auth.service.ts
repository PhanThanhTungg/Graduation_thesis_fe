import { post } from "@/lib/request";
import { showToast } from "@/lib/toast";
import { AdminLoginInput, AdminLoginResponse } from "@/schema/admin.schema";
import { redirect } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

export const adminLogout = async () => {
  // Clear admin info from localStorage
  localStorage.removeItem('admin');
  
  // Clear access token cookie
  await post('/api/cookie/admin_access_token', { value: '' }, { baseUrl: '/' });
  
  showToast("success", "Logged out successfully");
  redirect('/admin/login');
};

export const adminLogin: SubmitHandler<AdminLoginInput> = async (data) => {
  const response = await post<AdminLoginResponse>(
    '/api/admin/auth/login',
    data
  );

  if (response.status === 201 && 'data' in response.payload) {
    const { accessToken, admin } = response.payload.data;
    
    // Save access token
    await post( 
      '/api/cookie/admin_access_token', 
      { value: accessToken },
      { baseUrl: '/' }
    );

    // Save admin info
    localStorage.setItem('admin', JSON.stringify(admin));
    
    showToast("success", response.payload.message);
    redirect('/admin/dashboard');
  } else {
    showToast("error", response.payload.message);
  }
}