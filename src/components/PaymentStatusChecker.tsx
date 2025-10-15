import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showSuccess, showError } from '../utils/swal'

interface PaymentStatusCheckerProps {
  paymentId: number
  onStatusChange?: (status: string) => void
  autoRedirect?: boolean
}

const PaymentStatusChecker: React.FC<PaymentStatusCheckerProps> = ({
  paymentId,
  onStatusChange,
  autoRedirect = true
}) => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<string>('Pending')
  const [isChecking, setIsChecking] = useState(false)

  const checkPaymentStatus = async () => {
    try {
      setIsChecking(true)
      const token = localStorage.getItem('smart-child-token')
      
      const response = await fetch(`/api/paypos/${paymentId}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const newStatus = data.status
        
        if (newStatus !== status) {
          setStatus(newStatus)
          onStatusChange?.(newStatus)
          
          if (newStatus === 'Success') {
            showSuccess('Thanh toán thành công! Gói dịch vụ đã được kích hoạt.')
            if (autoRedirect) {
              setTimeout(() => {
                navigate('/')
              }, 2000)
            }
          } else if (newStatus === 'Failed') {
            showError('Thanh toán thất bại. Vui lòng thử lại.')
          }
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    // Check status immediately
    checkPaymentStatus()

    // Set up polling every 5 seconds
    const interval = setInterval(checkPaymentStatus, 5000)

    // Clean up interval after 5 minutes (300 seconds)
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 300000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [paymentId])

  // Don't render anything, this is just a background checker
  return null
}

export default PaymentStatusChecker
