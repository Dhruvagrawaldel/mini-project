"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const pos = useRef({ x: 0, y: 0 });
  const trail = useRef({ x: 0, y: 0 });
  const raf = useRef<number>();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animate = () => {
      trail.current.x += (pos.current.x - trail.current.x) * 0.12;
      trail.current.y += (pos.current.y - trail.current.y) * 0.12;

      if (trailRef.current) {
        trailRef.current.style.left = `${trail.current.x}px`;
        trailRef.current.style.top = `${trail.current.y}px`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor-hover]")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousemove", onHoverStart);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousemove", onHoverStart);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Hide default cursor via style */}
      <style jsx global>{`
        * { cursor: none !important; }
      `}</style>

      {/* Outer glow — large, very soft */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
        style={{
          width: isHovering ? "160px" : "80px",
          height: isHovering ? "160px" : "80px",
          background: isHovering
            ? "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          filter: "blur(10px)",
          transition: "width 0.4s ease, height 0.4s ease",
        }}
      />

      {/* Trail ring — lagging behind */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all"
        style={{
          width: isHovering ? "50px" : "32px",
          height: isHovering ? "50px" : "32px",
          borderColor: isHovering ? "rgba(139,92,246,0.8)" : "rgba(139,92,246,0.5)",
          borderWidth: "1.5px",
          backdropFilter: "blur(2px)",
          transition: "width 0.35s cubic-bezier(0.17,0.67,0.35,1.2), height 0.35s cubic-bezier(0.17,0.67,0.35,1.2), border-color 0.3s ease",
          boxShadow: isHovering
            ? "0 0 20px rgba(139,92,246,0.5), inset 0 0 10px rgba(139,92,246,0.1)"
            : "0 0 12px rgba(139,92,246,0.3)",
        }}
      />

      {/* Dot — immediate, sharp center */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[10000] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: isClicking ? "6px" : isHovering ? "10px" : "8px",
          height: isClicking ? "6px" : isHovering ? "10px" : "8px",
          backgroundColor: "rgba(167,139,250,1)",
          boxShadow: "0 0 10px rgba(167,139,250,0.9), 0 0 20px rgba(139,92,246,0.6)",
          transition: "width 0.2s ease, height 0.2s ease, background-color 0.2s ease",
        }}
      />
    </>
  );
}
