'use client';

import { useState } from 'react';

export function useToast(duration = 2500) {
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const open = (text: string) => {
    setMessage(text);
    setShow(true);

    setTimeout(() => {
      setShow(false);
    }, duration);
  };

  return {
    message,
    show,
    open,
  };
}
