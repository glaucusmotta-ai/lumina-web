import { apiClient } from './apiClient'

export function getTodayReminderItems() {
  return apiClient.get('/reminders/today')
}

export function sendReminder(payload) {
  return apiClient.post('/reminders/send', payload)
}

export function getReminderApiLogs() {
  return apiClient.get('/reminders/logs')
}

