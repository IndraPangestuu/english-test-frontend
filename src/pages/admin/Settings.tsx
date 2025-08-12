import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../../api/setting';
import Loader from '../../components/Loader';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then((data) => setSettings(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    await updateSettings(settings);
    alert('Settings updated!');
  }

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">System Settings</h1>
      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block mb-1">Theme</label>
          <select
            value={settings.theme || 'light'}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
            className="border px-3 py-2 rounded"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="high-contrast">High Contrast</option>
          </select>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

