import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Carousel, CarouselPagination } from './Carousel';

const Slide = ({ n, tone }: { n: number; tone: string }) => (
  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tone, fontSize: 24 }}>Slide {n}</Box>
);
const tones = ['#eef3fb', '#f0fdf4', '#fffbeb', '#fef2f2'];
const darkTones = ['#1e3a6e', '#14532d', '#78350f', '#7f1d1d'];

export default function CarouselDemo() {
  const [page, setPage] = useState(1);
  return (
    <Stack spacing={8} sx={{ pl: 20, pr: 20 }}>
      <Box>
        <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>Light, indicator outside (lined), arrows outside</Typography>
        <Carousel width={640} height={260} indicatorType="lined" arrowPosition="outside">
          {tones.map((t, i) => <Slide key={t} n={i + 1} tone={t} />)}
        </Carousel>
      </Box>
      <Box>
        <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>Light, indicator outside (circle), arrows inside</Typography>
        <Carousel width={640} height={260}>
          {tones.map((t, i) => <Slide key={t} n={i + 1} tone={t} />)}
        </Carousel>
      </Box>
      <Box>
        <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>Dark, indicator inside (circle), arrows inside, loop</Typography>
        <Carousel width={640} height={260} theme="dark" indicatorPosition="inside" loop>
          {darkTones.map((t, i) => <Slide key={t} n={i + 1} tone={t} />)}
        </Carousel>
      </Box>
      <Box>
        <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>Dark, indicator inside (lined), square large arrows outside</Typography>
        <Carousel width={640} height={260} theme="dark" indicatorPosition="inside" indicatorType="lined" arrowPosition="outside" arrowShape="square" arrowSize="large">
          {darkTones.map((t, i) => <Slide key={t} n={i + 1} tone={t} />)}
        </Carousel>
      </Box>
      <Box>
        <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>CarouselPagination alone: circle / lined / dark</Typography>
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
          <CarouselPagination count={5} value={page} onChange={setPage} />
          <CarouselPagination count={5} value={page} onChange={setPage} type="lined" />
          <Box sx={{ background: '#0f172a', p: 1, borderRadius: 1 }}>
            <CarouselPagination count={5} value={page} onChange={setPage} theme="dark" />
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

