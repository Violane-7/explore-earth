import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Earth from "./Earth";

export default function Globe() {
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
            <Earth />

            {/* Stars */}
            <Stars radius={100} depth={50} count={5000} factor={4} />

            {/* Controls */}
            <OrbitControls
                makeDefault
                enableZoom
                enablePan={false}
                dampingFactor={0.05}
                enableDamping
            />
        </Canvas>
    );
}