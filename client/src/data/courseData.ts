// Age-appropriate course data for the learning platform

export const courseData = {
  "6-11": [
    {
      id: "visual-coding-basics",
      title: "🎨 Visual Coding Adventures",
      description: "Learn coding through fun drag-and-drop blocks! Create animations, games, and stories while learning programming basics.",
      difficulty: "beginner",
      category: "programming",
      estimatedHours: 8,
      imageUrl: "/images/courses/visual-coding.svg",
      lessons: [
        {
          title: "🎮 Meet Your Coding Buddy",
          type: "interactive",
          description: "Learn what coding is and meet our friendly coding character!",
          content: {
            type: "visual_story",
            elements: [
              { type: "animation", src: "robot-intro.gif" },
              { type: "text", content: "Hi! I'm CodeBot, and I'll help you learn coding!" },
              { type: "interactive_demo", blocks: ["move_forward", "turn_left", "say_hello"] }
            ]
          },
          estimatedMinutes: 20
        },
        {
          title: "🧩 Your First Block Program",
          type: "interactive",
          description: "Drag blocks to make CodeBot move and talk!",
          content: {
            type: "block_playground",
            starter_blocks: ["move_forward", "say_hello", "turn_right"],
            goal: "Make CodeBot say 'Hello World!' and move forward"
          },
          estimatedMinutes: 30
        },
        {
          title: "🌈 Colors and Loops",
          type: "interactive", 
          description: "Use repeat blocks to create colorful patterns!",
          content: {
            type: "creative_canvas",
            tools: ["repeat", "change_color", "draw_shape"],
            project: "rainbow_spiral"
          },
          estimatedMinutes: 25
        },
        {
          title: "🎵 Make Music with Code",
          type: "project",
          description: "Create your own musical masterpiece using sound blocks!",
          content: {
            type: "music_maker",
            blocks: ["play_note", "repeat", "wait", "change_tempo"],
            example_song: "twinkle_star"
          },
          estimatedMinutes: 35
        }
      ]
    },
    {
      id: "micro-bit-adventures",
      title: "🤖 Micro:bit Magic",
      description: "Program a virtual micro:bit! Make lights flash, buttons work, and create awesome displays.",
      difficulty: "beginner",
      category: "robotics",
      estimatedHours: 6,
      imageUrl: "/images/courses/microbit.svg",
      lessons: [
        {
          title: "✨ Light Up the World",
          type: "interactive",
          description: "Learn to control LED lights and create patterns!",
          content: {
            type: "microbit_simulator",
            starter_code: "basic.showIcon(IconNames.Heart)",
            challenges: ["heart_blink", "smiley_face", "custom_pattern"]
          },
          estimatedMinutes: 25
        },
        {
          title: "🎮 Button Games",
          type: "interactive",
          description: "Make games using A and B buttons!",
          content: {
            type: "button_games",
            games: ["reaction_timer", "memory_game", "counter"]
          },
          estimatedMinutes: 30
        },
        {
          title: "📱 Shake and Move",
          type: "project",
          description: "Use motion sensors to create interactive programs!",
          content: {
            type: "motion_projects",
            projects: ["magic_8_ball", "step_counter", "dice_roller"]
          },
          estimatedMinutes: 40
        }
      ]
    },
    {
      id: "game-maker-junior",
      title: "🎮 Little Game Makers",
      description: "Create your first video games! Design characters, add sounds, and make them move.",
      difficulty: "beginner",
      category: "game-development",
      estimatedHours: 10,
      imageUrl: "/images/courses/game-maker.svg",
      lessons: [
        {
          title: "👾 Design Your Hero",
          type: "interactive",
          description: "Create and customize your game character!",
          content: {
            type: "character_designer",
            tools: ["sprite_editor", "animation_maker", "color_picker"]
          },
          estimatedMinutes: 30
        },
        {
          title: "🏃 Make It Move",
          type: "interactive",
          description: "Program your character to walk, jump, and dance!",
          content: {
            type: "movement_coding",
            blocks: ["move_left", "move_right", "jump", "animate"],
            playground: "simple_platformer"
          },
          estimatedMinutes: 35
        },
        {
          title: "🎨 Build Your World",
          type: "project",
          description: "Design backgrounds and obstacles for your game!",
          content: {
            type: "world_builder",
            tools: ["background_maker", "obstacle_placer", "collect_items"]
          },
          estimatedMinutes: 45
        }
      ]
    }
  ],
  "12-17": [
    {
      id: "javascript-foundations",
      title: "💻 JavaScript Mastery",
      description: "Master the fundamentals of JavaScript programming with hands-on projects and real-world applications.",
      difficulty: "beginner",
      category: "programming",
      estimatedHours: 15,
      imageUrl: "/images/courses/javascript.svg",
      lessons: [
        {
          title: "Variables and Data Types",
          type: "interactive",
          description: "Learn to store and manipulate different types of data in JavaScript.",
          content: {
            type: "code_tutorial",
            exercises: ["variable_declaration", "string_manipulation", "number_operations"],
            interactive_editor: true
          },
          estimatedMinutes: 45
        },
        {
          title: "Functions and Control Flow",
          type: "interactive",
          description: "Master functions, conditionals, and loops to control program flow.",
          content: {
            type: "advanced_coding",
            topics: ["function_creation", "if_statements", "for_loops", "while_loops"],
            challenges: ["calculator", "grade_evaluator", "fibonacci"]
          },
          estimatedMinutes: 60
        },
        {
          title: "DOM Manipulation",
          type: "project",
          description: "Learn to make interactive web pages by controlling HTML elements.",
          content: {
            type: "web_project",
            project_type: "interactive_webpage",
            skills: ["element_selection", "event_handling", "dynamic_content"]
          },
          estimatedMinutes: 75
        }
      ]
    },
    {
      id: "web-development-pro",
      title: "🌐 Full-Stack Web Development",
      description: "Build complete web applications from frontend to backend using modern technologies.",
      difficulty: "intermediate",
      category: "web-development",
      estimatedHours: 20,
      imageUrl: "/images/courses/web-dev.svg",
      lessons: [
        {
          title: "HTML5 & CSS3 Foundations",
          type: "interactive",
          description: "Master semantic HTML and advanced CSS techniques.",
          content: {
            type: "web_builder",
            projects: ["responsive_portfolio", "css_animations", "flexbox_layout"],
            live_preview: true
          },
          estimatedMinutes: 90
        },
        {
          title: "React Components",
          type: "interactive",
          description: "Learn component-based development with React.",
          content: {
            type: "react_tutorial",
            concepts: ["jsx", "components", "props", "state", "hooks"],
            project: "todo_app"
          },
          estimatedMinutes: 120
        },
        {
          title: "Backend with Node.js",
          type: "project",
          description: "Build REST APIs and connect to databases.",
          content: {
            type: "backend_project",
            technologies: ["express", "mongodb", "authentication"],
            final_project: "social_media_api"
          },
          estimatedMinutes: 150
        }
      ]
    },
    {
      id: "robotics-programming",
      title: "🤖 Advanced Robotics Programming",
      description: "Program real robots and create autonomous systems using sensors and AI.",
      difficulty: "intermediate", 
      category: "robotics",
      estimatedHours: 18,
      imageUrl: "/images/courses/robotics.svg",
      lessons: [
        {
          title: "Sensor Integration",
          type: "interactive",
          description: "Learn to work with ultrasonic, camera, and motion sensors.",
          content: {
            type: "sensor_lab",
            sensors: ["ultrasonic", "camera", "gyroscope", "accelerometer"],
            projects: ["obstacle_avoidance", "line_following"]
          },
          estimatedMinutes: 80
        },
        {
          title: "Machine Learning for Robots",
          type: "interactive",
          description: "Implement basic AI to make robots learn and adapt.",
          content: {
            type: "ai_programming",
            concepts: ["pattern_recognition", "decision_trees", "neural_networks"],
            robot_project: "smart_pet"
          },
          estimatedMinutes: 100
        },
        {
          title: "Autonomous Robot Challenge",
          type: "project",
          description: "Build a robot that can navigate and complete tasks independently.",
          content: {
            type: "robot_challenge",
            requirements: ["autonomous_navigation", "object_manipulation", "task_completion"],
            final_demo: true
          },
          estimatedMinutes: 180
        }
      ]
    }
  ]
};

export const roboticsActivities = {
  "6-11": [
    {
      id: "maze-runner",
      title: "🏃 Maze Runner",
      description: "Help RoboFriend navigate through colorful mazes!",
      type: "maze",
      difficulty: "easy",
      instructions: [
        { step: 1, text: "Drag the 'Move Forward' block", image: "move-forward.svg" },
        { step: 2, text: "Add 'Turn Left' or 'Turn Right' blocks", image: "turn-blocks.svg" },
        { step: 3, text: "Connect blocks to reach the goal!", image: "goal-star.svg" }
      ],
      mazeData: {
        width: 5,
        height: 5,
        start: [0, 0],
        goal: [4, 4],
        walls: [[1,1], [2,1], [1,2], [3,2], [2,3]],
        theme: "forest"
      },
      estimatedMinutes: 15,
      points: 100
    },
    {
      id: "light-puzzle",
      title: "💡 Light Up Puzzle",
      description: "Turn on all the lights using the right sequence!",
      type: "puzzle",
      difficulty: "easy",
      instructions: [
        { step: 1, text: "Click lights to turn them on/off", image: "click-light.svg" },
        { step: 2, text: "Some lights affect their neighbors", image: "neighbor-effect.svg" },
        { step: 3, text: "Turn all lights on to win!", image: "all-lights-on.svg" }
      ],
      puzzleData: {
        gridSize: 3,
        initialState: [false, true, false, true, false, true, false, true, false],
        rules: "toggle_neighbors"
      },
      estimatedMinutes: 10,
      points: 80
    },
    {
      id: "color-sequence",
      title: "🌈 Color Pattern Master",
      description: "Remember and repeat the colorful sequence!",
      type: "challenge",
      difficulty: "medium",
      instructions: [
        { step: 1, text: "Watch the color sequence carefully", image: "watch-colors.svg" },
        { step: 2, text: "Click colors in the same order", image: "repeat-sequence.svg" },
        { step: 3, text: "Each round adds one more color!", image: "growing-sequence.svg" }
      ],
      gameData: {
        colors: ["red", "blue", "yellow", "green"],
        maxSequenceLength: 8,
        theme: "rainbow"
      },
      estimatedMinutes: 12,
      points: 120
    },
    {
      id: "robot-painter",
      title: "🎨 Robot Artist",
      description: "Program your robot to paint beautiful pictures!",
      type: "project",
      difficulty: "medium",
      instructions: [
        { step: 1, text: "Choose your colors from the palette", image: "color-palette.svg" },
        { step: 2, text: "Use 'Move and Paint' blocks", image: "paint-blocks.svg" },
        { step: 3, text: "Create your masterpiece!", image: "art-canvas.svg" }
      ],
      projectData: {
        canvasSize: [400, 300],
        tools: ["move_paint", "change_color", "lift_brush", "lower_brush"],
        templates: ["flower", "house", "rainbow", "free_draw"]
      },
      estimatedMinutes: 20,
      points: 150
    }
  ],
  "12-17": [
    {
      id: "algorithm-challenge",
      title: "🧮 Algorithm Optimization",
      description: "Solve complex pathfinding and sorting challenges efficiently.",
      type: "challenge",
      difficulty: "hard",
      instructions: [
        { step: 1, text: "Analyze the problem constraints", image: "analysis.svg" },
        { step: 2, text: "Implement your algorithm", image: "code-editor.svg" },
        { step: 3, text: "Optimize for time and space complexity", image: "optimization.svg" }
      ],
      challenges: [
        { name: "Dijkstra's Pathfinding", difficulty: "hard", topic: "graphs" },
        { name: "Dynamic Programming", difficulty: "hard", topic: "optimization" },
        { name: "Binary Search Tree", difficulty: "medium", topic: "data_structures" }
      ],
      estimatedMinutes: 45,
      points: 300
    },
    {
      id: "ai-robot-trainer",
      title: "🧠 AI Robot Trainer",
      description: "Train robots using machine learning algorithms.",
      type: "project",
      difficulty: "hard",
      instructions: [
        { step: 1, text: "Collect training data from sensors", image: "data-collection.svg" },
        { step: 2, text: "Choose and configure ML model", image: "ml-model.svg" },
        { step: 3, text: "Train and test your robot", image: "robot-training.svg" }
      ],
      projectData: {
        mlModels: ["neural_network", "decision_tree", "svm"],
        datasets: ["obstacle_detection", "object_classification", "behavior_prediction"],
        evaluationMetrics: ["accuracy", "precision", "recall"]
      },
      estimatedMinutes: 60,
      points: 400
    }
  ]
};

// Teacher course creation templates
export const teacherCourseTemplates = [
  {
    id: "programming-fundamentals",
    title: "Programming Fundamentals Template",
    description: "A comprehensive template for teaching basic programming concepts",
    ageGroup: "both",
    sections: [
      { name: "Variables and Data Types", estimatedHours: 2 },
      { name: "Control Flow", estimatedHours: 3 },
      { name: "Functions", estimatedHours: 2 },
      { name: "Arrays and Objects", estimatedHours: 3 },
      { name: "Final Project", estimatedHours: 4 }
    ],
    resources: [
      { type: "slides", name: "Introduction to Variables" },
      { type: "video", name: "Control Flow Explained" },
      { type: "exercise", name: "Function Practice" },
      { type: "project", name: "Calculator App" }
    ]
  },
  {
    id: "robotics-basics",
    title: "Robotics Basics Template", 
    description: "Everything needed to teach robotics to students",
    ageGroup: "6-11",
    sections: [
      { name: "What is a Robot?", estimatedHours: 1 },
      { name: "Sensors and Motors", estimatedHours: 2 },
      { name: "Basic Programming", estimatedHours: 3 },
      { name: "Building Projects", estimatedHours: 4 }
    ],
    resources: [
      { type: "interactive", name: "Robot Simulator" },
      { type: "video", name: "How Sensors Work" },
      { type: "project", name: "Pet Robot" }
    ]
  }
];