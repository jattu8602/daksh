'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Mail,
  Phone,
  Lock,
  Upload,
  Eye,
  EyeOff,
  Check,
  X,
  Shield,
  Users,
  Activity,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function AdminSettings() {
  // Profile state
  const [profile, setProfile] = useState(null)
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    profileImage: '',
  })
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Email verification state
  const [emailVerification, setEmailVerification] = useState({
    newEmail: '',
    otp: '',
    isVerifying: false,
    otpSent: false,
    isVerifyingOtp: false,
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // All admins state
  const [allAdmins, setAllAdmins] = useState([])
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false)

  // File upload ref
  const fileInputRef = useRef(null)

  // Real-time admin list updates
  useEffect(() => {
    // Refresh admin list every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchAllAdmins()
    }, 30 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Fetch profile data
  useEffect(() => {
    fetchProfile()
    fetchAllAdmins()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile', {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        setProfile(data.admin)
        setProfileFormData({
          name: data.admin.name,
          username: data.admin.username,
          email: data.admin.email || '',
          phone: data.admin.phone || '',
          profileImage: data.admin.profileImage || '',
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    }
  }

  const fetchAllAdmins = async () => {
    setIsLoadingAdmins(true)
    try {
      const response = await fetch('/api/admin/all-admins', {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        setAllAdmins(data.admins)
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast.error('Failed to load admin list')
    } finally {
      setIsLoadingAdmins(false)
    }
  }

  // Handle profile image upload
  const handleImageUpload = async (file) => {
    if (!file) return

    try {
      // Get Cloudinary signature
      const signatureResponse = await fetch('/api/cloudinary/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: Math.round(new Date().getTime() / 1000),
        }),
      })

      const { signature, timestamp, apiKey, cloudName } =
        await signatureResponse.json()

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp)
      formData.append('api_key', apiKey)

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const uploadData = await uploadResponse.json()

      if (uploadData.secure_url) {
        setProfileFormData((prev) => ({
          ...prev,
          profileImage: uploadData.secure_url,
        }))
        toast.success('Image uploaded successfully')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    }
  }

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsUpdatingProfile(true)
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileFormData),
      })

      const data = await response.json()

      if (data.success) {
        setProfile(data.admin)
        toast.success('Profile updated successfully')
        if (profileFormData.email !== profile?.email) {
          setEmailVerification((prev) => ({
            ...prev,
            newEmail: profileFormData.email,
          }))
        }
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Handle email verification
  const handleSendOTP = async () => {
    if (!profile.email) {
      toast.error('No email address found in your profile')
      return
    }

    setEmailVerification((prev) => ({ ...prev, isVerifying: true }))
    try {
      const response = await fetch('/api/admin/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: profile.email }),
      })

      const data = await response.json()

      if (data.success) {
        setEmailVerification((prev) => ({
          ...prev,
          otpSent: true,
          isVerifying: false,
        }))
        toast.success('OTP sent to your email')
      } else {
        toast.error(data.error || 'Failed to send OTP')
        setEmailVerification((prev) => ({ ...prev, isVerifying: false }))
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast.error('Failed to send OTP')
      setEmailVerification((prev) => ({ ...prev, isVerifying: false }))
    }
  }

  const handleVerifyOTP = async () => {
    if (!emailVerification.otp) {
      toast.error('Please enter the OTP')
      return
    }

    setEmailVerification((prev) => ({ ...prev, isVerifyingOtp: true }))
    try {
      const response = await fetch('/api/admin/verify-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: profile.email,
          otp: emailVerification.otp,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Email verified successfully')
        setEmailVerification({
          newEmail: '',
          otp: '',
          isVerifying: false,
          otpSent: false,
          isVerifyingOtp: false,
        })
        fetchProfile() // Refresh profile to get updated verification status
      } else {
        toast.error(data.error || 'Failed to verify email')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast.error('Failed to verify email')
    } finally {
      setEmailVerification((prev) => ({ ...prev, isVerifyingOtp: false }))
    }
  }

  // Handle password change
  const handlePasswordChange = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error('All password fields are required')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }

    setIsChangingPassword(true)
    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passwordData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Password changed successfully')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        toast.error(data.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
      </div>

      {/* Profile and Password Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Section - 70% on large screens */}
        <Card className="flex-1 lg:w-[70%]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileFormData.profileImage} />
                <AvatarFallback className="text-lg">
                  {profile.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileFormData.name}
                  onChange={(e) =>
                    setProfileFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profileFormData.username}
                  onChange={(e) =>
                    setProfileFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  Email Address
                  {profile.emailVerified && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {!profile.emailVerified && profile.email && (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileFormData.email}
                  onChange={(e) =>
                    setProfileFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  value={profileFormData.phone}
                  onChange={(e) =>
                    setProfileFormData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            <Button
              onClick={handleProfileUpdate}
              disabled={isUpdatingProfile}
              className="w-full md:w-auto"
            >
              {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* Password Change Section - 30% on large screens */}
        <Card className="lg:w-[30%]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
              className="w-full"
            >
              {isChangingPassword ? 'Changing Password...' : 'Change Password'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Email Verification Section */}
      {profile.email && !profile.emailVerified && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Your email address is not verified. Please verify to receive
                important notifications.
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Email to verify:</p>
                <p className="font-medium">{profile.email}</p>
              </div>

              {!emailVerification.otpSent ? (
                <Button
                  onClick={handleSendOTP}
                  disabled={emailVerification.isVerifying}
                  className="w-full"
                >
                  {emailVerification.isVerifying
                    ? 'Sending OTP...'
                    : 'Send OTP to Email'}
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    OTP sent to {profile.email}. Please check your email.
                  </p>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter 6-digit OTP"
                      value={emailVerification.otp}
                      onChange={(e) =>
                        setEmailVerification((prev) => ({
                          ...prev,
                          otp: e.target.value,
                        }))
                      }
                      maxLength={6}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={emailVerification.isVerifyingOtp}
                    >
                      {emailVerification.isVerifyingOtp
                        ? 'Verifying...'
                        : 'Verify'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Admins Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Admins
          </CardTitle>
          <Button
            variant="outline"
            onClick={fetchAllAdmins}
            disabled={isLoadingAdmins}
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            {isLoadingAdmins ? 'Refreshing...' : 'Refresh'}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingAdmins ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {allAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={admin.profileImage} />
                        <AvatarFallback>
                          {admin.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          admin.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{admin.name}</h4>
                        <Badge
                          variant={
                            admin.role === 'SUPER_ADMIN'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {admin.role === 'SUPER_ADMIN'
                            ? 'Super Admin'
                            : 'Admin'}
                        </Badge>
                        {admin.emailVerified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">@{admin.username}</p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                      {admin.phone !== 'Not provided' && (
                        <p className="text-sm text-gray-500">{admin.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          admin.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {admin.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Last active: {admin.lastActive}
                    </p>
                  </div>
                </div>
              ))}

              {allAdmins.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No admins found.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
