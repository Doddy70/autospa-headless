'use client';

import {
	type MotionValue,
	motion,
	useMotionValue,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from "framer-motion";
import Image from 'next/image';
import { type RefObject, useEffect, useState, useMemo } from "react";
import { useViewport, type Viewport } from "@/hooks/useViewport";
import {
	CARD_SIZE,
	CARD_SRCS,
	getTimeForProgress,
	hoverEase,
	smoothEase,
} from "@/lib/scrollCards";

/* ------------------------------------------------------------------ *
 * Slot & cascade shapes
 * ------------------------------------------------------------------ */
interface Slot {
	x: number;
	y: number;
	rotate: number;
	scale: number;
	z: number;
}

interface CascadeSlot {
	top: number;
	left: number;
	rotate: number;
	z: number;
}

/* ------------------------------------------------------------------ *
 * Intro choreography timing. All in seconds.
 * ------------------------------------------------------------------ */
const introDelay = 0.8;
const introDuration = 0.72;
const travelToRightDuration = 0.6;
const sweepLeftDuration = 1.6;
const totalDuration = introDuration + travelToRightDuration + sweepLeftDuration;
const sweepStart = introDelay + introDuration + travelToRightDuration;

/* ------------------------------------------------------------------ *
 * Responsive slot configuration based on viewport width
 * ------------------------------------------------------------------ */
function getSlots(w: number): Slot[] {
	// Scale factor based on viewport width
	// Desktop (1440+) uses full size, smaller screens scale down
	const scale = Math.min(1, w / 1440);

	// Scale card size
	const cardSize = Math.round(CARD_SIZE * scale);

	// Base fan offsets
	const baseSlots = [
		{ x: -480, y: 18, rotate: -18, scale: 0.88, z: 1 },
		{ x: -310, y: 6, rotate: -10, scale: 0.92, z: 2 },
		{ x: -155, y: -2, rotate: -4, scale: 0.96, z: 3 },
		{ x: 0, y: -8, rotate: 0, scale: 1, z: 4 },
		{ x: 160, y: -2, rotate: 5, scale: 0.96, z: 3 },
		{ x: 320, y: 6, rotate: 12, scale: 0.92, z: 2 },
		{ x: 480, y: 18, rotate: 20, scale: 0.88, z: 1 },
	];

	// Scale slots for smaller screens
	if (w < 768) {
		// Mobile: reduce fan spread significantly
		const mobileScale = 0.35;
		return baseSlots.map(s => ({
			...s,
			x: Math.round(s.x * mobileScale),
			y: Math.round(s.y * mobileScale),
		}));
	} else if (w < 1024) {
		// Tablet: reduce fan spread
		const tabletScale = 0.5;
		return baseSlots.map(s => ({
			...s,
			x: Math.round(s.x * tabletScale),
			y: Math.round(s.y * tabletScale),
		}));
	} else if (w < 1440) {
		// Small desktop: moderate reduction
		const smallScale = 0.7;
		return baseSlots.map(s => ({
			...s,
			x: Math.round(s.x * smallScale),
			y: Math.round(s.y * smallScale),
		}));
	}

	return baseSlots;
}

function getCascade(w: number): CascadeSlot[] {
	const scale = Math.min(1, w / 1440);

	// Scale cascade for responsiveness
	const baseCascade = Array.from({ length: 7 }, (_, i) => ({
		top: 300 + i * 70,
		left: 20 + i * 150,
		rotate: -3 + i * 3,
		z: 7 - i,
	}));

	if (w < 768) {
		// Mobile: much tighter cascade
		const mobileScale = 0.35;
		return baseCascade.map(c => ({
			...c,
			top: Math.round(c.top * mobileScale),
			left: Math.round(c.left * mobileScale),
		}));
	} else if (w < 1024) {
		// Tablet
		const tabletScale = 0.5;
		return baseCascade.map(c => ({
			...c,
			top: Math.round(c.top * tabletScale),
			left: Math.round(c.left * tabletScale),
		}));
	} else if (w < 1440) {
		// Small desktop
		const smallScale = 0.7;
		return baseCascade.map(c => ({
			...c,
			top: Math.round(c.top * smallScale),
			left: Math.round(c.left * smallScale),
		}));
	}

	return baseCascade;
}

function getCardSize(w: number): number {
	if (w < 480) return 70;
	if (w < 768) return 90;
	if (w < 1024) return 130;
	if (w < 1440) return 170;
	return CARD_SIZE;
}

function getHeroRowY(h: number): number {
	// Position cards BELOW the Hero
	// Hero is full viewport height (~890px), so cards start at ~920px
	// This ensures NO overlap with Hero
	return Math.round(h * 1.02);
}

/* ------------------------------------------------------------------ *
 * Shared card chrome
 * ------------------------------------------------------------------ */
function cardShellStyle(z: number, cardSize: number): React.CSSProperties {
	return {
		position: "absolute",
		top: "0px",
		left: "0px",
		width: `${cardSize}px`,
		height: `${cardSize}px`,
		borderRadius: "18px",
		overflow: "hidden",
		boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
		zIndex: String(z),
		willChange: "transform",
		opacity: "0",
	} as React.CSSProperties;
}

function CardImage({ src, cardSize }: { src: string; cardSize: number }) {
	return (
		<Image
			src={src}
			alt=""
			width={cardSize}
			height={cardSize}
			quality={80}
			sizes="(max-width: 768px) 90px, 130px"
			style={{ width: '100%', height: '100%', objectFit: 'cover' }}
			priority
		/>
	);
}

/* ------------------------------------------------------------------ *
 * Lead card (index 0): three-phase choreographed entrance.
 * ------------------------------------------------------------------ */
function LeadIntroCard({
	vp,
	hovered,
	setHovered,
	onComplete,
	slots,
	cardSize,
}: {
	vp: Viewport;
	hovered: boolean;
	setHovered: (v: boolean) => void;
	onComplete: () => void;
	slots: ReturnType<typeof getSlots>;
	cardSize: number;
}) {
	const slot6 = slots[6]!;
	const slot0 = slots[0]!;
	const heroRowY = getHeroRowY(vp.h);

	return (
		<motion.div
			data-pallet-card="0"
			style={cardShellStyle(hovered ? 30 : slot0.z, cardSize)}
			initial={false}
			animate={{
				x: [vp.w / 2, vp.w / 2, vp.w / 2 + slot6.x, vp.w / 2 + slot0.x],
				y: [
					vp.h / 2 + 180,
					heroRowY,
					heroRowY + slot6.y,
					heroRowY + slot0.y,
				],
				rotate: [0, 0, slot6.rotate, slot0.rotate],
				scale: [0.3, 1, slot6.scale, slot0.scale],
				opacity: [0, 1, 1, 1],
			}}
			transition={{
				delay: introDelay,
				duration: totalDuration,
				times: [
					0,
					introDuration / totalDuration,
					(introDuration + travelToRightDuration) / totalDuration,
					1,
				],
				ease: [smoothEase, smoothEase, smoothEase],
			}}
			onAnimationComplete={onComplete}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			whileHover={{ transition: { duration: 0.2, ease: hoverEase } }}
		>
			<CardImage src={CARD_SRCS[0]!} cardSize={cardSize} />
		</motion.div>
	);
}

/* ------------------------------------------------------------------ *
 * Follower intro cards (indices 1..6)
 * ------------------------------------------------------------------ */
function FollowerIntroCard({
	index,
	vp,
	revealed,
	onRevealed,
	hovered,
	setHovered,
	slots,
	cardSize,
}: {
	index: number;
	vp: Viewport;
	revealed: boolean;
	onRevealed: () => void;
	hovered: boolean;
	setHovered: (v: boolean) => void;
	slots: ReturnType<typeof getSlots>;
	cardSize: number;
}) {
	const slot = slots[index]!;
	const heroRowY = getHeroRowY(vp.h);

	const progress = (slot.x - slots[6]!.x) / (slots[0]!.x - slots[6]!.x);
	const revealTime = getTimeForProgress(progress, smoothEase);
	const revealDelay = sweepStart + revealTime * sweepLeftDuration;
	const revealDuration = index <= 3 ? 0.06 : 0.18;

	const cx = vp.w / 2 + slot.x;
	const cy = heroRowY + slot.y;

	return (
		<motion.div
			data-pallet-card={index}
			style={{
				...cardShellStyle(hovered ? 30 : slot.z, cardSize),
				x: cx,
				y: cy,
				rotate: slot.rotate,
				scale: slot.scale,
			}}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={
				revealed
					? { duration: 0.25, ease: hoverEase }
					: { delay: revealDelay, duration: revealDuration, ease: "easeOut" }
			}
			onAnimationComplete={() => {
				if (!revealed) onRevealed();
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			whileHover={{ transition: { duration: 0.2, ease: hoverEase } }}
		>
			<CardImage src={CARD_SRCS[index]!} cardSize={cardSize} />
		</motion.div>
	);
}

/* ------------------------------------------------------------------ *
 * Scroll-linked card
 * ------------------------------------------------------------------ */
function ScrollLinkedCard({
	index,
	clamped,
	lp,
	vp,
	slots,
	cascade,
	cardSize,
}: {
	index: number;
	clamped: MotionValue<number>;
	lp: number;
	vp: Viewport;
	slots: ReturnType<typeof getSlots>;
	cascade: ReturnType<typeof getCascade>[number];
	cardSize: number;
}) {
	const [hovered, setHovered] = useState(false);

	const slot = slots[index]!;
	const heroRowY = getHeroRowY(vp.h);

	const p1 = lp * 0.33;
	const p2 = lp * 0.66;

	const s1Cx = vp.w / 2 + slot.x;
	const s1Cy = heroRowY + slot.y;
	const stackCx = vp.w / 2;
	const stackCy = vp.h / 2;
	const cascadeLeftRef = vp.w * 0.4;
	const s2Cx = cascadeLeftRef + cascade.left + cardSize / 2;
	const s2Cy = cascade.top + cardSize / 2;

	const x = useTransform(
		clamped,
		[0, p1, p2, lp],
		[s1Cx, stackCx, stackCx, s2Cx],
	);
	const y = useTransform(clamped, [0, p1, p2, lp], [s1Cy, stackCy, s2Cy, s2Cy]);
	const rotate = useTransform(
		clamped,
		[0, p1, lp],
		[slot.rotate, 0, cascade.rotate],
	);
	const scaleX = useTransform(clamped, [0, p1, lp], [slot.scale, 1, 1]);
	const scaleY = useTransform(clamped, [0, p1, lp], [slot.scale, 1, 1]);

	return (
		<motion.div
			data-pallet-card={index}
			style={{
				...cardShellStyle(hovered ? 30 : cascade.z, cardSize),
				x,
				y,
				rotate,
				scaleX,
				scaleY,
				pointerEvents: "auto",
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			whileHover={{ transition: { duration: 0.2, ease: hoverEase } }}
		>
			<CardImage src={CARD_SRCS[index]!} cardSize={cardSize} />
		</motion.div>
	);
}

/* ------------------------------------------------------------------ *
 * PalletRossCards
 * ------------------------------------------------------------------ */
export default function PalletRossCards({
	containerRef,
}: {
	containerRef: RefObject<HTMLDivElement | null>;
}) {
	const vp = useViewport();

	const slots = useMemo(() => getSlots(vp.w), [vp.w]);
	const cascade = useMemo(() => getCascade(vp.w), [vp.w]);
	const cardSize = useMemo(() => getCardSize(vp.w), [vp.w]);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	});

	const [lockProgress, setLockProgress] = useState(0.5);
	const [scrollableHeight, setScrollableHeight] = useState(1);

	const [currentProgress, setCurrentProgress] = useState(0);
	const clamped = useMotionValue(0);
	const lp = Math.max(lockProgress, 0.05);

	useEffect(() => {
		let scrollable = 1;
		let lockP = 0.5;

		const measure = () => {
			const container = containerRef.current;
			const sectionTwo = document.querySelector<HTMLElement>(
				'[data-section="two"]',
			);
			if (!container || !sectionTwo) return;

			const containerTop =
				container.getBoundingClientRect().top + window.scrollY;
			const containerScrollHeight = container.scrollHeight;
			const innerHeight = window.innerHeight;
			scrollable = Math.max(1, containerScrollHeight - innerHeight);
			const sectionTwoTop =
				sectionTwo.getBoundingClientRect().top + window.scrollY;

			const raw = (sectionTwoTop - containerTop) / scrollable;
			lockP = Math.min(0.99, Math.max(0.05, raw));

			setScrollableHeight(scrollable);
			setLockProgress(lockP);
			onScroll();
		};

		const onScroll = () => {
			const v = Math.min(1, Math.max(0, window.scrollY / scrollable));
			setCurrentProgress(v);
			clamped.set(Math.min(v, Math.max(lockP, 0.05)));
		};

		measure();
		const t = window.setTimeout(measure, 300);
		window.addEventListener("resize", measure);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.clearTimeout(t);
			window.removeEventListener("resize", measure);
			window.removeEventListener("scroll", onScroll);
		};
	}, [containerRef, clamped]);

	useMotionValueEvent(scrollYProgress, "change", (v) => {
		if (v <= 0) return;
		setCurrentProgress(v);
		clamped.set(Math.min(v, lp));
	});

	const [introDone, setIntroDone] = useState(false);
	const [revealed, setRevealed] = useState<boolean[]>(() =>
		Array(7).fill(false),
	);

	useEffect(() => {
		const fullIntro = (introDelay + totalDuration + 0.4) * 1000;
		const id = window.setTimeout(() => setIntroDone(true), fullIntro);
		return () => window.clearTimeout(id);
	}, []);

	const [leadHovered, setLeadHovered] = useState(false);
	const [hoveredFollower, setHoveredFollower] = useState<number | null>(null);

	const markRevealed = (i: number) =>
		setRevealed((prev) => {
			if (prev[i]) return prev;
			const next = prev.slice();
			next[i] = true;
			return next;
		});

	// Hide on very small screens
	if (vp.w < 360) {
		return null;
	}

	// ----------------------------------------------------------------
	// INTRO MODE
	// ----------------------------------------------------------------
	if (!introDone) {
		return (
			<div
				suppressHydrationWarning
				style={{
					position: "fixed",
					inset: 0,
					zIndex: 5,
					pointerEvents: "none",
				}}
				aria-hidden
			>
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<FollowerIntroCard
						key={`card-${i}`}
						index={i}
						vp={vp}
						revealed={revealed[i]!}
						onRevealed={() => markRevealed(i)}
						hovered={hoveredFollower === i}
						setHovered={(v) => setHoveredFollower(v ? i : null)}
						slots={slots}
						cardSize={cardSize}
					/>
				))}
				<LeadIntroCard
					key="card-0"
					vp={vp}
					hovered={leadHovered}
					setHovered={setLeadHovered}
					onComplete={() => setIntroDone(true)}
					slots={slots}
					cardSize={cardSize}
				/>
			</div>
		);
	}

	// ----------------------------------------------------------------
	// SCROLL-LINKED MODE
	// ----------------------------------------------------------------
	const isLocked = currentProgress >= lp;
	const wrapperStyle: React.CSSProperties = isLocked
		? {
				position: "absolute",
				top: lp * scrollableHeight,
				left: 0,
				width: "100%",
				height: vp.h,
				zIndex: 5,
			}
		: { position: "fixed", inset: 0, zIndex: 5 };

	return (
		<div
			suppressHydrationWarning
			data-progress={currentProgress.toFixed(3)}
			data-locked={String(isLocked)}
			style={{ ...wrapperStyle, pointerEvents: "none" }}
		>
			{CARD_SRCS.map((_, i) => (
				<ScrollLinkedCard
					key={`card-${i}`}
					index={i}
					clamped={clamped}
					lp={lp}
					vp={vp}
					slots={slots}
					cascade={cascade[i]!}
					cardSize={cardSize}
				/>
			))}
		</div>
	);
}
