'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useToast(duration = 2500) {
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const open = useCallback(
    (text: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setMessage(text);
      setShow(true);

      timerRef.current = setTimeout(() => {
        setShow(false);
      }, duration);
    },
    [duration],
  );

  return {
    message,
    show,
    open,
  };
}
