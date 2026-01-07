import { AdminAnalytics } from "@/interfaces/admin-analytics.interface"
import { get } from "@/lib/request"
import { redirect } from "next/navigation"

export const getAdminAnalytics = async (startDate: string, endDate: string): Promise<AdminAnalytics> => {
    const response = await get<AdminAnalytics>(
        '/api/admin/analytics',
        { startDate, endDate }
    )

    if (response.status === 200) {
        console.log('Analytics data fetched:', response.payload)
        return response.payload
    } else {
        redirect('/error-fetch-data')
    }
}