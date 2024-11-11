precision mediump float;

// varying float vRandom;
uniform vec3 uColor;
uniform sampler2D uTexture;
varying vec2 vUv;
varying float vElevation;

float plot(vec2 vUv) {    
    return smoothstep(0.02, 0.0, abs(vUv.y - vUv.x));
}
float plot2(vec2 vUv) {    
    return smoothstep(0.02, 0.0, abs(vUv.y -  (1.0 - vUv.x)));
}

void main(){
    // vec4 textureColor = texture2D(uTexture, vUv);
    // textureColor.rgb *= vElevation * 2.0 + 0.7;
    // gl_FragColor = vec4(uColor, 1.0);
    // gl_FragColor = textureColor;
    // gl_FragColor = vec4(vUv, 1.0, 1.0);
    // vec3 color = vec3(vUv.x);

    vec3 color = vec3(0.0);

    if(vUv.x  < 0.025 || vUv.x > 0.975 || vUv.y < 0.025 || vUv.y > 0.975) {
        color = vec3(0.0941, 0.4196, 0.7216);
    } else {
        color = vec3(1.0,vUv.x, 0.0);
    }

    // Plot a line
    // float pct = plot(vUv);
    // float pct2 = plot2(vUv);
    // color = ((1.0 - pct) * color) + (pct * vec3(0.0,1.0,0.0))  + (pct2 *vec3(1.0,1.0,0.0));

	gl_FragColor = vec4(color, 1.0);
}