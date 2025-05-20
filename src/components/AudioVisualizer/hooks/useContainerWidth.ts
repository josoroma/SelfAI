import { useEffect, useState, RefObject } from "react";

/**
 * React hook to get the width and device pixel ratio (dpr) of a container element.
 * @param ref - React ref object pointing to the container element.
 * @returns { width, dpr }
 */
export function useContainerWidth<T extends HTMLElement>(ref: RefObject<T>) {
  const [width, setWidth] = useState(500);
  const [dpr, setDpr] = useState(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  useEffect(() => {
    const update = () => {
      if (ref.current) setWidth(ref.current.offsetWidth);
      setDpr(window.devicePixelRatio || 1);
    };
    update();
    const ro = new window.ResizeObserver(update);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener('resize', update);
    window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).addEventListener('change', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).removeEventListener('change', update);
    };
  }, [ref]);
  return { width, dpr };
}
