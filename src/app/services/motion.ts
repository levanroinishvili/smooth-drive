import { Injectable, Injector } from '@angular/core';
import { defer, fromEvent, Observable, of, throwError } from 'rxjs';
import { distinctUntilKeyChanged, map, switchMap } from 'rxjs/operators';
import { NonNullableProps } from '../types/helpers';
import { throttleHighValue } from '../rxjs-extend';
import { AccelerationMeta, AccelerationSummary } from '../types';
import { CONFIG } from '../config/config';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { toSignal } from '@angular/core/rxjs-interop';

type Acceleration = NonNullableProps<DeviceMotionEventAcceleration>

@Injectable({ providedIn: 'root' })
export class MotionService {
  /** iOS requires a user gesture to request permission */
  async getPermission(): Promise<boolean> {
    try {
      const anyDM = DeviceMotionEvent as any;
      if (anyDM && typeof anyDM.requestPermission === 'function') {
        const res = await anyDM.requestPermission();
        return res === 'granted';
      }
      return true; // Android/desktop usually don’t prompt
    } catch {
      return false;
    }
  }

  /** Stream devicemotion events (accelerationIncludingGravity) */
  readonly acceleration$: Observable<AccelerationMeta> = defer(() => fromPromise(this.getPermission()))
  .pipe(
    switchMap(permission => permission ? of(permission) : throwError(() => new Error('Permission denied'))),
    switchMap(() => fromEvent<DeviceMotionEvent>(window, 'devicemotion')),
    map(getAcceleration),
    map(measureAcceleration),
    map(normalizeAcceleration),
    throttleHighValue(CONFIG.freezeHighValue, 'magnitudeAbs'),
    distinctUntilKeyChanged('percent'),
  )

  readonly acceleration = (injector?: Injector) => {
    return toSignal(this.acceleration$, {
      injector,
      initialValue: normalizeAcceleration(measureAcceleration({x: 0, y: 0, z: 0})),
    })
  }
}

const getAcceleration = (e: DeviceMotionEvent): Acceleration => ({
  x: e.acceleration?.x ?? 0,
  y: e.acceleration?.y ?? 0,
  z: e.acceleration?.z ?? 0,
})

/**
 * Quick summary of the acceleration.
 * @param accelearion As reported by the device motion event.
 * @returns the direction of the largest component of acceleration and the magnitude of the acceleration.
 */
const measureAcceleration = (accelearion: Acceleration): AccelerationSummary => {
  const { x, y, z } = accelearion;
  const magnitude = Math.sqrt(x * x + y * y + z * z)
  const xAbs = Math.abs(x)
  const yAbs = Math.abs(y)
  const zAbs = Math.abs(z)
  return xAbs > yAbs
    ? xAbs > zAbs ? {orientation: 'X', magnitude: Math.sign(x) * magnitude} : {orientation: 'Z', magnitude: -Math.sign(z) * magnitude}
    : yAbs > zAbs ? {orientation: 'Y', magnitude: Math.sign(y) * magnitude} : {orientation: 'Z', magnitude: -Math.sign(z) * magnitude}
}

const normalizeAcceleration = (acceleration: AccelerationSummary): AccelerationMeta => {
  // Ignore acceleration below a threshold
  const magnitude = Math.abs(acceleration.magnitude) > CONFIG.minAcceleration ? acceleration.magnitude : 0;
  const percent = 100 * (magnitude / CONFIG.maxAcceleration) // Percentage of the maximum acceleration
  const percentSafe = Math.min(100, Math.max(-100, percent)) // Clamp to [-100, 100] to avoid overflow
  return {
    ...acceleration,
    magnitudeAbs: Math.abs(magnitude),
    percent,
    percentSafe,
  }
}
