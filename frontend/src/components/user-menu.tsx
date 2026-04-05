"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

interface UserMenuProps {
  name: string | null;
  email: string | null;
}

export function UserMenu({ name, email }: UserMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleLogout = async () => {
    setLoading(true);
    await authClient.signOut();
    window.location.href = "/";
  };

  const handleUpdateProfile = async () => {
    if (profileData.newPassword && profileData.currentPassword) {
      if (profileData.newPassword !== profileData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      try {
        const { error } = await authClient.changePassword({
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword,
        });
        if (error) {
          alert(error.message || "Failed to change password");
          return;
        }
      } catch (err: any) {
        alert(err?.message || "Failed to change password");
        return;
      }
    }

    if (profileData.name !== name) {
      try {
        const { error } = await authClient.updateUser({ name: profileData.name });
        if (error) {
          alert(error.message || "Failed to update name");
          return;
        }
      } catch (err: any) {
        alert(err?.message || "Failed to update name");
        return;
      }
    }

    alert("Profile updated successfully");
    setShowProfile(false);
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 px-4 py-3 w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
          {name?.charAt(0) || "U"}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium truncate">{name || "User"}</p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </button>

      {showMenu && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-zinc-900 border rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => {
              setShowMenu(false);
              setShowProfile(true);
            }}
            className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>⚙️</span>
            <span className="text-sm">Edit Profile</span>
          </button>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-red-500"
          >
            <span>🚪</span>
            <span className="text-sm">{loading ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                  placeholder="Required to change password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={profileData.newPassword}
                  onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                  placeholder="Leave empty to keep current"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowProfile(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}