import type { SVGProps } from 'react';

/** Generic brand mark for the top of the LeftNav rail: a pulse trace. 29.27 x 31.99. Pass `logo` to LeftNav to replace it. */
export function LeftNavLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={29.27} height={31.99} viewBox="0 0 29.27 31.99" aria-hidden fill="none" {...props}>
      <path d="M1.5 17h6.2l3.4-9.4 5.2 18.3 3.9-12.6 1.7 3.7h6" stroke="#2eb0cc" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
