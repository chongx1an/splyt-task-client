import * as React from "react";

interface Props {
    message: string;
};

interface State {
    count: number;
};

class Panel extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { count: 0 };
    }

    render() {
        return (
            <div>
                {this.props.message} {this.state.count}
            </div>
        );
    }
}

export default Panel;