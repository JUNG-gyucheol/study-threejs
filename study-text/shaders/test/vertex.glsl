// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;
// attribute float aRandom;
// attribute vec2 uv;

varying vec2 vUv;
// varying float vRandom;
varying float vElevation;

vec2 rotate2D(vec2 position, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    
    mat2 rotationMatrix = mat2(
        c, -s,  // [cos θ, -sin θ]
        s,  c   // [sin θ,  cos θ]
    );
    
    return rotationMatrix * position;
}

void main() {
    // float angle = a.x * 20.0;
    // newPosition.xz = rotate2D(newPosition.xz, a.y);

    vec3 newPosition = position;
    newPosition.xz = rotate2D(newPosition.xz, uTime * 2.0);

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    // float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
    // elevation += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;
    // modelPosition.z += elevation;
    // modelPosition.z += aRandom * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;

    viewPosition.z += sin(uTime);
    // viewPosition.y += sin(uTime);
    viewPosition.x += cos(uTime) * 0.5;




    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vUv = uv;
    // vElevation = elevation;
    // vRandom = aRandom;
}
