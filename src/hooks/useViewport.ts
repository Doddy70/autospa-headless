import { useEffect, useState } from "react";

export type Viewport = { w: number; h: number };

/**
 * Fixed fallback used for the server render AND the first client render.
 * Reading `window` during render makes the first client markup differ from
 * the server markup (hydration mismatch), so real dimensions are only
 * applied inside the effect, after hydration has finished.
 */
const DEFAULT_VIEWPORT: Viewport = { w: 1280, h: 800 };

/** Tracks the live viewport size, updating on resize. */
export function useViewport(): Viewport {
	const [vp, setVp] = useState<Viewport>(DEFAULT_VIEWPORT);

	useEffect(() => {
		const onResize = () =>
			setVp({ w: window.innerWidth, h: window.innerHeight });
		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	return vp;
}
