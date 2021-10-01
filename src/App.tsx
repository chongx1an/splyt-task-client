import * as React from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';
import Marker from './components/Marker';

interface Origin {
  name: string;
  latitude: number;
  longitude: number;
}

const App = () => {

  const origin: Origin[] = [
    {
      name: "Singapore",
      latitude: 1.285194,
      longitude: 103.8522982
    },
    {
      name: "London",
      latitude: 51.5049375,
      longitude: -0.0964509
    }
  ];


  const [currentOrigin, setCurrentOrigin] = React.useState<Origin>(origin[0])

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyBvE6P-KbxN6v27WvLTnZKD-9uZ3e8_4Rc" }}
        defaultCenter={{ lat: currentOrigin.latitude, lng: currentOrigin.longitude }}
        defaultZoom={11}
      >
      </GoogleMapReact>
    </div>
  );
}

export default App;
