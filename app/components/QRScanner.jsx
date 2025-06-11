'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode'

export default function QRScanner({ onScanSuccess, onScanError }) {
  const scannerRef = useRef(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [scanStatus, setScanStatus] = useState('initializing')
  const [cameraError, setCameraError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)
  const fileInputRef = useRef(null)
  const [uploadError, setUploadError] = useState(null)

  useEffect(() => {
    let scanner = null
    let isUnmounted = false
    let initializationTimeout = null

    const initializeScanner = async () => {
      try {
        setScanStatus('initializing')
        setCameraError(null)
        setUploadError(null)

        // Wait for DOM element
        await new Promise((resolve) => setTimeout(resolve, 200))

        const element = document.getElementById('qr-reader')
        if (!element) {
          if (!isUnmounted) {
            initializationTimeout = setTimeout(initializeScanner, 500)
          }
          return
        }

        // Clear any existing content
        element.innerHTML = ''

        // Use minimal configuration to avoid BarcodeDetector issues
        const config = {
          fps: 10,
          qrbox: 250,
          aspectRatio: 1.0,
        }

        console.log('Creating Html5QrcodeScanner with config:', config)

        scanner = new Html5QrcodeScanner('qr-reader', config, false)
        scannerRef.current = scanner

        const onScanSuccess = (decodedText, decodedResult) => {
          console.log('QR Code scanned successfully:', decodedText)
          setScanStatus('success')
          processQrData(decodedText)
        }

        const onScanFailure = (error) => {
          // Handle scan failures - most are just "no QR code found"
          const errorString =
            typeof error === 'string'
              ? error
              : error?.message || error?.toString() || ''

          if (errorString.includes('No MultiFormat Readers')) {
            // Normal - no QR code in view, keep scanning
            if (scanStatus !== 'scanning') {
              setScanStatus('scanning')
            }
          } else if (
            errorString.includes('Permission denied') ||
            errorString.includes('NotAllowedError')
          ) {
            setCameraError(
              'Camera access denied. Please allow camera access and try again.'
            )
            setScanStatus('error')
          } else if (
            errorString.includes('NotFoundError') ||
            errorString.includes('Camera not found')
          ) {
            setCameraError('No camera found on this device.')
            setScanStatus('error')
          } else if (errorString.includes('NotSupportedError')) {
            setCameraError(
              'Camera not supported by this browser. Try using Chrome or Safari.'
            )
            setScanStatus('error')
          } else if (
            errorString &&
            !errorString.includes('No MultiFormat Readers')
          ) {
            // Only log unexpected errors
            console.warn('QR scan error:', errorString)
          }
        }

        console.log('Starting QR scanner...')
        await scanner.render(onScanSuccess, onScanFailure)

        if (!isUnmounted) {
          setIsInitialized(true)
          setScanStatus('scanning')
          console.log('QR Scanner initialized successfully')
        }
      } catch (error) {
        console.error('Scanner initialization failed:', error)

        if (!isUnmounted) {
          setScanStatus('error')

          const errorMessage =
            error?.message || error?.toString() || 'Unknown error'
          console.log('Error details:', errorMessage)

          // Handle specific errors
          if (errorMessage.includes('BarcodeDetector')) {
            setCameraError(
              'Camera scanning not supported in this browser. Please try Chrome, Edge, or Safari.'
            )
          } else if (
            errorMessage.includes('Permission denied') ||
            errorMessage.includes('NotAllowedError')
          ) {
            setCameraError(
              'Camera access denied. Please allow camera access and try again.'
            )
          } else if (errorMessage.includes('NotFoundError')) {
            setCameraError('No camera found on this device.')
          } else if (errorMessage.includes('NotSupportedError')) {
            setCameraError('Camera not supported by this browser.')
          } else if (errorMessage.includes('HTTPS')) {
            setCameraError(
              'Camera requires HTTPS. Please use a secure connection.'
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

    // Start initialization with a small delay
    const timeoutId = setTimeout(initializeScanner, 100)

    return () => {
      isUnmounted = true
      clearTimeout(timeoutId)
      if (initializationTimeout) {
        clearTimeout(initializationTimeout)
      }
      if (scannerRef.current) {
        try {
          scannerRef.current.clear().catch((err) => {
            console.warn('Error clearing scanner:', err)
          })
        } catch (error) {
          console.warn('Error during cleanup:', error)
        }
      }
    }
  }, [retryKey]) // Removed onScanSuccess, onScanError from dependencies to avoid recreation

  const handleRetry = () => {
    console.log('Retrying camera initialization...')
    setCameraError(null)
    setIsInitialized(false)
    setScanStatus('initializing')
    setUploadError(null)

    // Clear the scanner element
    const element = document.getElementById('qr-reader')
    if (element) {
      element.innerHTML = ''
    }

    // Trigger re-initialization
    setRetryKey((prev) => prev + 1)
  }

  const processQrData = (decodedText) => {
    try {
      console.log('Processing QR data:', decodedText)

      // Try to parse as JSON first
      let qrData
      try {
        qrData = JSON.parse(decodedText)
      } catch (parseError) {
        // If not JSON, treat as plain text (maybe it's just a URL or plain text QR)
        console.log('QR code is not JSON, treating as plain text')
        onScanError(
          'QR code format not recognized. Please scan a valid student QR code.'
        )
        return
      }

      if (!qrData.username) {
        throw new Error('Invalid QR code: missing username')
      }

      // Handle different QR code formats
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
            console.error('Password retrieval error:', error)
            setScanStatus('error')
            onScanError(error.message || 'Failed to retrieve password')
          })
      } else if (qrData.password) {
        onScanSuccess(qrData)
      } else {
        throw new Error('Invalid QR code: missing required authentication data')
      }
    } catch (error) {
      console.error('QR processing error:', error)
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
      console.log('Processing uploaded file:', file.name)

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file')
      }

      // Create a temporary scanner for file processing
      const tempElement = document.getElementById('qr-upload-temp')
      if (!tempElement) {
        throw new Error('File upload not available')
      }

      const html5Qr = new Html5Qrcode('qr-upload-temp')
      const result = await html5Qr.scanFile(file, true)

      // Clean up the temporary scanner
      await html5Qr.clear()

      console.log('File scan result:', result)
      processQrData(result)
    } catch (error) {
      console.error('File scan error:', error)
      setScanStatus(isInitialized ? 'scanning' : 'error')
      setUploadError(
        'Could not read QR code from image. Please try a clearer image or use camera scanning.'
      )
    }

    // Reset file input
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
        <div id="qr-reader" className="w-full min-h-[300px]"></div>

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
