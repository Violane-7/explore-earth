import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import { getCountryFromLatLon } from "../../utils/geoUtils";

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

    // Convert 3D point (local space) → lat/lon
    const getLatLong = (localPoint) => {
        const { x, y, z } = localPoint;
        const radius = Math.sqrt(x * x + y * y + z * z);

        // Latitude: elevation angle from the XZ plane
        const lat = Math.asin(y / radius) * (180 / Math.PI);

        // Longitude: Three.js SphereGeometry uses these vertex equations:
        //   vertex.x = -R * cos(phi) * sin(theta)
        //   vertex.z =  R * sin(phi) * sin(theta)
        // where phi = u * 2π and u maps to the texture's horizontal axis.
        // For a standard equirectangular texture (prime meridian at center):
        //   u=0.5 → lon=0° → phi=π → x=+R, z=0
        //   u=0.75 → lon=90°E → phi=3π/2 → x=0, z=-R
        // Therefore: lon = atan2(-z, x)
        const lon = Math.atan2(-z, x) * (180 / Math.PI);

        return { lat, lon };
    };

    // Handle click
    const handleClick = (event) => {
        event.stopPropagation();

        // event.point is in world space — we need to convert to the
        // mesh's local space to account for rotation
        const mesh = event.object;
        const worldPoint = event.point.clone();
        const localPoint = mesh.worldToLocal(worldPoint);

        const { lat, lon } = getLatLong(localPoint);

        console.log("Lat:", lat.toFixed(2), "Lon:", lon.toFixed(2));

        const countryCode = getCountryFromLatLon(lat, lon);

        console.log("Country:", countryCode);
    };

    // Rotation
    useFrame(() => {
        if (earthRef.current && cloudRef.current) {
            earthRef.current.rotation.y += 0.0008;
            cloudRef.current.rotation.y += 0.001;
        }
    });

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