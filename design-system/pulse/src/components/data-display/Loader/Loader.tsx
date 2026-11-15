// Figma: Loader page. Real loaders: ".Spinner" (12), ".dotsAnimation", ".dotLoaderAnimation", "skeletonLoader", "skeletonAnimation".
// Illustration loaders (test tube, capsule, tablet, heartbeat, liquid, search, scanning, ...) live in IllustrationLoaders.tsx\n// (frames generated from the Figma vectors by scripts/generate/pulse-loaders.mjs) and are re-exported here.
import { forwardRef } from 'react';
import { IllustrationLoader } from './IllustrationLoaders';
import Box from '@mui/material/Box';
import { keyframes } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

const shimmer = keyframes`from { transform: translateX(-100%); } to { transform: translateX(300%); }`;

type Sx = { sx?: SxProps<Theme> };
const merge = (a: object, sx?: SxProps<Theme>) => [a, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>;

export * from './IllustrationLoaders';

export interface SpinnerProps extends Sx {
  /** Outer box in px. @default 24 */
  size?: number;
}
/** Spinner (Figma .Spinner): the 12 Spinner 01-12 frames, 0.125s each, in a 24px box. */
export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(function Spinner({ size = 24, sx }, ref) {
  return <IllustrationLoader ref={ref} type="spinner" size={size} sx={sx} />;
});

/** Three dots that light up in turn (Figma .dotsAnimation, 6 frames, 40x40). */
export function DotsLoader({ sx }: Sx) {
  return <IllustrationLoader type="dots" sx={sx} />;
}

/** Sliding dots (Figma .dotLoaderAnimation, 7 frames, 26x5). */
export function SlidingDotsLoader({ sx }: Sx) {
  return <IllustrationLoader type="slidingDots" sx={sx} />;
}
export interface SkeletonProps extends Sx {
  /** @default "box" */
  shape?: 'box' | 'circle';
  width?: number | string;
  height?: number | string;
}
/** Skeleton block: #f8fafc base, white shimmer sweep; box radius 8, circle radius 100. */
export function Skeleton({ shape = 'box', width, height, sx }: SkeletonProps) {
  const circle = shape === 'circle';
  return (
    <Box
      aria-hidden
      sx={merge(
        {
          position: 'relative', overflow: 'hidden', flexShrink: 0, background: '#f8fafc',
          borderRadius: circle ? '100px' : '8px',
          width: width ?? (circle ? 40 : 300), height: height ?? (circle ? 40 : 32),
          '&::after': { content: '""', position: 'absolute', inset: 0, width: '40%', background: 'linear-gradient(270deg, #ffffff00 0%, #ffffffcc 50%, #ffffff00 100%)', animation: `${shimmer} 1.9s linear infinite` },
        },
        sx,
      )}
    />
  );
}

export interface SkeletonCardProps {
  /** Figma skeletonAnimation "Variant": 1 avatar + text, 2 image + text, 3 image + caption + block, 4 wide row. @default 1 */
  option?: 1 | 2 | 3 | 4;
  /** Option 1 width. @default 183 */
  width?: number;
}
/** Skeleton layouts (Figma skeletonAnimation Option 1-4). */
export function SkeletonCard({ option = 1, width = 183 }: SkeletonCardProps) {
  if (option === 2 || option === 3) {
    return (
      <Box sx={{ width: 120, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Skeleton width="100%" height={64} />
        {option === 2 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton height={8} width="100%" />
            <Skeleton height={8} width="100%" />
            <Skeleton height={8} width={78.69} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: '6px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Skeleton height={8} width={61} />
              <Skeleton height={8} width={61} />
            </Box>
            <Skeleton height={24} width={53} />
          </Box>
        )}
      </Box>
    );
  }
  if (option === 4) {
    return (
      <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center', width: 509, minHeight: 60 }}>
        <Box sx={{ p: '10px' }}><Skeleton shape="circle" /></Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Skeleton height={12} width={53.7} />
          <Skeleton height={8} width={53.7} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton height={12} width={69.36} />
          <Skeleton height={8} width={189.06} />
          <Skeleton height={8} width={189.06} />
        </Box>
        <Skeleton height={8} width={53.7} />
        <Skeleton height={16} width={53.7} />
      </Box>
    );
  }
  return (
    <Box sx={{ width, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <Skeleton shape="circle" />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Skeleton height={12} width="100%" />
          <Skeleton height={8} width="56%" />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton height={8} width="100%" />
        <Skeleton height={8} width="100%" />
        <Skeleton height={8} width="66%" />
      </Box>
    </Box>
  );
}


