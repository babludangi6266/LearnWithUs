import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ThreeObj: any = THREE;

    // Scene, Camera, Renderer setup
    const scene = new ThreeObj.Scene();
    const camera = new ThreeObj.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new ThreeObj.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const currentContainer = containerRef.current;
    currentContainer.appendChild(renderer.domElement);

    // Particle Field Creation
    const particlesCount = 900;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    const cyan = new ThreeObj.Color('#00F0FF');
    const violet = new ThreeObj.Color('#8B5CF6');
    const emerald = new ThreeObj.Color('#10B981');

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 80;
      posArray[i + 1] = (Math.random() - 0.5) * 80;
      posArray[i + 2] = (Math.random() - 0.5) * 60;

      const mixFactor = Math.random();
      const pColor = mixFactor < 0.4 ? cyan : mixFactor < 0.8 ? violet : emerald;

      colorArray[i] = pColor.r;
      colorArray[i + 1] = pColor.g;
      colorArray[i + 2] = pColor.b;
    }

    const particlesGeometry = new ThreeObj.BufferGeometry();
    particlesGeometry.setAttribute('position', new ThreeObj.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new ThreeObj.BufferAttribute(colorArray, 3));

    const particlesMaterial = new ThreeObj.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particlesMesh = new ThreeObj.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Central Floating Tech Mesh
    const sphereGeometry = new ThreeObj.IcosahedronGeometry(12, 2);
    const wireframeMaterial = new ThreeObj.MeshBasicMaterial({
      color: 0x8B5CF6,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const sphereMesh = new ThreeObj.Mesh(sphereGeometry, wireframeMaterial);
    scene.add(sphereMesh);

    const innerSphereGeo = new ThreeObj.IcosahedronGeometry(8, 1);
    const innerWireframeMat = new ThreeObj.MeshBasicMaterial({
      color: 0x00F0FF,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const innerSphere = new ThreeObj.Mesh(innerSphereGeo, innerWireframeMat);
    scene.add(innerSphere);

    // Mouse Tracking for Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new ThreeObj.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate sphere meshes
      sphereMesh.rotation.y = elapsedTime * 0.08;
      sphereMesh.rotation.x = elapsedTime * 0.05;

      innerSphere.rotation.y = -elapsedTime * 0.12;
      innerSphere.rotation.z = elapsedTime * 0.06;

      // Rotate particles slightly
      particlesMesh.rotation.y = elapsedTime * 0.02;

      // Parallax smooth interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x += (targetX * 10 - camera.position.x) * 0.05;
      camera.position.y += (-targetY * 10 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentContainer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      sphereGeometry.dispose();
      wireframeMaterial.dispose();
      innerSphereGeo.dispose();
      innerWireframeMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80"
    />
  );
}
