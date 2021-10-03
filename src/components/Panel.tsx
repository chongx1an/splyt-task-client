import axios from "axios"
import * as React from "react"
import ReactSlider from "react-slider"
import useInterval from "../hooks/useInterval"
import Driver from "../interfaces/driver.interface"
import Origin from "../interfaces/origin.interface"
import "./Panel.css"
interface Props {
  origins: Origin[]
  currentOrigin: Origin
  setDrivers: Function
  setCurrentOrigin: Function
  setMapZoom: Function
  getNearestOrigin: Function
}

interface ApiSuccessResponse {
  pickup_eta: number
  drivers: Driver[]
}

const Panel: React.FC<Props> = ({ origins, currentOrigin, setDrivers, setCurrentOrigin, setMapZoom, getNearestOrigin }) => {

  const [numOfDriver, setNumOfDriver] = React.useState<number>(10)
  const [errorMessage, setErrorMessage] = React.useState<String>()
  const [isSearched, setIsSearched] = React.useState<boolean>(false)

  const relocateToNearest = () => {
    const nearest: Origin = getNearestOrigin()
    setCurrentOrigin(nearest)
  }

  const search = async () => {

    if (!currentOrigin) return

    setErrorMessage("")
    setIsSearched(true)

    const query = new URLSearchParams({
      latitude: `${currentOrigin.latitude}`,
      longitude: `${currentOrigin.longitude}`,
      count: `${numOfDriver}`
    })

    try {
      const response = await axios.get<ApiSuccessResponse>(`${process.env.REACT_APP_API_URL}/drivers?${query.toString()}`)
      setDrivers(response.data.drivers)
    } catch (error) {
      setErrorMessage("Something went wrong, please try again later.")
    }


    setCurrentOrigin({
      icon: "",
      name: "",
      latitude: currentOrigin.latitude - 0.00001,
      longitude: currentOrigin.longitude - 0.00001,
    })

    setCurrentOrigin(currentOrigin)

    setMapZoom(13.9)
    setMapZoom(14)

  }

  useInterval(() => {
    if (isSearched) search()
  }, 15000) // 15s


  return (
    <div className="mx-10">
      <label className=" font-bold">Origin</label>
      <div>
        {
          origins.map((origin, i) => {
            return (
              <button
                key={i}
                className={currentOrigin?.name === origin.name ? "px-10 py-3 bg-black text-white rounded my-2" : "px-10 py-3 bg-gray-100 rounded my-2 hover:bg-gray-200"}
                onClick={() => setCurrentOrigin(origin)}>
                {origin.icon} {origin.name}
              </button>)
          })
        }
      </div>
      <div className="mb-10 flex justify-end items-center text-sm text-gray-500 hover:text-black cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p onClick={relocateToNearest}>Use nearest</p>
      </div>

      <label className="font-bold">Number of taxis</label>
      <div className="mt-3">
        <ReactSlider
          max={20}
          min={5}
          defaultValue={10}
          onAfterChange={(value) => setNumOfDriver(value)}
          renderThumb={(props, state) => <div {...props} className="bg-black h-6 w-6 rounded-md text-white font-bold text-sm flex items-center justify-center cursor-pointer">{state.value}</div>}
          renderTrack={(props) => <div {...props} className="bg-gray-100 h-2 transform translate-y-2 rounded-xl"></div>}
        />
      </div>

      <button className="mt-20 px-10 py-3 bg-gray-100 rounded my-2 w-full hover:bg-gray-200" onClick={search}>Search</button>

      {
        errorMessage &&
        <div
          className="absolute top-0 z-10 mt-5 px-5 py-3 bg-red-100 rounded m-2 text-red-500 flex justify-between">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">{errorMessage}</p>
        </div>
      }
    </div>

  )

}

export default Panel