'use client';
import { useEffect } from 'react';

export default function JsonLd({ data }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);
  return null;
}
