import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Earth from "./Earth";

export default function Globe() {
    return (
        <Canvas camera={{ position: [0, 0, 3] }}>
            <ambientLight intensity={1} />
            <directionalLight position={[2, 2, 2]} />

            <Earth />

            <Stars radius={100} depth={50} count={5000} factor={4} />

            <OrbitControls enableZoom />
        </Canvas>
    );
}