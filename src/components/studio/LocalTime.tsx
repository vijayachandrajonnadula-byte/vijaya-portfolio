import { useEffect, useState } from 'react';

const fmt = () =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());

/** Current time in Hyderabad (IST), updated every 20 seconds. */
export default function LocalTime({ className }: { className?: string }) {
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 20000);
    return () => window.clearInterval(id);
  }, []);
  return <time className={className} dateTime={t}>{t} IST</time>;
}
