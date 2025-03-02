import { motion } from "framer-motion";

const FloatingShape = ({ color, size, top, left, delay, isStars }) => {
  if (isStars) {
    // Generate Moving Twinkling Stars
    return (
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-75"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.3, 1],
              x: ["0%", "5%", "-5%", "0%"],
              y: ["0%", "5%", "-5%", "0%"],
            }}
            transition={{
              duration: Math.random() * 6 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  // Moving Floating Nebula-Like Shapes
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-3xl`}
      style={{ top, left }}
      animate={{
        y: ["0%", "-20%", "10%", "0%"],
        x: ["0%", "10%", "-5%", "0%"],
        rotate: [0, 20, -10, 0],
      }}
      transition={{
        duration: 15,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingShape;
