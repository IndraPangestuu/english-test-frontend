import { useState, useCallback, useEffect } from 'react';

interface FullscreenOptions {
  onExitFullscreen?: () => void;
}

export function useFullscreenLock(options?: FullscreenOptions) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = useCallback(async (element: HTMLElement) => {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    }
    setIsFullscreen(true);
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
    setIsFullscreen(false);
  }, []);

  const handleFullscreenChange = useCallback(() => {
    const currentlyFullscreen =
      document.fullscreenElement || (document as any).webkitFullscreenElement;
    if (!currentlyFullscreen) {
      setIsFullscreen(false);
      if (options?.onExitFullscreen) {
        options.onExitFullscreen();
      }
    }
  }, [options]);

  // Attach event
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  return { isFullscreen, enterFullscreen, exitFullscreen };
}
