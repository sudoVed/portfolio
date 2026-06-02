export const skills = [
  {
    group: "Robotics & Autonomous Systems",
    items: [
      "ROS2",
      "Autonomous Navigation",
      "SLAM",
      "Path Planning",
      "Sensor Fusion",
      "Embedded Systems",
    ],
  },
  {
    group: "AI & Machine Learning",
    items: [
      "Reinforcement Learning",
      "Deep Learning",
      "PyTorch",
      "Neural Networks",
      "Machine Learning",
      "Reward Modeling",
    ],
  },
  {
    group: "Computer Vision",
    items: [
      "OpenCV",
      "Image Processing",
      "Object Detection",
      "Feature Extraction",
    ],
  },
  {
    group: "Software Development",
    items: [
      "Python",
      "C++",
      "React",
      "JavaScript",
      "WebSockets",
      "Database Management",
    ],
  },
  {
    group: "Tools & Infrastructure",
    items: [
      "Git",
      "Linux",
      "Docker",
      "VS Code",
    ],
  },
];

export const projects = [
  {
    title: "Autonomous Mobile Robot",
    descriptor: "ROS2 navigation system for unstructured spaces.",
    body:
      "A fully autonomous mobile robot capable of real-time navigation, obstacle avoidance, and goal-directed movement. It integrates LIDAR and camera feeds to build a live map and plan paths dynamically without human intervention.",
    tags: ["ROS2", "LIDAR", "Sensor Fusion", "Path Planning"],
    href: "https://github.com/sudoVed/autonomous-mobile-robot",
    visual: "robot",
  },
  {
    title: "Chain Reaction with Reinforcement Learning",
    descriptor: "Self-play agent for a discrete adversarial strategy game.",
    body:
      "A reinforcement learning agent trained to play Chain Reaction from scratch using self-play and reward shaping. The project explores emergent strategy in adversarial, discrete-action environments with Python and PyTorch.",
    tags: ["Python", "PyTorch", "Self-Play", "Reward Modeling"],
    href: "https://github.com/sudoVed/chain-reaction",
    visual: "chain",
  },
  {
    title: "Chat Application",
    descriptor: "Low-latency messaging with synchronized client state.",
    body:
      "A real-time chat application concept with WebSocket-based messaging, user authentication, and persistent message history. The focus is reliable state synchronization across clients with a clean user experience.",
    tags: ["WebSockets", "Authentication", "Real-Time", "State Sync"],
    href: "",
    visual: "chat",
  },
];
