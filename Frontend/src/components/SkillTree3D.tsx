import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Phase } from '@/services/api';
import { Sparkles, Trophy, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SkillTree3DProps {
  phases: Phase[];
  userProgress?: Record<string, any>;
}

export default function SkillTree3D({ phases, userProgress = {} }: SkillTree3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f3ff, 2, 50);
    pointLight.position.set(0, 5, 10);
    scene.add(pointLight);

    // Group for nodes & lines
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    // Particle Background Stars
    const starCount = 300;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.08,
      transparent: true,
      opacity: 0.6
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Generate Node Positions in 3D Constellation Curve
    const defaultPhaseList = phases.length > 0 ? phases : [
      { _id: '1', name: 'Phase 1: Java Core & Fundamentals' },
      { _id: '2', name: 'Phase 2: JVM Memory & Garbage Collection' },
      { _id: '3', name: 'Phase 3: Spring Boot REST & Data JPA' },
      { _id: '4', name: 'Phase 4: OAuth2 Security & Microservices' }
    ];

    const nodePositions: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    defaultPhaseList.forEach((phase, index) => {
      // Calculate curve coordinates
      const angle = (index / defaultPhaseList.length) * Math.PI * 1.5 - Math.PI * 0.75;
      const radius = 6;
      const x = Math.cos(angle) * radius;
      const y = (index - 1.5) * 1.8;
      const z = Math.sin(angle) * 2;

      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos);

      const isCompleted = userProgress[phase._id]?.score !== undefined;
      const colorHex = isCompleted ? 0x10b981 : index === 0 ? 0x00f3ff : 0x6366f1;

      // Node Sphere Geometry
      const sphereGeo = new THREE.SphereGeometry(0.55, 32, 32);
      const sphereMat = new THREE.MeshPhongMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.6,
        shininess: 100,
        wireframe: false
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.copy(pos);
      sphereMesh.userData = { phase, index };
      treeGroup.add(sphereMesh);
      nodeMeshes.push(sphereMesh);

      // Outer Glowing Ring
      const ringGeo = new THREE.RingGeometry(0.7, 0.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      treeGroup.add(ringMesh);
    });

    // Connecting Laser Lines
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const p1 = nodePositions[i];
      const p2 = nodePositions[i + 1];

      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.6,
        linewidth: 2
      });
      const line = new THREE.Line(lineGeo, lineMat);
      treeGroup.add(line);
    }

    // Raycasting for Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        const hit = intersects[0].object as THREE.Mesh;
        const phaseData = hit.userData.phase;
        setSelectedPhase(phaseData);
      } else {
        container.style.cursor = 'default';
      }
    };

    const handleClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const phaseData = hit.userData.phase;
        if (phaseData._id) {
          navigate(`/quiz/${phaseData._id}`);
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle Rotation
      treeGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.25;
      starPoints.rotation.y = elapsedTime * 0.05;

      // Pulse Rings
      nodeMeshes.forEach((mesh, idx) => {
        mesh.rotation.y = elapsedTime;
        mesh.scale.setScalar(1 + Math.sin(elapsedTime * 2 + idx) * 0.08);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 450;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [phases, userProgress, navigate]);

  return (
    <div className="glass-card rounded-3xl p-6 border border-indigo-500/40 shadow-2xl relative overflow-hidden bg-[#04070D]/90 space-y-4">
      <div className="glow-point-indigo -top-20 -right-20 opacity-40" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive 3D Curriculum Map</span>
          </div>
          <h3 className="text-xl font-extrabold text-white font-heading">
            3D Skill Tree & <span className="gradient-text-indigo-cyan">Learning Constellation</span>
          </h3>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Click any 3D node to jump into the Phase Quiz assessment.
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[450px] rounded-2xl overflow-hidden bg-[#02050A] border border-white/10 shadow-inner">
        <div ref={mountRef} className="w-full h-full" />

        {/* Selected Node Overlay Box */}
        {selectedPhase && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm glass-card rounded-2xl p-4 border border-cyan-400/50 bg-[#080C14]/90 backdrop-blur-md shadow-neon-indigo space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Node Selected</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            </div>
            <h4 className="text-sm font-bold text-white font-heading">{selectedPhase.name}</h4>
            <button
              onClick={() => selectedPhase._id && navigate(`/quiz/${selectedPhase._id}`)}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow-neon-cyan transition-all"
            >
              <span>Start Phase Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
