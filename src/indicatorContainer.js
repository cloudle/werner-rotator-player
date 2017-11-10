import { h, Component } from 'preact';

import MaxamedIndicator from './maxamedIndicator';
import UbaxIndicator from './ubaxIndicator';
import MagoolIndicator from './magoolIndicator';

export default class IndicatorContainer extends Component {
	render() {
		const containerStyle = {
			display: 'flex', alignItems: 'center',
			position: 'absolute', zIndex: 11,
			...getSnappingStyles(this.props.snapping, this.props.direction, this.props.padding),
		};

		return <div style={containerStyle}>
			{this.props.slides.map((item, i) => {
				const isActive = this.props.activeIndex === i;

				return <MagoolIndicator
					key={i}
					active={isActive}
					direction={this.props.direction}
					color={this.props.indicatorColor}
					size={this.props.indicatorSize}
					spacing={this.props.indicatorSpacing}/>;
			})}
		</div>;
	}
}

function getSnappingStyles(snapping, direction = 'row', padding = 20) {
	switch(snapping) {
	case 'left':
		return { top: '50%', left: padding, flexDirection: direction, transform: 'translate(0, -50%)', };
	case 'right':
		return { top: '50%', right: padding, flexDirection: direction, transform: 'translate(0, -50%)', };
	case 'top-left':
		return { top: padding, left: padding, flexDirection: direction, };
	case 'top-right':
		return { top: padding, right: padding, flexDirection: direction, };
	case 'bottom-left':
		return { bottom: padding, left: padding, flexDirection: direction, };
	case 'bottom-right':
		return { bottom: padding, right: padding, flexDirection: direction, };
	case 'top':
		return { top: padding, left: '50%', flexDirection: direction, transform: 'translate(-50%, 0)', };
	default:
		return { bottom: padding, left: '50%', flexDirection: direction, transform: 'translate(-50%, 0)', };
	}
}