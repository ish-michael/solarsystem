// Generate random positions, sizes, and animation delay for stars once on load
const STARS_COUNT = 150;
const starsData = Array.from({ length: STARS_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100, // percentage
  y: Math.random() * 100, // percentage
  size: Math.random() * 1.2 + 0.5, // radius 0.5 to 1.7px
  opacity: Math.random() * 0.7 + 0.3,
  duration: Math.random() * 4 + 3, // 3s to 7s
  delay: Math.random() * 5,
}));

export default function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {starsData.map((star) => (
          <circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="#ffffff"
            opacity={star.opacity}
            style={{
              animation: `twinkle ${star.duration}s infinite ease-in-out`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
