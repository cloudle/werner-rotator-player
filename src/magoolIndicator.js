import { h, Component } from 'preact';

export class MagoolIndicator extends Component {
	render() {
		const color = this.props.color || '#ffffff',
			size = this.props.size || 15,
			spacing = this.props.spacing || 15,
			wrapperStyle = { width: size + spacing, height: size + spacing },
			activeStyle = this.props.active ? {
				transform: this.props.direction.indexOf('row') >= 0
					? 'scale3d(1, 2, 1)' : 'scale3d(2, 1, 1)',
				opacity: 1,
			} : {},
			innerStyle = {
				transition: 'transform 0.3s',
				opacity: 0.75,
				backgroundColor: color,
				...getSizingStyle(this.props.direction, size),
				...activeStyle,
			};

		return <div style={wrapperStyle}>
			<div style={innerStyle}/>
		</div>;
	}
}

function getSizingStyle(direction = 'row', size) {
	if (direction.indexOf('row') >= 0) {
		return { height: size, width: 2, };
	} else {
		return { height: 2, width: size, };
	}
}

export default MagoolIndicator;