'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'

export default function QRScanner({ onScanSuccess, onScanError }) {
  const scannerRef = useRef(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [scanStatus, setScanStatus] = useState('initializing')
  const [cameraError, setCameraError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)
  const fileInputRef = useRef(null)
  const [uploadError, setUploadError] = useState(null)
  const videoRef = useRef(null)
  const [controls, setControls] = useState(null)

  useEffect(() => {
    let isUnmounted = false
    let codeReader = null
    let currentControls = null

    const initializeScanner = async () => {
      try {
        setScanStatus('initializing')
        setCameraError(null)
        setUploadError(null)
        setIsInitialized(false)

        // Wait for DOM element
        await new Promise((resolve) => setTimeout(resolve, 200))

        const element = document.getElementById('qr-reader')
        if (!element) {
          if (!isUnmounted) {
            setTimeout(initializeScanner, 500)
          }
          return
        }
        element.innerHTML = ''

        codeReader = new BrowserMultiFormatReader()
        scannerRef.current = codeReader

        // Prefer back camera
        const videoConstraints = { facingMode: { exact: 'environment' } }
        const devices = await BrowserMultiFormatReader.listVideoInputDevices()
        if (!devices.length) throw new Error('No camera devices')
        setScanStatus('scanning')
        const deviceId = devices[0].deviceId

        // Create video element for scanning
        let video = document.createElement('video')
        video.setAttribute('playsinline', true)
        video.setAttribute('muted', true)
        video.setAttribute('autoplay', true)
        video.className = 'w-full min-h-[300px] object-cover'
        videoRef.current = video
        element.appendChild(video)

        // Start scanning
        currentControls = await codeReader.decodeFromVideoDevice(
          deviceId,
          video,
          (result, error, ctrl) => {
            if (result) {
              setScanStatus('success')
              processQrData(result.getText())
              ctrl.stop()
            }
            if (error && error.name !== 'NotFoundException') {
              // Only log unexpected errors
              console.warn('QR scan error:', error)
            }
          },
          videoConstraints
        )
        setControls(currentControls)
        if (!isUnmounted) {
          setIsInitialized(true)
          setScanStatus('scanning')
        }
      } catch (error) {
        if (!isUnmounted) {
          setScanStatus('error')
          const errorMessage =
            error?.message || error?.toString() || 'Unknown error'
          if (
            errorMessage.includes('Permission denied') ||
            errorMessage.includes('NotAllowedError')
          ) {
            setCameraError(
              'Camera access denied. Please allow camera access and try again.'
            )
          } else if (
            errorMessage.includes('NotFoundError') ||
            errorMessage.includes('No camera')
          ) {
            setCameraError('No camera found on this device.')
          } else if (
            errorMessage.includes('NotSupportedError') ||
            errorMessage.includes('HTTPS')
          ) {
            setCameraError(
              'Camera not supported by this browser or requires HTTPS.'
            )
          } else {
            setCameraError(
              'Camera initialization failed. Please try refreshing the page.'
            )
          }
          onScanError('QR scanner initialization failed: ' + errorMessage)
        }
      }
    }

    const timeoutId = setTimeout(initializeScanner, 100)

    return () => {
      isUnmounted = true
      clearTimeout(timeoutId)
      if (controls) {
        controls.stop && controls.stop()
      }
      if (scannerRef.current) {
        BrowserMultiFormatReader.releaseAllStreams()
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    }
  }, [retryKey])

  const handleRetry = () => {
    setCameraError(null)
    setIsInitialized(false)
    setScanStatus('initializing')
    setUploadError(null)
    const element = document.getElementById('qr-reader')
    if (element) {
      element.innerHTML = ''
    }
    setRetryKey((prev) => prev + 1)
  }

  const processQrData = (decodedText) => {
    try {
      let qrData
      try {
        qrData = JSON.parse(decodedText)
      } catch (parseError) {
        onScanError(
          'QR code format not recognized. Please scan a valid student QR code.'
        )
        return
      }
      if (!qrData.username) {
        throw new Error('Invalid QR code: missing username')
      }
      if (qrData.role && !qrData.password) {
        setScanStatus('processing')
        fetch('/api/auth/get-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: qrData.username }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              onScanSuccess({ ...qrData, password: data.password })
            } else {
              throw new Error(data.error || 'Failed to retrieve password')
            }
          })
          .catch((error) => {
            setScanStatus('error')
            onScanError(error.message || 'Failed to retrieve password')
          })
      } else if (qrData.password) {
        onScanSuccess(qrData)
      } else {
        throw new Error('Invalid QR code: missing required authentication data')
      }
    } catch (error) {
      setScanStatus('error')
      onScanError(error.message || 'Invalid QR code format')
    }
  }

  const handleFileChange = async (e) => {
    setUploadError(null)
    const file = e.target.files[0]
    if (!file) return
    try {
      setScanStatus('processing')
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file')
      }
      // Read file as image and decode
      const img = document.createElement('img')
      img.src = URL.createObjectURL(file)
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
      const codeReader = new BrowserMultiFormatReader()
      const result = await codeReader.decodeFromImageElement(img)
      processQrData(result.getText())
      URL.revokeObjectURL(img.src)
    } catch (error) {
      setScanStatus(isInitialized ? 'scanning' : 'error')
      setUploadError(
        'Could not read QR code from image. Please try a clearer image or use camera scanning.'
      )
    }
    e.target.value = ''
  }

  const getStatusMessage = () => {
    if (cameraError) {
      return (
        <div className="text-center space-y-3">
          <div className="text-red-600 text-sm leading-relaxed">
            {cameraError}
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Retry Camera
          </button>
        </div>
      )
    }
    if (uploadError) {
      return <div className="text-red-500 text-sm">{uploadError}</div>
    }
    switch (scanStatus) {
      case 'initializing':
        return (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm">Starting camera...</span>
          </div>
        )
      case 'scanning':
        return (
          <div className="text-gray-600 text-sm">
            Position QR code within the frame
          </div>
        )
      case 'processing':
        return (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
            <span className="text-sm">Processing QR code...</span>
          </div>
        )
      case 'success':
        return (
          <div className="text-green-600 text-sm font-medium">
            QR code scanned successfully!
          </div>
        )
      case 'error':
        return (
          <div className="text-red-500 text-sm">
            Scanning failed. Please try again.
          </div>
        )
      default:
        return (
          <div className="text-gray-600 text-sm">
            Position QR code within the frame
          </div>
        )
    }
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* QR Scanner Container */}
      <div className="relative w-full bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
        <div id="qr-reader" className="w-full min-h-[250px]"></div>
        {/* Status overlay when not initialized */}
        {!isInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center p-6">{getStatusMessage()}</div>
          </div>
        )}
      </div>
      {/* File Upload */}
      <div className="w-full text-center">
        <input
          type="file"
          accept="image/*,.png,.jpg,.jpeg,.gif,.bmp,.webp"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={scanStatus === 'processing'}
        >
          {scanStatus === 'processing' ? 'Processing...' : 'Upload QR Image'}
        </button>
      </div>
      {/* Status Message (when initialized) */}
      {isInitialized && <div className="text-center">{getStatusMessage()}</div>}
      {/* Hidden element for file scanning */}
      <div id="qr-upload-temp" className="hidden"></div>
    </div>
  )
}
