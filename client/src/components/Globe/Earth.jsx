import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export default function Earth() {
    const earthRef = useRef();
    const cloudRef = useRef();

    const texture = useLoader(
        THREE.TextureLoader,
        "/textures/earth.jpg"
    );

    const clouds = useLoader(
        THREE.TextureLoader,
        "/textures/clouds.png"
    );

    // Rotation
    useFrame(() => {
        if (earthRef.current && cloudRef.current) {
            earthRef.current.rotation.y += 0.0008;
            cloudRef.current.rotation.y += 0.001;
        }
    });

    const getLatLong = (point) => {
        const lat = Math.asin(point.y) * (180 / Math.PI);
        const lon = Math.atan2(point.z, point.x) * (180 / Math.PI);
        return { lat, lon };
    };

    const handleClick = (event) => {
        const { lat, lon } = getLatLong(event.point);
        console.log("Lat:", lat.toFixed(2), "Lon:", lon.toFixed(2));
    };

    return (
        <>
            {/* Earth */}
            <mesh ref={earthRef} onClick={handleClick}>
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
        </>
    );
}