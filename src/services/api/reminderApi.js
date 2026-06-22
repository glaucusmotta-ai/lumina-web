import { apiClient } from './apiClient'

export function getTodayReminderItems() {
  return apiClient.get('/reminders/today')
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

