'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './SevenCardSection.module.css';

// ============================================
// CARD IMAGES
// ============================================
const CARD_SRCS = [
  '/assets/autospa-cards/Anti-Rust-1.jpg',
  '/assets/autospa-cards/Premium-Wash.jpg',
  '/assets/autospa-cards/Eksterior-2.jpg',
  '/assets/autospa-cards/Interior-Detailing.jpg',
  '/assets/autospa-cards/Eksterior-Detailing.jpg',
  '/assets/autospa-cards/PPF.jpg',
  '/assets/autospa-cards/Engine-BAy.jpg',
];

// ============================================
// CARD CONFIGURATION
// ============================================
const CARD_SIZE = 220;
const CARD_RADIUS = 18;

// ============================================
// FAN POSITIONS (relative to fan center)
// ============================================
// These offsets describe where each card is relative to the fan center
// Negative X = left of center, Positive X = right of center
const FAN_OFFSETS = [
  { x: -480, y: 18, rotate: -18, scale: 0.88 },   // Card 1 - leftmost
  { x: -310, y: 6, rotate: -10, scale: 0.92 },    // Card 2
  { x: -155, y: -2, rotate: -4, scale: 0.96 },    // Card 3
  { x: 0, y: -8, rotate: 0, scale: 1.0 },         // Card 4 - center
  { x: 160, y: -2, rotate: 5, scale: 0.96 },      // Card 5
  { x: 320, y: 6, rotate: 12, scale: 0.92 },      // Card 6
  { x: 480, y: 18, rotate: 20, scale: 0.88 },    // Card 7 - rightmost
] as const;

// ============================================
// CASCADE POSITIONS (relative to cascade origin)
// ============================================
// These are offsets from the final cascade origin point
const CASCADE_OFFSETS = [
  { x: 0, y: 0, rotate: -3 },    // Card 1 - top-left
  { x: 150, y: 70, rotate: 0 },  // Card 2
  { x: 300, y: 140, rotate: 3 }, // Card 3
  { x: 450, y: 210, rotate: 6 }, // Card 4 - center
  { x: 600, y: 280, rotate: 9 }, // Card 5
  { x: 750, y: 350, rotate: 12 },// Card 6
  { x: 900, y: 420, rotate: 15 },// Card 7 - bottom-right
] as const;

// ============================================
// ANIMATION PHASES (normalized progress 0→1)
// ============================================
const PHASE_GATHER_END = 0.30;  // FAN → STACK
const PHASE_MOVE_END = 0.60;    // STACK → MOVE
// PHASE_MOVE_END → 1.00: MOVE → CASCADE

// ============================================
// ANCHORS (from actual DOM measurements)
// ============================================
// ANCHOR A: Initial Fan Center
// - Cards start near Hero bottom, overlapping by 80px
// - Fan center Y = Hero bottom - overlap
const FAN_CENTER_Y = 810; // Hero bottom (890) - 80px overlap

// ANCHOR B: Final Cascade Origin
// - Cascade origin positioned relative to Section 2 content
// - Origin Y = Content h2 top - offset
const CASCADE_ORIGIN_Y = 1732; // Content h2 top (1932) - 200px

// Stack center is midpoint between fan and cascade
const STACK_CENTER_Y = (FAN_CENTER_Y + CASCADE_ORIGIN_Y) / 2;

// ============================================
// HELPER FUNCTIONS
// ============================================
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ============================================
// CARD COMPONENT
// ============================================
interface CardProps {
  index: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  zIndex: number;
  cardSize: number;
}

function Card({ index, x, y, rotate, scale, zIndex, cardSize }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={styles.card}
      style={{
        width: cardSize,
        height: cardSize,
        zIndex: isHovered ? 30 : zIndex,
      }}
      animate={{
        x: x - cardSize / 2,
        y: y - cardSize / 2,
        rotate,
        scale: isHovered ? scale * 1.03 : scale,
      }}
      transition={{
        x: { duration: 0.05, ease: 'linear' },
        y: { duration: 0.05, ease: 'linear' },
        rotate: { duration: 0.05, ease: 'linear' },
        scale: { duration: 0.2 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={CARD_SRCS[index]}
        alt={`Service ${index + 1}`}
        draggable={false}
      />
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function SevenCardSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [vpSize, setVpSize] = useState({ width: 1440, height: 900 });
  const [isInView, setIsInView] = useState(false);
  const [cardSize, setCardSize] = useState(CARD_SIZE);

  // Update viewport and responsive card size
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setVpSize({ width, height });

      // Responsive card sizes
      if (width < 480) {
        setCardSize(70);
      } else if (width < 768) {
        setCardSize(90);
      } else if (width < 1024) {
        setCardSize(130);
      } else if (width < 1440) {
        setCardSize(170);
      } else {
        setCardSize(CARD_SIZE);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Check if section is in view
      const inView = rect.top < viewportHeight && rect.bottom > 0;
      setIsInView(inView);

      // Calculate progress through section
      // When section top hits viewport top = progress 0
      // When section bottom hits viewport top = progress 1
      const sectionTop = rect.top;
      const sectionScrollY = -sectionTop;
      const scrollableHeight = sectionHeight - viewportHeight;

      if (scrollableHeight <= 0) {
        setScrollProgress(1);
        return;
      }

      const progress = Math.max(0, Math.min(1, sectionScrollY / scrollableHeight));
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate card positions based on scroll progress
  const getCardPositions = useCallback(() => {
    const { width: vpWidth } = vpSize;
    const scaleFactor = cardSize / CARD_SIZE;

    // Fan center X is viewport center
    const fanCenterX = vpWidth / 2;
    const fanCenterY = FAN_CENTER_Y * scaleFactor;

    // Stack center
    const stackCenterX = vpWidth / 2;
    const stackCenterY = STACK_CENTER_Y * scaleFactor;

    // Cascade origin
    // Adjust for viewport - cascade should be positioned to the left of content
    const cascadeOriginX = vpWidth * 0.35;
    const cascadeOriginY = CASCADE_ORIGIN_Y * scaleFactor;

    // Responsive cascade scale to keep cards in view
    const cascadeWidth = 900 * scaleFactor;
    const maxCascadeX = vpWidth - 100;
    const cascadeScale = Math.min(1, maxCascadeX / cascadeWidth);

    return CARD_SRCS.map((_, index) => {
      const fan = FAN_OFFSETS[index]!;
      const cascade = CASCADE_OFFSETS[index]!;

      // === INITIAL FAN POSITION ===
      const initialX = fanCenterX + fan.x * scaleFactor;
      const initialY = fanCenterY + fan.y * scaleFactor;
      const initialRotate = fan.rotate;
      const initialScale = fan.scale;
      const initialZ = fan.x < 0 ? 7 - Math.abs(index - 3) : 7 - Math.abs(index - 3);

      // === STACK POSITION ===
      const stackX = stackCenterX;
      const stackY = stackCenterY;

      // === FINAL CASCADE POSITION ===
      const finalX = cascadeOriginX + cascade.x * cascadeScale * scaleFactor;
      const finalY = cascadeOriginY + cascade.y * cascadeScale * scaleFactor;
      const finalRotate = cascade.rotate;
      const finalScale = 1;
      const finalZ = 7 - index; // First card is on top

      // === INTERPOLATE BASED ON PROGRESS ===
      let x: number, y: number, rotate: number, scale: number, zIndex: number;
      const p = scrollProgress;

      if (p <= PHASE_GATHER_END) {
        // PHASE 1: FAN → STACK (0.00 - 0.30)
        const t = easeOutCubic(p / PHASE_GATHER_END);
        x = lerp(initialX, stackX, t);
        y = lerp(initialY, stackY, t);
        rotate = lerp(initialRotate, 0, t);
        scale = lerp(initialScale, 1, t);
        zIndex = lerp(initialZ, 4, t);
      } else if (p <= PHASE_MOVE_END) {
        // PHASE 2: STACK → MOVE (0.30 - 0.60)
        const t = easeOutCubic((p - PHASE_GATHER_END) / (PHASE_MOVE_END - PHASE_GATHER_END));
        x = lerp(stackX, finalX, t);
        y = stackY; // Stay centered vertically during move
        rotate = 0;
        scale = 1;
        zIndex = 4;
      } else {
        // PHASE 3: MOVE → CASCADE (0.60 - 1.00)
        const t = easeOutCubic((p - PHASE_MOVE_END) / (1 - PHASE_MOVE_END));
        x = lerp(stackCenterX, finalX, t);
        y = lerp(stackCenterY, finalY, t);
        rotate = lerp(0, finalRotate, t);
        scale = 1;
        zIndex = finalZ;
      }

      return { x, y, rotate, scale, zIndex };
    });
  }, [scrollProgress, vpSize, cardSize]);

  const cardPositions = getCardPositions();

  // Content
  const eyebrow = 'AUTOMOTIVE DETAILING';
  const headingLines = [
    { text: 'REFINE, PROTECT', color: 'primary' },
    { text: '& PRESERVE YOUR', color: 'accent' },
    { text: 'VEHICLE.', color: 'primary' },
  ];
  const description = 'More than just a clean car. AutoSPA combines precision detailing, paint correction, ceramic coating, and paint protection to keep your vehicle looking its best.';

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-section="two"
    >
      {/* Visual Stage - sticky container for card animation */}
      <div className={styles.stickyContainer}>
        {/* Cards - always mounted, animated based on scroll */}
        {CARD_SRCS.map((_, index) => {
          const pos = cardPositions[index]!;
          return (
            <Card
              key={`card-${index + 1}`}
              index={index}
              x={pos.x}
              y={pos.y}
              rotate={pos.rotate}
              scale={pos.scale}
              zIndex={pos.zIndex}
              cardSize={cardSize}
            />
          );
        })}

        {/* Floating Tags - appear after cascade */}
        {scrollProgress > 0.7 && (
          <>
            <motion.div
              className={styles.floatingTagPrimary}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              PAINT PROTECTION
            </motion.div>
            <motion.div
              className={styles.floatingTagSecondary}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              PRECISION DETAILING
            </motion.div>
          </>
        )}
      </div>

      {/* Section Content */}
      <div className={styles.content}>
        <span className={styles.eyebrow}>{eyebrow}</span>

        <h2 className={styles.heading}>
          {headingLines.map((line, lineIndex) => (
            <span key={lineIndex} className={styles.headingLine}>
              {line.text.split(' ').map((word, wordIndex) => {
                const globalIndex = lineIndex * 3 + wordIndex;
                return (
                  <motion.span
                    key={wordIndex}
                    className={line.color === 'accent' ? styles.accentWord : styles.primaryWord}
                    initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                    animate={{
                      opacity: isInView ? 1 : 0,
                      filter: isInView ? 'blur(0px)' : 'blur(10px)',
                      y: isInView ? 0 : 20,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: globalIndex * 0.06,
                      ease: 'easeOut',
                    }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h2>

        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 0.8 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {description}
        </motion.p>

        <motion.div
          className={styles.ctaWrapper}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <button className={styles.ctaPrimary}>EXPLORE OUR SERVICES</button>
          <button className={styles.ctaSecondary}>BOOK YOUR CAR</button>
        </motion.div>
      </div>
    </section>
  );
}
