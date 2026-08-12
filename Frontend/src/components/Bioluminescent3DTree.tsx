import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Phase, StudentProgress } from '@/services/api';
import { Sparkles, CheckCircle2, Lock, Flame, Zap, Volume2, VolumeX, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Bioluminescent3DTreeProps {
  phases: Phase[];
  progressMap: Record<string, StudentProgress>;
}

export default function Bioluminescent3DTree({ phases, progressMap }: Bioluminescent3DTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [hoveredPhase, setHoveredPhase] = useState<Phase | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [particleTheme, setParticleTheme] = useState<'fireflies' | 'cherry' | 'quantum'>('fireflies');

  const defaultPhases = phases.length > 0 ? phases : [
    { _id: 'p1', name: 'Phase 1: Java Core & Fundamentals' },
    { _id: 'p2', name: 'Phase 2: JVM Memory Model & Garbage Collection' },
    { _id: 'p3', name: 'Phase 3: Spring Boot Microservices & Data JPA' },
    { _id: 'p4', name: 'Phase 4: Spring Security, JWT & OAuth2 Filters' }
  ];

  // Sound Synthesizer Audio Trigger
  const playChimeSound = (freq = 520) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio optional
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04070d, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 2, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 3, 30);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 2.5, 25);
    emeraldLight.position.set(-4, 0, 3);
    scene.add(emeraldLight);

    // 3. Central Bioluminescent 3D Tree Group
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    // Central Trunk Geometry
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.6, 6, 16, 32);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      emissive: 0x1e1b4b,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true
    });
    const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
    trunkMesh.position.y = 0;
    treeGroup.add(trunkMesh);

    // Glowing Root Base Ring
    const ringGeo = new THREE.TorusGeometry(1.4, 0.1, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -3;
    treeGroup.add(ringMesh);

    // 4. Branch Node Orbs (Phases)
    const nodeMeshes: THREE.Mesh[] = [];
    const colors = [0x10b981, 0x06b6d4, 0xa855f7, 0xf59e0b];
    const nodePositions = [
      new THREE.Vector3(-2.8, -1.2, 0.5),  // Branch 1
      new THREE.Vector3(2.8, -0.4, 0.8),   // Branch 2
      new THREE.Vector3(-2.2, 1.8, 0.6),   // Branch 3
      new THREE.Vector3(2.2, 2.6, 0.4)    // Branch 4
    ];

    defaultPhases.forEach((phase, idx) => {
      const pos = nodePositions[idx % nodePositions.length];
      const color = colors[idx % colors.length];
      const prog = progressMap[phase._id] || progressMap[phase.name];
      const isPassed = prog && prog.score !== undefined && (prog.score / (prog.totalScore || 3) >= 0.5);

      // Branch Tube Geometry
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, pos.y * 0.4, 0),
        new THREE.Vector3(pos.x * 0.5, pos.y * 0.7, pos.z * 0.5),
        pos
      ]);
      const branchTubeGeo = new THREE.TubeGeometry(curve, 20, 0.08, 8, false);
      const branchTubeMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: isPassed ? 0.8 : 0.2,
        roughness: 0.1
      });
      const tubeMesh = new THREE.Mesh(branchTubeGeo, branchTubeMat);
      treeGroup.add(tubeMesh);

      // Node Orb Mesh
      const nodeGeo = new THREE.IcosahedronGeometry(isPassed ? 0.55 : 0.45, 3);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: isPassed ? 1.2 : 0.3,
        roughness: 0.1,
        metalness: 0.9
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = { phase, isPassed, color };
      treeGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);

      // Outer Aura Ring
      const auraGeo = new THREE.TorusGeometry(0.75, 0.02, 16, 32);
      const auraMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.6 });
      const auraMesh = new THREE.Mesh(auraGeo, auraMat);
      auraMesh.position.copy(pos);
      treeGroup.add(auraMesh);
    });

    // 5. Starry Particles Cloud (Fireflies / Cherry / Quantum)
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      color: particleTheme === 'cherry' ? 0xf43f5e : particleTheme === 'quantum' ? 0x06b6d4 : 0x10b981,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particlesMesh);

    // 6. Interactive Mouse Drag Rotation & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        treeGroup.rotation.y += deltaX * 0.008;
        treeGroup.rotation.x += deltaY * 0.008;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      } else {
        // Raycast Hover check
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes);

        if (intersects.length > 0) {
          const target = intersects[0].object as THREE.Mesh;
          const phase = target.userData.phase as Phase;
          if (hoveredPhase?._id !== phase._id) {
            setHoveredPhase(phase);
            playChimeSound(600);
          }
          container.style.cursor = 'pointer';
        } else {
          setHoveredPhase(null);
          container.style.cursor = 'grab';
        }
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const target = intersects[0].object as THREE.Mesh;
        const phase = target.userData.phase as Phase;
        setSelectedPhase(phase);
        playChimeSound(800);
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('click', onClick);

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto gentle rotation
      if (!isDragging) {
        treeGroup.rotation.y += 0.003;
      }

      // Pulse particles
      particlesMesh.rotation.y -= 0.001;

      // Pulse node meshes
      nodeMeshes.forEach((mesh, idx) => {
        mesh.rotation.y += 0.02;
        mesh.rotation.x += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [phases, progressMap, particleTheme, soundEnabled]);

  return (
    <div className="relative w-full rounded-3xl bg-[#030712] border border-cyan-500/30 overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6">
      
      {/* Top Toolbar Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="text-sm font-extrabold text-white font-heading">
            3D Interactive Tree Matrix <span className="text-cyan-400 text-xs font-mono">(Drag to Rotate 3D Space)</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Particle Theme Switcher */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
            {[
              { id: 'fireflies', label: '✨ Fireflies' },
              { id: 'cherry', label: '🌸 Blossoms' },
              { id: 'quantum', label: '⚡ Quantum' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setParticleTheme(t.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  particleTheme === t.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Audio Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-80 sm:h-[450px] relative cursor-grab rounded-2xl overflow-hidden bg-gradient-to-b from-[#02050D] to-[#080E1E]">
        
        {/* Hovered Phase Overlay Badge */}
        {hoveredPhase && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none p-3.5 rounded-2xl bg-black/80 backdrop-blur-md border border-cyan-400/50 space-y-1 shadow-2xl animate-fade-in">
            <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold">Hovering 3D Branch Node</span>
            <div className="text-sm font-bold text-white font-heading">{hoveredPhase.name}</div>
            <div className="text-[11px] text-emerald-400 font-mono">Click orb to open branch modal</div>
          </div>
        )}
      </div>

      {/* Selected Phase Glass Modal */}
      {selectedPhase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-cyan-400/50 space-y-6 relative shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">3D Branch Node Selected</span>
                <h3 className="text-lg font-bold text-white font-heading">{selectedPhase.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPhase(null)}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Attempt this branch's quiz assessment to unlock glowing neon leaves and fruits of wisdom on your knowledge tree!
            </p>

            <button
              onClick={() => {
                setSelectedPhase(null);
                navigate(`/quiz/${selectedPhase._id}`);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-neon-indigo hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>⚡ Start Branch Assessment Quiz</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
