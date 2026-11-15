import '../../styles/electro.css';

/** A small resistor with colour bands between two wires: a quiet divider. Decorative only. */
export default function ResistorBands({ className = '' }: { className?: string }) {
  return (
    <svg className={`el-resistor ${className}`.trim()} viewBox="0 0 160 20" width="160" height="20" aria-hidden="true" focusable="false">
      <path d="M0 10h38M122 10h38" className="el-resistor__wire" />
      <rect x="38" y="3" width="84" height="14" rx="7" className="el-resistor__body" />
      <rect x="54" y="3" width="6" height="14" className="el-resistor__b1" />
      <rect x="68" y="3" width="6" height="14" className="el-resistor__b2" />
      <rect x="82" y="3" width="6" height="14" className="el-resistor__b3" />
      <rect x="104" y="3" width="5" height="14" className="el-resistor__b4" />
    </svg>
  );
}
