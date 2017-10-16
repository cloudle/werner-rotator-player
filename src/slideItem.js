import { h, Component } from 'preact';

export default class SlideItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			height: 300,
		};
	}

	componentDidMount() {
		this.injectScript();
	}

	render() {
		const containerStyle = { ...styles.container, ...this.props.wrapperStyle};

		return <div
			ref={this.props.containerRef}
			style={containerStyle}>
			<div
				ref={(instance) => { this.scriptContainer = instance; }}
				id={`${this.props.name}_hype_container`}/>
		</div>;
	}

	injectScript = () => {
		const script = document.createElement('script');
		script.src = this.props.url;
		while (script.firstChild) {
			script.removeChild(script.firstChild);
		}
		this.scriptContainer.appendChild(script);

		this.layoutInterval = setInterval(() => this.initializeHypeLayout(), 1000);
	};

	initializeHypeLayout = () => {
		if (!global.HYPE || !this.container) return;

		this.container.measure((ox, oy, width, height, px, py) => {
			if (this.layoutInterval) clearInterval(this.layoutInterval);

			const hypeDocuments = global.HYPE.documents,
				extractedName = extractHypeNameFromUrl(this.props.url),
				hypeInstance = hypeDocuments[extractedName] || hypeDocuments[this.props.name],
				currentLayoutName = hypeInstance.currentLayoutName(),
				currentSceneName = hypeInstance.currentSceneName(),
				layouts = hypeInstance.layoutsForSceneNamed(currentSceneName),
				currentScene = layouts.find(layout => layout.name === currentLayoutName),
				widthRatio = width / currentScene.width;

			this.setState({ height: currentScene.height * widthRatio });
			hypeInstance.relayoutIfNecessary && hypeInstance.relayoutIfNecessary();
			currentScene.widthRatioToContainer = widthRatio;
		});
	};
}

function extractHypeNameFromUrl(url) {
	const endIndex = url.indexOf('.hyperesources/'),
		startIndex = url.lastIndexOf('/', endIndex) + 1;

	return url.substring(startIndex, endIndex);
}

const styles = {
	container: {

	},
};