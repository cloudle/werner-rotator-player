import { h, render } from 'preact';
import Player from './player';

export function playSlide(element, slideConfigs) {
	render(<Player configs={slideConfigs} container={element}/>, element);
}