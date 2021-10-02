import * as React from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';
import Marker from './components/Marker';
import { getDistance } from 'geolib'
import ReactSlider from 'react-slider'

interface Origin {
  icon: string;
  name: string;
  latitude: number;
  longitude: number;
}

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

  const [currentOrigin, setCurrentOrigin] = React.useState<Origin | null>()

  React.useEffect(() => {

    console.log(process.env.REACT_APP_GOOGLE_MAP_KEY)
    navigator.geolocation.getCurrentPosition(function (position) {

      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);

      const nearestOrigin = findNearestOrigin(position.coords);

      setCurrentOrigin(nearestOrigin);

    });
  }, []);

  function findNearestOrigin(coords: { latitude: number, longitude: number }): Origin {

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

  function search() {

  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex-grow">
        <div className="m-20">
          <label className="ml-3 font-bold">Origin</label>
          <div>
            {
              origins.map((origin, i) => {
                return <button key={i} className={currentOrigin?.name === origin.name ? "px-12 py-3 bg-black text-white rounded m-2" : "px-12 py-3 bg-gray-100 rounded m-2 hover:bg-gray-200"} onClick={() => setCurrentOrigin(origin)}>{origin.icon} {origin.name}</button>;
              })
            }
          </div>
          <div className="mt-5"></div>
          <label className="ml-3 font-bold">Number of taxis</label>
          <div className="ml-3 mt-3">
            <ReactSlider
              max={20}
              min={5}
              defaultValue={10}
              renderThumb={(props, state) => <div {...props} className="bg-black h-6 w-6 rounded-md text-white font-bold text-sm flex items-center justify-center cursor-pointer">{state.value}</div>}
              renderTrack={(props, state) => <div {...props} className="bg-gray-100 h-2 transform translate-y-2 rounded-xl"></div>}
            />
          </div>

          <button className="mt-20 px-10 py-3 bg-gray-100 rounded m-2 w-full hover:bg-gray-200" onClick={search}>Search</button>
        </div>

      </div>
      <div className="mx-20 my-10" style={{ height: '80vh', width: '50%', borderRadius: "100px" }}>
        {
          currentOrigin && process.env.REACT_APP_GOOGLE_MAP_KEY &&
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_KEY }}
            defaultCenter={{ lat: currentOrigin.latitude, lng: currentOrigin.longitude }}
            center={{ lat: currentOrigin.latitude, lng: currentOrigin.longitude }}
            defaultZoom={12}
          >
            <Marker lat={currentOrigin.latitude} lng={currentOrigin.longitude} imageSrc=""></Marker>
          </GoogleMapReact>
        }

      </div>

    </div>

  );

}

export default App;
