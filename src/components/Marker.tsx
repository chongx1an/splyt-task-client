import * as React from "react";

interface Props {
    imageSrc: string;
    lat: number;
    lng: number;
};

class Marker extends React.Component<Props> {

    render() {
        return (
            <img src={this.props.imageSrc} alt="" />
        );
    }
}

export default Marker;