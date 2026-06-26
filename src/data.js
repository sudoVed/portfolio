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
      "PyTorch",
      "Neural Networks",
      "Machine Learning",
      "Reward Modeling",
      "Self-Play",
    ],
  },
  {
    group: "Systems & Performance",
    items: [
      "WebAssembly",
      "SIMD / Vectorization",
      "Model Quantization",
      "Multithreading",
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
      "Trained a 15 kg Unitree Go2 quadruped to locomote from scratch with deep reinforcement learning (PPO in MuJoCo), developing a single neural locomotion policy for gait generation and disturbance recovery. The policy recovers from impulsive, unanticipated mid-gait pushes across 8 directions — 100% recovery at 90 N (~0.6× body weight) on flat ground, and 100% / 91.7% recovery at 75 N / 90 N on procedurally generated uneven terrain (0.15 m elevation).",
    tags: ["Python", "PyTorch", "MuJoCo", "PPO", "Reinforcement Learning"],
    href: "https://github.com/sudoVed/stride-v1",
    visual: "stride",
  },
  {
    title: "Chess Engine - Browser NNUE Engine",
    descriptor: "",
    body:
      "A complete chess engine written from scratch in C++ and compiled to WebAssembly, running entirely in the browser with no backend, Stockfish, or chess libraries. It pairs an alpha-beta search (transposition tables, move ordering, quiescence, null-move pruning, late-move reductions) with a HalfKP NNUE evaluator trained from scratch in PyTorch. Incremental accumulator updates, integer quantization, and WASM SIMD cut per-evaluation cost ~3-4x, verified bit-exact against full rebuilds — a depth-10 NNUE search runs in ~330 ms.",
    tags: ["C++", "WebAssembly", "SIMD", "PyTorch", "NNUE"],
    href: "https://github.com/sudoVed/chees",
    href2: "https://chess.vhades.dpdns.org",
    visual: "chess",
  },
  {
    title: "Chain Reaction with Reinforcement Learning",
    descriptor: "",
    body:
      "A reinforcement learning agent trained to play Chain Reaction from scratch using self-play and reward shaping. A fully-convolutional DQN trained over ~10,000 episodes across a four-stage curriculum, with a self-simulation risk filter that evaluates the opponent's best reply before committing to a move. The final agent reaches a 95% win rate vs random, 81.5% vs defensive, and 57% vs greedy opponents.",
    tags: ["Python", "PyTorch", "Self-Play", "Reward Modeling"],
    href: "https://github.com/sudoVed/chain-reaction",
    href2: "https://chain.vhades.dpdns.org",
    visual: "chain",
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
    title: "Chat Application",
    descriptor: "",
    body:
      "A real-time chat application with WebSocket-based messaging, user authentication, and persistent message history with SQL. The focus is reliable state synchronization across backend and frontend keeping privacy in mind.",
    tags: ["WebSockets", "Authentication", "Real-Time", "State Sync"],
    href: "",
    visual: "chat",
  },

];
