'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSound from 'use-sound';

export default function Lightsaber() {
  const [isOn, setIsOn] = useState(false);
  const [playOn] = useSound('/sounds/lightsaber-on.mp3');
  const [playOff] = useSound('/sounds/lightsaber-off.mp3');
  const [playSwing] = useSound('/sounds/lightsaber-swing.mp3');
  const [hasPermission, setHasPermission] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    acceleration: 0,
    lastSwing: 0,
    permissionStatus: 'unknown',
  });

  const requestMotionPermission = async () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      // @ts-ignore: Property 'requestPermission' exists on type 'DeviceMotionEvent'
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        // @ts-ignore
        const permissionState = await DeviceMotionEvent.requestPermission();
        setHasPermission(permissionState === 'granted');
        setDebugInfo((prev) => ({
          ...prev,
          permissionStatus: permissionState,
        }));
      } catch (error) {
        console.error('Error requesting motion permission:', error);
        setDebugInfo((prev) => ({ ...prev, permissionStatus: 'error' }));
      }
    } else {
      // デバイスモーションAPIが利用可能な場合（Android等）
      setHasPermission(true);
      setDebugInfo((prev) => ({
        ...prev,
        permissionStatus: 'granted (default)',
      }));
    }
  };

  useEffect(() => {
    let lastSwing = 0;
    const SWING_COOLDOWN = 500; // ミリ秒単位でのクールダウン時間

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

        setDebugInfo((prev) => ({
          ...prev,
          acceleration: Math.round(totalAcceleration * 100) / 100,
          lastSwing: now,
        }));

        if (totalAcceleration > 15) {
          playSwing();
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
  }, [isOn, playSwing, hasPermission]);

  const handleClick = () => {
    if (!hasPermission) {
      requestMotionPermission();
    }

    if (isOn) {
      playOff();
    } else {
      playOn();
    }
    setIsOn(!isOn);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* デバッグ情報 */}
      <div className="fixed top-0 left-0 bg-black/80 text-white p-4 text-sm font-mono">
        <div>Permission: {debugInfo.permissionStatus}</div>
        <div>Acceleration: {debugInfo.acceleration}</div>
        <div>
          Last Swing:{' '}
          {debugInfo.lastSwing > 0
            ? new Date(debugInfo.lastSwing).toLocaleTimeString()
            : 'Never'}
        </div>
        <div>Saber: {isOn ? 'ON' : 'OFF'}</div>
      </div>

      {!hasPermission && (
        <button
          onClick={requestMotionPermission}
          className="absolute top-[-40px] bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          モーションセンサーを有効化
        </button>
      )}

      {/* ライトセーバーの持ち手 */}
      <div className="relative w-16 h-64 bg-gradient-to-b from-gray-300 to-gray-600 rounded-full">
        {/* スイッチ */}
        <button
          onClick={handleClick}
          className="absolute top-1/3 right-0 w-6 h-12 bg-red-600 rounded-lg transform translate-x-1/2"
        />
        {/* 装飾パーツ */}
        <div className="absolute top-4 w-full h-4 bg-black"></div>
        <div className="absolute bottom-4 w-full h-4 bg-black"></div>
        <div className="absolute top-1/4 w-full h-2 bg-gray-800"></div>
        <div className="absolute bottom-1/4 w-full h-2 bg-gray-800"></div>
      </div>

      {/* ブレード */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOn ? 400 : 0,
          opacity: isOn ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 w-8 bg-blue-500 rounded-full transform -translate-y-full"
        style={{
          boxShadow: isOn ? '0 0 20px 10px #3b82f6' : 'none',
        }}
      />
    </div>
  );
}
