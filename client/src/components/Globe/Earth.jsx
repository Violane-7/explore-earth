import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useState } from "react";
import { getCountryFromLatLon } from "../../utils/geoUtils";

export default function Earth({ onCountrySelect, onHover, onHoverEnd, highlightedCountry, viewMode }) {
  const earthRef = useRef();
  const cloudRef = useRef();
  const highlightRef = useRef();
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const texture = useLoader(THREE.TextureLoader, "/textures/earth.jpg");
  const clouds = useLoader(THREE.TextureLoader, "/textures/clouds.png");

  const getLatLong = (localPoint) => {
    const { x, y, z } = localPoint;
    const radius = Math.sqrt(x * x + y * y + z * z);
    const lat = Math.asin(y / radius) * (180 / Math.PI);
    const lon = Math.atan2(-z, x) * (180 / Math.PI);
    return { lat, lon };
  };

  const handleClick = (event) => {
    event.stopPropagation();

    const mesh = event.object;
    const worldPoint = event.point.clone();
    const localPoint = mesh.worldToLocal(worldPoint);
    const { lat, lon } = getLatLong(localPoint);
    const countryCode = getCountryFromLatLon(lat, lon);

    if (onCountrySelect) {
      onCountrySelect(countryCode);
    }
  };

  const handlePointerMove = (event) => {
    if (event.object.name !== "earth") return;

    const mesh = event.object;
    const worldPoint = event.point.clone();
    const localPoint = mesh.worldToLocal(worldPoint);
    const { lat, lon } = getLatLong(localPoint);
    const countryCode = getCountryFromLatLon(lat, lon);

    if (countryCode && onHover) {
      const position = {
        x: event.clientX,
        y: event.clientY
      };
      onHover(countryCode, position);
    }
    setHoveredCountry(countryCode);
  };

  const handlePointerLeave = () => {
    setHoveredCountry(null);
    if (onHoverEnd) onHoverEnd();
  };

  useFrame(() => {
    if (earthRef.current && cloudRef.current) {
      earthRef.current.rotation.y += 0.0008;
      cloudRef.current.rotation.y += 0.001;
    }

    // Add subtle pulsing effect to highlighted country glow
    if (highlightRef.current && highlightedCountry) {
      const time = Date.now() * 0.001;
      const pulse = Math.sin(time * 2) * 0.05 + 1;
      highlightRef.current.scale.set(1.15 * pulse, 1.15 * pulse, 1.15 * pulse);
    }
  });

  return (
    <>
      {/* Earth */}
      <mesh ref={earthRef} onClick={handleClick} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} name="earth">
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          map={clouds}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Glow */}
      <mesh scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#3aa7ff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Highlight glow when country is selected */}
      {highlightedCountry && (
        <mesh ref={highlightRef} scale={[1.15, 1.15, 1.15]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            color="#00ff88"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Hover glow */}
      {hoveredCountry && !highlightedCountry && (
        <mesh scale={[1.05, 1.05, 1.05]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            color="#ff9500"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </>
  );
}
