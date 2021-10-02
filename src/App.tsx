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

  const getNearestOrigin = (): Origin => {

    let nearest: Origin = origins[0];

    navigator.geolocation.getCurrentPosition(function (position) {

      let shortest: number = Number.MAX_SAFE_INTEGER;

      origins.forEach(origin => {

        const distance = getDistance(position.coords, origin)

        if (distance < shortest) {
          shortest = distance;
          nearest = origin;
        }

      })
    });

    return nearest;

  }


  React.useEffect(() => {

    const nearest: Origin = getNearestOrigin();
    setCurrentOrigin(nearest);

  }, []);


  return (
    <div className="w-screen h-screen flex items-center">

      <div className="flex-grow h-screen flex justify-center items-center">
        <Panel
          origins={origins}
          currentOrigin={currentOrigin}
          setDrivers={setDrivers}
          setCurrentOrigin={setCurrentOrigin}
          setMapZoom={setMapZoom}
          getNearestOrigin={getNearestOrigin}
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
            <Marker
              lat={currentOrigin.latitude}
              lng={currentOrigin.longitude}
              src={require("./assets/office.png").default}
            ></Marker>
          </GoogleMapReact>
        }
      </div>

    </div >

  );

}

export default App;
