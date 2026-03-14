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
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
            <ShieldCheck className="text-indigo-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Security Settings
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-0.5">
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
      <div className="bg-rose-50/50 rounded-3xl p-8 border border-rose-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
            <LogOut className="text-rose-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-rose-900 tracking-tight">
              Sign Out
            </h3>
            <p className="text-rose-700/70 text-sm font-medium mt-0.5">
              Securely sign out of your current session.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white rounded-2xl border border-rose-200 shadow-sm">
          <div className="text-sm font-medium text-slate-600">
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
