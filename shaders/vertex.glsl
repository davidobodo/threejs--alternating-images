
varying vec2 vUv;

void main(){
    vUv = uv;

    // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.);
    gl_PointSize = 5000. * (1. / - mvPosition.z ); // For particles we need to set point size
    // gl_PointSize = size * 10.;
    gl_Position = projectionMatrix * mvPosition;

}