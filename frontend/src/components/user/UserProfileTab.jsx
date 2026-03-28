import React from "react";
import Button from "../common/Button";
import InputField from "../common/InputField";
import { Camera, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const UserProfileTab = ({
  userInfo,
  name,
  setName,
  phone,
  setPhone,
  profileImage,
  setProfileImage,
  imagePreview,
  setImagePreview,
  handleProfileUpdate,
  profileLoading,
  profileSuccess,
  profileError,
}) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto transition-colors duration-300">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Profile Settings</h2>

      {profileSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl flex items-center gap-3 mb-6 border border-emerald-100 dark:border-emerald-900/50">
          <CheckCircle size={20} className="flex-shrink-0" />
          <p className="font-semibold text-sm">Profile updated successfully!</p>
        </div>
      )}

      {profileError && (
        <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-4 rounded-2xl flex items-center gap-3 mb-6 border border-rose-100 dark:border-rose-900/50">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p className="font-semibold text-sm">{profileError}</p>
        </div>
      )}

      <form onSubmit={handleProfileUpdate} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-800">
              {imagePreview || userInfo?.profileImage ? (
                <img
                  src={imagePreview || userInfo?.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-300 dark:text-slate-600">
                  {name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 group-hover:scale-110"
            >
              <Camera size={14} />
            </label>
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-slate-900 dark:text-white">Profile Picture</h4>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              JPG, GIF or PNG. 1MB max.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jane Doe"
            required
          />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={userInfo?.email || ""}
            readOnly
            className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 opacity-60"
          />
          <div className="md:col-span-2">
            <InputField
              label="Phone Number"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={profileLoading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {profileLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileTab;
