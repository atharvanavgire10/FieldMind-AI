import React from 'react';

/**
 * FieldMind AI brand mark — original artwork for this project.
 *
 * Concept: three stacked field readings (widest = raw signal, narrowing as
 * the diagnosis resolves) with an amber riser and node lifting out of the
 * stack — the moment raw field data becomes an actionable insight.
 * Field position + narrowing diagnosis + rising signal.
 */

type Tone = 'onDark' | 'onLight';

interface MarkProps {
  className?: string;
  /** Size in px for width/height. Defaults to 24. */
  size?: number;
  title?: string;
}

const SIGNAL = '#E8A13A';

/** Bare glyph. Stack bars inherit `currentColor`; the riser is always amber. */
export const FieldMindMark: React.FC<MarkProps> = ({ className = '', size = 24, title }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : true}
    aria-label={title}
    fill="none"
  >
    {title ? <title>{title}</title> : null}
    <rect x="2.5" y="7" width="12" height="2.4" rx="0.5" fill="currentColor" />
    <rect x="2.5" y="11.8" width="8" height="2.4" rx="0.5" fill={SIGNAL} />
    <rect x="2.5" y="16.6" width="5" height="2.4" rx="0.5" fill="currentColor" opacity="0.5" />
    <rect x="17.6" y="8.6" width="2.4" height="10.4" rx="1.2" fill={SIGNAL} />
    <circle cx="18.8" cy="5.2" r="2.3" fill={SIGNAL} />
  </svg>
);

interface PlateProps {
  /** Container edge length in px. Defaults to 36. */
  size?: number;
  className?: string;
  tone?: Tone;
}

/** The mark seated in a machined graphite plate — used wherever the logo
 *  needs to hold its own against a busy background. */
export const FieldMindPlate: React.FC<PlateProps> = ({ size = 36, className = '', tone = 'onLight' }) => (
  <span
    className={[
      'inline-flex shrink-0 items-center justify-center rounded-plate text-deck-50',
      tone === 'onDark'
        ? 'bg-chassis-700 ring-1 ring-chassis-500/70'
        : 'bg-chassis-900 ring-1 ring-chassis-900',
      className,
    ].join(' ')}
    style={{ width: size, height: size }}
  >
    <FieldMindMark size={Math.round(size * 0.62)} />
  </span>
);

interface WordmarkProps {
  className?: string;
  tone?: Tone;
  /** Show the small "AI" suffix tag. Defaults to true. */
  showSuffix?: boolean;
}

/** FIELDMIND set in condensed signage type, with a restrained mono "AI" tag. */
export const FieldMindWordmark: React.FC<WordmarkProps> = ({
  className = '',
  tone = 'onLight',
  showSuffix = true,
}) => (
  <span className={`inline-flex items-baseline gap-1.5 leading-none ${className}`}>
    <span
      className={`fm-display ${tone === 'onDark' ? 'text-deck-50' : 'text-ink-900'}`}
      style={{ letterSpacing: '0.005em' }}
    >
      FIELDMIND
    </span>
    {showSuffix && (
      <span
        className={`font-mono text-[0.58em] font-semibold tracking-[0.14em] ${
          tone === 'onDark' ? 'text-signal-500' : 'text-signal-700'
        }`}
      >
        AI
      </span>
    )}
  </span>
);

interface LogoProps {
  className?: string;
  tone?: Tone;
  plateSize?: number;
  /** Tailwind text size class applied to the wordmark. */
  wordmarkClassName?: string;
  showSuffix?: boolean;
}

/** Lockup: plate + wordmark. */
export const FieldMindLogo: React.FC<LogoProps> = ({
  className = '',
  tone = 'onLight',
  plateSize = 34,
  wordmarkClassName = 'text-lg',
  showSuffix = true,
}) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <FieldMindPlate size={plateSize} tone={tone} />
    <FieldMindWordmark tone={tone} className={wordmarkClassName} showSuffix={showSuffix} />
  </span>
);
