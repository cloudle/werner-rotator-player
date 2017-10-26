import { h, Component } from 'preact';
import SlideItem from './slideItem';
import gsap, { TweenMax, Power3 } from 'gsap';

const validEasings = [
	'Power0', 'Power1', 'Power2', 'Power3', 'Power4',
	'Back', 'Elastic', 'Bounce', 'Rough', 'SlowMo', 'Stepped', 'Circ', 'Expo', 'Sine'];

export default class Player extends Component {
	constructor(props) {
		super(props);

		this.slideRefs = {};
		this.state = {
			widthRatio: 0.5,
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
			speed = data.speed || 1000,
			slideFrom = data.slideFrom || 'right',
			transition = data.transition || 'fade',
			easing = generateEasing(data.easing, data.customEasing),
			tweenSpeed = speed / 1000;

		/* Make the first Item appear above
		 - by default last "absolute position" item will display above */
		TweenMax.set(this.slideRefs[slideIndex], { zIndex: 9 });

		this.playingInterval = setInstantInterval(() => {
			if (slides.length === 1) return;

			const currentIndex = slideIndex,
				increasedIndex = currentIndex + 1,
				nextIndex = increasedIndex >= slides.length ? 0 : increasedIndex;

			if (transition === 'slide') {
				this.playTransitionEffect(
					this.slideRefs[currentIndex],
					this.slideRefs[nextIndex],
					tweenSpeed, easing,
					slideFrom);
			} else if (transition === 'cube') {
				this.playCubeEffect(
					this.slideRefs[currentIndex],
					this.slideRefs[nextIndex],
					tweenSpeed, easing,
					slideFrom);
			} else {
				this.playFadeEffect(
					this.slideRefs[currentIndex],
					this.slideRefs[nextIndex],
					tweenSpeed, easing);
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
		const { data, slides } = this.props.configs;

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
						position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
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


	playFadeEffect = (currentElement, nextElement, speed, ease) => {
		TweenMax.fromTo(
			nextElement, speed,
			{ opacity: 0, zIndex: 9, },
			{ opacity: 1, ease: ease.easeIn, });

		TweenMax.fromTo(
			currentElement, speed,
			{ opacity: 1, zIndex: 8, },
			{ opacity: 0, ease: ease.easeOut, delay: speed / 2, });
	};

	playTransitionEffect = (currentElement, nextElement, speed, ease, slideFrom) => {
		const width = this.state.width,
			height = this.state.height;

		if (slideFrom === 'left') {
			TweenMax.fromTo(
				nextElement, speed,
				{ x: -width },
				{ x: 0, ease: ease.easeInOut, });

			TweenMax.fromTo(
				currentElement, speed,
				{ x: 0, },
				{ x: width, ease: ease.easeInOut, });
		} else if (slideFrom === 'top') {
			TweenMax.fromTo(
				nextElement, speed,
				{ y: -height },
				{ y: 0, ease: ease.easeInOut, });

			TweenMax.fromTo(
				currentElement, speed,
				{ y: 0, },
				{ y: height, ease: ease.easeInOut, });
		} else if (slideFrom === 'bottom') {
			TweenMax.fromTo(
				nextElement, speed,
				{ y: height },
				{ y: 0, ease: ease.easeInOut, });

			TweenMax.fromTo(
				currentElement, speed,
				{ y: 0, },
				{ y: -height, ease: ease.easeInOut, });
		} else {
			TweenMax.fromTo(
				nextElement, speed,
				{ x: width },
				{ x: 0, ease: ease.easeInOut, });

			TweenMax.fromTo(
				currentElement, speed,
				{ x: 0, },
				{ x: -width, ease: ease.easeInOut, });
		}
	};

	playCubeEffect = (currentElement, nextElement, speed, ease, slideFrom) => {
		const width = this.state.width;

		if (slideFrom === 'left') {
			TweenMax.fromTo(
				nextElement, speed,
				{ scaleX: 0.000001, opacity: 0.5, transformOrigin: 'center left' },
				{ scaleX: 1, opacity: 1, ease: ease.easeInOut, });

			TweenMax.fromTo(
				currentElement, speed,
				{ scaleX: 1, opacity: 1, transformOrigin: 'center right', },
				{ scaleX: 0.000001, opacity: 0.5, z: width, ease: ease.easeInOut, });
		} else if (slideFrom === 'top') {
			TweenMax.fromTo(
				nextElement, speed,
				{ scaleY: 0.000001, opacity: 0.5, transformOrigin: 'top center' },
				{ scaleY: 1, opacity: 1, ease: ease.easeInOut, });

			TweenMax.fromTo(
				currentElement, speed,
				{ scaleY: 1, opacity: 1, transformOrigin: 'bottom center', },
				{ scaleY: 0.000001, opacity: 0.5, z: width, ease: ease.easeInOut, });
		} else if (slideFrom === 'bottom') {
			TweenMax.fromTo(
				nextElement, speed,
				{ scaleY: 0.000001, opacity: 0.5, transformOrigin: 'bottom center' },
				{ scaleY: 1, opacity: 1, ease: ease.easeInOut, });

			TweenMax.fromTo(
				currentElement, speed,
				{ scaleY: 1, opacity: 1, transformOrigin: 'top center', },
				{ scaleY: 0.000001, opacity: 0.5, z: width, ease: ease.easeInOut, });
		} else { /* right */
			TweenMax.fromTo(
				nextElement, speed,
				{ scaleX: 0.000001, opacity: 0.5, transformOrigin: 'center right' },
				{ scaleX: 1, opacity: 1, ease: ease.easeInOut, });

			TweenMax.fromTo(
				currentElement, speed,
				{ scaleX: 1, opacity: 1, transformOrigin: 'center left', },
				{ scaleX: 0.000001, opacity: 0.5, z: width, ease: ease.easeInOut, });
		}
	}
}

function setInstantInterval(functionRef, interval) {
	functionRef();
	return setInterval(functionRef, interval);
}

function generateEasing(easing, customEasing) {
	if (validEasings.indexOf(easing) >= 0) {
		return gsap[easing];
	} else {
		return Power3;
	}
}