import { h, Component } from 'preact';
import SlideItem from './slideItem';
import gsap, { TweenMax, Power3 } from 'gsap';

import NavigationIndicator from './indicatorContainer';

const validEasings = [
	'Power0', 'Power1', 'Power2', 'Power3', 'Power4',
	'Back', 'Elastic', 'Bounce', 'Rough', 'SlowMo', 'Stepped', 'Circ', 'Expo', 'Sine'];

export default class Player extends Component {
	constructor(props) {
		super(props);

		this.slideRefs = {};
		this.state = {
			widthRatio: 9999, /* make initial height very close to ZERO */
			width: 1, height: 1,
			counter: 0,
			slideIndex: 0,
		};
	}

	componentDidMount() {
		this.onResize(); window.addEventListener('resize', this.onResize);

		const interval = this.props.configs.data.interval || 6000;
		this.playTimeout = setTimeout(() => this.playTransition(0), interval);
	}

	componentWillUnmount() {
		this.playTimeout && clearTimeout(this.playTimeout);
		window.removeEventListener('resize', this.onResize);
	}

	render() {
		return <div
			style={{
				position: 'relative', overflow: 'hidden',
				width: this.state.width, height: this.state.height }}>
			{this.renderSlides()}
			{this.renderIndicator()}
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

	renderIndicator = () => {
		const { data = {} } = this.props.configs;

		return <NavigationIndicator
			slides={this.props.configs.slides}
			activeIndex={this.state.slideIndex}
			onNavigate={(position) => {
				this.playTransition(this.state.slideIndex, position);
			}}
			snapping={data.indicatorSnapping}
			direction={data.indicatorDirection}
			indicatorType={data.indicatorType}
			indicatorColor={data.indicatorColor}
			indicatorSize={data.indicatorSize}
			padding={data.indicatorPadding}/>;
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

	playTransition(currentIndex, targetIndex = -1) {
		this.playTimeout && clearTimeout(this.playTimeout);

		const { data = {}, slides } = this.props.configs,
			interval = data.interval || 6000,
			speed = data.speed || 1000,
			slideFrom = data.slideFrom || 'right',
			transition = data.transition || 'fade',
			easing = generateEasing(data.easing, data.customEasing),
			tweenSpeed = speed / 1000,
			nextIndex = (targetIndex >= 0 && targetIndex < slides.length) ? targetIndex
				: getNextTransitionIndex(slides, currentIndex);

		if (slides.length <= 1) return; /* if we have only 1 slide, nothing to slide!!! */

		try {
			/* Make the first Item appear above
	 		- by default last "absolute position" item will display above */
			for (let i = 0; i < slides.length; i += 1) {
				TweenMax.set(this.slideRefs[i], { zIndex: 0 });
			}

			TweenMax.set(this.slideRefs[currentIndex], { zIndex: 8 });
			TweenMax.set(this.slideRefs[nextIndex], { zIndex: 9 });

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

			this.playTimeout = setTimeout(() => this.playTransition(nextIndex), interval);
		} catch (e) {
			console.log(`Cannot play slide ${currentIndex}|>${nextIndex}, recovered from crash:`, e);
			this.playTimeout = setTimeout(() => this.playTransition(nextIndex), interval);
		}

		/* Finally, we're always focus on the next slide! no-matter the current one played or not.. */
		this.setState({ slideIndex: nextIndex });
	}

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
	};
}

function getNextTransitionIndex(slides, currentIndex) {
	const increasedIndex = currentIndex + 1;
	return increasedIndex >= slides.length ? 0 : increasedIndex;
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