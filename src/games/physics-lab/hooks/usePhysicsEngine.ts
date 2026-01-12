import { useRef, useCallback, useEffect } from 'react';
import type { Vector2D, PhysicsObject, TrailPoint } from '../types';
import { PHYSICS_CONSTANTS } from '../types';

interface PhysicsEngineConfig {
  gravity: number;
  bounds: { width: number; height: number };
  groundY?: number;
  onCollision?: (obj: PhysicsObject, type: 'ground' | 'wall') => void;
  onUpdate?: (objects: PhysicsObject[], deltaTime: number) => void;
}

interface UsePhysicsEngineReturn {
  objects: React.MutableRefObject<PhysicsObject[]>;
  trails: React.MutableRefObject<Map<string, TrailPoint[]>>;
  addObject: (obj: PhysicsObject) => void;
  removeObject: (id: string) => void;
  clearObjects: () => void;
  applyForce: (id: string, force: Vector2D) => void;
  applyImpulse: (id: string, impulse: Vector2D) => void;
  setVelocity: (id: string, velocity: Vector2D) => void;
  setPosition: (id: string, position: Vector2D) => void;
  update: (deltaTime: number) => void;
  reset: () => void;
}

export function usePhysicsEngine(config: PhysicsEngineConfig): UsePhysicsEngineReturn {
  const objects = useRef<PhysicsObject[]>([]);
  const trails = useRef<Map<string, TrailPoint[]>>(new Map());
  const configRef = useRef(config);

  // Update config ref when it changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const addObject = useCallback((obj: PhysicsObject) => {
    objects.current.push(obj);
    trails.current.set(obj.id, []);
  }, []);

  const removeObject = useCallback((id: string) => {
    objects.current = objects.current.filter(obj => obj.id !== id);
    trails.current.delete(id);
  }, []);

  const clearObjects = useCallback(() => {
    objects.current = [];
    trails.current.clear();
  }, []);

  const applyForce = useCallback((id: string, force: Vector2D) => {
    const obj = objects.current.find(o => o.id === id);
    if (obj && !obj.isStatic) {
      // F = ma, so a = F/m
      obj.acceleration.x += force.x / obj.mass;
      obj.acceleration.y += force.y / obj.mass;
    }
  }, []);

  const applyImpulse = useCallback((id: string, impulse: Vector2D) => {
    const obj = objects.current.find(o => o.id === id);
    if (obj && !obj.isStatic) {
      // Impulse directly changes velocity: dv = impulse / mass
      obj.velocity.x += impulse.x / obj.mass;
      obj.velocity.y += impulse.y / obj.mass;
    }
  }, []);

  const setVelocity = useCallback((id: string, velocity: Vector2D) => {
    const obj = objects.current.find(o => o.id === id);
    if (obj) {
      obj.velocity = { ...velocity };
    }
  }, []);

  const setPosition = useCallback((id: string, position: Vector2D) => {
    const obj = objects.current.find(o => o.id === id);
    if (obj) {
      obj.position = { ...position };
    }
  }, []);

  const update = useCallback((deltaTime: number) => {
    const { gravity, bounds, groundY = bounds.height - 50, onCollision, onUpdate } = configRef.current;
    const dt = deltaTime / 1000; // Convert to seconds
    const ppm = PHYSICS_CONSTANTS.PIXELS_PER_METER;

    objects.current.forEach(obj => {
      if (obj.isStatic) return;

      // Apply gravity
      obj.acceleration.y = gravity * ppm;

      // Apply air resistance
      const speed = Math.sqrt(obj.velocity.x ** 2 + obj.velocity.y ** 2);
      if (speed > 0) {
        const dragForce = PHYSICS_CONSTANTS.AIR_RESISTANCE * speed * speed;
        obj.acceleration.x -= (obj.velocity.x / speed) * dragForce / obj.mass;
        obj.acceleration.y -= (obj.velocity.y / speed) * dragForce / obj.mass;
      }

      // Update velocity
      obj.velocity.x += obj.acceleration.x * dt;
      obj.velocity.y += obj.acceleration.y * dt;

      // Clamp velocity
      const maxVel = PHYSICS_CONSTANTS.MAX_VELOCITY;
      obj.velocity.x = Math.max(-maxVel, Math.min(maxVel, obj.velocity.x));
      obj.velocity.y = Math.max(-maxVel, Math.min(maxVel, obj.velocity.y));

      // Update position
      obj.position.x += obj.velocity.x * dt;
      obj.position.y += obj.velocity.y * dt;

      // Reset acceleration (forces need to be reapplied each frame)
      obj.acceleration = { x: 0, y: 0 };

      // Get object radius or half-height for collision
      const radius = obj.radius || (obj.height ? obj.height / 2 : 20);

      // Ground collision
      if (obj.position.y + radius >= groundY) {
        obj.position.y = groundY - radius;

        // Bounce with elasticity
        if (Math.abs(obj.velocity.y) > 10) {
          obj.velocity.y = -obj.velocity.y * obj.elasticity;
          onCollision?.(obj, 'ground');
        } else {
          obj.velocity.y = 0;
        }

        // Apply ground friction
        obj.velocity.x *= (1 - obj.friction);
      }

      // Wall collisions
      if (obj.position.x - radius <= 0) {
        obj.position.x = radius;
        obj.velocity.x = -obj.velocity.x * obj.elasticity;
        onCollision?.(obj, 'wall');
      }
      if (obj.position.x + radius >= bounds.width) {
        obj.position.x = bounds.width - radius;
        obj.velocity.x = -obj.velocity.x * obj.elasticity;
        onCollision?.(obj, 'wall');
      }

      // Update trail
      const trail = trails.current.get(obj.id);
      if (trail) {
        // Add new point
        trail.push({
          x: obj.position.x,
          y: obj.position.y,
          time: Date.now(),
          opacity: 1,
        });

        // Remove old points and fade
        const now = Date.now();
        const maxAge = 2000; // 2 seconds
        trails.current.set(
          obj.id,
          trail
            .filter(p => now - p.time < maxAge)
            .map(p => ({
              ...p,
              opacity: 1 - (now - p.time) / maxAge,
            }))
        );
      }
    });

    onUpdate?.(objects.current, deltaTime);
  }, []);

  const reset = useCallback(() => {
    objects.current = [];
    trails.current.clear();
  }, []);

  return {
    objects,
    trails,
    addObject,
    removeObject,
    clearObjects,
    applyForce,
    applyImpulse,
    setVelocity,
    setPosition,
    update,
    reset,
  };
}

// Helper function to create a ball object
export function createBall(
  id: string,
  x: number,
  y: number,
  radius: number = 20,
  color: string = '#00f5ff',
  mass: number = 1,
  elasticity: number = 0.8
): PhysicsObject {
  return {
    id,
    type: 'ball',
    position: { x, y },
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    mass,
    radius,
    color,
    elasticity,
    friction: 0.1,
    isStatic: false,
  };
}

// Helper function to create a block object
export function createBlock(
  id: string,
  x: number,
  y: number,
  width: number = 40,
  height: number = 40,
  color: string = '#ff00ff',
  mass: number = 1,
  elasticity: number = 0.5
): PhysicsObject {
  return {
    id,
    type: 'block',
    position: { x, y },
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    mass,
    width,
    height,
    color,
    elasticity,
    friction: 0.3,
    isStatic: false,
  };
}
