import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;

            constructor(canvasWidth: number, canvasHeight: number) {
                this.x = Math.random() * canvasWidth;
                this.y = Math.random() * canvasHeight;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.1)';
            }

            update(canvasWidth: number, canvasHeight: number) {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvasWidth) this.x = 0;
                if (this.x < 0) this.x = canvasWidth;
                if (this.y > canvasHeight) this.y = 0;
                if (this.y < 0) this.y = canvasHeight;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((particle) => {
                particle.update(canvas.width, canvas.height);
                particle.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);
        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isDarkMode]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
            }}
        />
    );
};

export default AnimatedBackground; 