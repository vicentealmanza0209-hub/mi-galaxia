// ================= ESCENA =================
const scene = new THREE.Scene();

// ================= CÁMARA =================
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 25;

// ================= RENDER =================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// ================= GALAXIA =================
const starCount = 9000;
const geometry = new THREE.BufferGeometry();
const positions = [];
const colors = [];

const innerColor = new THREE.Color(0xffc6a8);
const outerColor = new THREE.Color(0x6b77ff);

for (let i = 0; i < starCount; i++) {
  const radius = Math.random() * 15;
  const spin = radius * 1.3;
  const branch = (i % 4) / 4 * Math.PI * 2;

  const x = Math.cos(branch + spin) * radius;
  const y = (Math.random() - 0.5) * 2;
  const z = Math.sin(branch + spin) * radius;

  positions.push(x, y, z);

  const color = innerColor.clone();
  color.lerp(outerColor, radius / 15);
  colors.push(color.r, color.g, color.b);
}

geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.07,
  vertexColors: true,
  transparent: true,
  blending: THREE.AdditiveBlending
});

const galaxy = new THREE.Points(geometry, material);
scene.add(galaxy);
// ================= AGUJERO NEGRO =================

// Núcleo oscuro
const blackHoleGeo = new THREE.SphereGeometry(1.6, 32, 32);
const blackHoleMat = new THREE.MeshBasicMaterial({
  color: 0x000000
});
const blackHole = new THREE.Mesh(blackHoleGeo, blackHoleMat);
scene.add(blackHole);

// Disco de acreción (halo brillante)
const diskGeo = new THREE.RingGeometry(2, 4, 64);
const diskMat = new THREE.MeshBasicMaterial({
  color: 0xffaa55,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 1,
  blending: THREE.AdditiveBlending
});
const accretionDisk = new THREE.Mesh(diskGeo, diskMat);
accretionDisk.rotation.x = Math.PI / 2;
scene.add(accretionDisk);


// ================= FOTOS =================
const loader = new THREE.TextureLoader();
const photoGroup = new THREE.Group();
const photos = [];

const mensajes = [
  "Hermosaaaa 💜",
  "Siempre tú ✨",
  "Preciosaa",
  "Mi lugar favorito es a tu lado",
  "Te elegiría mil veces",
  "Nuestra historia",
  "Te amo",
  "Momentos eternos",
  "Mi persona favorita",
  "Me encantas"
];

// AJUSTA AQUÍ SI TIENES MÁS O MENOS FOTOS
const TOTAL_FOTOS = 30;

for (let i = 1; i <= TOTAL_FOTOS; i++) {
  const texture = loader.load(`fotos/foto${i}.jpg`);
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();


  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });

  const geo = new THREE.PlaneGeometry(3, 2);
  const photo = new THREE.Mesh(geo, mat);

  const angle = (i / TOTAL_FOTOS) * Math.PI * 2;
  const radius = 10 + Math.random() * 4;

  photo.position.set(
    Math.cos(angle) * radius,
    (Math.random() - 0.5) * 5,
    Math.sin(angle) * radius
  );

  photo.userData.message = mensajes[i % mensajes.length];

  photoGroup.add(photo);
  photos.push(photo);
}

scene.add(photoGroup);

// ================= ZOOM + MENSAJE =================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(photos);

  if (intersects.length > 0) {
    const photo = intersects[0].object;
    alert(photo.userData.message);

    const target = photo.position.clone();
    camera.position.lerp(
      target.add(new THREE.Vector3(0, 0, 3)),
      0.25
    );
  }
});

// ================= ANIMACIÓN =================
function animate() {
  requestAnimationFrame(animate);

  galaxy.rotation.y += 0.0004;
  photoGroup.rotation.y -= 0.0006;

  accretionDisk.rotation.z += 0.002; // ✨ giro del disco
  
  photos.forEach(photo => {
    photo.lookAt(camera.position);
  });

  renderer.render(scene, camera);
}
animate();

// ================= RESPONSIVE =================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});




