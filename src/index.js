import { h, render } from 'preact';
import Player from './player';
import unique from 'css-path';
import { getCurrentLayout, arrayFind, simulateResizeEvent, debounce } from "./utils";

const playerInstances = {},
	debouncedResize = debounce(simulateResizeEvent, 500);

export function playSlide(element, slideConfigs) {
	render(<Player
		ref={instance => playerInstances[unique(element)] = instance}
		configs={slideConfigs} container={element}/>, element);
}

const hypeEventListeners = global.HYPE_eventListeners || [];
global.HYPE_eventListeners = [...hypeEventListeners, {
	type: 'HypeSceneLoad', callback: (scene) => {
		setTimeout(() => onSceneLoad(scene), 100);
	},
}];

function onSceneLoad(hype) {
	const sceneContainerId = hype.documentId(),
		sceneContainer = document.getElementById(sceneContainerId),
		playerRoot = sceneContainer.parentElement.parentElement.parentElement,
		playerInstance = playerInstances[unique(playerRoot)],
		currentSceneName = hype.currentSceneName(),
		layouts = hype.layoutsForSceneNamed(currentSceneName),
		currentLayout = getCurrentLayout(layouts, playerRoot.clientWidth),
		currentScene = arrayFind(layouts, layout => layout.name === currentLayout.name),
		widthRatio = playerRoot.clientWidth / currentScene.width;

	playerInstance && playerInstance.updateRatio({
		sceneWidth: currentScene.width,
		sceneHeight: currentScene.height,
	});

	hype.relayoutIfNecessary && hype.relayoutIfNecessary();
	currentScene.widthRatioToContainer = widthRatio;
	debouncedResize();
}

if (typeof window !== 'undefined') {
	window.WernerPlayer = {
		playSlide,
		instances: playerInstances,
	};
}