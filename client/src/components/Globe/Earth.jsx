import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function Earth() {
    const texture = useLoader(
        THREE.TextureLoader,
        "/textures/earth.jpg"
    );

    return (
        <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}