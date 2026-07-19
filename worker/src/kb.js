// Knowledge base for the ask-Maria chatbot.
// This is compiled from Maria's CV yaml files + courses page.
// To regenerate: edit by hand, or run the build-kb.py script in this folder against her CV repo.

export const KB = {
  profile: {
    name: "Maria Elisa Pilligua Costa",
    short_name: "Maria Pilligua",
    location: "Currently at CARIAD in Mönsheim, Germany (July–December 2026). Based in Lausanne, Switzerland during her MSc at EPFL.",
    email: "maria.pilliguacosta@epfl.ch",
    website: "https://mpilligua.github.io",
    linkedin: "https://www.linkedin.com/in/mariapilligua/",
    github: "https://github.com/mpilligua",
    google_scholar: "https://scholar.google.com/citations?user=qzpgC1cAAAAJ",
    orcid: "https://orcid.org/0009-0006-6656-7386",
    nationality: "Spanish (EU citizen)",
    languages: ["Spanish (native)", "English (C1)", "Catalan (C1)"]
  },

  headline: "Second-year MSc Data Science student at EPFL on an Excellence Fellowship (ESOP, top 0.004% of incoming MSc students). 5 papers at CVPR / ECCV, 4 as first author. Currently interning at CARIAD (Volkswagen Group) on perception for autonomous driving.",

  research_interests: [
    "Neural rendering and inverse rendering",
    "3D scene reconstruction (multi-view, Gaussian Splatting, NeRF-adjacent)",
    "Transformers for vision (VGGT, foundation models)",
    "Generative AI: diffusion models, video generation, editing",
    "Hypernetworks and meta-learning for fast adaptation",
    "Dynamic scenes: 4D Gaussian Splatting, video decomposition",
    "Efficient attention / sparse attention",
    "Controllable generation (motion, image, relighting)"
  ],

  education: [
    {
      id: "epfl-msc",
      degree: "MSc in Data Science",
      institution: "EPFL (École Polytechnique Fédérale de Lausanne)",
      dates: "Sep 2025 – Aug 2027 (in progress)",
      gpa: "5.4 / 6",
      highlights: [
        "Excellence Fellowship (ESOP): awarded to top 0.004% of incoming MSc students at EPFL, 40k CHF grant.",
        "Second-year student (as of Fall 2026)."
      ]
    },
    {
      id: "uab-bsc",
      degree: "BSc in Artificial Intelligence",
      institution: "Universitat Autònoma de Barcelona (UAB), School of Engineering",
      dates: "Sep 2021 – Jun 2025",
      gpa: "9.41 / 10",
      highlights: [
        "Best academic record across all UAB engineering undergraduate degrees.",
        "Honors in 18 subjects including 3D Vision, Generative Models, Deep Learning, CV, NLP.",
        "Selectividad (Spanish university entrance): 11.022 / 14."
      ]
    }
  ],

  experience: [
    {
      id: "cariad",
      role: "Research Intern",
      org: "CARIAD (Volkswagen Group)",
      location: "Mönsheim, Germany",
      dates: "July 2026 – December 2026",
      focus: "Perception for autonomous driving.",
      details: [
        "Developing camera + radar fusion pipelines for autonomous driving perception.",
        "Focus on moving-object segmentation and 3D dynamic scene reconstruction with Gaussian Splatting."
      ]
    },
    {
      id: "epfl-cvlab",
      role: "Student Researcher",
      org: "EPFL Computer Vision Lab (Pascal Fua's lab)",
      location: "Lausanne, Switzerland",
      dates: "October 2025 – July 2026",
      focus: "Transformer attention for 3D scene reconstruction.",
      details: [
        "Semester project supervised by Aoxiang Fan and Pascal Fua: sparse cross-view attention for VGGT. See project 'sparse-vggt'.",
        "Result: learned sparse index over patch correspondences runs 32x faster than dense FlashAttention at 96 frames while gaining +5 pose AUC@30 on ScanNet."
      ]
    },
    {
      id: "goodnotes",
      role: "Machine Learning Intern",
      org: "GoodNotes",
      location: "London, UK",
      dates: "May 2025 – September 2025",
      focus: "Diffusion-based generative features for note-taking app.",
      details: [
        "Proposed and led a diffusion-based text-to-SVG generation project. Prototyped 10+ model variants and built the full pipeline: prompting, filtering, ranking, and vectorization. Shipped to the GoodNotes app used by millions of users.",
        "Reduced latency from ~40s to ~7s with higher quality output.",
        "Also worked on YOLO-based layout understanding for handwritten documents (+13% accuracy) and expanded their synthetic dataset from ~1k to 10k+ pages."
      ]
    },
    {
      id: "cvc-uab",
      role: "Student Researcher",
      org: "Computer Vision Center (CVC-UAB)",
      location: "Barcelona, Spain",
      dates: "January 2023 – July 2025",
      focus: "Research in computer vision and generative modeling.",
      details: [
        "Developed transformer, diffusion, hypernetwork, and CNN-based models for tasks such as neural video editing, controllable relighting, document restoration, low-light enhancement, and continual learning.",
        "Authored and presented multiple papers at CVPR 2025 and ECCV 2024.",
        "Awarded 4 competitive research scholarships for academic excellence.",
        "Won 'Best Research Project' at UAB CVC in 2024 and 2025."
      ]
    },
    {
      id: "idisc",
      role: "AI Consultant",
      org: "IDISC Information Technology",
      location: "Remote",
      dates: "November 2024 – April 2025",
      focus: "Document digitization with OCR + LLMs.",
      details: [
        "Evaluated AI-based methods for document digitization from images, delivering a pipeline for automation and accuracy in client workflows. Used OCR, layout analysis, image enhancement, and LLMs for text understanding."
      ]
    }
  ],

  publications: [
    {
      short_name: "HyperNVD",
      title: "HyperNVD: Accelerating Neural Video Decomposition via Hypernetworks",
      venue: "CVPR 2025",
      first_author: true,
      authors: "Maria Pilligua, Danna Xue, Javier Vázquez-Corral",
      description: "Hypernetwork approach to Neural Video Decomposition. Predicts per-scene NVD network weights from a video, reducing per-scene adaptation from ~2 hours to 20 minutes (6x speedup). Meta-learning with reconstruction loss on decoded video. Extends Adobe's NVD method.",
      keywords: ["hypernetworks", "video decomposition", "meta-learning", "neural fields", "video editing", "cross-temporal alignment"],
      links: {
        project: "https://hypernvd.github.io",
        arxiv: "https://arxiv.org/abs/2503.17276",
        code: "https://github.com/HyperNVD/HyperNVD"
      }
    },
    {
      short_name: "LayeredDoc",
      title: "LayeredDoc: Domain Adaptive Document Restoration with a Layer Separation Approach",
      venue: "ECCV Workshop (WiCV) 2024, ICDAR 2024",
      first_author: true,
      authors: "Maria Pilligua, Nil Biescas, Javier Vázquez-Corral, Josep Lladós, Ernest Valveny, Sanket Biswas",
      description: "Pioneered the task of text-graphic layer separation in document images. Built the first model to do it, improving downstream OCR by +2 dB PSNR. Created both synthetic and real datasets.",
      keywords: ["documents", "layer separation", "OCR", "dataset creation", "domain adaptation"],
      links: {
        project: "https://layereddoc.github.io",
        arxiv: "https://arxiv.org/abs/2406.08610",
        code: "https://github.com/mpilligua/LayeredDoc"
      }
    },
    {
      short_name: "Low-Light Enhancement",
      title: "Evaluating Low-Light Image Enhancement Across Multiple Intensity Levels",
      venue: "CVPR Findings 2026",
      first_author: true,
      authors: "Maria Pilligua, David Serrano-Lozano, Pai Peng, Ramon Baldrich, Michael S. Brown, Javier Vázquez-Corral",
      description: "A new benchmark for AI models that recover detail from very dark photos. Curated data spanning multiple intensity levels; compared CNN and transformer architectures.",
      keywords: ["low-light", "image enhancement", "benchmark", "computational photography"]
    },
    {
      short_name: "PAH",
      title: "PAH: Prototype Augmented Hypernetworks",
      venue: "CVPR Workshop (LatinX in Computer Vision) 2025",
      first_author: false,
      authors: "Neil De La Fuente, Maria Pilligua, Daniel Vidal, Alvin Soutif, Andrey Barskey",
      description: "Prototype-augmented hypernetworks for continual learning.",
      keywords: ["hypernetworks", "continual learning", "prototypes"],
      links: {
        project: "https://pah2025.github.io/",
        arxiv: "https://arxiv.org/abs/2505.07450",
        code: "https://github.com/pah2025/PAH"
      }
    },
    {
      short_name: "PromptNorm",
      title: "PromptNorm: Image Geometry Guides Ambient Light Normalization",
      venue: "CVPR Workshop (NTIRE) 2025",
      first_author: false,
      authors: "David Serrano-Lozano, Francisco A. Molina Bakhos, Danna Xue, Yixiong Yang, Maria Pilligua, Ramon Baldrich, Maria Vanrell, Javier Vázquez-Corral",
      description: "Uses image geometry (surface normals) as prompts to guide ambient light normalization.",
      keywords: ["computational photography", "light normalization", "computer vision"],
      links: {
        project: "https://davidserra9.github.io/promptnorm/",
        code: "https://github.com/davidserra9/promptnorm"
      }
    }
  ],

  projects: [
    {
      id: "sparse-vggt",
      title: "(Full) Attention is More Than You Need: Sparse Cross-View Attention in VGGT",
      type: "Semester Project, EPFL Computer Vision Lab (2026)",
      supervisors: "Aoxiang Fan, Pascal Fua",
      description: "Replaced dense global cross-view attention in VGGT with a learned sparse index over patch correspondences. 32x faster than dense FlashAttention at 96 frames, +5 pose AUC@30 on ScanNet. Contrastive InfoNCE loss teaches the backbone to build its own sparse index at inference with no geometry.",
      keywords: ["VGGT", "sparse attention", "3D reconstruction", "transformers", "feed-forward", "FlashAttention", "ScanNet", "correspondence matching"],
      link: "https://mpilligua.github.io/projects/sparse-vggt.html"
    },
    {
      id: "relighting-thesis",
      title: "Towards Controllable Image Relighting (Bachelor's Thesis)",
      type: "BSc Thesis, UAB Computer Vision Center (2025)",
      supervisor: "Javier Vázquez-Corral",
      description: "Vision Transformer-based inverse rendering model that disentangles geometry, material, and illumination from single images, enabling controllable relighting. Explored conditioning with diffusion models (Stable Diffusion, ControlNet, IP-Adapter). Achieved 28.66 PSNR on unseen scenes.",
      keywords: ["inverse rendering", "relighting", "ViT", "diffusion", "ControlNet", "IP-Adapter", "material", "illumination", "geometry"]
    },
    {
      id: "text-to-svg",
      title: "Text-to-SVG Generation (GoodNotes)",
      type: "Shipped product feature, GoodNotes (2025)",
      description: "Text-to-vector graphics pipeline combining diffusion-based image synthesis with fast vectorization to generate editable SVG drawings from natural language. Style-alignment module for hand-drawn doodle aesthetic. Deployed to millions of GoodNotes users.",
      keywords: ["diffusion", "text-to-SVG", "generative AI", "product", "vectorization", "shipped"],
      link: "https://www.goodnotes.com/ai"
    },
    {
      id: "t2m-controllable",
      title: "Controllable Autoregressive Text-to-Motion Generation",
      type: "Class project, EPFL CS-503 Visual Intelligence (2026), grade 5.75/6",
      description: "Real-time text-to-motion model with online steering: at any frame, the user can specify a full-body pose, hand/foot position, or path. Built on T2M-GPT with a VQ-VAE motion codebook and 18-layer causal Transformer, trained on BONES (64k motion-capture sequences). Two constraint-injection architectures: ControlNet-style cross-attention adapter with a differentiable trajectory loss, and prefix-token with custom causal mask. R@3 30.6 and FID 0.449 on Kimodo benchmark.",
      keywords: ["text-to-motion", "T2M-GPT", "VQ-VAE", "autoregressive", "transformers", "ControlNet", "controllable generation", "motion synthesis"],
      link: "https://mpilligua.github.io/C-T2M.github.io/index.html"
    },
    {
      id: "vq-cot",
      title: "VQ-CoT: Discretising Latent Chain-of-Thought",
      type: "Class project, EPFL CS-552 Modern NLP (2026), grade 6/6",
      description: "Probed whether latent CoT models (Coconut, CODI) genuinely reason. Discretised their thought vectors with VQ-VAE and FSQ, then dissected the latents with logit lenses, ablations, and content swaps. Found that CODI's separator latents are content-free placeholders (a 3-latent student matches the 6-latent teacher), and that Qwen3 backbones up to 4B write structured latents they never actually read at inference. Cautions against attributing reasoning to latent thoughts on structure alone.",
      keywords: ["latent CoT", "chain-of-thought", "Coconut", "CODI", "VQ-VAE", "FSQ", "interpretability", "logit lens", "LLM", "reasoning"],
      link: "https://mpilligua.github.io/projects/vq-cot.html"
    },
    {
      id: "zo-optim",
      title: "No Gradients, No Problem? A Comparative Study of Zeroth-Order Optimizers",
      type: "Class project, EPFL CS-439 Optimization for ML (2026), grade 6/6",
      description: "Controlled comparison of 10 zeroth-order optimizers (Sparse-MeZO, HiZOO, QuZO, LOZO, SubZero, PseuZO, MeZO, ConMeZO, FZOO, DiZO) and an AdamW baseline on the same harness fine-tuning Qwen2.5 and Qwen3.5 on SuperGLUE. Sparse-MeZO was the strongest ZO method (5pt below AdamW at 1/3 memory), and the only one that improved with model scale. Cross-entropy still beat training on non-differentiable accuracy for almost every method.",
      keywords: ["zeroth-order optimization", "memory-efficient fine-tuning", "LLM", "SuperGLUE", "Qwen", "MeZO", "Sparse-MeZO", "benchmarking"],
      link: "https://mpilligua.github.io/projects/zo-optim.html"
    },
    {
      id: "doc-digitalization",
      title: "AI Document Digitalization",
      type: "Class project (UAB)",
      description: "End-to-end pipeline for digitising handwritten documents using OCR, layout analysis, and LLM-based text understanding. YOLO-based layout detector + diffusion prior for image enhancement.",
      keywords: ["OCR", "document AI", "layout analysis", "LLM", "YOLO", "diffusion"],
      link: "https://mpilligua.github.io/Document-Digitallization.github.io/"
    }
  ],

  courses: {
    note: "Grouped by topic. UAB = 0-10 scale (pass ≥ 5). EPFL = 1-6 scale (pass ≥ 4).",
    foundational: [
      { code: "106572", name: "Fundamentals of Machine Learning", uni: "UAB BSc", grade: "9.5/10", desc: "Core supervised and unsupervised methods." },
      { code: "CS-433", name: "Machine Learning", uni: "EPFL MSc", grade: "5.25/6", desc: "Regression, classification, SVMs, kernels, ensembles, neural nets." },
      { code: "106581", name: "Fundamentals of Computer Vision", uni: "UAB BSc", grade: "9.4/10", desc: "Classical CV pipeline: image formation, features, geometry." },
      { code: "106567", name: "Graph and Network Analysis", uni: "UAB BSc", grade: "9.8/10", desc: "Graph algorithms, network models, community detection." },
      { code: "106574", name: "Reinforcement Learning", uni: "UAB BSc", grade: "10/10", desc: "MDPs, Q-learning, policy gradients, deep RL." },
      { code: "106573", name: "Neural Networks and Deep Learning", uni: "UAB BSc", grade: "9.7/10", desc: "CNNs, RNNs, backprop, modern architectures with PyTorch." }
    ],
    generative_ai_foundation_models_3d: [
      { code: "CS-461", name: "Foundation Models and Generative AI", uni: "EPFL MSc", grade: "5.5/6", desc: "Transformers, pretraining, diffusion, RLHF." },
      { code: "CS-503", name: "Visual Intelligence: Machines and Minds", uni: "EPFL MSc", grade: "5.75/6", desc: "CV through the lens of machine perception + cognitive science.", project: "t2m-controllable" },
      { code: "106582", name: "Vision and Learning", uni: "UAB BSc", grade: "10/10", desc: "Deep learning for vision: detection, segmentation, self-supervised, ViTs." },
      { code: "106583", name: "3D Vision and Motion Analysis", uni: "UAB BSc", grade: "10/10", desc: "Multi-view geometry, stereo, SfM, optical flow, 3D reconstruction." }
    ],
    theoretical: [
      { code: "MATH-520", name: "Topics in Machine Learning", uni: "EPFL MSc", grade: "5.25/6", desc: "Statistical learning theory, generalization, modern DL phenomena." },
      { code: "CS-439", name: "Optimization for Machine Learning", uni: "EPFL MSc", grade: "4.75/6", desc: "Convex/non-convex optimization for ML, distributed, zeroth-order.", project: "zo-optim" },
      { code: "MATH-415", name: "Probabilistic Models of Modern AI", uni: "EPFL MSc", grade: "4.75/6", desc: "Probabilistic reasoning, graphical models, variational inference." }
    ],
    nlp: [
      { code: "CS-552", name: "Modern Natural Language Processing", uni: "EPFL MSc", grade: "6/6", desc: "Transformers, pretraining, alignment, interpretability, LLM evaluation.", project: "vq-cot" },
      { code: "106584", name: "Fundamentals of Natural Language", uni: "UAB BSc", grade: "9.7/10", desc: "Classical NLP: morphology, syntax, semantics." },
      { code: "106585", name: "Learning and Natural Language Processing", uni: "UAB BSc", grade: "10/10", desc: "Neural NLP: embeddings, seq2seq, attention, transformers, LM pretraining." }
    ],
    math_stats_logic: [
      { code: "EE-556", name: "Mathematics of Data: From Theory to Computation", uni: "EPFL MSc", grade: "5.5/6", desc: "Convex analysis and optimization for high-dimensional ML." },
      { code: "106550", name: "Fundamentals of Mathematics I", uni: "UAB BSc", grade: "7.7/10", desc: "Linear algebra." },
      { code: "106551", name: "Fundamentals of Mathematics II", uni: "UAB BSc", grade: "9/10", desc: "Multivariable calculus, optimization." },
      { code: "106552", name: "Probability and Statistics", uni: "UAB BSc", grade: "9.8/10", desc: "Probability, estimation, hypothesis testing, statistical inference." },
      { code: "106569", name: "Computational Logic", uni: "UAB BSc", grade: "9.7/10", desc: "Propositional and first-order logic, formal reasoning." }
    ],
    classical_ai: [
      { code: "106558", name: "Introduction to AI", uni: "UAB BSc", grade: "7.9/10", desc: "Search, planning, knowledge representation." },
      { code: "106564", name: "Knowledge Representation", uni: "UAB BSc", grade: "9.3/10", desc: "Ontologies, description logics, knowledge graphs." },
      { code: "106570", name: "Problem Solving", uni: "UAB BSc", grade: "8.5/10", desc: "Heuristic search, CSPs, adversarial games, planning." }
    ],
    robotics_autonomous: [
      { code: "106587", name: "Autonomous Agents", uni: "UAB BSc", grade: "10/10", desc: "Agent architectures, decision making, RL for autonomous behaviour." },
      { code: "106589", name: "Intelligent Robots", uni: "UAB BSc", grade: "10/10", desc: "Robot perception, sensor fusion, kinematics, learning-based control." },
      { code: "106590", name: "Autonomous Navigation", uni: "UAB BSc", grade: "10/10", desc: "Localization, SLAM, path planning, imitation learning for self-driving." }
    ],
    cognitive_science: [
      { code: "HUM-432", name: "How People Learn: Designing Learning Tools I", uni: "EPFL MSc", grade: "5.75/6", desc: "Learning sciences applied to educational tool design." },
      { code: "HUM-433", name: "How People Learn: Designing Learning Tools II", uni: "EPFL MSc", grade: "5.25/6", desc: "Prototyping and evidence-based iteration on educational tech." },
      { code: "106577", name: "Cognitive Processes", uni: "UAB BSc", grade: "7/10", desc: "Cognitive psychology as inspiration for AI." },
      { code: "106578", name: "Mind and Brain I", uni: "UAB BSc", grade: "9.2/10", desc: "Neural bases of cognition." }
    ],
    systems_data_programming: [
      { code: "106553", name: "Fundamentals of Programming I", uni: "UAB BSc", grade: "9.5/10", desc: "Imperative and OO programming in Python." },
      { code: "106554", name: "Fundamentals of Programming II", uni: "UAB BSc", grade: "10/10", desc: "Advanced programming, complexity, recursion." },
      { code: "106555", name: "Fundamentals of Computing", uni: "UAB BSc", grade: "9/10", desc: "Computer architecture, OS, low-level foundations." },
      { code: "106565", name: "Data Engineering", uni: "UAB BSc", grade: "9.5/10", desc: "Data pipelines, ETL, reproducible datasets." },
      { code: "106566", name: "Data Management", uni: "UAB BSc", grade: "9.6/10", desc: "Relational + NoSQL databases, query optimization." },
      { code: "106556", name: "Distributed Programming", uni: "UAB BSc", grade: "10/10", desc: "Concurrency, message passing, distributed systems." },
      { code: "106557", name: "Parallel Programming", uni: "UAB BSc", grade: "9.7/10", desc: "Multi-threading, GPU programming, parallel numerical algorithms." }
    ],
    ethics_regulation_society: [
      { code: "106559", name: "Ethics", uni: "UAB BSc", grade: "8.8/10", desc: "Ethics of computing and AI." },
      { code: "106560", name: "Regulation of AI", uni: "UAB BSc", grade: "8/10", desc: "AI Act, data protection, liability, governance." },
      { code: "106598", name: "Social Innovation", uni: "UAB BSc", grade: "9.1/10", desc: "Deploying tech for social impact." },
      { code: "106579", name: "Social Interaction", uni: "UAB BSc", grade: "10/10", desc: "Human-AI interaction, social robotics." },
      { code: "106595", name: "Applications and Challenges of AI I", uni: "UAB BSc", grade: "10/10", desc: "Real-world AI deployment case studies." }
    ],
    research_capstones: [
      { code: "COM-412", name: "Semester Research Project in Data Science", uni: "EPFL MSc", grade: "6/6", desc: "Sparse VGGT semester project at EPFL CVLab.", project: "sparse-vggt" },
      { code: "106601", name: "Bachelor's Degree Final Project", uni: "UAB BSc", grade: "10/10", desc: "ViT-based inverse rendering thesis.", project: "relighting-thesis" },
      { code: "106593", name: "Synthesis Project I", uni: "UAB BSc", grade: "9.8/10", desc: "Second-year team AI project." },
      { code: "106594", name: "Synthesis Project II", uni: "UAB BSc", grade: "9.9/10", desc: "Third-year team AI system, defended at end of year." },
      { code: "106600", name: "Work Placement", uni: "UAB BSc", grade: "10/10", desc: "Industry internship credited within the degree." }
    ],
    other: [
      { code: "106562", name: "Project Management", uni: "UAB BSc", grade: "9.8/10", desc: "Planning, risk, agile methods." }
    ]
  },

  hackathons: [
    { title: "MAPA: Multimodal agent controlling a quadruped robot (voice, VLM, SLAM)", venue: "RoboHack EPFL", year: "2026", place: "3rd", description: "Tool-using agent controlling a quadruped as a guide dog: voice requests, Claude as VLM for scene understanding, YOLO + SLAM for tracking, detection, and obstacle avoidance.", link: "https://devpost.com/software/mapa-lh29cx", repo: "https://github.com/mpilligua/RoboHack-2026/tree/submission" },
    { title: "TRAIN TALES: Interactive AI Travel Companion for Kids", venue: "UAB The Hack", year: "2025", place: "2nd", description: "Web app that narrates location-aware stories during train journeys and generates quizzes to engage children, particularly supporting kids with hyperactivity.", link: "https://devpost.com/software/train-tales" },
    { title: "Flowchart detection", venue: "GoodNotes Hackathon", year: "2025", place: "2nd", description: "Flowchart detection system for the GoodNotes app combining YOLO-based layout analysis and custom heuristics to convert hand-drawn flowcharts into editable digital formats." },
    { title: "INDITECH Challenge: Multimodal AI for E-Commerce", venue: "HackUPC", year: "2023", place: "2nd", description: "Voice- and gesture-controlled fashion shopping app using Whisper, Fashion-CLIP, YOLO, and Hugging Face transformers, with Flask backend.", link: "https://devpost.com/software/inditech" }
  ],

  awards: [
    { title: "EPFL MSc Excellence Fellowship (ESOP)", year: "2025", description: "Top 0.004% (30 students) of incoming MSc students at EPFL. 40k CHF grant." },
    { title: "Best Research Project, UAB Computer Vision Center", year: "2024 and 2025", description: "Awarded to 1 student per year." },
    { title: "Best Academic Record across all UAB engineering degrees", year: "2025", description: "Granted to 4 students." },
    { title: "Best Academic Record, Ibiza", year: "2025", description: "Granted to 2 students across all degrees in the region." },
    { title: "CVPR & ECCV DEI Scholarships", year: "2024–2025", description: "29 of 524 applicants selected for ECCV." },
    { title: "4 research scholarships from the Computer Vision Center", year: "2023–2025" },
    { title: "Honors in 18 subjects", year: "2021–2025", description: "Including 3D Vision, Generative Models, Deep Learning, CV, and NLP." },
    { title: "Top 5% Weights & Biases user", year: "Dec 2025", description: "Based on platform-wide activity." }
  ],

  skills: {
    programming: ["Python", "C++", "Bash"],
    ml_ai_expertise: [
      "Generative AI", "3D scene understanding", "multi-view reconstruction",
      "neural rendering", "transformers", "diffusion models",
      "vision-language models (CLIP)", "Gaussian Splatting",
      "spatial reasoning in vision models", "hypernetworks", "meta-learning"
    ],
    tools: ["PyTorch", "PyTorch Lightning", "OpenCV", "Hugging Face", "wandb (top 5% user)", "Git", "Docker", "AWS (S3, EC2)", "LaTeX", "SLURM"]
  }
};
