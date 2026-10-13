export const CLIMB_CYCLE = 20.5;
export const SWIM_CYCLE = 16;
const clamp = x => Math.max(0, Math.min(1, x));
const smooth = x => { const p = clamp(x); return p * p * (3 - 2 * p); };
const lerp = (a, b, t) => a + (b - a) * t;
const cycle = (time, duration) => ((time % duration) + duration) % duration;

export function climbPose(time) {
  const t = cycle(time, CLIMB_CYCLE);
  let phase = 'rest', x = 0, y = 0, effort = 0, side = 1, loweringProgress = 0;
  if (t >= .6 && t < 8.4) {
    phase = 'climbing';
    const progress = (t - .6) / 7.8 * 8;
    const step = Math.floor(progress), fraction = progress - step;
    side = step % 2 ? -1 : 1;
    effort = Math.sin(fraction * Math.PI);
    y = -192 * (step + smooth(fraction)) / 8;
    x = 5 * Math.sin((step + smooth(fraction)) * Math.PI);
  } else if (t >= 8.4 && t < 9.4) {
    phase = 'top'; y = -192;
  } else if (t >= 9.4 && t < 18.8) {
    phase = 'lowering';
    const p = (t - 9.4) / 9.4;
    loweringProgress = p;
    y = lerp(-192, 0, smooth(p));
    x = Math.sin(p * Math.PI * 2) * 2;
  }
  const released = phase === 'lowering' ? smooth((t - 9.4) / .55) : phase === 'rest' ? 1 : 0;
  const leftReach = side === 1 ? effort : 0, rightReach = side === -1 ? effort : 0;
  const leftArm = [[-6,-9],[-15,lerp(-17,-6,released)],[-18,lerp(-29-leftReach*8,-14,released)]];
  const rightArm = [[6,-9],[15,lerp(-16,-5,released)],[18,lerp(-29-rightReach*8,-15,released)]];
  const tuck = phase === 'lowering' ? .2+.6*Math.sin(loweringProgress*Math.PI) : phase === 'climbing' ? effort : .2;
  const leftLeg = [[-3,10],[-12,18-(side===1?tuck*9:tuck*3)],[-15,31-(side===1?tuck*11:tuck*3)]];
  const rightLeg = [[3,10],[12,18-(side===-1?tuck*9:tuck*3)],[15,31-(side===-1?tuck*11:tuck*3)]];
  return {phase,x,y,leftArm,rightArm,leftLeg,rightLeg};
}

export function swimPose(time) {
  const t = cycle(time, SWIM_CYCLE);
  let phase, x, scale = 1, roll = 0, tuck = 0;
  if (t < 6.9) { phase = 'outbound'; x = 182 * t / 6.9; }
  else if (t < 8) {
    phase = 'right-turn'; x = 182;
    const p = smooth((t - 6.9) / 1.1);
    scale = Math.cos(Math.PI*p); tuck = Math.sin(Math.PI*p); roll = tuck * -155;
  } else if (t < 14.9) { phase = 'return'; x = 182 * (1-(t-8)/6.9); scale = -1; }
  else {
    phase = 'left-turn'; x = 0;
    const p = smooth((t-14.9)/1.1);
    scale = -Math.cos(Math.PI*p); tuck = Math.sin(Math.PI*p); roll = tuck * 155;
  }
  return {phase,x,scale,roll,tuck,y:tuck*3};
}
