"use client"

import { useCallback, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Modal = ({ children, closeFunction }: { 
  children: ReactNode, 
  closeFunction?: () => void 
}) => {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  
  const router = useRouter();

  const onDismiss = useCallback(() => {
    if (typeof closeFunction === "function") closeFunction()
    
    router.push('/')
  }, [router]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target === overlay.current) && onDismiss) {
      onDismiss()
    } 
  }, [onDismiss, overlay]);

  return (
    <div ref={overlay} className="modal" onClick={handleClick}>
      <button type="button" onClick={onDismiss}
        className="absolute top-4 right-8"
      >
        <Image
          src="/close.svg"
          width={17}
          height={17}
          alt="close"
        />
      </button>

      <div ref={wrapper} className="modal_wrapper">
        {children}
      </div>
    </div>
  )
}

export default Modal