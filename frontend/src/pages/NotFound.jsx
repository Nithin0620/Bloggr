import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Floating particles background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(var(--accent-rgb, 100,200,150), ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="not-found-wrapper accent-bg-mode accent-text-mode">
      <canvas ref={canvasRef} className="not-found-canvas" />

      <div className="not-found-content">
        {/* Glowing 404 */}
        <div className="not-found-number-wrap">
          <span className="not-found-4">4</span>
          <span className="not-found-0">
            <span className="not-found-0-inner">0</span>
          </span>
          <span className="not-found-4">4</span>
        </div>

        <div className="not-found-divider" />

        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-desc">
          Looks like this page wandered off into the void.<br />
          It might have been moved, deleted, or never existed.
        </p>

        <div className="not-found-actions">
          <button
            onClick={() => navigate("/")}
            className="not-found-btn-primary"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="not-found-btn-secondary accent-border"
          >
            Go Back
          </button>
        </div>

        <p className="not-found-hint">
          Lost? Try searching from the{" "}
          <span
            onClick={() => navigate("/")}
            className="not-found-link"
          >
            home feed
          </span>.
        </p>
      </div>

      <style>{`
        .not-found-wrapper {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 2rem;
        }

        .not-found-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.6;
        }

        .not-found-content {
          position: relative;
          z-index: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          max-width: 520px;
          animation: nf-fade-up 0.7s ease both;
        }

        @keyframes nf-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Big 404 */
        .not-found-number-wrap {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          line-height: 1;
        }

        .not-found-4 {
          font-size: clamp(6rem, 18vw, 10rem);
          font-weight: 900;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, var(--accent-color, #22c55e), var(--accent-color-light, #4ade80));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 24px var(--accent-color, #22c55e66));
          animation: nf-pulse 3s ease-in-out infinite;
        }

        @keyframes nf-pulse {
          0%, 100% { filter: drop-shadow(0 0 16px var(--accent-color, #22c55e55)); }
          50%       { filter: drop-shadow(0 0 36px var(--accent-color, #22c55e99)); }
        }

        .not-found-0 {
          font-size: clamp(6rem, 18vw, 10rem);
          font-weight: 900;
          font-family: 'Inter', sans-serif;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .not-found-0-inner {
          background: linear-gradient(135deg, var(--accent-color, #22c55e), var(--accent-color-light, #4ade80));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          animation: nf-spin-slow 8s linear infinite;
          display: inline-block;
        }

        @keyframes nf-spin-slow {
          0%   { transform: rotate(0deg) scale(1); }
          25%  { transform: rotate(8deg) scale(1.05); }
          50%  { transform: rotate(0deg) scale(1); }
          75%  { transform: rotate(-8deg) scale(1.05); }
          100% { transform: rotate(0deg) scale(1); }
        }

        /* Divider */
        .not-found-divider {
          width: 60px;
          height: 3px;
          border-radius: 99px;
          background: linear-gradient(90deg, transparent, var(--accent-color, #22c55e), transparent);
          margin: 0.4rem 0;
        }

        /* Text */
        .not-found-title {
          font-size: clamp(1.4rem, 4vw, 2rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .not-found-desc {
          font-size: 0.95rem;
          opacity: 0.65;
          line-height: 1.7;
          margin: 0;
        }

        /* Buttons */
        .not-found-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 0.5rem;
        }

        .not-found-btn-primary {
          padding: 0.65rem 1.5rem;
          border-radius: 0.6rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          background: var(--accent-color, #22c55e);
          color: #fff;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 18px var(--accent-color, #22c55e44);
        }

        .not-found-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px var(--accent-color, #22c55e66);
        }

        .not-found-btn-secondary {
          padding: 0.65rem 1.5rem;
          border-radius: 0.6rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          background: transparent;
          border: 1.5px solid;
          transition: transform 0.2s, background 0.2s;
        }

        .not-found-btn-secondary:hover {
          transform: translateY(-2px);
          background: rgba(128,128,128,0.08);
        }

        /* Hint */
        .not-found-hint {
          font-size: 0.82rem;
          opacity: 0.5;
          margin-top: 0.25rem;
        }

        .not-found-link {
          color: var(--accent-color, #22c55e);
          cursor: pointer;
          font-weight: 500;
          opacity: 1;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .not-found-link:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
