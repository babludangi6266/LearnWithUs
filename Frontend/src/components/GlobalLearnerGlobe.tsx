import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe2, Users, Activity, Radio } from 'lucide-react';

interface ActiveHub {
  city: string;
  country: string;
  lat: number;
  lng: number;
  activeCount: number;
}

const GLOBAL_HUBS: ActiveHub[] = [
  { city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, activeCount: 84 },
  { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, activeCount: 62 },
  { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, activeCount: 48 },
  { city: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946, activeCount: 115 },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, activeCount: 54 },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, activeCount: 29 },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, activeCount: 41 },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, activeCount: 38 },
];

export default function GlobalLearnerGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [totalOnline, setTotalOnline] = useState(471);
  const [activeHub, setActiveHub] = useState<ActiveHub>(GLOBAL_HUBS[3]); // Default Bangalore

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Globe Wireframe Sphere
    const sphereRadius = 3.5;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 36, 36);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x1e1b4b,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // Inner Glowing Core
    const innerGeo = new THREE.SphereGeometry(sphereRadius - 0.05, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.9
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerMesh);

    // 2. Latitude/Longitude to 3D Coordinates Math
    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // 3. Render Pulsing Hotspots for each Global Hub
    const hotspotMeshes: THREE.Mesh[] = [];

    GLOBAL_HUBS.forEach((hub) => {
      const pos = latLngToVector3(hub.lat, hub.lng, sphereRadius + 0.05);

      // Hotspot Dot
      const dotGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0x00f3ff,
      });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(pos);
      dotMesh.userData = hub;
      globeGroup.add(dotMesh);
      hotspotMeshes.push(dotMesh);

      // Pulsing Halo Ring
      const haloGeo = new THREE.RingGeometry(0.15, 0.25, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.copy(pos);
      haloMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(haloMesh);
    });

    // 4. Connecting Arc Lines between Hubs
    for (let i = 0; i < GLOBAL_HUBS.length - 1; i++) {
      const p1 = latLngToVector3(GLOBAL_HUBS[i].lat, GLOBAL_HUBS[i].lng, sphereRadius);
      const p2 = latLngToVector3(GLOBAL_HUBS[i + 1].lat, GLOBAL_HUBS[i + 1].lng, sphereRadius);

      // Midpoint pulled outward to create curved 3D Arc
      const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(sphereRadius + 1.2);
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(50);

      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);
    }

    // Raycasting for interactive click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotMeshes);

      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        const hit = intersects[0].object as THREE.Mesh;
        setActiveHub(hit.userData as ActiveHub);
      } else {
        container.style.cursor = 'default';
      }
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      globeGroup.rotation.y += 0.003;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 420;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 shadow-2xl relative overflow-hidden bg-[#04070D]/90 space-y-4">
      <div className="glow-point-cyan -top-20 -right-20 opacity-30" />

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-1">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Live Telemetry Engine</span>
          </div>
          <h3 className="text-xl font-extrabold text-white font-heading">
            Live Global <span className="gradient-text-indigo-cyan">Learner & Freelancer Globe</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-emerald-400 font-bold shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{totalOnline} Developers Active Online</span>
        </div>
      </div>

      {/* 3D Globe Viewport */}
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-[#02050A] border border-white/10 shadow-inner">
        <div ref={mountRef} className="w-full h-full" />

        {/* Active Hub Telemetry Card */}
        <div className="absolute top-4 left-4 glass-card rounded-2xl p-4 border border-cyan-400/40 bg-[#080C14]/90 backdrop-blur-md space-y-1 text-xs font-mono max-w-xs shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" /> Hover Telemetry
          </div>
          <div className="text-sm font-bold text-white font-heading">{activeHub.city}, {activeHub.country}</div>
          <div className="text-emerald-400 font-bold flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {activeHub.activeCount} Engineers Online
          </div>
        </div>
      </div>

    </div>
  );
}
