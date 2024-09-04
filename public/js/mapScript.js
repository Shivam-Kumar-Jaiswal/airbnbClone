let secr=testSecret;
Radar.initialize(secr);

const map = Radar.ui.map({
    container: 'map',
    style: 'radar-default-v1',
    center: [77.2090,28.6139], // NYC
    zoom: 11
  });