"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/stores/useAppStore"
import { updatePassword, deleteAccount, logout } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User, Lock, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function AccountPage() {
  const router = useRouter()
  const { user, logoutUser } = useAppStore()

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  })
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  const handleUpdatePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill in all fields")
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }

    try {
      setIsUpdatingPassword(true)
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      toast.success("Password updated successfully")
      setShowPasswordDialog(false)
      setPasswordForm({ currentPassword: "", newPassword: "" })
    } catch (error: any) {
      toast.error(error.message || "Failed to update password")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true)
      await deleteAccount()
      await logout()
      logoutUser()
      toast.success("Account deleted successfully")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account")
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Profile Section */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-medium">Profile</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">Security</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your password to keep your account secure
          </p>

          <div className="mt-6">
            <Button onClick={() => setShowPasswordDialog(true)}>
              Update Password
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-lg border border-destructive/50 bg-card p-6">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <h2 className="text-lg font-medium text-destructive">
              Danger Zone
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Once you delete your account, there is no going back
          </p>

          <div className="mt-6">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Update Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">
                New Password (min 8 characters)
              </Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false)
                setPasswordForm({ currentPassword: "", newPassword: "" })
              }}
              disabled={isUpdatingPassword}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all associated data
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border-2 border-destructive bg-destructive/10 p-4">
            <p className="font-medium text-destructive">
              This action cannot be undone
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              All your things will be permanently deleted
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeletingAccount}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}