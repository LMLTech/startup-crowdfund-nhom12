import { useEffect, useRef } from 'react';

export default function ElegantNeonLeavesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let w, h;
    let time = 0; // Global time for animations

    // Bảng màu Neon tinh tế
    const neonPalettes = [
      { core: 'rgba(200, 255, 240, 0.9)', glow: 'rgba(0, 255, 170, 0.5)' }, // Soft Cyan-Green
      { core: 'rgba(220, 255, 220, 0.8)', glow: 'rgba(100, 255, 50, 0.4)' }, // Gentle Lime
      { core: 'rgba(200, 250, 255, 0.9)', glow: 'rgba(0, 200, 255, 0.5)' }, // Serene Blue
    ];

    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const randomFloat = (min, max) => Math.random() * (max - min) + min;

    // --- LỚP LÁ TRE (ElegantNeonLeaf) ---
    class ElegantNeonLeaf {
      constructor(side, depth) { // side: 0 = trái, 1 = phải
        this.side = side;
        this.depth = depth; // Để tạo hiệu ứng parallax
        this.reset();
      }

      reset() {
        // Xuất phát từ 2 bên màn hình
        this.x = this.side === 0 ? randomFloat(-50, w * 0.1) : randomFloat(w * 0.9, w + 50);
        this.y = randomFloat(h * 0.2, h * 0.8); // Cao độ ngẫu nhiên
        
        this.baseAngle = this.side === 0 ? randomFloat(-Math.PI / 8, Math.PI / 8) : randomFloat(Math.PI - Math.PI / 8, Math.PI + Math.PI / 8);
        this.length = randomFloat(100, 300) * (1 - this.depth * 0.4); // Lá dài và thanh mảnh
        this.swayAmplitude = randomFloat(0.05, 0.1);
        this.swaySpeed = randomFloat(0.0005, 0.0015);
        this.swayOffset = randomFloat(0, Math.PI * 2);
        this.colorPalette = neonPalettes[randomInt(0, neonPalettes.length - 1)];

        this.leaves = [];
        const numLeavesInCluster = randomInt(5, 10);
        for (let i = 0; i < numLeavesInCluster; i++) {
          this.leaves.push({
            relPos: randomFloat(0.1, 1), // Vị trí dọc theo nhánh chính
            len: randomFloat(25, 60) * (1 - this.depth * 0.2),
            angleOffset: randomFloat(-Math.PI / 6, Math.PI / 6),
            swayPhase: randomFloat(0, Math.PI * 2),
            swayFactor: randomFloat(0.8, 1.2)
          });
        }
      }

      update(globalTime) {
        // Lá di chuyển nhẹ nhàng, lượn sóng
        this.x += Math.sin(globalTime * this.swaySpeed * 0.5 + this.swayOffset) * 0.5 * (1 - this.depth);
        this.y += Math.cos(globalTime * this.swaySpeed * 0.7 + this.swayOffset) * 0.3 * (1 - this.depth);

        // Reset nếu lá bay ra khỏi màn hình
        if (this.side === 0 && this.x > w + 50) this.reset();
        if (this.side === 1 && this.x < -50) this.reset();
        if (this.y < -50 || this.y > h + 50) this.reset();
      }

      draw(ctx, globalTime) {
        const opacity = 0.8 * (1 - this.depth * 0.5); // Lá ở xa mờ hơn
        const sway = Math.sin(globalTime * this.swaySpeed + this.swayOffset) * this.swayAmplitude;
        const finalAngle = this.baseAngle + sway;

        ctx.save();
        ctx.globalAlpha = opacity;

        ctx.shadowBlur = 20 * (1 - this.depth * 0.4);
        ctx.shadowColor = this.colorPalette.glow;
        ctx.strokeStyle = this.colorPalette.core;
        ctx.lineWidth = 2 * (1 - this.depth * 0.2); // Nét thanh mảnh hơn
        ctx.lineCap = 'round';

        // Vẽ nhánh chính (không quá rõ ràng, chỉ là đường cong dẫn dắt)
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const ctrlX = this.x + Math.cos(finalAngle) * this.length * 0.3;
        const ctrlY = this.y - Math.sin(Math.abs(finalAngle)) * this.length * 0.8;
        const endX = this.x + Math.cos(finalAngle) * this.length;
        const endY = this.y - Math.sin(Math.abs(finalAngle)) * this.length;
        ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
        ctx.stroke();

        // Vẽ các lá con
        this.leaves.forEach(leaf => {
          const leafSway = Math.sin(globalTime * leaf.swayPhase * leaf.swayFactor * 0.001 + leaf.swayPhase) * 0.15;
          const leafAngle = finalAngle + leaf.angleOffset + leafSway;

          const leafBaseX = this.x + Math.cos(finalAngle) * this.length * leaf.relPos;
          const leafBaseY = this.y - Math.sin(Math.abs(finalAngle)) * this.length * leaf.relPos;

          ctx.beginPath();
          ctx.moveTo(leafBaseX, leafBaseY);
          const lCtrlX = leafBaseX + Math.cos(leafAngle) * leaf.len * 0.6;
          const lCtrlY = leafBaseY + Math.sin(leafAngle) * leaf.len * 0.6 - 5;
          const lEndX = leafBaseX + Math.cos(leafAngle) * leaf.len;
          const lEndY = leafBaseY + Math.sin(leafAngle) * leaf.len;
          ctx.quadraticCurveTo(lCtrlX, lCtrlY, lEndX, lEndY);
          ctx.lineWidth = 1.5 * (1 - this.depth * 0.1);
          ctx.stroke();
        });

        ctx.restore();
      }
    }

    // --- HẠT NĂNG LƯỢNG MƯỢT MÀ ---
    class EnergyParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = randomFloat(w * 0.1, w * 0.9);
        this.y = h + randomFloat(0, h * 0.5); 
        this.speed = randomFloat(0.5, 1.5);
        this.size = randomFloat(1.5, 4);
        this.color = neonPalettes[randomInt(0, neonPalettes.length - 1)].glow;
        this.opacity = randomFloat(0.1, 0.4); // Giảm opacity để dịu mắt
        this.swayAmplitude = randomFloat(5, 15);
        this.swaySpeed = randomFloat(0.001, 0.003);
        this.swayOffset = randomFloat(0, Math.PI * 2);
      }
      update(globalTime) {
        this.y -= this.speed;
        this.x += Math.sin(globalTime * this.swaySpeed + this.swayOffset) * this.swayAmplitude * 0.01;
        if (this.y < -50) this.reset();
      }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = this.color;
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // --- KHỞI TẠO ---
    const numLeavesClusters = Math.max(6, Math.floor(window.innerWidth / 300)); // Khoảng 6-10 cụm lá
    const leafClusters = [];
    for (let i = 0; i < numLeavesClusters; i++) {
        leafClusters.push(new ElegantNeonLeaf(i % 2, randomFloat(0.1, 0.9))); // Phân bố đều 2 bên, có chiều sâu
    }
    const particles = Array.from({ length: 40 }, () => new EnergyParticle());

    leafClusters.sort((a, b) => a.depth - b.depth); // Vẽ lá xa trước, lá gần sau

    // --- ANIMATION LOOP ---
    const render = (currentTime) => {
      time = currentTime;
      ctx.clearRect(0, 0, w, h);

      // Nền gradient đen sâu hơn, tinh tế
      const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
      bgGradient.addColorStop(0, '#000707'); // Đen sâu
      bgGradient.addColorStop(0.3, '#001515');
      bgGradient.addColorStop(1, '#000f0f');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);

      particles.forEach(p => { p.update(time); p.draw(ctx); });

      leafClusters.forEach(leaf => {
        leaf.update(time);
        leaf.draw(ctx, time);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // --- SETUP & CLEANUP ---
    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      leafClusters.forEach(leaf => leaf.reset()); // Reset vị trí lá khi resize
      particles.forEach(p => p.reset());
      leafClusters.sort((a, b) => a.depth - b.depth);
    };

    handleResize();
    render(performance.now());

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: '#000707' }}
    />
  );
}