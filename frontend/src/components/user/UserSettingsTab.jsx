import { LogOut, ShieldCheck, Key } from "lucide-react";
import InputField from "../common/InputField";
import Button from "../common/Button";

const UserSettingsTab = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  handlePasswordUpdate,
  pwLoading,
  handleLogout,
}) => {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      {/* Security Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Security Settings
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">
              Update your password to keep your account secure.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              icon={Key}
              required
            />
            <InputField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              icon={Key}
              required
            />
          </div>
          <div className="pt-2">
            <Button
              type="submit"
              isLoading={pwLoading}
              className="px-8"
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-50/50 dark:bg-rose-950/10 rounded-3xl p-8 border border-rose-100 dark:border-rose-900/30 transition-colors duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <LogOut className="text-rose-600 dark:text-rose-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-rose-900 dark:text-rose-400 tracking-tight">
              Sign Out
            </h3>
            <p className="text-rose-700/70 dark:text-rose-300/50 text-sm font-medium mt-0.5">
              Securely sign out of your current session.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 text-center sm:text-left">
            You can always sign back in anytime.
          </div>
          <Button
            variant="danger"
            onClick={handleLogout}
            icon={LogOut}
            className="w-full sm:w-auto px-8"
          >
            Logout Securely
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsTab;
