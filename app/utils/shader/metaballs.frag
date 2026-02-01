precision highp float;

uniform vec2 uMouse;
uniform float uTime;
uniform float uMetaballRadii[15];
uniform float uAudioStrength;
uniform vec3 uMetaballPositions[15];
uniform vec2 uResolution;

const int MAX_METABALLS = 15;
#define MAX_STEPS 64
#define MAX_DIST 6.0
#define SURF_DIST 0.005

float metaballField(vec3 p) {
  float field = 0.0;
  for (int i = 0; i < MAX_METABALLS; i++) {
    vec3 center = uMetaballPositions[i];
    float radius = uMetaballRadii[i];
    float dist = length(p - center);
    field += (radius * radius) / (dist * dist + 0.1);
  }
  return field;
}

float distFunc(vec3 p) {
  float field = metaballField(p);
  return 1.0 - field;
}

float raymarch(vec3 ro, vec3 rd) {
  float dist = 0.0;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dist;
    float d = distFunc(p);
    if (d < SURF_DIST) return dist;
    dist += d;
    if (dist > MAX_DIST) break;
  }
  return -1.0;
}

vec3 getNormal(vec3 p) {
  float eps = 0.0005;
  float dx = distFunc(p + vec3(eps, 0.0, 0.0)) - distFunc(p - vec3(eps, 0.0, 0.0));
  float dy = distFunc(p + vec3(0.0, eps, 0.0)) - distFunc(p - vec3(0.0, eps, 0.0));
  float dz = distFunc(p + vec3(0.0, 0.0, eps)) - distFunc(p - vec3(0.0, 0.0, eps));
  return normalize(vec3(dx, dy, dz));
}

void main() {
  vec2 uv = (gl_FragCoord.xy / uResolution.xy) * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  vec3 ro = vec3(0.0, 0.0, 2.0); // Cámara más cerca
  vec3 rd = normalize(vec3(uv, -1.0));

  float t = raymarch(ro, rd);

  if (t > 0.0) {
    vec3 p = ro + rd * t;
    vec3 normal = getNormal(p);

    vec3 lightDir = normalize(vec3(uMouse * 2.0 - 1.0, 1.0));
    float diff = max(dot(normal, lightDir), 0.0);

    vec3 baseColor = mix(vec3(0.3, 0.3, 0.3), vec3(1.0, 0.2, 0.5), uAudioStrength);

    float enhancedDiff = diff * (1.6 + uAudioStrength * 1.2);

    vec3 viewDir = normalize(ro - p);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0) * (0.2 + uAudioStrength * 2.0);

    float glow = uAudioStrength * 0.3;

    vec3 color = baseColor * enhancedDiff + vec3(spec + glow);

    gl_FragColor = vec4(color, 1.0);
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
}
