import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`glass rounded-xl p-6 hover-card ${className}`}>
      {children}
    </div>
  );
} 