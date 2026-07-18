"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ParticleWaveProps {
  className?: string;
}

const ParticleWave: React.FC<ParticleWaveProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    particleMaterial: THREE.ShaderMaterial;
    animationId: number | null;
    mouse: THREE.Vector2;
  } | null>(null);

  // Function to detect current theme
  const getCurrentTheme = () => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  };

  // Function to get background color based on theme
  const getBackgroundColor = (theme: string) => {
    return theme === 'dark' 
      ? new THREE.Color(0x000000) // Black background for dark theme
      : new THREE.Color(0xffffff); // White background for light theme
  };

  // Function to get particle color based on theme
  const getParticleColor = (theme: string) => {
    return theme === 'dark' 
      ? new THREE.Vector3(1.0, 1.0, 1.0) // White particles for dark theme
      : new THREE.Vector3(0.0, 0.0, 0.0); // Black particles for light theme
  };

  const particleVertex = `
    attribute float scale;
    uniform float uTime;
    uniform vec2 uMouse;
    void main() {
      vec3 p = position;
      float s = scale;

      // Base wave (slower, more elegant)
      p.y += (sin(p.x * 0.5 + uTime) * 0.5) + (cos(p.z * 0.5 + uTime) * 0.1) * 2.0;
      p.x += (sin(p.z * 0.5 + uTime) * 0.5);

      // Mouse effect
      // Map uMouse [-1, 1] to approximate world bounds
      vec2 mousePos = vec2(uMouse.x * 35.0, uMouse.y * 35.0);
      float dist = distance(p.xz, mousePos);
      
      // Create a smooth effect radius around the mouse
      float mouseEffect = smoothstep(15.0, 0.0, dist);
      
      // Smooth elevation and slight repulsion instead of chaotic waves
      p.y += mouseEffect * 3.0;
      
      // Scale calculation
      s += (sin(p.x * 0.5 + uTime) * 0.5) + (cos(p.z * 0.5 + uTime) * 0.1) * 2.0;
      s += mouseEffect * 2.0; // Make particles slightly bigger near mouse

      vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
      gl_PointSize = s * 15.0 * (1.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const particleFragment = `
    uniform vec3 uColor;
    void main() {
      gl_FragColor = vec4(uColor, 0.5);
    }
  `;

  const initScene = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const aspectRatio = winWidth / winHeight;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.01, 1000);
    camera.position.set(0, 6, 5);

    // Scene
    const scene = new THREE.Scene();

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true, // Make renderer background transparent so CSS background shows through
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(winWidth, winHeight);
    
    // Allow CSS backgrounds to show through by clearing with 0 alpha
    // renderer.setClearColor(getBackgroundColor(currentTheme)); 
    renderer.setClearColor(0x000000, 0);

    // Particles
    const gap = 0.3;
    const amountX = 200;
    const amountY = 200;
    const particleNum = amountX * amountY;
    const particlePositions = new Float32Array(particleNum * 3);
    const particleScales = new Float32Array(particleNum);
    
    let i = 0;
    let j = 0;
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        particlePositions[i] = ix * gap - ((amountX * gap) / 2);
        particlePositions[i + 1] = 0;
        particlePositions[i + 2] = iy * gap - ((amountX * gap) / 2);
        particleScales[j] = 1;
        i += 3;
        j++;
      }
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: {
        uTime: { type: 'f', value: 0 },
        uColor: { type: 'v3', value: getParticleColor(getCurrentTheme()) },
        uMouse: { type: 'v2', value: new THREE.Vector2(0, 0) }
      }
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const mouse = new THREE.Vector2(-10, -10);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      particleMaterial,
      animationId: null,
      mouse
    };
  };

  const animate = () => {
    if (!sceneRef.current) return;

    const { scene, camera, renderer, particleMaterial, mouse } = sceneRef.current;
    
    particleMaterial.uniforms.uTime.value += 0.015;
    
    // Smoothly interpolate uMouse towards actual mouse position
    particleMaterial.uniforms.uMouse.value.x += (mouse.x - particleMaterial.uniforms.uMouse.value.x) * 0.05;
    particleMaterial.uniforms.uMouse.value.y += (mouse.y - particleMaterial.uniforms.uMouse.value.y) * 0.05;
    
    // Update particle color based on current theme
    const currentTheme = getCurrentTheme();
    particleMaterial.uniforms.uColor.value = getParticleColor(currentTheme);
    
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    
    sceneRef.current.animationId = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    if (!sceneRef.current) return;

    const { camera, renderer } = sceneRef.current;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    camera.aspect = winWidth / winHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(winWidth, winHeight);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!sceneRef.current) return;

    sceneRef.current.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    sceneRef.current.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  useEffect(() => {
    initScene();
    animate();

    const handleResizeEvent = () => handleResize();
    const handleMouseMoveEvent = (e: MouseEvent) => handleMouseMove(e);

    window.addEventListener('resize', handleResizeEvent);
    window.addEventListener('mousemove', handleMouseMoveEvent);

    return () => {
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      window.removeEventListener('resize', handleResizeEvent);
      window.removeEventListener('mousemove', handleMouseMoveEvent);
      
      // Cleanup Three.js resources
      if (sceneRef.current) {
        const { scene, renderer, particles } = sceneRef.current;
        scene.remove(particles);
        if (particles.geometry) particles.geometry.dispose();
        if (particles.material) {
          if (Array.isArray(particles.material)) {
            particles.material.forEach(material => material.dispose());
          } else {
            particles.material.dispose();
          }
        }
        renderer.dispose();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block ${className}`}
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
        overflow: 'hidden'
      }}
    />
  );
};

export { ParticleWave };
