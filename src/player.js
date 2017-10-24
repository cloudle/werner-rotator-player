import { h, Component } from 'preact';
import SlideItem from './slideItem';
import { TweenMax, Power3 } from 'gsap';

export default class Player extends Component {
	constructor(props) {
		super(props);

		this.slideRefs = {};
		this.state = {
			width: 0, height: 0,
			counter: 0,
			slideIndex: 0,
		};
	}

	componentDidMount() {
		this.onResize();
		window.addEventListener('resize', this.onResize);

		let slideIndex = 0;
		const { data = {}, slides } = this.props.configs,
			interval = data.interval || 6000,
			speed = data.speed || 3000,
			slideFrom = data.slideFrom || 'right',
			transition = data.transition || 'fade',
			tweenSpeed = speed / 1000;

		this.playingInterval = setInstantInterval(() => {
			if (slides.length === 1) return;

			const currentIndex = slideIndex,
				increasedIndex = currentIndex + 1,
				nextIndex = increasedIndex >= slides.length ? 0 : increasedIndex;

			if (transition === 'slide') {
				if (slideFrom === 'left') {
					TweenMax.fromTo(
						this.slideRefs[nextIndex],
						tweenSpeed,
						{ x: -this.state.width },
						{ x: 0, ease: Power3.easeInOut, });

					TweenMax.fromTo(
						this.slideRefs[currentIndex],
						tweenSpeed,
						{ x: 0, },
						{ x: this.state.width, ease: Power3.easeInOut, });
				} else {
					TweenMax.fromTo(
						this.slideRefs[nextIndex],
						tweenSpeed,
						{ x: this.state.width },
						{ x: 0, ease: Power3.easeInOut, });

					TweenMax.fromTo(
						this.slideRefs[currentIndex],
						tweenSpeed,
						{ x: 0, },
						{ x: -this.state.width, ease: Power3.easeInOut, });
				}
			} else {
				TweenMax.fromTo(
					this.slideRefs[nextIndex],
					tweenSpeed,
					{ opacity: 0, },
					{ opacity: 1, ease: Power3.easeIn, });

				TweenMax.fromTo(
					this.slideRefs[currentIndex],
					tweenSpeed,
					{ opacity: 1, },
					{ opacity: 0, ease: Power3.easeOut, delay: tweenSpeed / 2, });
			}

			slideIndex = nextIndex;
		}, interval);
	}

	componentWillUnmount() {
		this.playingInterval && clearInterval(this.playingInterval);
		window.removeEventListener('resize', this.onResize);
	}

	render() {
		return <div
			style={{
				position: 'relative', overflow: 'hidden',
				width: this.state.width, height: this.state.height }}>
			{this.renderSlides()}
		</div>;
	}

	renderSlides = () => {
		const { data, slides } = this.props.configs,
			defaultItemStyle = getDefaultItemStyle(this.props.configs.data);

		if (slides.length === 1) {
			const route = slides[0] || {}, { name, url } = route;
			return <SlideItem
				index={0} name={name} url={url}
				onHypeLayout={this.updateRatio}/>;
		} else if (slides.length >= 2) {
			return slides.map((slide, i) => {
				const { name, url } = slide;
				return <SlideItem
					containerRef={(instance) => { this.slideRefs[i] = instance } }
					wrapperStyle={{
						position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,
						...defaultItemStyle }}
					index={i} key={i} name={name} url={url}
					onHypeLayout={this.updateRatio}/>;
			});
		}
	};

	onResize = (e) => {
		const { clientWidth, clientHeight } = this.props.container;

		this.setState({
			width: clientWidth,
			height: clientWidth / this.state.widthRatio,
		})
	};

	updateRatio = ({ sceneWidth, sceneHeight }) => {
		const { clientWidth, clientHeight } = this.props.container,
			widthRatio = sceneWidth / sceneHeight;

		this.setState({ widthRatio, width: clientWidth, height: clientWidth / widthRatio });
	};
}

function getDefaultItemStyle(data = {}) {
	const slideFrom = data.slideFrom || 'right',
		transition = data.transition || 'fade';

	if (transition === 'slide') {
		if (slideFrom === 'left') {
			return { transform: 'translate(-100%, 0)' };
		} else {
			return { transform: 'translate(100%, 0)' };
		}
	} else {
		return { opacity: 0, }
	}
}

function setInstantInterval(functionRef, interval) {
	functionRef();
	return setInterval(functionRef, interval);
}