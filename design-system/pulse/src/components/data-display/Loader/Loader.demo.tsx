import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { loaderAnimations } from './loaders.generated';
import { DotsLoader, SlidingDotsLoader, Skeleton, SkeletonCard, Spinner, IllustrationLoader, loaderAnimationTypes } from './Loader';
import type { LoaderAnimationType } from './Loader';

const all: LoaderAnimationType[] = [...loaderAnimationTypes.filter((t) => t !== 'liquid2'), 'liquid1', 'liquid2', 'liquid3'];

/** Loader: spinner, dots, skeletons (box, circle, 4 card layouts) and every illustration animation. */
export default function LoaderDemo() {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
        <Typography variant="textS">Spinner</Typography>
        {[16, 24, 32, 48].map((s) => <Spinner key={s} size={s} />)}
      </Stack>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
        <Typography variant="textS">Dots</Typography>
        <DotsLoader />
        <Typography variant="textS">Sliding</Typography>
        <SlidingDotsLoader />
      </Stack>
      <Typography variant="textM">Skeleton (box, circle, skeletonAnimation Option 1-4)</Typography>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-start', flexWrap: 'wrap', rowGap: 3 }}>
        <Skeleton />
        <Skeleton shape="circle" />
        {([1, 2, 3, 4] as const).map((o) => <SkeletonCard key={o} option={o} />)}
      </Stack>
      <Typography variant="textM">Illustration loaders (looping; first frame under reduced motion)</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 3 }}>
        {all.map((t) => (
          <Stack key={t} spacing={1} sx={{ alignItems: 'center', justifyContent: 'flex-end', minHeight: 140 }}>
            <IllustrationLoader type={t} size={t === 'spinner' || t === 'dots' ? 40 : undefined} sx={{ maxWidth: 140 }} />
            <Typography variant="textS">{t}</Typography>
          </Stack>
        ))}
      </Box>
      <Typography variant="textM">Frames (each Figma variant, in prototype order)</Typography>
      {all.map((t) => (
        <Stack key={t} spacing={0.5}>
          <Typography variant="textS">{t} ({loaderAnimations[t].frames.length} frames)</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {loaderAnimations[t].frames.map((fr, i) => <IllustrationLoader key={fr.name} type={t} frame={i} size={Math.min(loaderAnimations[t].width, 64)} aria-label={fr.name} />)}
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}

