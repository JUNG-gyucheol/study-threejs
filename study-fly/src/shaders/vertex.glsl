 uniform float uTime;
//  uniform float uSize;

 attribute float aScale;
 attribute vec3 aRandomness;
 varying vec3 vColor;

 void main()
    {
        /**
         * Position
         */
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);

        // Spin
        // float angle = atan(modelPosition.z, modelPosition.y);
        // float distanceToCenter = length(modelPosition.xz);
        // float angleOffset =  (1.0 / distanceToCenter) * uTime * 2.0;
        // angle += angleOffset;
        // modelPosition.x = cos(angle) * distanceToCenter;
        // modelPosition.z = sin(angle) * distanceToCenter;
        
        // modelPosition.x = sin(modelPosition.x * uTime * 0.05) * 10.0;
        // modelPosition.z += sin(modelPosition.z * uTime * 0.2) * 10.0;
        // modelPosition.y = cos(modelPosition.y * uTime * 0.05) * 10.0;

        // vec3 targetPoint = vec3(modelPosition.x, modelPosition.y, modelPosition.z);

        // // 현재 위치에서 목표 지점까지의 벡터
        // vec3 toTarget = targetPoint - modelPosition.xyz;

        // // 시간에 따른 보간 계수 (0~1)
        // float t = clamp(uTime * 2.0, 0.0, 5.0);
        // float t = smoothstep(uTime * 2.0, 0.0, 1.0);

        // // 현재 위치에서 목표 지점으로 선형 보간
        // modelPosition.z = mix(modelPosition.z, modelPosition.z - 5.0, t);
        // modelPosition.y = mix(modelPosition.y, modelPosition.y + 5.0, t);

        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        gl_PointSize = 300.0;
        /**
         * Size
         */
        // gl_PointSize = uSize * aScale;
        gl_PointSize *= (1.0 / -viewPosition.z);

        /**
        * Color
        */
        // vColor = color; 
  }
