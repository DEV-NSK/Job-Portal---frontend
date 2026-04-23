import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { notificationsAPI } from '../services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data } = await notificationsAPI.getAll()
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.isRead).length)
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchNotifications()
      // Poll every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    } else {
      setNotifications([])
      setUnreadCount(0)
    }
  }, [user, fetchNotifications])

  const markRead = async (id) => {
    try {
      await notificationsAPI.markRead(id)
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch { /* silent */ }
  }

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch { /* silent */ }
  }

  const deleteNotification = async (id) => {
    try {
      await notificationsAPI.delete(id)
      const notification = notifications.find(n => n._id === id)
      setNotifications(prev => prev.filter(n => n._id !== id))
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      toast.success('Notification deleted')
    } catch {
      toast.error('Failed to delete notification')
    }
  }

  const deleteAllRead = async () => {
    try {
      await notificationsAPI.deleteAllRead()
      setNotifications(prev => prev.filter(n => !n.isRead))
      toast.success('All read notifications deleted')
    } catch {
      toast.error('Failed to delete notifications')
    }
  }

  const clearAll = async () => {
    try {
      await notificationsAPI.clearAll()
      setNotifications([])
      setUnreadCount(0)
      toast.success('All notifications cleared')
    } catch {
      toast.error('Failed to clear notifications')
    }
  }

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      loading, 
      fetchNotifications, 
      markRead, 
      markAllRead,
      deleteNotification,
      deleteAllRead,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
