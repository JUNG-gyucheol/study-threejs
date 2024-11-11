uniform float uTime;
varying vec2 vUv;

float circle(vec2 uv, vec2 pos, float size) {
    float d = length(uv - pos);
    return smoothstep(size, size - 0.01, d);
}

float ellipse(vec2 uv, vec2 pos, vec2 size) {
    vec2 d = uv - pos;
    d = d / size;
    return smoothstep(1.0, 0.98, length(d));
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    
    // 애니메이션 효과
    float wobble = sin(uTime * 2.0) * 0.03;
    uv.y += wobble;
    
    vec3 color = vec3(0.0);
    
    // 해골 머리
    float skull = ellipse(uv, vec2(0.0, 0.0), vec2(0.5, 0.6));
    
    // 눈
    float leftEye = circle(uv, vec2(-0.2, 0.1), 0.15);
    float rightEye = circle(uv, vec2(0.2, 0.1), 0.15);
    
    // 코
    float nose = circle(uv, vec2(0.0, -0.1), 0.08);
    
    // 이빨
    float teeth = 0.0;
    for(float i = -0.3; i <= 0.3; i += 0.1) {
        teeth += smoothstep(0.05, 0.04, length(uv - vec2(i, -0.3)));
    }
    
    // 해골 색상 조합
    vec3 skullColor = vec3(0.9);
    color += skull * skullColor;
    color -= leftEye;
    color -= rightEye;
    color -= nose;
    color += teeth * 0.5;
    
    gl_FragColor = vec4(color, 1.0);
}