import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useState } from "react";
import { getCountryFromLatLon } from "../../utils/geoUtils";

export default function Earth({ onCountrySelect, onHover, onHoverEnd, highlightedCountry }) {
  const earthRef = useRef();
  const cloudRef = useRef();
  const highlightRef = useRef();
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const texture = useLoader(THREE.TextureLoader, "/textures/earth.jpg");
  const clouds = useLoader(THREE.TextureLoader, "/textures/clouds.png");

  // Convert local 3D point → lat/lon
  const getLatLong = (localPoint) => {
    const { x, y, z } = localPoint;
    const radius = Math.sqrt(x * x + y * y + z * z);
    const lat = Math.asin(y / radius) * (180 / Math.PI);
    const lon = Math.atan2(-z, x) * (180 / Math.PI);
    return { lat, lon };
  };

  const handlePointerDown = () => setIsPointerDown(false);
  const handlePointerUp = (event) => {
    if (!isPointerDown) {
      handleClick(event);
    }
  };

  const handleClick = (event) => {
    event.stopPropagation();
    const mesh = event.object;
    const worldPoint = event.point.clone();
    const localPoint = mesh.worldToLocal(worldPoint);
    const { lat, lon } = getLatLong(localPoint);
    const code = getCountryFromLatLon(lat, lon);
    onCountrySelect?.(code);
  };

  const handlePointerMove = (event) => {
    setIsPointerDown(true);
    if (event.object.name !== "earth") return;

    const mesh = event.object;
    const worldPoint = event.point.clone();
    const localPoint = mesh.worldToLocal(worldPoint);
    const { lat, lon } = getLatLong(localPoint);
    const code = getCountryFromLatLon(lat, lon);

    setHoveredCountry(code || null);

    if (code && onHover) {
      onHover(code, { x: event.clientX, y: event.clientY });
    } else if (!code && onHoverEnd) {
      onHoverEnd();
    }
  };

  const handlePointerLeave = () => {
    setHoveredCountry(null);
    onHoverEnd?.();
  };

  useFrame(() => {
    // Slow auto-rotation — pause when country selected for clean UX
    if (earthRef.current && cloudRef.current && !highlightedCountry) {
      earthRef.current.rotation.y += 0.0006;
      cloudRef.current.rotation.y += 0.0009;
    } else if (cloudRef.current) {
      // Clouds always drift slightly
      cloudRef.current.rotation.y += 0.0003;
    }

    // Pulsing glow when country selected
    if (highlightRef.current && highlightedCountry) {
      const pulse = Math.sin(Date.now() * 0.002) * 0.04 + 1;
      highlightRef.current.scale.setScalar(1.12 * pulse);
    }
  });

  return (
    <>
      {/* Earth sphere */}
      <mesh
        ref={earthRef}
        name="earth"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef} scale={[1.012, 1.012, 1.012]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          map={clouds}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere glow (always visible) */}
      <mesh scale={[1.06, 1.06, 1.06]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#3a8fff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Selection glow — pulsing green ring when country selected */}
      {highlightedCountry && (
        <mesh ref={highlightRef} scale={[1.12, 1.12, 1.12]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#00e87a"
            transparent
            opacity={0.18}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Hover glow — warm orange when hovering over a country (no selection) */}
      {hoveredCountry && !highlightedCountry && (
        <mesh scale={[1.04, 1.04, 1.04]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#ff9500"
            transparent
            opacity={0.12}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </>
  );
}
