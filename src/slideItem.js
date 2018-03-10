import { h, Component } from 'preact';
import { isUri } from 'valid-url';

export default class SlideItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasValidLink: isUri(this.props.externalLink),
		};
	}

	componentDidMount() {
		this.injectScript();
	}

	render() {
		const cursorStyle = this.state.hasValidLink ? { cursor: 'pointer' } : {},
			containerStyle = { ...styles.container, ...cursorStyle, ...this.props.wrapperStyle};

		return <div
			ref={this.props.containerRef}
			style={containerStyle}
			onClick={this.onSlideClick}>
			<div
				ref={(instance) => { this.scriptContainer = instance; }}
				id={`${this.props.name}_hype_container`}/>
		</div>;
	}

	onSlideClick = () => {
		if (this.state.hasValidLink) {
			window.open(this.props.externalLink, this.props.externalLinkType || '_blank');
		}
	};

	injectScript = () => {
		const script = document.createElement('script');
		script.src = this.props.url;
		while (script.firstChild) {
			script.removeChild(script.firstChild);
		}
		this.scriptContainer.appendChild(script);
	};
}

const styles = {
	container: {

	},
};