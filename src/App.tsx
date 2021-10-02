import * as React from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';
import Marker from './components/Marker';
import { getDistance } from 'geolib'
import Origin from './interfaces/origin.interface';
import Driver from './interfaces/driver.interface';
import Panel from './components/Panel';

const App: React.FC = () => {

  const origins: Origin[] = [
    {
      icon: "🇸🇬",
      name: "Singapore",
      latitude: 1.285194,
      longitude: 103.8522982
    },
    {
      icon: "🇬🇧",
      name: "London",
      latitude: 51.5049375,
      longitude: -0.0964509
    }
  ];

  const [currentOrigin, setCurrentOrigin] = React.useState<Origin>(origins[0]);
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [mapZoom, setMapZoom] = React.useState<number>(14);


  React.useEffect(() => {

    navigator.geolocation.getCurrentPosition(function (position) {

      const nearestOrigin = findNearestOrigin(position.coords);

      setCurrentOrigin(nearestOrigin);

    });
  }, []);

  const findNearestOrigin = (coords: { latitude: number, longitude: number }): Origin => {

    let shortest: number = Number.MAX_SAFE_INTEGER;
    let nearest: Origin = origins[0];

    origins.forEach(origin => {

      const distance = getDistance(coords, origin)

      if (distance < shortest) {
        shortest = distance;
        nearest = origin;
      }

    })

    return nearest;
  }

  return (
    <div className="w-screen h-screen flex items-center">

      <div className="flex-grow h-screen flex justify-center items-center">
        <Panel
          origins={origins}
          currentOrigin={currentOrigin}
          setDrivers={setDrivers}
          setCurrentOrigin={setCurrentOrigin}
          setMapZoom={setMapZoom}
        ></Panel >
      </div >

      <div className="my-10" style={{ height: '100vh', width: '60%', borderRadius: "100px" }}>
        {
          currentOrigin && process.env.REACT_APP_GOOGLE_MAP_KEY &&
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_KEY }}
            center={{ lat: currentOrigin.latitude, lng: currentOrigin.longitude }}
            zoom={mapZoom}
          >
            <Marker
              lat={currentOrigin.latitude}
              lng={currentOrigin.longitude}
              src={require("./assets/office.png").default}
            ></Marker>
            {
              drivers.map(driver => {
                return (
                  <Marker
                    key={driver.driver_id}
                    lat={driver.location.latitude}
                    lng={driver.location.longitude}
                    src={require("./assets/car.png").default}
                    size={20}
                    bearing={driver.location.bearing}>
                  </Marker>);
              })
            }
          </GoogleMapReact>
        }
      </div>

    </div >

  );

}

export default App;
