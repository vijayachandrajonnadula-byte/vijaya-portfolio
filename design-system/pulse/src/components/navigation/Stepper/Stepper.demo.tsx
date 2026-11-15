import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Stepper } from './Stepper';

const steps = [1, 2, 3, 4, 5].map((n) => ({ metadata: `Step ${n}`, label: `Title` }));
const many = Array.from({ length: 8 }, (_, i) => ({ metadata: `Step ${i + 1}`, label: `Title` }));

/** Stepper: Direction x Text Position (circle states Not Started / Active / Completed / Focus via keyboard), clickable steps, +N overflow buttons. */
export default function StepperDemo() {
  const [active, setActive] = useState(2);
  return (
    <Stack spacing={3}>
      <Typography variant="textM" color="text.secondary">Horizontal, text right (clickable; Tab to a step for Focus)</Typography>
      <Stepper steps={steps} activeStep={active} onStepClick={setActive} />
      <Typography variant="textM" color="text.secondary">Horizontal, text bottom</Typography>
      <Stepper steps={steps.slice(0, 4)} activeStep={1} contentAlignment="bottom" />
      <Typography variant="textM" color="text.secondary">Horizontal, 8 steps with +N overflow buttons (maxSteps=4)</Typography>
      <Stepper steps={many} activeStep={4} maxSteps={4} showStatusText={false} />
      <Typography variant="textM" color="text.secondary">Vertical, text right</Typography>
      <Stepper steps={steps.slice(0, 4)} activeStep={1} orientation="vertical" />
      <Typography variant="textM" color="text.secondary">Vertical, text bottom (centered column)</Typography>
      <Stepper steps={steps.slice(0, 3)} activeStep={1} orientation="vertical" contentAlignment="bottom" />
      <Typography variant="textM" color="text.secondary">Vertical with +N overflow buttons</Typography>
      <Stepper steps={many} activeStep={4} maxSteps={3} orientation="vertical" showStatusText={false} />
    </Stack>
  );
}
