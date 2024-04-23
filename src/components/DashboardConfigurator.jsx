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
      top: '100px', // to make sure it's below the nav bar
      right: '40px',
      zIndex: '1000',
    }}>
      <form onSubmit={savePreferences}>
        <label for="colorpicker">Select background color:&nbsp;&nbsp;</label>
        <input type="color" id="colorpicker" name="colorpicker" value={localPreferences.color} onChange={(e) => (setLocalPreferences({ ...localPreferences, color: e.target.value }))} />
        &nbsp;&nbsp;&nbsp;<button type="submit">Apply</button>
      </form>
    </div>
  )
}

export default DashboardConfigurator;