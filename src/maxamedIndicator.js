import { h, Component } from 'preact';

export class MaxamedIndicator extends Component {
	render() {
		const color = this.props.color || '#ffffff',
			size = this.props.size || 15,
			spacing = this.props.spacing || 15,
			borderRadius = this.props.radius || size / 2,
			defaultThickness = this.props.defaultThickness || 1,
			activeThickness = this.props.activeThickness || 1,
			wrapperStyle = {
				width: size + spacing, height: size + spacing,
				display: 'flex', alignItems: 'center', justifyContent: 'center',
			},
			activeStyle = this.props.active ? {
				borderWidth: activeThickness,
				transform: 'scale3d(1.75, 1.75, 1)',
				opacity: 1,
			} : {},
			innerStyle = {
				transition: 'all 0.3s', cursor: 'pointer',
				boxSizing: 'border-box',
				borderStyle: 'solid', borderWidth: defaultThickness + 5, borderColor: color,
				width: size, height: size, borderRadius, opacity: 0.75,
				...activeStyle,
			};

		return <div style={wrapperStyle}>
			<div style={innerStyle}/>
		</div>;
	}
}

export default MaxamedIndicator;