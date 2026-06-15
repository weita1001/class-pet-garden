import { useState, useEffect, useRef } from "react";

function Pupil({ size = 12, maxDistance = 5, pupilColor = "#2D2D2D", forceLookX, forceLookY }: {
  size?: number; maxDistance?: number; pupilColor?: string; forceLookX?: number; forceLookY?: number;
}) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const calc = () => {
    if (!ref.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = mouseX - cx, dy = mouseY - cy;
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const pos = calc();
  return (
    <div ref={ref} style={{
      width: size, height: size, borderRadius: "50%", backgroundColor: pupilColor,
      transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform 0.1s ease-out",
    }} />
  );
}

function EyeBall({ size = 18, pupilSize = 7, maxDistance = 5, eyeColor = "#fff", pupilColor = "#2D2D2D", isBlinking = false, forceLookX, forceLookY }: {
  size?: number; pupilSize?: number; maxDistance?: number; eyeColor?: string; pupilColor?: string;
  isBlinking?: boolean; forceLookX?: number; forceLookY?: number;
}) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const calc = () => {
    if (!ref.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = mouseX - cx, dy = mouseY - cy;
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const pos = calc();
  return (
    <div ref={ref} style={{
      width: size, height: isBlinking ? 2 : size, borderRadius: "50%",
      backgroundColor: eyeColor, overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "height 0.15s",
    }}>
      {!isBlinking && <Pupil size={pupilSize} maxDistance={maxDistance} pupilColor={pupilColor} forceLookX={pos.x} forceLookY={pos.y} />}
    </div>
  );
}

export default function AnimatedCharacters({ isTyping = false, showPassword = false, passwordLength = 0, passwordFocused = false }: {
  isTyping?: boolean; showPassword?: boolean; passwordLength?: number; passwordFocused?: boolean;
}) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const go = () => {
      t = setTimeout(() => { setIsPurpleBlinking(true); setTimeout(() => { setIsPurpleBlinking(false); go(); }, 150); }, 3000 + Math.random() * 4000);
    };
    go();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const go = () => {
      t = setTimeout(() => { setIsBlackBlinking(true); setTimeout(() => { setIsBlackBlinking(false); go(); }, 150); }, 3000 + Math.random() * 4000);
    };
    go();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isTyping) { setIsLookingAtEachOther(true); const t = setTimeout(() => setIsLookingAtEachOther(false), 800); return () => clearTimeout(t); }
    else setIsLookingAtEachOther(false);
  }, [isTyping]);

  useEffect(() => {
    if (passwordLength > 0 && showPassword) {
      let t: ReturnType<typeof setTimeout>;
      const go = () => {
        t = setTimeout(() => { setIsPurplePeeking(true); setTimeout(() => { setIsPurplePeeking(false); go(); }, 800); }, 2000 + Math.random() * 3000);
      };
      go();
      return () => clearTimeout(t);
    } else setIsPurplePeeking(false);
  }, [passwordLength, showPassword, isPurplePeeking]);

  const calcBody = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 3;
    const dx = mouseX - cx, dy = mouseY - cy;
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    };
  };

  const purplePos = calcBody(purpleRef);
  const blackPos = calcBody(blackRef);
  const yellowPos = calcBody(yellowRef);
  const orangePos = calcBody(orangeRef);

  const isHidingPassword = passwordLength > 0 && !showPassword;
  const eyesShut = passwordFocused && !showPassword;

  return (
    <div style={{ position: "relative", width: 550, height: 400 }}>
      {/* P1 Purple */}
      <div ref={purpleRef} style={{
        position: "absolute", bottom: 0, left: 70,
        width: 180, height: (isTyping || isHidingPassword) ? 440 : 400,
        backgroundColor: "#6C3FF5", borderRadius: "10px 10px 0 0",
        zIndex: 1, transformOrigin: "bottom center",
        transition: "transform 0.7s ease-in-out, height 0.7s ease-in-out",
        overflow: "hidden",
        transform: (passwordLength > 0 && showPassword)
          ? "skewX(0deg)"
          : (isTyping || isHidingPassword)
            ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
            : `skewX(${purplePos.bodySkew || 0}deg)`,
      }}>
        <div style={{
          position: "absolute", display: "flex", gap: 8,
          transition: "all 0.7s ease-in-out",
          left: (passwordLength > 0 && showPassword) ? 20 : isLookingAtEachOther ? 55 : 45 + purplePos.faceX,
          top: (passwordLength > 0 && showPassword) ? 35 : isLookingAtEachOther ? 65 : 40 + purplePos.faceY,
        }}>
          <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="#fff" pupilColor="#2D2D2D"
            isBlinking={isPurpleBlinking || eyesShut}
            forceLookX={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
          <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="#fff" pupilColor="#2D2D2D"
            isBlinking={isPurpleBlinking || eyesShut}
            forceLookX={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
        </div>
      </div>

      {/* P2 Black */}
      <div ref={blackRef} style={{
        position: "absolute", bottom: 0, left: 240,
        width: 120, height: 310,
        backgroundColor: "#2D2D2D", borderRadius: "8px 8px 0 0",
        zIndex: 2, transformOrigin: "bottom center",
        transition: "transform 0.7s ease-in-out",
        overflow: "hidden",
        transform: (passwordLength > 0 && showPassword)
          ? "skewX(0deg)"
          : isLookingAtEachOther
            ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
            : (isTyping || isHidingPassword)
              ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
              : `skewX(${blackPos.bodySkew || 0}deg)`,
      }}>
        <div style={{
          position: "absolute", display: "flex", gap: 6,
          transition: "all 0.7s ease-in-out",
          left: (passwordLength > 0 && showPassword) ? 10 : isLookingAtEachOther ? 32 : 26 + blackPos.faceX,
          top: (passwordLength > 0 && showPassword) ? 28 : isLookingAtEachOther ? 12 : 32 + blackPos.faceY,
        }}>
          <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="#fff" pupilColor="#2D2D2D"
            isBlinking={isBlackBlinking || eyesShut}
            forceLookX={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined} />
          <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="#fff" pupilColor="#2D2D2D"
            isBlinking={isBlackBlinking || eyesShut}
            forceLookX={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined} />
        </div>
      </div>

      {/* P3 Orange */}
      <div ref={orangeRef} style={{
        position: "absolute", bottom: 0, left: 0,
        width: 240, height: 200,
        backgroundColor: "#FF9B6B", borderRadius: "120px 120px 0 0",
        zIndex: 3, transformOrigin: "bottom center",
        transition: "transform 0.7s ease-in-out",
        overflow: "hidden",
        transform: (passwordLength > 0 && showPassword) ? "skewX(0deg)" : `skewX(${orangePos.bodySkew || 0}deg)`,
      }}>
        <div style={{
          position: "absolute", display: "flex", gap: 8,
          transition: "all 0.2s ease-out",
          left: (passwordLength > 0 && showPassword) ? 50 : 82 + (orangePos.faceX || 0),
          top: (passwordLength > 0 && showPassword) ? 85 : 90 + (orangePos.faceY || 0),
        }}>
          <Pupil size={eyesShut ? 2 : 12} maxDistance={5} pupilColor="#2D2D2D"
            forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
          <Pupil size={eyesShut ? 2 : 12} maxDistance={5} pupilColor="#2D2D2D"
            forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
        </div>
      </div>

      {/* P4 Yellow */}
      <div ref={yellowRef} style={{
        position: "absolute", bottom: 0, left: 310,
        width: 140, height: 230,
        backgroundColor: "#E8D754", borderRadius: "70px 70px 0 0",
        zIndex: 4, transformOrigin: "bottom center",
        transition: "transform 0.7s ease-in-out",
        overflow: "hidden",
        transform: (passwordLength > 0 && showPassword) ? "skewX(0deg)" : `skewX(${yellowPos.bodySkew || 0}deg)`,
      }}>
        <div style={{
          position: "absolute", display: "flex", gap: 6,
          transition: "all 0.2s ease-out",
          left: (passwordLength > 0 && showPassword) ? 20 : 52 + (yellowPos.faceX || 0),
          top: (passwordLength > 0 && showPassword) ? 35 : 40 + (yellowPos.faceY || 0),
        }}>
          <Pupil size={eyesShut ? 2 : 12} maxDistance={5} pupilColor="#2D2D2D"
            forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
          <Pupil size={eyesShut ? 2 : 12} maxDistance={5} pupilColor="#2D2D2D"
            forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
        </div>
        <div style={{
          position: "absolute", width: 80, height: 4,
          backgroundColor: "#2D2D2D", borderRadius: 2,
          transition: "all 0.2s ease-out",
          left: (passwordLength > 0 && showPassword) ? 10 : 40 + (yellowPos.faceX || 0),
          top: (passwordLength > 0 && showPassword) ? 88 : 88 + (yellowPos.faceY || 0),
        }} />
      </div>
    </div>
  );
}
