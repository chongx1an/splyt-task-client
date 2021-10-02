import * as React from "react";

interface Props {
    imageSrc: string;
    lat: number;
    lng: number;
};

class Marker extends React.Component<Props> {

    render() {
        return (
            <img src="https://pbs.twimg.com/profile_images/841672289460592641/uuwofC-5.jpg" style={{ height: "20px" }}></img>
        );
    }
}

export default Marker;