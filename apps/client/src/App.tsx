import React, { useEffect, useRef } from 'react';

function App() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const speed = 0.005; // Adjust the speed to your liking

  const lerp = (start: number, end: number, factor: number) => {
    return (1 - factor) * start + factor * end;
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const updateCursor = () => {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, speed);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, speed);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentRef.current.x - 8}px, ${currentRef.current.y - 8}px, 0)`;
      }

      requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove);

    requestAnimationFrame(updateCursor); // change this line

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="flex justify-center h-screen bg-green-400 p-1">
      <div
        ref={cursorRef}
        className="absolute w-16 h-16 rounded-full bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-lg max-w-md px-2 sm:px-4 py-8 flex flex-col space-y-4 items-center mx-auto"
        style={{
          left: '0',
          top: '0',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  );
}

export default App;
