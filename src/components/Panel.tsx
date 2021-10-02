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

interface ListDriversResponse {
    pickup_eta: number,
    drivers: Driver[]
}

const Panel: React.FC<Props> = ({ origins, currentOrigin, setDrivers, setCurrentOrigin, setMapZoom }) => {

    const [numOfDriver, setNumOfDriver] = React.useState<Number>(10);

    const search = async () => {

        if (!currentOrigin) return;

        const query = new URLSearchParams({
            latitude: `${currentOrigin.latitude}`,
            longitude: `${currentOrigin.longitude}`,
            count: `${numOfDriver}`
        })

        const response = await axios.get<ListDriversResponse>(`${process.env.REACT_APP_API_URL}/drivers?${query.toString()}`);

        setCurrentOrigin({
            icon: "",
            name: "",
            latitude: currentOrigin.latitude - 0.00001,
            longitude: currentOrigin.longitude - 0.00001,
        });

        setCurrentOrigin(currentOrigin);

        setMapZoom(13.9)
        setMapZoom(14)

        setDrivers(response.data.drivers);

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
                    onAfterChange={(value, index) => setNumOfDriver(value)}
                    renderThumb={(props, state) => <div {...props} className="bg-black h-6 w-6 rounded-md text-white font-bold text-sm flex items-center justify-center cursor-pointer">{state.value}</div>}
                    renderTrack={(props, state) => <div {...props} className="bg-gray-100 h-2 transform translate-y-2 rounded-xl"></div>}
                />
            </div>

            <button className="mt-20 px-10 py-3 bg-gray-100 rounded m-2 w-full hover:bg-gray-200" onClick={search}>Search</button>
        </div>

    );

}

export default Panel;