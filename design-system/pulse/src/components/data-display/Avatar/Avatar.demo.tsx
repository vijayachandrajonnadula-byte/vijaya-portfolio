import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Avatar, AvatarGroup } from './Avatar';
import type { AvatarSize } from './Avatar';

const sizes: AvatarSize[] = ['xxsmall', 'xsmall', 'small', 'medium', 'large'];
const photo = (a: string, b: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/><circle cx="20" cy="16" r="7" fill="#fff" opacity=".7"/></svg>`)}`;
const p1 = photo('#60a5fa', '#1e3a6e');
const p2 = photo('#f59e0b', '#ef4444');
const p3 = photo('#14b8a6', '#8b5cf6');
const row = { flexWrap: 'wrap', gap: 2, alignItems: 'center' } as const;

/** Avatar: 5 sizes x (default, initials, photo, emoji, splits, AI, badge) and AvatarGroup per size. */
export default function AvatarDemo() {
  return (
    <Stack spacing={2.5}>
      {sizes.map((s) => (
        <Stack key={s} direction="row" useFlexGap sx={row}>
          <Typography variant="textS" sx={{ width: 64 }}>{s}</Typography>
          <Avatar size={s} />
          <Avatar size={s}>VG</Avatar>
          <Avatar size={s} avatarColor="blue">VG</Avatar>
          <Avatar size={s} src={p1} alt="photo" />
          <Avatar size={s}>{'\u{1F913}'}</Avatar>
          <Avatar size={s} splits={[{ text: 'X' }, { text: 'V' }]} />
          <Avatar size={s} splits={[{ src: p1 }, { src: p2 }]} />
          <Avatar size={s} splits={[{ src: p1 }, { src: p2 }, { src: p3 }]} />
          <Avatar size={s} splits={[{ text: 'X' }, { text: 'Y' }, { text: 'Z' }]} />
          <Avatar size={s} ai badge />
          <Avatar size={s} badge>VG</Avatar>
        </Stack>
      ))}
      <Typography variant="textM">AvatarGroup</Typography>
      {sizes.map((s) => (
        <AvatarGroup key={s} size={s} max={3} onAdd={() => undefined}>
          <Avatar src={p1} />
          <Avatar src={p2} />
          <Avatar src={p3} />
          <Avatar>AB</Avatar>
          <Avatar>CD</Avatar>
        </AvatarGroup>
      ))}
      <AvatarGroup layout="pie" size="large"><Avatar src={p1} /><Avatar src={p2} /><Avatar src={p3} /></AvatarGroup>
    </Stack>
  );
}
