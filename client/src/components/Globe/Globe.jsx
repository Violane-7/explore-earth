import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Earth from "./Earth";
import { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

// OrbitControls must be defined OUTSIDE the Globe component
// to avoid remounting on every render (which would break the ref)
const GlobeControls = ({ controlsRef }) => (
  <OrbitControls
    ref={controlsRef}
    makeDefault
    enableZoom
    minDistance={1.5}
    maxDistance={8}
    enablePan={false}
    dampingFactor={0.08}
    enableDamping
    autoRotate={false}
  />
);

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
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    },
  }));

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 35 }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={2.2} color="#fff8f0" />
      <directionalLight position={[-5, -3, -5]} intensity={0.6} color="#c8e0ff" />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#ffffff" />

      {/* Earth */}
      <Earth
        onCountrySelect={onCountrySelect}
        onHover={onHover}
        onHoverEnd={onHoverEnd}
        highlightedCountry={highlightedCountry}
        viewMode={viewMode}
      />

      {/* Background stars */}
      <Stars radius={120} depth={60} count={6000} factor={4} saturation={0.3} fade />

      {/* Controls */}
      <GlobeControls controlsRef={controlsRef} />
    </Canvas>
  );
});

Globe.displayName = "Globe";
export default Globe;
