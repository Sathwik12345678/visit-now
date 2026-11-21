'use client';
import {Canvas,useFrame} from '@react-three/fiber';
import {RoundedBox,Text,OrbitControls,ContactShadows} from '@react-three/drei';
import {useRef} from 'react';
import * as THREE from 'three';
function Building(){const ref=useRef<THREE.Group>(null!);useFrame(({clock})=>{if(ref.current)ref.current.rotation.y=Math.sin(clock.elapsedTime*.25)*.13});return <group ref={ref} rotation={[0,-.25,0]}>
 <RoundedBox args={[3.25,2.7,1.55]} radius={.09} smoothness={4} position={[0,.7,0]}><meshStandardMaterial color="#f9fcff" metalness={.18} roughness={.3}/></RoundedBox>
 <RoundedBox args={[3.48,.24,1.72]} radius={.05} position={[0,2.14,0]}><meshStandardMaterial color="#168fe0"/></RoundedBox>
 <RoundedBox args={[1.2,.78,.12]} radius={.03} position={[0,.15,.84]}><meshStandardMaterial color="#b9e6f6" metalness={.5} roughness={.16}/></RoundedBox>
 {[-1.13,-.37,.39,1.15].map(x=>[.85,1.52].map(y=><group key={`${x}-${y}`}><RoundedBox args={[.48,.45,.055]} radius={.025} position={[x,y,.81]}><meshStandardMaterial color="#b9e0f8" metalness={.45} roughness={.18}/></RoundedBox><mesh position={[x,y,.843]}><planeGeometry args={[.02,.44]}/><meshBasicMaterial color="#fff"/></mesh></group>))}
 <RoundedBox args={[.65,.12,.1]} radius={.04} position={[0,2.32,.87]}><meshStandardMaterial color="#55c927"/></RoundedBox>
 <mesh position={[0,2.33,.93]}><boxGeometry args={[.13,.42,.04]}/><meshBasicMaterial color="#55c927"/></mesh>
 <mesh position={[0,2.33,.95]}><boxGeometry args={[.44,.13,.04]}/><meshBasicMaterial color="#55c927"/></mesh>
 <Text position={[0,-.63,.9]} fontSize={.14} color="#168fe0" anchorX="center">VISIT NOW · CONCEPT</Text>
 </group>}
export default function Hospital3D(){return <div className="three-wrap" aria-label="Interactive 3D illustration of a modern hospital"><Canvas dpr={[1,1.5]} camera={{position:[5,3.8,7],fov:35}} gl={{alpha:true,antialias:true}}><ambientLight intensity={1.7}/><directionalLight position={[3,6,4]} intensity={2.5}/><directionalLight position={[-3,3,-2]} intensity={1} color="#a3e9ff"/><Building/><ContactShadows position={[0,-.75,0]} opacity={.2} scale={7} blur={2.7}/><OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2.1} autoRotate autoRotateSpeed={.35}/></Canvas></div>}
