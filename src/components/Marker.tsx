import * as React from "react";

interface Props {
    src: string;
    lat: number;
    lng: number;
    size?: number;
    bearing?: number;
};

const Marker: React.FC<Props> = ({ src, size = 10, bearing = 0 }) => {
    return (
        <div className="filter drop-shadow-sm">
            <img className={`filter drop-shadow-sm w-${size} h-${size} rounded`} style={{ transform: `rotate(${bearing}deg)` }} src={src} alt=""></img>
        </div>
    );
}

export default Marker;
