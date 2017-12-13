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
		if (!global.HYPE || !this.scriptContainer) return;
		/* clear the initial layout watch.. */
		if (this.layoutInterval) clearInterval(this.layoutInterval);

		const { clientHeight, clientWidth } = this.scriptContainer,
			hypeDocuments = global.HYPE.documents,
			extractedName = extractHypeNameFromUrl(this.props.url),
			hypeInstance = hypeDocuments[extractedName] || hypeDocuments[this.props.name];

		if (!hypeInstance) {
			console.log(`[WernerPlayer] cannot find hype of name: ${this.props.name}`);
			return;
		}

		const setupLayout = () => {
			const currentLayoutName = hypeInstance.currentLayoutName(),
				currentSceneName = hypeInstance.currentSceneName(),
				layouts = hypeInstance.layoutsForSceneNamed(currentSceneName),
				currentScene = find(layouts, layout => layout.name === currentLayoutName),
				widthRatio = clientWidth / currentScene.width;

			if (this.props.onHypeLayout) this.props.onHypeLayout({
				sceneWidth: currentScene.width,
				sceneHeight: currentScene.height,
			});

			this.setState({ height: currentScene.height * widthRatio });
			hypeInstance.relayoutIfNecessary && hypeInstance.relayoutIfNecessary();
			currentScene.widthRatioToContainer = widthRatio;
		};

		setupLayout();

		/* register HypeSceneLoad!! which re-triggered when a scene load
		 * (responsive layout change also load new scene!) */
		if (!global.HYPE_eventListeners) {
			global.HYPE_eventListeners = [];
		} else {
			global.HYPE_eventListeners.push({ type: 'HypeSceneLoad', callback: setupLayout });
		}
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

function find(array, predicate) {
	for (const item of array) {
		if (predicate(item)) return item;
	}

	return undefined;
}