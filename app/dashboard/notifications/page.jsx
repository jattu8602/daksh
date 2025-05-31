'use client'
import React from 'react'
// This file is used to redirect from /notifications to /notifications/school
import { useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function NotificationsPage() {
  // Redirect directly to school notifications
  redirect('/dashboard/notifications/school')

  // Note: The code below is technically unreachable due to the redirect,
  // but we include it as a fallback
  return null
}
