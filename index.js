import { h, render } from 'preact';

import { playSlide } from './src';
import configs from './slideConfigs.json';

const element = document.getElementById('root');

playSlide(element, configs);