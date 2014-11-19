uniform vec3 NormalColor;
uniform vec3 EdgeDefinition;

varying vec3 Normal;

void main()
{
	vec4 baseColor = vec4(normalize(NormalColor), 1.0);
    float intensity;
    vec4 color;
    vec3 n = normalize(Normal);
    intensity = dot(normalize(vec3(gl_LightSource[0].position)), n);
    
    if (intensity > EdgeDefinition.x)
        color = baseColor * vec4(1.0, 1.0, 1.0, 1.0);
    else if (intensity > EdgeDefinition.y)
        color = baseColor * vec4(0.6, 0.6, 0.6, 1.0);
    else if (intensity > EdgeDefinition.z)
        color = baseColor * vec4(0.3, 0.3, 0.3, 1.0);
    else
        color = baseColor * vec4(0.1, 0.1, 0.1, 1.0);
    gl_FragColor = color;
}

