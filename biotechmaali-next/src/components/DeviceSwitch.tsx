'use client';

import { isMobile } from 'react-device-detect';
import React from 'react';

interface DeviceSwitchProps {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
}

/**
 * Renders different content based on device type.
 * Replaces the isMobile conditional routing from the CRA App.js.
 * 
 * Usage:
 *   <DeviceSwitch
 *     mobile={<MobileComponent />}
 *     desktop={<DesktopComponent />}
 *   />
 */
export default function DeviceSwitch({ mobile, desktop }: DeviceSwitchProps) {
  return <>{isMobile ? mobile : desktop}</>;
}
