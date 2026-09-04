import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// =========================================================
// ⚙️ TOP CONTROLLER / ALL CONFIGURATION VARIABLES
// =========================================================
const CONFIG = {
  // 🎨 COLORS (Exact Original Hex Colors)
  redColor: "#801601",
  whiteColor: "#FFFFFF",

  // 🔍 VISUALS (Blur Controller)
  defaultBlur: "10px", // જરૂર મુજબ બ્લર બદલો (ઉદા. "2px", "5px")

  // 🧵 CLOTH PHYSICS CONTROLLERS
  clothSegsX: 30,          // કાપડની સોફ્ટનેસ (વધારે સેગમેન્ટ્સ = વધુ સોફ્ટ મુવમેન્ટ)
  clothSegsY: 18,
  damping: 0.96,           // હવા નો અવરોધ / સોફ્ટનેસ (0.95 થી 0.98 સુધી રાખવું)
  stiffness: 0.15,         // કાપડનું ખેંચાણ અને પાછા આવવાની તાકાત (Elasticity)

  // 🎯 DIRECTIONAL FORCES
  gravityY: -0.04,         // 🔻 ગ્રેવિટી ફક્ત Y-લાઇનમાં (નીચેની તરફ લટકાવવા માટે)
  windX: 0.005,            // 🌬️ પવન / એર ફ્લો ફક્ત X-લાઇનમાં (જમણી તરફ લહેરાવવા માટે)
  windWaveSpeed: 30,        // પવનના મોજાની સ્પીડ

  // 📐 CAMERA & SIZE
  cameraZ: 5,
};
// =========================================================

interface LoginBackgroundProps {
  isVisible?: boolean;
}

// Particle Class for Cloth Physics
class Particle {
  position: THREE.Vector3;
  previous: THREE.Vector3;
  original: THREE.Vector3;
  acceleration: THREE.Vector3;
  isPinned: boolean;

  constructor(x: number, y: number, z: number, isPinned: boolean) {
    this.position = new THREE.Vector3(x, y, z);
    this.previous = new THREE.Vector3(x, y, z);
    this.original = new THREE.Vector3(x, y, z);
    this.acceleration = new THREE.Vector3(0, 0, 0);
    this.isPinned = isPinned;
  }

  update(deltaSq: number) {
    if (this.isPinned) return;
    const temp = this.position.clone();
    // Verlet Integration for soft cloth physics
    this.position
      .add(this.position.clone().sub(this.previous).multiplyScalar(CONFIG.damping))
      .add(this.acceleration.multiplyScalar(deltaSq));
    this.previous.copy(temp);
    this.acceleration.set(0, 0, 0);
  }
}

// Constraint (Spring between cloth particles)
class Constraint {
  p1: Particle;
  p2: Particle;
  distance: number;

  constructor(p1: Particle, p2: Particle) {
    this.p1 = p1;
    this.p2 = p2;
    this.distance = p1.position.distanceTo(p2.position);
  }

  resolve() {
    const diff = new THREE.Vector3().subVectors(this.p2.position, this.p1.position);
    const currentDist = diff.length();
    if (currentDist === 0) return;
    const correction = diff.multiplyScalar((1 - this.distance / currentDist) * 0.5);

    if (!this.p1.isPinned) this.p1.position.add(correction);
    if (!this.p2.isPinned) this.p2.position.sub(correction);
  }
}

// Solid Color Texture Generator (Perfect Color Accuracy)
const createFlagTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const layerHeight = 100;
    const colors = [
      CONFIG.redColor,
      CONFIG.whiteColor,
      CONFIG.redColor,
      CONFIG.whiteColor,
      CONFIG.redColor,
    ];
    colors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, i * layerHeight, 100, layerHeight);
    });
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; // 🎯 પૂરતો સોલિડ કલર જાળવી રાખશે
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

export default function LoginBackground({ isVisible = true }: LoginBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = CONFIG.cameraZ;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const flagWidth = 10;
    const flagHeight = 6;
    const geometry = new THREE.PlaneGeometry(
      flagWidth,
      flagHeight,
      CONFIG.clothSegsX,
      CONFIG.clothSegsY
    );
    const flagTexture = createFlagTexture();

    // Solid Material (No Opacity)
    const material = new THREE.MeshBasicMaterial({
      map: flagTexture,
      side: THREE.DoubleSide,
    });

    const flagMesh = new THREE.Mesh(geometry, material);
    scene.add(flagMesh);

    // Build Particles Grid & Pin Left Side (Flag Pole)
    const particles: Particle[] = [];
    const constraints: Constraint[] = [];
    const posAttr = geometry.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      // 📌 ડાબી ધાર ફ્લેગ પોલ સાથે જોડાયેલી રહેશે
      const isLeftEdge = Math.abs(x - -flagWidth / 2) < 0.01;
      particles.push(new Particle(x, y, z, isLeftEdge));
    }

    // Connect Particles Grid
    const w = CONFIG.clothSegsX + 1;
    const h = CONFIG.clothSegsY + 1;

    for (let v = 0; v < h; v++) {
      for (let u = 0; u < w; u++) {
        const idx = v * w + u;
        if (u < w - 1) constraints.push(new Constraint(particles[idx], particles[idx + 1]));
        if (v < h - 1) constraints.push(new Constraint(particles[idx], particles[idx + w]));
      }
    }

    // 🖱️ Cursor Drag Mechanics
    let draggedParticle: Particle | null = null;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const planeIntersect = new THREE.Vector3();

    const onMouseDown = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(flagMesh);

      if (intersects.length > 0 && intersects[0].face) {
        const face = intersects[0].face;
        const p1 = particles[face.a];
        const p2 = particles[face.b];
        const p3 = particles[face.c];

        const pLoc = intersects[0].point;
        let minDist = Infinity;
        [p1, p2, p3].forEach((p) => {
          const d = p.position.distanceTo(pLoc);
          if (d < minDist) {
            minDist = d;
            draggedParticle = p;
          }
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!draggedParticle || draggedParticle.isPinned) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, planeIntersect);
      draggedParticle.position.copy(planeIntersect);
    };

    const onMouseUp = () => {
      draggedParticle = null;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    const updateSize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", updateSize);

    // Animation & Physics Loop
    let time = 0;
    let animationFrameId: number;

    const animate = () => {
      time += 0.016;

      particles.forEach((p) => {
        if (!p.isPinned && p !== draggedParticle) {
          // 🔻 1. Y-Axis Gravity Force
          p.acceleration.y += CONFIG.gravityY;

          // 🌬️ 2. X-Axis Air Flow Simulation (પવનનો પ્રભાવ X-લાઇનમાં)
          const wave = Math.sin(p.original.x * 2 + time * CONFIG.windWaveSpeed);
          p.acceleration.x += (CONFIG.windX + wave * 0.002);
          
          // 🌊 3. Z-Axis Ripples (કુદરતી કાપડના લહેરાવા માટે હળવી ફ્લટર ઈફેક્ટ)
          p.acceleration.z += wave * 0.002;

          // 🔁 Return Force (Elastic Recall)
          const returnForce = p.original.clone().sub(p.position).multiplyScalar(CONFIG.stiffness);
          p.acceleration.add(returnForce);
        }
        p.update(0.016);
      });

      // Constraints Resolve
      for (let i = 0; i < 5; i++) {
        constraints.forEach((c) => c.resolve());
      }

      // Update Mesh Vertices
      for (let i = 0; i < particles.length; i++) {
        posAttr.setXYZ(i, particles[i].position.x, particles[i].position.y, particles[i].position.z);
      }
      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      flagTexture.dispose();
      renderer.dispose();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        filter: `blur(${CONFIG.defaultBlur})`,
      }}
      className="fixed inset-0 w-screen h-screen z-0 pointer-events-none overflow-hidden [&_canvas]:pointer-events-auto"
    />
  );
}