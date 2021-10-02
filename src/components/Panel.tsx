import axios from "axios";
import * as React from "react";
import ReactSlider from "react-slider";
import Driver from "../interfaces/driver.interface";
import Origin from "../interfaces/origin.interface";

interface Props {
    origins: Origin[]
    currentOrigin: Origin,
    setDrivers: Function,
    setCurrentOrigin: Function,
    setMapZoom: Function
};

interface ApiSuccessResponse {
    pickup_eta: number,
    drivers: Driver[]
}

const Panel: React.FC<Props> = ({ origins, currentOrigin, setDrivers, setCurrentOrigin, setMapZoom }) => {

    const [numOfDriver, setNumOfDriver] = React.useState<Number>(10);
    const [errorMessage, setErrorMessage] = React.useState<String>();

    const search = async () => {

        if (!currentOrigin) return;

        if (errorMessage) setErrorMessage("");

        const query = new URLSearchParams({
            latitude: `${currentOrigin.latitude}`,
            longitude: `${currentOrigin.longitude}`,
            count: `${numOfDriver}`
        })

        try {
            const response = await axios.get<ApiSuccessResponse>(`${process.env.REACT_APP_API_URL}/drivers?${query.toString()}`);
            setDrivers(response.data.drivers);
        } catch (error) {
            setErrorMessage("Something went wrong, please try again later.")
        }


        setCurrentOrigin({
            icon: "",
            name: "",
            latitude: currentOrigin.latitude - 0.00001,
            longitude: currentOrigin.longitude - 0.00001,
        });

        setCurrentOrigin(currentOrigin);

        setMapZoom(13.9)
        setMapZoom(14)

    }

    return (
        <div className="mx-10">
            <label className="ml-3 font-bold">Origin</label>
            <div className="mb-5">
                {
                    origins.map((origin, i) => {
                        return (
                            <button
                                key={i}
                                className={currentOrigin?.name === origin.name ? "px-12 py-3 bg-black text-white rounded m-2" : "px-12 py-3 bg-gray-100 rounded m-2 hover:bg-gray-200"}
                                onClick={() => setCurrentOrigin(origin)}>
                                {origin.icon} {origin.name}
                            </button>);
                    })
                }
            </div>
            <label className="ml-3 font-bold">Number of taxis</label>
            <div className="ml-3 mt-3">
                <ReactSlider
                    max={20}
                    min={5}
                    defaultValue={10}
                    onAfterChange={(value) => setNumOfDriver(value)}
                    renderThumb={(props, state) => <div {...props} className="bg-black h-6 w-6 rounded-md text-white font-bold text-sm flex items-center justify-center cursor-pointer">{state.value}</div>}
                    renderTrack={(props) => <div {...props} className="bg-gray-100 h-2 transform translate-y-2 rounded-xl"></div>}
                />
            </div>

            <button className="mt-20 px-10 py-3 bg-gray-100 rounded m-2 w-full hover:bg-gray-200" onClick={search}>Search</button>

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

    );

}

export default Panel;