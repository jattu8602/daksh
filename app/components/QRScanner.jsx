'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'

export default function QRScanner({ onScanSuccess, onScanError }) {
  const videoRef = useRef(null)
  const codeReaderRef = useRef(null)
  const [scanStatus, setScanStatus] = useState('initializing')
  const [cameraError, setCameraError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)
  const fileInputRef = useRef(null)
  const [uploadError, setUploadError] = useState(null)

  useEffect(() => {
    const startScanner = async () => {
      setScanStatus('initializing')
      setCameraError(null)

      const codeReader = new BrowserMultiFormatReader()
      codeReaderRef.current = codeReader

      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices()
        if (!devices.length) throw new Error('No camera devices')

        setScanStatus('scanning')
        const deviceId = devices[0].deviceId

        await codeReader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              setScanStatus('success')
              onScanSuccess(result.getText())
              codeReader.reset()
            }
            // ignore "no QR found" errors
            if (error && error.name !== 'NotFoundException') {
              console.warn('QR scan error', error)
            }
          }
        )
      } catch (err) {
        // Map a few common names to friendly messages
        const name = err.name || ''
        let msg = 'Camera initialization failed.'

        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          msg = 'Camera access denied. Please allow camera and retry.'
        } else if (
          name === 'NotFoundError' ||
          err.message.includes('No camera')
        ) {
          msg = 'No camera found on this device.'
        } else if (name === 'NotSupportedError' || name === 'SecurityError') {
          msg = 'Camera not supported by this browser (must be HTTPS).'
        }

        setCameraError(msg)
        setScanStatus('error')
        onScanError(msg)
      }
    }

    startScanner()

    return () => {
      // Properly stop all video streams
      if (codeReaderRef.current) {
        BrowserMultiFormatReader.releaseAllStreams()
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    }
  }, [retryKey])

  // File upload handler placeholder (implement if needed)
  const handleFileChange = async (e) => {
    setUploadError(null)
    const file = e.target.files[0]
    if (!file) return
    // You can implement QR code reading from image file here using zxing if needed
    setUploadError('QR code image upload is not implemented yet.')
    e.target.value = ''
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="relative w-full bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
        <video
          ref={videoRef}
          className="w-full min-h-[300px] object-cover"
          muted
          playsInline
        />
        {!cameraError && scanStatus !== 'scanning' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            {scanStatus === 'initializing' && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                <span className="text-sm">Starting camera...</span>
              </div>
            )}
            {scanStatus === 'success' && (
              <div className="text-green-600 text-sm font-medium">
                QR code scanned!
              </div>
            )}
          </div>
        )}
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-4 space-y-3">
            <div className="text-red-600 text-sm">{cameraError}</div>
            <button
              onClick={() => setRetryKey((k) => k + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Retry Camera
            </button>
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
        {uploadError && (
          <div className="text-red-500 text-sm mt-2">{uploadError}</div>
        )}
      </div>
    </div>
  )
}
