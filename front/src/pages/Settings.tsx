import React from "react";

const Settings: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-blue-900">Settings</h2>
    <p className="text-gray-800">Change your application preferences and user profile settings here.</p>
    <div className="bg-white p-4 rounded shadow max-w-md">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-900">Username</label>
          <input type="text" className="mt-1 block w-full border border-blue-300 rounded px-3 py-2" value="User" readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-900">Email</label>
          <input type="email" className="mt-1 block w-full border border-blue-300 rounded px-3 py-2" value="user@example.com" readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-900">Theme</label>
          <select className="mt-1 block w-full border border-blue-300 rounded px-3 py-2">
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Save Changes</button>
      </form>
    </div>
  </div>
);

export default Settings;
