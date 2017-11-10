import { h, Component } from 'preact';

export class MaxamedIndicator extends Component {
	render() {
		const color = this.props.color || '#ffffff',
			size = this.props.size || 15,
			spacing = this.props.spacing || 15,
			borderRadius = this.props.radius || size / 2,
			defaultThickness = this.props.defaultThickness || 1,
			activeThickness = this.props.activeThickness || 1,
			wrapperStyle = { width: size + spacing, height: size + spacing },
			activeStyle = this.props.active ? {
				boxShadow: `inset 0 0 0 ${activeThickness}px ${color}`,
				transform: 'scale3d(1.75, 1.75, 1)',
				opacity: 1,
			} : {},
			innerStyle = {
				transition: 'transform 0.3s, box-shadow 0.3s',
				boxShadow: `inset 0 0 0 ${defaultThickness}px ${color}`,
				width: size, height: size, borderRadius, opacity: 0.75,
				...activeStyle,
			};

		return <div style={wrapperStyle}>
			<div style={innerStyle}/>
		</div>;
	}
}

export default MaxamedIndicator;