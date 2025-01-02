import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export default function horizontalLoop(items, config = {}) {
  items = gsap.utils.toArray(items);

  const { repeat = 0, paused = false, reversed = false, speed = 1, paddingRight = 0, draggable = false, onChange } = config;

  let tl = gsap.timeline({
    repeat,
    paused,
    defaults: { ease: "none" },
    onUpdate: onChange
      ? () => {
          // optional: trigger the onChange callback
        }
      : null,
    onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
  });

  let length = items.length,
    startX = items[0].offsetLeft,
    widths = [],
    xPercents = [],
    pixelsPerSecond = speed * 100,
    snap = gsap.utils.snap(1),
    totalWidth;

  gsap.set(items, {
    xPercent: (i, el) => {
      const w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
      xPercents[i] = snap((parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 + gsap.getProperty(el, "xPercent"));
      return xPercents[i];
    },
  });

  gsap.set(items, { x: 0 });

  totalWidth = items[length - 1].offsetLeft + (xPercents[length - 1] / 100) * widths[length - 1] - startX + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + paddingRight;

  items.forEach((item, i) => {
    const curX = (xPercents[i] / 100) * widths[i],
      distanceToStart = item.offsetLeft + curX - startX,
      distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");

    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    ).fromTo(
      item,
      {
        xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100),
      },
      {
        xPercent: xPercents[i],
        duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
        immediateRender: false,
      },
      distanceToLoop / pixelsPerSecond
    );
  });

  tl.progress(1, true).progress(0, true);
  if (reversed) tl.reverse();

  if (draggable && typeof Draggable === "function") {
    const proxy = document.createElement("div");
    let ratio = 1 / totalWidth;
    let startProgress = 0;

    const draggableInstance = Draggable.create(proxy, {
      trigger: items[0].parentNode,
      type: "x",
      inertia: true,
      onPress() {
        tl.pause();
        gsap.killTweensOf(tl);
        startProgress = tl.progress();
      },
      onRelease() {
        tl.play();
      },
      onDrag() {
        tl.progress(startProgress + (this.startX - this.x) * ratio);
      },
      onThrowUpdate() {
        tl.progress(startProgress + (this.startX - this.x) * ratio);
      },
    })[0];

    tl.draggable = draggableInstance;
  }

  // ----- SCROLL FUNCTIONALITY -----
  function onScroll(event) {
    const delta = event.deltaY || -event.wheelDelta || event.detail;
    const direction = Math.sign(delta);

    gsap.to(tl, {
      time: "+=" + direction * 2, // multiplier
      modifiers: {
        time: (time) => gsap.utils.wrap(0, tl.duration(), time),
      },
      ease: "power1.out",
      overwrite: true,
    });
  }

  window.addEventListener("wheel", onScroll);

  // Cleanup function for scroll listener
  tl.killScroll = () => {
    window.removeEventListener("wheel", onScroll);
  };

  return tl;
}
