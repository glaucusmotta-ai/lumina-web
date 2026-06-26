// src/services/api/reminderApi.js
import { apiClient } from './apiClient'

export function getTodayReminderItems(date = null) {
  const query = date ? `?date=${date}` : ''
  return apiClient.get(`/reminders/today${query}`)
}

export async function sendReminder(payload) {
  const response = await apiClient.post(
    '/reminders/send',
    payload,
  )
  return response?.data || response
}

export function getReminderApiLogs() {
  return apiClient.get('/reminders/logs')
}

