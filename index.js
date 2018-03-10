import { h, render } from 'preact';

import { playSlide } from './src';
import configs from './newConfigs.json';

const container = document.getElementById('root');
const childContainer = document.getElementById('child-player');

playSlide(container, configs);
playSlide(childContainer, configs);