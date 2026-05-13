import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Earth from "./Earth";
import { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

const Globe = forwardRef(({ onCountrySelect, onHover, onHoverEnd, highlightedCountry, viewMode }, ref) => {
  const controlsRef = useRef();

  const latLonToVector3 = (lat, lon) => {
    const latRad = THREE.MathUtils.degToRad(lat);
    const lonRad = THREE.MathUtils.degToRad(lon);
    const x = Math.cos(latRad) * Math.cos(lonRad);
    const y = Math.sin(latRad);
    const z = -Math.cos(latRad) * Math.sin(lonRad);
    return new THREE.Vector3(x, y, z);
  };

  useImperativeHandle(ref, () => ({
    rotateToCountry(lat, lon) {
      if (!controlsRef.current) return;
      const destination = latLonToVector3(lat, lon);
      const camera = controlsRef.current.object;
      const targetPosition = destination.clone().multiplyScalar(4.2);
      camera.position.lerp(targetPosition, 0.6);
      controlsRef.current.target.copy(destination);
      controlsRef.current.update();
    },
  }));

  const Controls = () => {
    return (
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableZoom
        enablePan={false}
        dampingFactor={0.08}
        enableDamping
        autoRotate={false}
      />
    );
  };

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 35 }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={2} />
      <directionalLight position={[-5, -3, -5]} intensity={0.8} />

      {/* Earth */}
      <Earth
        onCountrySelect={onCountrySelect}
        onHover={onHover}
        onHoverEnd={onHoverEnd}
        highlightedCountry={highlightedCountry}
        viewMode={viewMode}
      />

      {/* Stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} />

      {/* Controls */}
      <Controls />
    </Canvas>
  );
});

export default Globe;
