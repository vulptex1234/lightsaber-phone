'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSound from 'use-sound';
// import './lightsaber.css';

type SaberColor = 'blue' | 'red' | 'green' | 'purple' | 'yellow' | 'darksaber';

export default function LightsaberV3() {
  const [selectedColor, setSelectedColor] = useState<SaberColor>('green');
  // activate, deactivate sound
  const [isOn, setIsOn] = useState(false);
  const [saberActivate] = useSound('/sounds/switch/activate.wav');
  const [saberDeactivate] = useSound('/sounds/switch/deactivate.wav');

  // swing sounds
  const [swing1] = useSound('/sounds/swing/swing_1.wav');
  const [swing2] = useSound('/sounds/swing/swing_2.wav');
  const [swing3] = useSound('/sounds/swing/swing_3.wav');
  const [swing4] = useSound('/sounds/swing/swing_4.wav');
  const [swing5] = useSound('/sounds/swing/swing_5.wav');

  // hit sounds
  const [hit1] = useSound('/sounds/hit/hit_1.wav');
  const [hit2] = useSound('/sounds/hit/hit_2.wav');
  const [hit3] = useSound('/sounds/hit/hit_3.wav');
  const [hit4] = useSound('/sounds/hit/hit_4.wav');
  const [hit5] = useSound('/sounds/hit/hit_5.wav');

  const swingSounds = [swing1, swing2, swing3, swing4, swing5];
  const hitSounds = [hit1, hit2, hit3, hit4, hit5];
  // 実行時 ↓↓↓↓↓
  // const randomIndex = Math.floor(Math.random() * swingSounds.length);
  // swingSounds[randomIndex](); // ランダムなswing音を再生

  const [hasPermission, setHasPermission] = useState(false);
  // request motion permission to device
  const requestMotionPermission = async () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      // @ts-ignore
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        // @ts-ignore
        const permissionState = await DeviceMotionEvent.requestPermission();
        setHasPermission(permissionState === 'granted');
      } catch (error) {
        console.error('Error requesting motion permission:', error);
      }
    } else {
      setHasPermission(true);
    }
  };

  useEffect(() => {
    let lastSwing = 0;
    let lastHit = 0;
    const SWING_COOLDOWN = 250;
    const HIT_COOLDOWN = 500;
    const HIT_THRESHOLD = 12;

    const handleMotion = (event: DeviceMotionEvent) => {
      const now = Date.now();
      if (!isOn) return;

      const acceleration = event.acceleration;
      if (acceleration) {
        const totalAcceleration = Math.sqrt(
          (acceleration.x || 0) ** 2 +
            (acceleration.y || 0) ** 2 +
            (acceleration.z || 0) ** 2
        );

        if (
          totalAcceleration > HIT_THRESHOLD &&
          now - lastHit >= HIT_COOLDOWN
        ) {
          const randomIndex = Math.floor(Math.random() * hitSounds.length);
          hitSounds[randomIndex]();
          lastHit = now;
        } else if (totalAcceleration > 8 && now - lastSwing >= SWING_COOLDOWN) {
          const randomIndex = Math.floor(Math.random() * swingSounds.length);
          swingSounds[randomIndex]();
          lastSwing = now;
        }
      }
    };

    if (hasPermission) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isOn, swingSounds, hasPermission]);

  const handleClick = () => {
    if (!hasPermission) {
      requestMotionPermission();
    }

    if (isOn) {
      saberDeactivate();
    } else {
      saberActivate();
    }
    setIsOn(!isOn);
  };

  return (
    // <div>
    //   <h1 className="title">Saber Phone</h1>
    //   <div>
    //     <p>Make your phone a lightsaber</p>
    //   </div>

    //   <button onClick={handleClick}>Ignite phone saber</button>

    //   <div></div>
    // </div>
    <>
      <title>phone saber</title>
      {/* <h1>Phone Saber</h1> */}
      <label htmlFor="green">G</label>
      <input
        type="radio"
        id="green"
        name="color"
        checked={selectedColor === 'green'}
        onChange={() => setSelectedColor('green')}
      />
      <label htmlFor="blue">B</label>
      <input
        type="radio"
        id="blue"
        name="color"
        checked={selectedColor === 'blue'}
        onChange={() => setSelectedColor('blue')}
      />
      <label htmlFor="yellow">Y</label>
      <input
        type="radio"
        id="yellow"
        name="color"
        checked={selectedColor === 'yellow'}
        onChange={() => setSelectedColor('yellow')}
      />
      <label htmlFor="purple">P</label>
      <input
        type="radio"
        id="purple"
        name="color"
        checked={selectedColor === 'purple'}
        onChange={() => setSelectedColor('purple')}
      />
      <label htmlFor="red">R</label>
      <input
        type="radio"
        id="red"
        name="color"
        checked={selectedColor === 'red'}
        onChange={() => setSelectedColor('red')}
      />
      <label htmlFor="darksaber">D</label>
      <input
        type="radio"
        id="darksaber"
        name="color"
        checked={selectedColor === 'darksaber'}
        onChange={() => setSelectedColor('darksaber')}
      />
      <div className="lightsaber">
        <input type="checkbox" onChange={handleClick} id="on-off" />
        {/* <button onClick={handleClick} id="on-off"></button> */}
        <div className="blade"></div>
        <label className="hilt" htmlFor="on-off"></label>
      </div>
    </>
  );
}
