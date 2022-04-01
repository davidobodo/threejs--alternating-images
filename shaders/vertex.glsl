
varying vec2 vUv;
varying vec2 vCoordinates;
attribute vec3 aCoordinates;
attribute float aSpeed;
attribute float aOffset;

uniform float move;
uniform float time;


void main(){
    vUv = uv;

    vec3 pos = position;
    pos.z = position.z + move*aSpeed + aOffset;

    // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.);
    gl_PointSize = 1000. * (1. / - mvPosition.z ); // For particles we need to set point size
    // gl_PointSize = size * 10.;
    gl_Position = projectionMatrix * mvPosition;

    vCoordinates = aCoordinates.xy;

}