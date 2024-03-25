import './DashboardConfigurator.css'
import {useState} from 'react';

const DashboardConfigurator = ({initialPreference, preferenceCallback}) => {

  const [localPreferences, setLocalPreferences] = useState(initialPreference);
  
  const savePreferences = (e) => {
    e.preventDefault();
    preferenceCallback(localPreferences);
  }

  return (
    <div className="configurator-wrapper"> 
      <form onSubmit={savePreferences}>
        <label for="colorpicker">Select background color:</label>
        <input type="color" id="colorpicker" name="colorpicker" value={localPreferences.color} onChange={(e)=>(setLocalPreferences({...localPreferences, color:e.target.value}))}/>
        <button type="submit">Apply</button>
      </form>
    </div>
  )
}

export default DashboardConfigurator;