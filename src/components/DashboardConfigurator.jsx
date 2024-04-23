import './DashboardConfigurator.css'
import { useState } from 'react';

const DashboardConfigurator = ({ initialPreference, preferenceCallback }) => {

  const [localPreferences, setLocalPreferences] = useState(initialPreference);

  const savePreferences = (e) => {
    e.preventDefault();
    preferenceCallback(localPreferences);
  }

  return (
    <div className="configurator-wrapper" style={{
      position: 'fixed',
      top: '75px', // to make sure it's below the nav bar
      right: '10px',
      zIndex: '1000',
    }}>
      <form onSubmit={savePreferences}>
        <label for="colorpicker">Select background color:</label>
        <input type="color" id="colorpicker" name="colorpicker" value={localPreferences.color} onChange={(e) => (setLocalPreferences({ ...localPreferences, color: e.target.value }))} />
        <button type="submit">Apply</button>
      </form>
    </div>
  )
}

export default DashboardConfigurator;