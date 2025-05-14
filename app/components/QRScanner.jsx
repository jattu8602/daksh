"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScanSuccess, onScanError }) {
  const scannerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [scanStatus, setScanStatus] = useState("initializing");
  const [cameraError, setCameraError] = useState(null);
  const containerRef = useRef(null);
  const [retryKey, setRetryKey] = useState(0);
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    let scanner = null;
    let initializationTimeout = null;
    let isUnmounted = false;

    const initializeScanner = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const element = document.getElementById("qr-reader");
        if (!element) {
          initializationTimeout = setTimeout(initializeScanner, 500);
          return;
        }
        scanner = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 300, height: 300 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true,
            defaultZoomValueIfSupported: 2,
            formatsToSupport: ["QR_CODE"],
            rememberLastUsedCamera: true
          },
          false
        );
        scannerRef.current = scanner;
        scanner.render(
          (decodedText) => {
            processQrData(decodedText);
          },
          (error) => {
            let errorMessage = "Unknown error";
            if (typeof error === 'string') errorMessage = error;
            else if (error instanceof Error) errorMessage = error.message;
            else if (error && typeof error === 'object') errorMessage = error.message || error.toString();
            if (typeof errorMessage === 'string') {
              if (errorMessage.includes("No MultiFormat Readers were able to detect the code")) {
                setScanStatus("scanning");
              } else if (errorMessage.includes("Camera access denied")) {
                setCameraError("Camera access denied. Please allow camera access and refresh the page.");
                setScanStatus("error");
              } else {
                setScanStatus("error");
                onScanError("Error scanning QR code. Please try again.");
              }
            }
          }
        );
        if (!isUnmounted) {
          setIsInitialized(true);
          setScanStatus("scanning");
        }
      } catch (error) {
        setScanStatus("error");
        setCameraError(error.message || "Failed to initialize QR scanner. Please refresh the page.");
        onScanError("Failed to initialize QR scanner. Please refresh the page.");
      }
    };
    initializeScanner();
    return () => {
      isUnmounted = true;
      if (initializationTimeout) clearTimeout(initializationTimeout);
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          // ignore
        }
      }
    };
  }, [onScanSuccess, onScanError, retryKey]);

  const handleRetry = () => {
    setCameraError(null);
    setIsInitialized(false);
    setScanStatus("initializing");
    setRetryKey(prev => prev + 1);
  };

  const processQrData = (decodedText) => {
    try {
      const qrData = JSON.parse(decodedText);
      if (!qrData.username) {
        throw new Error("Invalid QR code format: missing username");
      }
      if (qrData.role && !qrData.password) {
        fetch("/api/auth/get-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: qrData.username })
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              setScanStatus("success");
              onScanSuccess({ ...qrData, password: data.password });
            } else {
              throw new Error(data.error || "Failed to get password");
            }
          })
          .catch(error => {
            setScanStatus("error");
            onScanError(error.message || "Failed to get password");
          });
      } else if (qrData.password) {
        setScanStatus("success");
        onScanSuccess(qrData);
      } else {
        throw new Error("Invalid QR code format: missing required fields");
      }
    } catch (error) {
      setScanStatus("error");
      onScanError(error.message || "Invalid QR code format");
    }
  };

  const handleFileChange = async (e) => {
    setUploadError(null);
    const file = e.target.files[0];
    if (!file) return;
    try {
      const html5Qr = new Html5Qrcode("qr-upload-temp");
      const result = await html5Qr.scanFile(file, true);
      html5Qr.clear();
      processQrData(result);
    } catch (err) {
      setUploadError("Could not read a valid QR code from the image.");
    }
    e.target.value = "";
  };

  const getStatusMessage = () => {
    if (cameraError) {
      return (
        <>
          {cameraError}
          <br />
          <button
            onClick={handleRetry}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry Camera
          </button>
        </>
      );
    }
    if (uploadError) {
      return <span className="text-red-500">{uploadError}</span>;
    }
    switch (scanStatus) {
      case "initializing":
        return "Initializing QR scanner...";
      case "scanning":
        return "Position the QR code within the frame or upload an image";
      case "success":
        return "QR code scanned successfully!";
      case "error":
        return "Error scanning QR code. Please try again.";
      default:
        return "Position the QR code within the frame or upload an image";
    }
  };

  if (!isInitialized) {
    return (
      <div ref={containerRef} className="w-full h-64 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
        <div id="qr-reader" className="w-full h-full"></div>
        <div className="absolute text-center text-gray-500 w-full">
          {getStatusMessage()}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          Upload QR Image
        </button>
        <div id="qr-upload-temp" style={{ display: "none" }}></div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      <div id="qr-reader" className="w-full"></div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        Upload QR Image
      </button>
      <div className={`mt-4 text-center text-sm ${
        scanStatus === "error" || cameraError || uploadError ? "text-red-500" :
        scanStatus === "success" ? "text-green-500" :
        "text-gray-500"
      }`}>
        {getStatusMessage()}
      </div>
      <div id="qr-upload-temp" style={{ display: "none" }}></div>
    </div>
  );
}