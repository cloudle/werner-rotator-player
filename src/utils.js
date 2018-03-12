export function simulateResizeEvent() {
	const resizeEvent = window.document.createEvent('UIEvents');
	resizeEvent .initUIEvent('resize', true, false, window, 0);
	window.dispatchEvent(resizeEvent);
}

export function getCurrentLayout(layouts, containerWidth) {
	const sortedLayouts = layouts.sort((a, b) => {
		if (a.breakpoint < b.breakpoint) return 1;
		if (a.breakpoint > b.breakpoint) return -1;
		return 0;
	}); /* From layout with bigger breakpoint to smaller one.. */

	for (const layout of sortedLayouts) {
		if (containerWidth > layout.breakpoint) {
			return layout;
		}
	}

	return layouts[layouts.length - 1];
}

export function arrayFind(array, predicate) {
	for (const item of array) {
		if (predicate(item)) return item;
	}

	return undefined;
}

export function debounce(fn, duration) {
	let timeout;
	return function () {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			timeout = null;
			fn.apply(this, arguments);
		}, duration);
	};
}