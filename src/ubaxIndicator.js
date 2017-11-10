import { h, Component } from 'preact';
import MaxamedIndicator from './maxamedIndicator';

export class UbaxIndicator extends Component {
	render() {
		return <MaxamedIndicator
			{...this.props}
			spacing={this.props.spacing || 12}
			defaultThickness={2}
			activeThickness={2}
			radius={1} />;
	}
}

export default UbaxIndicator;