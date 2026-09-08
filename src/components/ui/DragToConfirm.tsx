"use client";

import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface DragToConfirmProps {
  /** Teks yang muncul di slider sebelum dikonfirmasi */
  label?: string;
  /** Teks setelah berhasil dikonfirmasi */
  successLabel?: string;
  /** Callback dipanggil saat slider berhasil ditarik penuh */
  onConfirm?: () => void;
  /** Apakah komponen disabled */
  disabled?: boolean;
  className?: string;
}

type SliderState = "idle" | "dragging" | "confirmed";

export function DragToConfirm({
  label = "Geser untuk mengajukan penarikan",
  successLabel = "Pengajuan diproses",
  onConfirm,
  disabled = false,
  className,
}: DragToConfirmProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<SliderState>("idle");
  const [offset, setOffset] = useState(0);
  const [progress, setProgress] = useState(0);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  const getMaxTrack = useCallback(() => {
    if (!trackRef.current) return 0;
    return trackRef.current.offsetWidth - 40 - 8; // thumb width - padding
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || state === "confirmed") return;
      e.preventDefault();
      isDraggingRef.current = true;
      startXRef.current = e.clientX - currentXRef.current;
      setState("dragging");

      const handleMouseMove = (ev: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const maxTrack = getMaxTrack();
        let newX = ev.clientX - startXRef.current;
        newX = Math.max(0, Math.min(newX, maxTrack));
        currentXRef.current = newX;
        const pct = (newX / maxTrack) * 100;
        setOffset(newX);
        setProgress(pct);

        if (newX >= maxTrack) {
          isDraggingRef.current = false;
          setState("confirmed");
          setOffset(maxTrack);
          setProgress(100);
          onConfirm?.();
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
        }
      };

      const handleMouseUp = () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        setState("idle");
        currentXRef.current = 0;
        setOffset(0);
        setProgress(0);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [disabled, state, getMaxTrack, onConfirm]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || state === "confirmed") return;
      isDraggingRef.current = true;
      startXRef.current = e.touches[0].clientX - currentXRef.current;
      setState("dragging");

      const handleTouchMove = (ev: TouchEvent) => {
        if (!isDraggingRef.current) return;
        const maxTrack = getMaxTrack();
        let newX = ev.touches[0].clientX - startXRef.current;
        newX = Math.max(0, Math.min(newX, maxTrack));
        currentXRef.current = newX;
        const pct = (newX / maxTrack) * 100;
        setOffset(newX);
        setProgress(pct);

        if (newX >= maxTrack) {
          isDraggingRef.current = false;
          setState("confirmed");
          setOffset(maxTrack);
          setProgress(100);
          onConfirm?.();
          window.removeEventListener("touchmove", handleTouchMove);
          window.removeEventListener("touchend", handleTouchEnd);
        }
      };

      const handleTouchEnd = () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        setState("idle");
        currentXRef.current = 0;
        setOffset(0);
        setProgress(0);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };

      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    },
    [disabled, state, getMaxTrack, onConfirm]
  );

  const isConfirmed = state === "confirmed";

  return (
    <div
      ref={trackRef}
      className={cn("slider-track select-none", className, {
        "opacity-50 cursor-not-allowed": disabled,
      })}
    >
      {/* Progress fill */}
      <div
        className="slider-progress"
        style={{
          width: `${progress}%`,
          backgroundColor: isConfirmed ? "#16a34a" : "#f2a93b",
          opacity: isConfirmed ? 0.3 : 0.2,
        }}
      />

      {/* Label */}
      <span
        className="slider-text"
        style={{
          opacity: isConfirmed ? 1 : Math.max(0, 1 - progress / 100),
          color: isConfirmed ? "#16a34a" : "#514535",
        }}
      >
        {isConfirmed ? successLabel : label}
      </span>

      {/* Draggable Thumb */}
      {!disabled && (
        <div
          className="slider-thumb"
          style={{
            transform: `translateX(${offset}px)`,
            transition: state === "idle" && offset === 0 ? "transform 0.3s ease" : "none",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <span
            className={cn("material-symbols-outlined text-[20px]", {
              "text-success": isConfirmed,
              "text-primary-container": !isConfirmed,
            })}
          >
            {isConfirmed ? "check" : "arrow_forward"}
          </span>
        </div>
      )}
    </div>
  );
}
