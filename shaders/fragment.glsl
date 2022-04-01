varying vec2 vCoordinates;

uniform sampler2D imgCans;
uniform sampler2D imgImposter;
uniform sampler2D imgMask;

void main(){
    vec4 maskTexture = texture2D(imgMask, gl_PointCoord);
    vec2 myUV = vec2(vCoordinates.x/512., vCoordinates.y/512.);
    vec4 image =  texture2D(imgImposter, myUV);
    // gl_FragColor = vec4(1., 0., 0., 1.); //Red
    // gl_FragColor = vec4(1., 1., 0., 1.); //Yellow
    //  gl_FragColor = vec4(vCoordinates.x/512., 1., 0., 1.);  //Gradient
    //  gl_FragColor = vec4(vCoordinates.x/512., vCoordinates.y/512., 0., 1.);  //More Gradient
     gl_FragColor = image;
     gl_FragColor = maskTexture;

}