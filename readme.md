# Werner's Rotator Player

Tumult's Hype embeded player using Werner's convention.
This project didn't aimed for public user.

### Installation:
In your project's root run this command
```
npm install --save werner-rotator-player
```

### Usage:
```javascript
import { playSlide } from 'werner-rotator-player';
import configs from './slideConfigs.json'; // Normally we'll load this from a service or api instead..

const playerContainer = document.getElementById('sliderContainer');
playSlide(playerContainer, configs);
```