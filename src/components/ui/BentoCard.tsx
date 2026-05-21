import React from 'react'

interface BentoCardProps {
  number?: string
  title: string
  children?: React.ReactNode
  className?: string
}

export default function BentoCard({ number, title, children, className = '' }: BentoCardProps) {
  return (
    <div className={['bento-card', className].filter(Boolean).join(' ')}>
      {number && <span className="bento-card__number">{number}</span>}
      <h3 className="bento-card__title">{title}</h3>
      {children && <div className="bento-card__row">{children}</div>}
    </div>
  )
}
