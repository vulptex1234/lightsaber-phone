'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSound from 'use-sound';

type SaberColor = 'blue' | 'red' | 'green' | 'purple' | 'yellow';

export default function LightsaberV3() {
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

  const swingSounds = [swing1, swing2, swing3, swing4, swing5];
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
    const SWING_COOLDOWN = 250;

    const handleMotion = (event: DeviceMotionEvent) => {
      const now = Date.now();
      if (!isOn || now - lastSwing < SWING_COOLDOWN) return;

      const acceleration = event.acceleration;
      if (acceleration) {
        const totalAcceleration = Math.sqrt(
          (acceleration.x || 0) ** 2 +
            (acceleration.y || 0) ** 2 +
            (acceleration.z || 0) ** 2
        );

        if (totalAcceleration > 8) {
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
    <div>
      <h1>Saber Phone</h1>
      <div>
        <p>Make your phone a lightsaber</p>
      </div>

      <input
        type="image"
        src="/image/lightsaber.webp"
        id="lightsaber-pic"
      ></input>
      <button onClick={handleClick}>Ignite phone saber</button>
    </div>
  );
}
