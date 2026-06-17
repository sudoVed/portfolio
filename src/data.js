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
    title: "STRIDE - RL Quadruped Locomotion",
    descriptor: "",
    body:
      "A reinforcement learning-based locomotion system for the Unitree Go2 quadruped in MuJoCo using PPO. Combines PMTG-based gait generation, residual control, and reward shaping to achieve stable trotting and disturbance recovery.",
    tags: ["Python", "PyTorch", "MuJoCo", "PPO", "Reinforcement Learning"],
    href: "https://github.com/sudoVed/stride-v1",
    visual: "stride",
  },
  {
    title: "Autonomous Mobile Robot",
    descriptor: "",
    body:
      "A fully autonomous mobile robot capable of SLAM, real-time navigation, and goal-directed movement. It utilizes LIDAR to build a live map and plans paths dynamically without human intervention.",
    tags: ["ROS2", "LIDAR", "Sensor Fusion", "Path Planning"],
    href: "https://github.com/sudoVed/autonomous-mobile-robot",
    visual: "robot",
  },
  {
    title: "Chain Reaction with Reinforcement Learning",
    descriptor: "",
    body:
      "A reinforcement learning agent trained to play Chain Reaction from scratch using self-play and reward shaping. The project explores emergent strategy in adversarial, discrete-action environments with Python and PyTorch. Final model scores displayed in GitHub repository.",
    tags: ["Python", "PyTorch", "Self-Play", "Reward Modeling"],
    href: "https://github.com/sudoVed/chain-reaction",
    visual: "chain",
  },
  {
    title: "Chat Application",
    descriptor: "",
    body:
      "A real-time chat application with WebSocket-based messaging, user authentication, and persistent message history with SQL. The focus is reliable state synchronization across backend and frontend keeping privacy in mind.",
    tags: ["WebSockets", "Authentication", "Real-Time", "State Sync"],
    href: "",
    visual: "chat",
  },

];
