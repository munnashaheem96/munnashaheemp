/* ==========================================================================
   MUNNA SHAHEEM - CORE PORTFOLIO JAVASCRIPT ENGINE
   Custom Physics, Interactive Graphs, Web Audio, Command Palette, 3D Globe
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --------------------------------------------------------------------------
  // A. INITIALIZATION & SELECTORS
  // --------------------------------------------------------------------------
  const html = document.documentElement;
  const body = document.body;
  const loader = document.getElementById('page-loader');
  const loaderBar = document.getElementById('loader-progress-bar');
  const loaderPct = document.getElementById('loader-percentage');
  const liveClock = document.getElementById('live-clock');
  const themeToggle = document.getElementById('theme-toggle');
  const customCursor = document.getElementById('custom-cursor');
  const cursorDot = customCursor.querySelector('.cursor-dot');
  const cursorRing = customCursor.querySelector('.cursor-ring');
  const cursorGlow = document.getElementById('cursor-glow');
  const commandPalette = document.getElementById('command-palette');
  const paletteInput = document.getElementById('palette-search-input');
  const paletteResults = document.getElementById('palette-results');
  const backToTop = document.getElementById('back-to-top');
  const mobileToggle = document.getElementById('menu-mobile-toggle');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');

  // Web Audio Context for synthesized UI sounds (Apple launch vibes)
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSound(type) {
    try {
      initAudio();
      if (!audioCtx) return;
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      const now = audioCtx.currentTime;
      
      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(900, now + 0.03);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'rocket') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.8);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === 'konami') {
        // Futuristic retro arcade rise
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.setValueAtTime(300, now + 0.1);
        osc.frequency.setValueAtTime(600, now + 0.2);
        osc.frequency.setValueAtTime(1200, now + 0.3);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {
      console.warn("Audio synthesis blocked or unsupported:", e);
    }
  }

  // --------------------------------------------------------------------------
  // B. LOCAL CLOCK ENGINE
  // --------------------------------------------------------------------------
  function updateClock() {
    const options = {
      timeZone: 'Asia/Kolkata', // Malappuram, Kerala time zone
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    liveClock.textContent = `${formatter.format(new Date())} IST`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --------------------------------------------------------------------------
  // B2. SYSTEM MONITOR SPARKLINE SIMULATOR
  // --------------------------------------------------------------------------
  const fpsVal = document.getElementById('fps-val');
  const sparklineCanvas = document.getElementById('fps-sparkline');
  if (sparklineCanvas) {
    const sCtx = sparklineCanvas.getContext('2d');
    let fpsHistory = Array(20).fill(60);
    
    function updateFPSMonitor() {
      // Simulate real-time FPS variance
      const currentFPS = (59.2 + Math.random() * 0.9).toFixed(1);
      if (fpsVal) fpsVal.textContent = currentFPS;
      
      // Update sparkline queue
      fpsHistory.shift();
      fpsHistory.push(parseFloat(currentFPS));
      
      // Draw sparkline
      sCtx.clearRect(0, 0, sparklineCanvas.width, sparklineCanvas.height);
      sCtx.beginPath();
      sCtx.strokeStyle = '#30d158';
      sCtx.lineWidth = 1.5;
      
      const step = sparklineCanvas.width / (fpsHistory.length - 1);
      fpsHistory.forEach((fps, i) => {
        const x = i * step;
        // Map FPS from 58 to 61 to canvas height (30 to 0)
        const y = 30 - ((fps - 58) / 3) * 30;
        if (i === 0) sCtx.moveTo(x, y);
        else sCtx.lineTo(x, y);
      });
      sCtx.stroke();
      
      setTimeout(updateFPSMonitor, 200);
    }
    updateFPSMonitor();
  }

  // --------------------------------------------------------------------------
  // C. EXPOLOADER LOGIC (SYSTEM LOADING MOCKUP)
  // --------------------------------------------------------------------------
  let loadingVal = 0;
  const loadInterval = setInterval(() => {
    // Exponential ease: loads fast, slows down at 85%, speeds to 100% on complete
    if (loadingVal < 85) {
      loadingVal += Math.floor(Math.random() * 8) + 2;
    } else if (loadingVal < 99) {
      loadingVal += 1;
    }
    
    if (loadingVal > 100) loadingVal = 100;
    
    loaderBar.style.width = `${loadingVal}%`;
    loaderPct.textContent = `${loadingVal}%`;
    
    if (loadingVal >= 100) {
      clearInterval(loadInterval);
      setTimeout(dismissLoader, 400);
    }
  }, 40);

  window.addEventListener('load', () => {
    // Ensure loader completes on total load
    loadingVal = 100;
    loaderBar.style.width = '100%';
    loaderPct.textContent = '100%';
  });

  function dismissLoader() {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    playSound('click');
    setTimeout(() => {
      // Trigger entrance text reveal adjustments
      document.querySelectorAll('.char-span').forEach((el) => {
        el.style.transform = 'translateY(0) rotate(0deg)';
        el.style.opacity = '1';
        el.style.filter = 'blur(0)';
      });
    }, 100);
  }

  // --------------------------------------------------------------------------
  // D. THEME MANAGER (SAVING STATE)
  // --------------------------------------------------------------------------
  const currentTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    playSound('click');
    const targetTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
  });

  // --------------------------------------------------------------------------
  // E. CUSTOM CURSOR PHYSICS & SPOTLIGHTS
  // --------------------------------------------------------------------------
  let mouse = { x: -100, y: -100 };
  let cursor = { x: -100, y: -100 };
  let ring = { x: -100, y: -100 };

  const gridBackdrop = document.getElementById('grid-backdrop');

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Smooth spotlight coordinates updates
    cursorGlow.style.opacity = '1';
    cursorGlow.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;

    // Perspective parallax grid movement
    if (gridBackdrop) {
      gridBackdrop.style.transform = `translate3d(${(e.clientX - window.innerWidth/2) * -0.012}px, ${(e.clientY - window.innerHeight/2) * -0.012}px, 0)`;
    }
  });

  window.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });

  // Inertia loop for elastic ring lag
  function updateCursorPhysics() {
    // Exact dot tracking
    cursor.x = mouse.x;
    cursor.y = mouse.y;
    cursorDot.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0)`;

    // Elastic ring tracking: x += (targetX - x) * easing
    ring.x += (mouse.x - ring.x) * 0.15;
    ring.y += (mouse.y - ring.y) * 0.15;
    cursorRing.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;

    requestAnimationFrame(updateCursorPhysics);
  }
  updateCursorPhysics();

  // Highlight rings on interactive items
  const interactives = document.querySelectorAll('a, button, .tilt-card, .contact-card-item, .mock-dot, .palette-item');
  interactives.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      customCursor.classList.add('hovered');
      playSound('hover');
    });
    item.addEventListener('mouseleave', () => {
      customCursor.classList.remove('hovered');
    });
  });

  // Card hover radial highlight coordinate updates
  const gridCards = document.querySelectorAll('.stat-card, .cert-card, .portrait-container');
  gridCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });

  // --------------------------------------------------------------------------
  // F. MAGNETIC ACTION PHYSICS
  // --------------------------------------------------------------------------
  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      // Magnetic pull scaling: translates by up to 15px max
      btn.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`;
      const text = btn.querySelector('.btn-text, svg, .rocket-body');
      if (text) {
        text.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate3d(0px, 0px, 0)`;
      const text = btn.querySelector('.btn-text, svg, .rocket-body');
      if (text) {
        text.style.transform = `translate3d(0px, 0px, 0)`;
      }
    });
  });

  // --------------------------------------------------------------------------
  // G. 3D PERSPECTIVE TILT
  // --------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const rotateY = ((x / rect.width) - 0.5) * 12; // max 6deg roll
      const rotateX = -((y / rect.height) - 0.5) * 12; // max 6deg pitch
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
  });

  // --------------------------------------------------------------------------
  // H. ROLE SWITCHER (CHARACTER SCRAMBLER)
  // --------------------------------------------------------------------------
  const roles = [
    "Flutter Developer",
    "Software Engineer",
    "Mobile App Developer",
    "Problem Solver",
    "Firebase Developer",
    "Frontend Developer"
  ];
  let roleIdx = 0;
  const roleEl = document.getElementById('role-text');

  function scrambleScripter(targetWord) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%&*';
    let currentIteration = 0;
    const interval = setInterval(() => {
      roleEl.textContent = targetWord
        .split('')
        .map((char, index) => {
          if (index < currentIteration) {
            return targetWord[index];
          }
          if (char === ' ') return ' ';
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join('');
      
      currentIteration += 1/3;
      
      if (currentIteration >= targetWord.length + 1) {
        clearInterval(interval);
        roleEl.textContent = targetWord;
      }
    }, 30);
  }

  setInterval(() => {
    roleIdx = (roleIdx + 1) % roles.length;
    scrambleScripter(roles[roleIdx]);
  }, 4000);

  // --------------------------------------------------------------------------
  // I. TERMINAL SIMULATOR ENGINE
  // --------------------------------------------------------------------------
  const typedSpan = document.getElementById('terminal-typed');
  const terminalLines = [
    'flutter create munna_project',
    'fetching github.com/munnashaheem96',
    'connecting to Firebase services...',
    'auth initialized successfully.',
    'status: ready for deployment.'
  ];
  let terminalLineIdx = 0;
  let terminalCharIdx = 0;
  let isDeleting = false;

  function runTerminalLoop() {
    const currentLine = terminalLines[terminalLineIdx];
    
    if (isDeleting) {
      typedSpan.textContent = currentLine.substring(0, terminalCharIdx - 1);
      terminalCharIdx--;
    } else {
      typedSpan.textContent = currentLine.substring(0, terminalCharIdx + 1);
      terminalCharIdx++;
    }

    let delay = isDeleting ? 30 : 60;

    if (!isDeleting && terminalCharIdx === currentLine.length) {
      delay = 2000; // Pause at end of line
      isDeleting = true;
    } else if (isDeleting && terminalCharIdx === 0) {
      isDeleting = false;
      terminalLineIdx = (terminalLineIdx + 1) % terminalLines.length;
      delay = 500; // Pause before typing new line
    }

    setTimeout(runTerminalLoop, delay);
  }
  setTimeout(runTerminalLoop, 1500);

  // --------------------------------------------------------------------------
  // J. ABOUT METRIC INTERSECTION COUNTING
  // --------------------------------------------------------------------------
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.counter');
        const targetVal = parseInt(entry.target.getAttribute('data-target'));
        let count = 0;
        const speed = 1000 / targetVal; // complete in 1s
        
        const tick = setInterval(() => {
          count++;
          counters.forEach((c) => {
            c.textContent = count;
          });
          if (count >= targetVal) {
            clearInterval(tick);
          }
        }, speed);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.stat-card').forEach((card) => {
    counterObserver.observe(card);
  });

  // Reveal elements on scroll
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    scrollObserver.observe(el);
  });

  // --------------------------------------------------------------------------
  // K. CANVAS PARTICLES SYSTEM
  // --------------------------------------------------------------------------
  const particleCanvas = document.getElementById('hero-particles');
  const pCtx = particleCanvas.getContext('2d');
  let particles = [];
  let velocityFactor = 1.0; // Boosted during easter egg

  function initParticleCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    particles = [];
    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }
  }

  function drawParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    const theme = html.getAttribute('data-theme');
    pCtx.fillStyle = theme === 'light' ? 'rgba(0, 113, 227, 0.4)' : 'rgba(255, 255, 255, 0.3)';
    pCtx.strokeStyle = theme === 'light' ? 'rgba(0, 113, 227, 0.05)' : 'rgba(255, 255, 255, 0.04)';
    
    particles.forEach((p, idx) => {
      // Update coordinates
      p.x += p.vx * velocityFactor;
      p.y += p.vy * velocityFactor;

      // Wrap-around bounds checks
      if (p.x < 0) p.x = particleCanvas.width;
      if (p.x > particleCanvas.width) p.x = 0;
      if (p.y < 0) p.y = particleCanvas.height;
      if (p.y > particleCanvas.height) p.y = 0;

      // Repel from cursor
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        p.x -= (dx / dist) * force * 1.5;
        p.y -= (dy / dist) * force * 1.5;
      }

      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fill();

      // Connect neighbor nodes
      for (let j = idx + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const distance = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
        if (distance < 100) {
          pCtx.beginPath();
          pCtx.moveTo(p.x, p.y);
          pCtx.lineTo(p2.x, p2.y);
          pCtx.stroke();
        }
      }
    });

    requestAnimationFrame(drawParticles);
  }

  window.addEventListener('resize', initParticleCanvas);
  initParticleCanvas();
  drawParticles();

  // --------------------------------------------------------------------------
  // L. SKILLS ORBITAL UNIVERSE GRAV GRAPH
  // --------------------------------------------------------------------------
  const skillsCanvas = document.getElementById('skills-canvas');
  const sCtx = skillsCanvas.getContext('2d');
  let skillUniverse = {
    centerX: 0,
    centerY: 0,
    nodes: [],
    draggingNode: null
  };

  const skillsData = [
    { name: 'Java', orbit: 110, angle: 0.1, speed: 0.004, details: 'Object-Oriented Programming, API design' },
    { name: 'Python', orbit: 110, angle: 2.2, speed: -0.003, details: 'Scripting, Automation, Data Structures' },
    { name: 'Dart', orbit: 160, angle: 1.0, speed: 0.002, details: 'Core Flutter language, Asynchronous Streams' },
    { name: 'Flutter', orbit: 160, angle: 3.5, speed: 0.0015, details: 'Cross-platform apps, custom widgets, clean UI' },
    { name: 'Firebase', orbit: 210, angle: 0.5, speed: -0.002, details: 'Auth, Firestore, Cloud Functions' },
    { name: 'React', orbit: 210, angle: 2.8, speed: 0.0025, details: 'State hooks, component layout, micro-interactions' },
    { name: 'JavaScript', orbit: 210, angle: 4.5, speed: -0.0018, details: 'DOM APIs, ES6+, Web APIs, script logic' },
    { name: 'HTML5/CSS3', orbit: 260, angle: 1.5, speed: 0.0012, details: 'Semantic document grids, fluid layouts' },
    { name: 'SQL', orbit: 260, angle: 5.2, speed: -0.0015, details: 'Relational logic, joins, index optimizations' },
    { name: 'Git', orbit: 110, angle: 4.0, speed: 0.0035, details: 'Version control branch management' },
    { name: 'GitHub', orbit: 160, angle: 5.8, speed: -0.0022, details: 'Collaborative PR reviews, Actions workflows' },
    { name: 'Figma', orbit: 260, angle: 3.2, speed: 0.001, details: 'Component wireframes, interactive transitions' },
    { name: 'Photoshop', orbit: 260, angle: 0.8, speed: -0.0014, details: 'Layout asset adjustments, canvas compositions' },
    { name: 'Firestore', orbit: 210, angle: 1.8, speed: 0.002, details: 'NoSQL structuring, subcollection triggers' },
    { name: 'REST APIs', orbit: 160, angle: 2.4, speed: -0.0018, details: 'JSON parsing, rate limits, interceptors' }
  ];

  function resizeSkillsCanvas() {
    const container = skillsCanvas.parentElement;
    skillsCanvas.width = container.clientWidth;
    skillsCanvas.height = container.clientHeight;
    skillUniverse.centerX = skillsCanvas.width / 2;
    skillUniverse.centerY = skillsCanvas.height / 2;
    
    // Set nodes
    skillUniverse.nodes = skillsData.map((s) => ({
      name: s.name,
      orbit: s.orbit * (skillsCanvas.width < 600 ? 0.7 : 1.0),
      angle: s.angle,
      speed: s.speed,
      details: s.details,
      x: 0,
      y: 0,
      radius: skillsCanvas.width < 600 ? 25 : 38,
      hovered: false,
      dragged: false,
      offsetX: 0,
      offsetY: 0
    }));
  }

  // Mouse interactivity on Skills universe
  let skillsMouse = { x: 0, y: 0, isDown: false };
  
  skillsCanvas.addEventListener('mousemove', (e) => {
    const rect = skillsCanvas.getBoundingClientRect();
    skillsMouse.x = e.clientX - rect.left;
    skillsMouse.y = e.clientY - rect.top;
    
    if (skillUniverse.draggingNode) {
      // Dynamic manual displacement relative to universe center
      const dx = skillsMouse.x - skillUniverse.centerX;
      const dy = skillsMouse.y - skillUniverse.centerY;
      skillUniverse.draggingNode.orbit = Math.sqrt(dx * dx + dy * dy);
      skillUniverse.draggingNode.angle = Math.atan2(dy, dx);
      return;
    }

    skillUniverse.nodes.forEach((node) => {
      const dist = Math.sqrt((node.x - skillsMouse.x) ** 2 + (node.y - skillsMouse.y) ** 2);
      node.hovered = dist < node.radius;
    });
  });

  skillsCanvas.addEventListener('mousedown', () => {
    skillsMouse.isDown = true;
    const clickedNode = skillUniverse.nodes.find((n) => n.hovered);
    if (clickedNode) {
      skillUniverse.draggingNode = clickedNode;
      clickedNode.dragged = true;
    }
  });

  window.addEventListener('mouseup', () => {
    skillsMouse.isDown = false;
    if (skillUniverse.draggingNode) {
      skillUniverse.draggingNode.dragged = false;
      skillUniverse.draggingNode = null;
    }
  });

  function drawSkillsUniverse() {
    sCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);
    const theme = html.getAttribute('data-theme');
    
    // Center Node - Munna Shaheem
    const centerRadius = skillsCanvas.width < 600 ? 45 : 60;
    
    // Grid alignment reference orbits
    const orbits = [110, 160, 210, 260].map(o => o * (skillsCanvas.width < 600 ? 0.7 : 1.0));
    sCtx.strokeStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.02)';
    sCtx.lineWidth = 1.5;
    orbits.forEach((o) => {
      sCtx.beginPath();
      sCtx.arc(skillUniverse.centerX, skillUniverse.centerY, o, 0, Math.PI * 2);
      sCtx.stroke();
    });

    // Draw connection lines to nodes first
    skillUniverse.nodes.forEach((node) => {
      // Calculate coordinates if not dragged
      if (!node.dragged) {
        node.angle += node.speed;
        node.x = skillUniverse.centerX + Math.cos(node.angle) * node.orbit;
        node.y = skillUniverse.centerY + Math.sin(node.angle) * node.orbit;
      }
      
      sCtx.beginPath();
      sCtx.moveTo(skillUniverse.centerX, skillUniverse.centerY);
      sCtx.lineTo(node.x, node.y);
      sCtx.strokeStyle = node.hovered
        ? (theme === 'light' ? 'rgba(0, 113, 227, 0.25)' : 'rgba(10, 132, 255, 0.25)')
        : (theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.04)');
      sCtx.lineWidth = node.hovered ? 2 : 1;
      sCtx.stroke();

      // Traveling glowing light nodes along threads (fiber-optic effect)
      const pulseOffset = ((Date.now() / 1500) + (node.orbit * 0.003)) % 1.0;
      const px = skillUniverse.centerX + (node.x - skillUniverse.centerX) * pulseOffset;
      const py = skillUniverse.centerY + (node.y - skillUniverse.centerY) * pulseOffset;
      sCtx.beginPath();
      sCtx.arc(px, py, 2.5, 0, Math.PI * 2);
      sCtx.fillStyle = theme === 'light' ? '#0071e3' : '#0a84ff';
      sCtx.fill();
    });

    // Draw center core
    const coreGlow = sCtx.createRadialGradient(
      skillUniverse.centerX, skillUniverse.centerY, centerRadius * 0.6,
      skillUniverse.centerX, skillUniverse.centerY, centerRadius
    );
    coreGlow.addColorStop(0, theme === 'light' ? '#121212' : '#ffffff');
    coreGlow.addColorStop(1, theme === 'light' ? '#333333' : '#a1a1a6');
    
    sCtx.beginPath();
    sCtx.arc(skillUniverse.centerX, skillUniverse.centerY, centerRadius, 0, Math.PI * 2);
    sCtx.fillStyle = coreGlow;
    sCtx.fill();
    
    // Core label
    sCtx.fillStyle = theme === 'light' ? '#ffffff' : '#000000';
    sCtx.font = `600 ${skillsCanvas.width < 600 ? '9px' : '12px'} Satoshi, sans-serif`;
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText('MUNNA', skillUniverse.centerX, skillUniverse.centerY - 8);
    sCtx.fillText('SHAHEEM', skillUniverse.centerX, skillUniverse.centerY + 8);

    // Draw child nodes
    skillUniverse.nodes.forEach((node) => {
      // Outer glow for hover
      if (node.hovered) {
        sCtx.beginPath();
        sCtx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        sCtx.fillStyle = theme === 'light' ? 'rgba(0, 113, 227, 0.08)' : 'rgba(10, 132, 255, 0.12)';
        sCtx.fill();
      }

      sCtx.beginPath();
      sCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      sCtx.fillStyle = theme === 'light' ? '#ffffff' : '#16161a';
      sCtx.strokeStyle = node.hovered
        ? (theme === 'light' ? '#0071e3' : '#0a84ff')
        : (theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)');
      sCtx.lineWidth = 1.5;
      sCtx.fill();
      sCtx.stroke();

      // Node label
      sCtx.fillStyle = theme === 'light' ? '#121212' : '#ffffff';
      sCtx.font = `${node.hovered ? '700' : '500'} ${skillsCanvas.width < 600 ? '8px' : '10px'} Satoshi, sans-serif`;
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';
      sCtx.fillText(node.name, node.x, node.y);

      // Tooltip render for hovered node
      if (node.hovered) {
        const tooltipX = node.x;
        const tooltipY = node.y - node.radius - 24;

        sCtx.fillStyle = '#0a0a0c';
        sCtx.beginPath();
        sCtx.roundRect(tooltipX - 90, tooltipY - 24, 180, 36, 6);
        sCtx.fill();

        sCtx.fillStyle = '#ffffff';
        sCtx.font = '500 8.5px Satoshi, sans-serif';
        sCtx.fillText(node.details, tooltipX, tooltipY - 6);
      }
    });

    requestAnimationFrame(drawSkillsUniverse);
  }

  window.addEventListener('resize', resizeSkillsCanvas);
  resizeSkillsCanvas();
  drawSkillsUniverse();

  // --------------------------------------------------------------------------
  // M. EXPERIENCE TIMELINE FILL TRACKER
  // --------------------------------------------------------------------------
  const timelineProgress = document.getElementById('timeline-progress');
  const expSection = document.getElementById('experience');

  window.addEventListener('scroll', () => {
    const rect = expSection.getBoundingClientRect();
    const sectionHeight = rect.height;
    
    // Measure relative visibility inside the viewport
    const progressStart = window.innerHeight * 0.8;
    const progressEnd = window.innerHeight * 0.2;
    
    let scrolled = ((progressStart - rect.top) / (sectionHeight - progressEnd)) * 100;
    if (scrolled < 0) scrolled = 0;
    if (scrolled > 100) scrolled = 100;
    
    timelineProgress.style.height = `${scrolled}%`;
  });

  // --------------------------------------------------------------------------
  // N. 3D PHONE SCREEN SHOWCASE CAROUSEL
  // --------------------------------------------------------------------------
  const mockDots = document.querySelectorAll('.mock-dot');
  const slides = document.querySelectorAll('.phone-slide');
  let currentSlide = 0;
  let slideInterval = null;

  function setSlide(index) {
    slides.forEach((slide) => slide.classList.remove('active'));
    mockDots.forEach((dot) => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    mockDots[index].classList.add('active');
    currentSlide = index;
  }

  function startSlideShow() {
    slideInterval = setInterval(() => {
      let nextSlide = (currentSlide + 1) % slides.length;
      setSlide(nextSlide);
    }, 4000);
  }

  mockDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      playSound('click');
      clearInterval(slideInterval);
      setSlide(idx);
      startSlideShow();
    });
  });

  startSlideShow();

  // --------------------------------------------------------------------------
  // O. SSCET OUTPASS ARCHITECTURE SIMULATOR
  // --------------------------------------------------------------------------
  const diagramNodeClient = document.querySelector('.node-client');
  const diagramNodeServer = document.querySelector('.node-server');
  const diagramNodeAdmin = document.querySelector('.node-admin');
  const packetAnim = document.getElementById('packet-anim');
  const wSteps = document.querySelectorAll('.w-step');
  
  let outpassStep = 0;

  function animateOutpassFlow() {
    // coordinates mapping relative to parent
    const cRect = diagramNodeClient.getBoundingClientRect();
    const sRect = diagramNodeServer.getBoundingClientRect();
    const aRect = diagramNodeAdmin.getBoundingClientRect();
    const meshRect = diagramNodeClient.parentElement.getBoundingClientRect();

    const clientX = cRect.left + cRect.width/2 - meshRect.left;
    const clientY = cRect.top + cRect.height/2 - meshRect.top;
    const serverX = sRect.left + sRect.width/2 - meshRect.left;
    const serverY = sRect.top + sRect.height/2 - meshRect.top;
    const adminX = aRect.left + aRect.width/2 - meshRect.left;
    const adminY = aRect.top + aRect.height/2 - meshRect.top;

    wSteps.forEach((s) => s.classList.remove('active'));
    packetAnim.style.opacity = '1';
    packetAnim.style.transition = 'none';

    if (outpassStep === 0) {
      // Step 1: Client -> Server
      wSteps[0].classList.add('active');
      packetAnim.style.left = `${clientX}px`;
      packetAnim.style.top = `${clientY}px`;
      
      setTimeout(() => {
        packetAnim.style.transition = 'left 1.5s linear, top 1.5s linear';
        packetAnim.style.left = `${serverX}px`;
        packetAnim.style.top = `${serverY}px`;
      }, 50);

    } else if (outpassStep === 1) {
      // Step 2: Server -> Admin
      wSteps[1].classList.add('active');
      packetAnim.style.left = `${serverX}px`;
      packetAnim.style.top = `${serverY}px`;
      
      setTimeout(() => {
        packetAnim.style.transition = 'left 1.5s linear, top 1.5s linear';
        packetAnim.style.left = `${adminX}px`;
        packetAnim.style.top = `${adminY}px`;
      }, 50);

    } else if (outpassStep === 2) {
      // Step 3: Admin approves -> back to client
      wSteps[2].classList.add('active');
      packetAnim.style.left = `${adminX}px`;
      packetAnim.style.top = `${adminY}px`;
      
      setTimeout(() => {
        packetAnim.style.transition = 'left 2s ease-in-out, top 2s ease-in-out';
        packetAnim.style.left = `${clientX}px`;
        packetAnim.style.top = `${clientY}px`;
      }, 50);
    }

    outpassStep = (outpassStep + 1) % 3;
    setTimeout(animateOutpassFlow, 4000);
  }
  
  // Start outpass visual loop once parent is loaded
  setTimeout(animateOutpassFlow, 2000);

  // --------------------------------------------------------------------------
  // P. CANVAS 3D ROTATING WIREFRAME GLOBE
  // --------------------------------------------------------------------------
  const globeCanvas = document.getElementById('globe-canvas');
  const gCtx = globeCanvas.getContext('2d');
  let globeRadius = 180;
  let globePoints = [];
  let rotationY = 0;
  let rotationX = 0;
  let dragX = 0;
  let dragY = 0;
  let isDraggingGlobe = false;

  function initGlobe() {
    globeCanvas.width = globeCanvas.parentElement.clientWidth;
    globeCanvas.height = globeCanvas.parentElement.clientHeight;
    globeRadius = Math.min(globeCanvas.width, globeCanvas.height) * 0.38;
    
    // Generate point matrix on sphere surface
    globePoints = [];
    const count = 350;
    for (let i = 0; i < count; i++) {
      const theta = Math.acos(Math.random() * 2 - 1);
      const phi = Math.random() * Math.PI * 2;
      
      globePoints.push({
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(theta)
      });
    }
  }

  // Globe drag listeners
  globeCanvas.addEventListener('mousedown', (e) => {
    isDraggingGlobe = true;
    dragX = e.clientX;
    dragY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingGlobe) return;
    const dx = e.clientX - dragX;
    const dy = e.clientY - dragY;
    
    rotationY += dx * 0.005;
    rotationX += dy * 0.005;
    
    dragX = e.clientX;
    dragY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDraggingGlobe = false;
  });

  function drawGlobe() {
    gCtx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);
    const theme = html.getAttribute('data-theme');
    
    // Orbit rotation automatically if not dragging
    if (!isDraggingGlobe) {
      rotationY += 0.002;
    }

    const cx = globeCanvas.width / 2;
    const cy = globeCanvas.height / 2;

    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);

    // Filter points based on depth for aesthetic wireframe look
    globePoints.forEach((p) => {
      // Rotation Y
      let x1 = p.x * cosY - p.z * sinY;
      let z1 = p.x * sinY + p.z * cosY;
      
      // Rotation X
      let y2 = p.y * cosX - z1 * sinX;
      let z2 = p.y * sinX + z1 * cosX;

      // Project orthographically
      const px = x1 * globeRadius + cx;
      const py = y2 * globeRadius + cy;

      // Calculate depth brightness (points in front are brighter)
      const depthVal = (z2 + 1) / 2; // scale 0 to 1
      
      if (z2 > -0.2) { // Hide points in back to enhance clean Vercel/Tesla sphere wireframe
        gCtx.beginPath();
        gCtx.arc(px, py, depthVal * 2.5 + 0.5, 0, Math.PI * 2);
        
        if (theme === 'light') {
          gCtx.fillStyle = `rgba(0, 113, 227, ${depthVal * 0.8})`;
        } else {
          gCtx.fillStyle = `rgba(255, 255, 255, ${depthVal * 0.85})`;
        }
        gCtx.fill();
      }
    });

    // Draw Kerala Coordinate Node Pin
    const pinTheta = (90 - 10.98) * Math.PI / 180;
    const pinPhi = 76.07 * Math.PI / 180;
    const pinX = Math.sin(pinTheta) * Math.cos(pinPhi);
    const pinY = Math.sin(pinTheta) * Math.sin(pinPhi);
    const pinZ = Math.cos(pinTheta);

    // Apply Y/X matrix rotations
    let px1 = pinX * cosY - pinZ * sinY;
    let pz1 = pinX * sinY + pinZ * cosY;
    let py2 = pinY * cosX - pz1 * sinX;
    let pz2 = pinY * sinX + pz1 * cosX;

    if (pz2 > 0) { // Render only if facing front hemisphere
      const pinPX = px1 * globeRadius + cx;
      const pinPY = py2 * globeRadius + cy;

      // Glowing dot
      gCtx.beginPath();
      gCtx.arc(pinPX, pinPY, 5, 0, Math.PI * 2);
      gCtx.fillStyle = '#ff2d55';
      gCtx.fill();

      // Pulsing coordinate ring
      const pulseSize = 5 + ((Date.now() % 1200) * 0.012);
      gCtx.beginPath();
      gCtx.arc(pinPX, pinPY, pulseSize, 0, Math.PI * 2);
      gCtx.strokeStyle = 'rgba(255, 45, 85, 0.5)';
      gCtx.lineWidth = 1;
      gCtx.stroke();

      // Label background
      gCtx.fillStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)';
      gCtx.beginPath();
      gCtx.roundRect(pinPX + 12, pinPY - 12, 100, 24, 4);
      gCtx.fill();

      // Label text
      gCtx.fillStyle = theme === 'light' ? '#ffffff' : '#000000';
      gCtx.font = '700 8px Satoshi, sans-serif';
      gCtx.textAlign = 'left';
      gCtx.textBaseline = 'middle';
      gCtx.fillText('MUNNA [KERALA]', pinPX + 18, pinPY);
    }

    // Drawing halo around edge
    const haloGlow = gCtx.createRadialGradient(cx, cy, globeRadius * 0.9, cx, cy, globeRadius * 1.05);
    if (theme === 'light') {
      haloGlow.addColorStop(0, 'rgba(0, 113, 227, 0.0)');
      haloGlow.addColorStop(1, 'rgba(0, 113, 227, 0.08)');
    } else {
      haloGlow.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
      haloGlow.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    }
    gCtx.beginPath();
    gCtx.arc(cx, cy, globeRadius * 1.05, 0, Math.PI * 2);
    gCtx.fillStyle = haloGlow;
    gCtx.fill();

    requestAnimationFrame(drawGlobe);
  }

  window.addEventListener('resize', initGlobe);
  initGlobe();
  drawGlobe();

  // --------------------------------------------------------------------------
  // Q. COMMAND PALETTE FUZZY SEARCH (CTRL+K CONTROLLER)
  // --------------------------------------------------------------------------
  const commandsList = [
    { title: 'Go to Hero Section', action: () => document.getElementById('hero').scrollIntoView(), icon: '⚡' },
    { title: 'Go to About Section', action: () => document.getElementById('about').scrollIntoView(), icon: '👤' },
    { title: 'Go to Skill Universe', action: () => document.getElementById('skills').scrollIntoView(), icon: '🧠' },
    { title: 'Go to Timeline Experience', action: () => document.getElementById('experience').scrollIntoView(), icon: '⏳' },
    { title: 'Go to Project Showcase', action: () => document.getElementById('projects').scrollIntoView(), icon: '💻' },
    { title: 'Go to Certification Wall', action: () => document.getElementById('certifications').scrollIntoView(), icon: '📜' },
    { title: 'Go to Contact Section', action: () => document.getElementById('contact').scrollIntoView(), icon: '✉️' },
    { title: 'Download Official Resume', action: () => {
      const link = document.createElement('a');
      link.href = 'Munna_Shaheem_Resume.pdf';
      link.download = 'Munna_Shaheem_Resume.pdf';
      link.click();
    }, icon: '📥' },
    { title: 'Switch System Theme', action: () => themeToggle.click(), icon: '🌗' },
    { title: 'Launch Rocket to Top', action: () => {
      closePalette();
      backToTop.click();
    }, icon: '🚀' }
  ];

  let selectedIdx = 0;
  let activeMatches = [];

  function openPalette() {
    commandPalette.showModal();
    paletteInput.value = '';
    renderResults(commandsList);
    setTimeout(() => paletteInput.focus(), 50);
  }

  function closePalette() {
    commandPalette.close();
  }

  function renderResults(list) {
    activeMatches = list;
    selectedIdx = 0;
    paletteResults.innerHTML = '';
    
    if (list.length === 0) {
      paletteResults.innerHTML = '<div class="palette-item" style="cursor:default;"><span style="opacity:0.5;">No commands found.</span></div>';
      return;
    }

    list.forEach((cmd, idx) => {
      const div = document.createElement('div');
      div.className = `palette-item ${idx === selectedIdx ? 'selected' : ''}`;
      
      div.innerHTML = `
        <div class="palette-item-left">
          <span class="palette-item-icon">${cmd.icon}</span>
          <span class="palette-item-title">${cmd.title}</span>
        </div>
        <span class="palette-item-shortcut">Select</span>
      `;
      
      div.addEventListener('click', () => {
        cmd.action();
        closePalette();
      });
      
      paletteResults.appendChild(div);
    });
  }

  // Keyboard navigation inside palette modal
  window.addEventListener('keydown', (e) => {
    // Check Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (commandPalette.open) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });

  paletteInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIdx = (selectedIdx + 1) % activeMatches.length;
      updateSelectedHighlight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIdx = (selectedIdx - 1 + activeMatches.length) % activeMatches.length;
      updateSelectedHighlight();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeMatches[selectedIdx]) {
        playSound('click');
        activeMatches[selectedIdx].action();
        closePalette();
      }
    }
  });

  paletteInput.addEventListener('input', () => {
    const val = paletteInput.value.toLowerCase();
    const matches = commandsList.filter((cmd) => 
      cmd.title.toLowerCase().includes(val)
    );
    renderResults(matches);
  });

  function updateSelectedHighlight() {
    const items = paletteResults.querySelectorAll('.palette-item');
    items.forEach((item, idx) => {
      if (idx === selectedIdx) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  // Close palette on backdrop click
  commandPalette.addEventListener('click', (e) => {
    if (e.target === commandPalette) {
      closePalette();
    }
  });

  // --------------------------------------------------------------------------
  // R. BACK TO TOP ROCKET CONTROLLER
  // --------------------------------------------------------------------------
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    playSound('rocket');
    backToTop.classList.add('launching');
    
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    setTimeout(() => {
      backToTop.classList.remove('launching');
    }, 1000);
  });

  // --------------------------------------------------------------------------
  // S. KONAMI CODE EASTER EGG (HYPER-SPACE MODE)
  // --------------------------------------------------------------------------
  const konamiSeq = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let konamiProgress = 0;

  window.addEventListener('keydown', (e) => {
    const key = e.key;
    const targetKey = konamiSeq[konamiProgress];
    
    if (key.toLowerCase() === targetKey.toLowerCase()) {
      konamiProgress++;
      if (konamiProgress === konamiSeq.length) {
        triggerHyperSpace();
        konamiProgress = 0;
      }
    } else {
      konamiProgress = 0;
    }
  });

  function triggerHyperSpace() {
    playSound('konami');
    velocityFactor = 10.0; // Boost canvas particles
    body.style.filter = 'contrast(1.4) hue-rotate(45deg) saturate(1.8)';
    
    // Create matrix-alert notification overlay
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #30d158;
      color: #000000;
      padding: 16px 32px;
      border-radius: 8px;
      font-family: 'Inter', Courier, monospace;
      font-size: 0.9rem;
      font-weight: 700;
      z-index: 10005;
      box-shadow: 0 10px 40px rgba(48, 209, 88, 0.4);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      animation: fadeIn 0.4s ease forwards;
    `;
    notification.textContent = '⚡ HYPER-SPACE MODE ACTIVATED ⚡';
    body.appendChild(notification);

    setTimeout(() => {
      velocityFactor = 1.0;
      body.style.filter = 'none';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 400);
    }, 4000);
  }

  // --------------------------------------------------------------------------
  // T. MOBILE NAV SYSTEM
  // --------------------------------------------------------------------------
  mobileToggle.addEventListener('click', () => {
    playSound('click');
    const isActive = mobileOverlay.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    
    if (isActive) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  });

  document.querySelectorAll('.mobile-nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      mobileOverlay.classList.remove('active');
      mobileToggle.classList.remove('active');
      body.style.overflow = '';
    });
  });

});
