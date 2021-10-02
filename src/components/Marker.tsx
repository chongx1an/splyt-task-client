import * as React from "react";
import { transform } from "typescript";

interface Props {
    src: string;
    lat: number;
    lng: number;
    size?: number;
    bearing?: number;
};

const Marker: React.FC<Props> = ({ src, lat, lng, size = 10, bearing = 0 }) => {
    return (
        <img className={`w-${size} h-${size} rounded`} style={{ transform: `rotate(${bearing}deg)` }} src={src} alt=""></img>
    );
}

export default Marker;
