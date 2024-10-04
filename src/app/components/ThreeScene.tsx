// components/ThreeScene.tsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls( camera, renderer.domElement );

    if (mountRef.current) {
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);
    }

    // Crear un cubo
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    const geometry = new THREE.SphereGeometry( 3, 3, 3 );
    const wireframe = new THREE.WireframeGeometry( geometry );
    const line = new THREE.LineSegments( wireframe );
    scene.add( line );

    camera.position.z = 5;
    controls.update();
    const animate = () => {
      requestAnimationFrame(animate);
      line.rotation.x += 0.001;
      line.rotation.y += 0.001;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeScene;
