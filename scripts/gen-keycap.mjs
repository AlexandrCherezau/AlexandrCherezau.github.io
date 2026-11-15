// Generates tmp/keycap.raw.glb: a single sculpted keycap. Then `npm run assets:keycap` compresses it.
import { writeFileSync, mkdirSync } from "node:fs";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Minimal FileReader polyfill: GLTFExporter uses it to turn Blobs into ArrayBuffers.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      this.onload?.({ target: this });
      this.onloadend?.({ target: this });
    });
  }
};

const SIZE = 1;
const HEIGHT = 0.62;
const RADIUS = 0.16;
const TOP_SCALE = 0.74; // cherry-like taper
const DISH = 0.035; // concave top

function roundedRect(size, radius) {
  const s = size / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-s + radius, -s);
  shape.lineTo(s - radius, -s);
  shape.quadraticCurveTo(s, -s, s, -s + radius);
  shape.lineTo(s, s - radius);
  shape.quadraticCurveTo(s, s, s - radius, s);
  shape.lineTo(-s + radius, s);
  shape.quadraticCurveTo(-s, s, -s, s - radius);
  shape.lineTo(-s, -s + radius);
  shape.quadraticCurveTo(-s, -s, -s + radius, -s);
  return shape;
}

const geo = new THREE.ExtrudeGeometry(roundedRect(SIZE - 0.08, RADIUS), {
  depth: HEIGHT - 0.08,
  bevelEnabled: true,
  bevelThickness: 0.06,
  bevelSize: 0.05,
  bevelSegments: 5,
  curveSegments: 8,
  steps: 4,
});
geo.rotateX(-Math.PI / 2); // extrude axis +Z -> top faces +Y
geo.computeBoundingBox();
const { min, max } = geo.boundingBox;
const pos = geo.attributes.position;
const v = new THREE.Vector3();
for (let i = 0; i < pos.count; i++) {
  v.fromBufferAttribute(pos, i);
  const t = (v.y - min.y) / (max.y - min.y);
  const k = 1 - (1 - TOP_SCALE) * Math.pow(t, 1.4);
  v.x *= k;
  v.z *= k;
  if (t > 0.98) {
    const r = Math.min(1, (v.x * v.x + v.z * v.z) / 0.16);
    v.y -= DISH * (1 - r);
  }
  pos.setXYZ(i, v.x, v.y - min.y, v.z);
}
geo.deleteAttribute("uv");
const merged = mergeVertices(geo, 1e-4);
merged.computeVertexNormals();
merged.computeBoundingBox();
const bb = merged.boundingBox;
// Origin at the top face centre (the cap top is flat at y=0), so legends can sit just above it.
merged.translate(-(bb.min.x + bb.max.x) / 2, -bb.max.y, -(bb.min.z + bb.max.z) / 2);

const mesh = new THREE.Mesh(
  merged,
  new THREE.MeshStandardMaterial({ name: "keycap", color: 0xede6d6, roughness: 0.45 }),
);
mesh.name = "Keycap";
const scene = new THREE.Scene();
scene.add(mesh);

const glb = await new GLTFExporter().parseAsync(scene, { binary: true });
mkdirSync("tmp", { recursive: true });
writeFileSync("tmp/keycap.raw.glb", Buffer.from(glb));
console.log("keycap.raw.glb", glb.byteLength, "bytes,", merged.attributes.position.count, "verts");
