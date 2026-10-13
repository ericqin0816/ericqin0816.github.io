import {climbPose, swimPose} from './motion.mjs';
const scene = document.querySelector('.athlete-scene');
if (scene) {
  const $ = selector => scene.querySelector(selector);
  const climber = $('.climb-motion');
  const rope = $('.belay-rope');
  const swimmer = $('.swim-travel');
  const direction = $('.swim-direction');
  const posture = $('.swim-posture');
  const stroke = $('.swim-stroke');
  const snorlax = $('.snorlax-sprite');
  const frameEnds = snorlax.dataset.frameDurations.split(',').reduce((ends, duration) => {
    ends.push((ends.at(-1) || 0) + Number(duration));
    return ends;
  }, []);
  const sleepCycle = frameEnds.at(-1);
  let sleepFrame = -1;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const format = n => Number(n.toFixed(3));
  function line(points) { return points.map(([x,y],i) => `${i?'L':'M'}${format(x)} ${format(y)}`).join(' '); }
  const limbSelectors = [['leftArm','.climb-left-arm'],['rightArm','.climb-right-arm'],['leftLeg','.climb-left-leg'],['rightLeg','.climb-right-leg']];
  function render(seconds) {
    const c = climbPose(seconds);
    climber.setAttribute('transform', `translate(${format(c.x)} ${format(c.y)})`);
    climber.dataset.phase = c.phase;
    rope.setAttribute('d', `M0 -231L${format(c.x)} ${format(c.y+8)}`);
    limbSelectors.forEach(([key,selector]) => {
      const group = $(selector), points = c[key];
      group.querySelector('path').setAttribute('d',line(points));
      const end = points[2];
      const hand = group.querySelector('circle');
      if(hand){hand.setAttribute('cx',format(end[0]));hand.setAttribute('cy',format(end[1]));}
      const shoe = group.querySelector('.character-shoe');
      if(shoe) shoe.setAttribute('d',`M${format(end[0])} ${format(end[1])}h${key==='leftLeg'?'-6':'6'}`);
    });
    const s = swimPose(seconds);
    swimmer.setAttribute('transform',`translate(${format(s.x)} 0)`);
    swimmer.dataset.phase = s.phase;
    direction.setAttribute('transform',`scale(${format(s.scale)} 1)`);
    posture.setAttribute('transform',`translate(0 ${format(s.y)}) rotate(${format(s.roll)})`);
    $('.swim-head').setAttribute('transform',`translate(${format(-6*s.tuck)} ${format(s.tuck)})`);
    $('.swim-kick path').setAttribute('d',`M0 0L${format(-14+8*s.tuck)} ${format(8*s.tuck)}L${format(-21+13*s.tuck)} ${format(-5+5*s.tuck)}`);
    stroke.setAttribute('transform',`rotate(${format(s.tuck > .1 ? -35 : (seconds % 1.4)/1.4*360)})`);
    const nextFrame = preference.matches ? frameEnds.length - 1 : frameEnds.findIndex(end => (seconds * 1000) % sleepCycle < end);
    if (nextFrame !== sleepFrame) {
      sleepFrame = nextFrame;
      snorlax.setAttribute('viewBox', `${sleepFrame * 81} 0 81 81`);
      snorlax.dataset.frame = String(sleepFrame);
    }
  }
  let seconds = preference.matches ? 4 : 2;
  let frameId = null, last = null;
  render(seconds);
  const shouldRun = () => scene.dataset.motion === 'playing' && !document.hidden && !preference.matches;
  function tick(now) {
    frameId = null;
    if (!shouldRun()) {last = null;return;}
    if (last !== null) seconds += Math.min((now-last)/1000,.1);
    last = now;
    render(seconds);
    frameId = requestAnimationFrame(tick);
  }
  function sync() {
    if (shouldRun()) {if(frameId === null) frameId = requestAnimationFrame(tick);}
    else {if(frameId !== null) cancelAnimationFrame(frameId);frameId = null;last = null;}
  }
  new MutationObserver(sync).observe(scene,{attributes:true,attributeFilter:['data-motion']});
  document.addEventListener('visibilitychange',sync);
  preference.addEventListener('change',() => {if(preference.matches)render(4);sync();});
  sync();
}
