/**
 * Arduino Projects Cookbook — Interactive Web Application Logic
 * Implements Apple HIG principles: Purpose, Agency, Familiarity, Simplicity, Craft & Delight
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // State Management
  let currentCategory = 'all';
  let searchQuery = '';
  let activeModalProject = null;

  // DOM Elements
  const categoriesGrid = document.getElementById('categoriesGrid');
  const projectsGrid = document.getElementById('projectsGrid');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('projectSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterPills = document.querySelectorAll('.filter-pill');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const searchTriggerBtn = document.getElementById('searchTriggerBtn');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const copyCloneBtn = document.getElementById('copyCloneBtn');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  // Modal Elements
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');
  const modalTabBtns = document.querySelectorAll('.modal-tab-btn');
  const modalTabContents = document.querySelectorAll('.modal-tab-content');
  const modalCategoryBadge = document.getElementById('modalCategoryBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalHook = document.getElementById('modalHook');
  const modalLearnList = document.getElementById('modalLearnList');
  const modalComponentsTable = document.getElementById('modalComponentsTable').querySelector('tbody');
  const modalPinsTable = document.getElementById('modalPinsTable').querySelector('tbody');
  const modalAsciiDiagram = document.getElementById('modalAsciiDiagram');
  const modalSketchFilename = document.getElementById('modalSketchFilename');
  const modalCodeSnippet = document.getElementById('modalCodeSnippet');
  const modalExplanation = document.getElementById('modalExplanation');
  const modalChallengesList = document.getElementById('modalChallengesList');
  const modalCombinationsList = document.getElementById('modalCombinationsList');
  const modalGithubLink = document.getElementById('modalGithubLink');
  const modalCopyCodeBtn = document.getElementById('modalCopyCodeBtn');
  const modalDownloadCodeBtn = document.getElementById('modalDownloadCodeBtn');

  // Recipe Mixer Elements
  const mixerSensorSelect = document.getElementById('mixerSensorSelect');
  const mixerActuatorSelect = document.getElementById('mixerActuatorSelect');
  const mixerDisplaySelect = document.getElementById('mixerDisplaySelect');
  const resultTitle = document.getElementById('resultTitle');
  const resultDesc = document.getElementById('resultDesc');
  const resultDifficulty = document.getElementById('resultDifficulty');
  const resultLogic = document.getElementById('resultLogic');
  const resultWiring = document.getElementById('resultWiring');
  const mixerFindRecipeBtn = document.getElementById('mixerFindRecipeBtn');
  const mixerCopySpecBtn = document.getElementById('mixerCopySpecBtn');

  /* --------------------------------------------------------------------------
     Theme Management (Dark / Light)
     -------------------------------------------------------------------------- */
  const savedTheme = localStorage.getItem('arduino_cookbook_theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('arduino_cookbook_theme', next);
    
    // Update highlight.js theme if needed
    const hljsTheme = document.getElementById('hljs-theme');
    if (hljsTheme) {
      hljsTheme.href = next === 'dark' 
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    }
  });

  /* --------------------------------------------------------------------------
     Toast Notification Helper
     -------------------------------------------------------------------------- */
  function showToast(msg) {
    toastMessage.textContent = msg;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }

  /* --------------------------------------------------------------------------
     Render Categories Grid
     -------------------------------------------------------------------------- */
  function renderCategories() {
    if (!categoriesGrid) return;
    categoriesGrid.innerHTML = '';

    CATEGORIES_DATA.forEach(cat => {
      const card = document.createElement('a');
      card.href = `#explorer`;
      card.className = 'category-card';
      
      const count = PROJECTS_DATA.filter(p => p.categoryId === cat.id).length;

      card.innerHTML = `
        <div class="category-card-img-wrapper">
          <img src="${cat.image}" alt="${cat.title}" class="category-card-img" loading="lazy">
          <div class="category-badge-chip">${cat.badge}</div>
        </div>
        <div class="category-card-body">
          <h3 class="category-card-title">
            <span>${cat.icon}</span>
            <span>${cat.title}</span>
          </h3>
          <p class="category-card-desc">${cat.desc}</p>
          <div class="category-card-footer">
            <span>${count} Recipes Available</span>
            <i data-lucide="arrow-right"></i>
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        setCategoryFilter(cat.id);
      });

      categoriesGrid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  /* --------------------------------------------------------------------------
     Render Projects Grid with Search & Filter
     -------------------------------------------------------------------------- */
  function renderProjects() {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = '';

    const filtered = PROJECTS_DATA.filter(p => {
      const matchCat = (currentCategory === 'all' || p.categoryId === currentCategory);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        p.title.toLowerCase().includes(q) ||
        p.hook.toLowerCase().includes(q) ||
        p.categoryTitle.toLowerCase().includes(q) ||
        p.folder.toLowerCase().includes(q) ||
        p.learn.some(l => l.toLowerCase().includes(q)) ||
        p.components.some(c => c[0].toLowerCase().includes(q))
      );
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';

      filtered.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-id', project.id);

        const compPreview = project.components.slice(0, 3).map(c => `<span class="chip">${c[0]}</span>`).join('');

        card.innerHTML = `
          <div class="project-card-header">
            <span class="project-card-cat">
              <span>${project.categoryIcon}</span>
              <span>${project.categoryTitle}</span>
            </span>
            <span class="project-card-sketch">${project.sketchName}</span>
          </div>
          <h3 class="project-card-title">${project.title}</h3>
          <p class="project-card-hook">${project.hook}</p>
          <div class="project-card-chips">
            ${compPreview}
          </div>
          <div class="project-card-footer">
            <span class="view-guide-link">
              <span>View Guide & Code</span>
              <i data-lucide="chevron-right"></i>
            </span>
            <span class="chip">${project.pins.length} Pins</span>
          </div>
        `;

        card.addEventListener('click', () => openProjectModal(project));
        projectsGrid.appendChild(card);
      });
    }

    if (window.lucide) lucide.createIcons();
  }

  function setCategoryFilter(catId) {
    currentCategory = catId;
    filterPills.forEach(pill => {
      if (pill.getAttribute('data-category') === catId) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
    renderProjects();
  }

  // Filter Pill Click Handlers
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.getAttribute('data-category');
      setCategoryFilter(cat);
    });
  });

  // Search Input Handler
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearSearchBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
    renderProjects();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    renderProjects();
  });

  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    setCategoryFilter('all');
  });

  searchTriggerBtn.addEventListener('click', () => {
    searchInput.focus();
    document.getElementById('explorer').scrollIntoView({ behavior: 'smooth' });
  });

  /* --------------------------------------------------------------------------
     Interactive Recipe Mixer Logic
     -------------------------------------------------------------------------- */
  const RECIPES_DB = {
    "ultrasonic-buzzer": {
      title: "Acoustic Parking Proximity Alarm",
      desc: "An intelligent distance sensor that beeps with increasing frequency as objects approach closer.",
      difficulty: "Beginner",
      logic: "Measures sonar reflection time; maps distance (cm) to buzzer frequency and interval clicks.",
      wiring: "HC-SR04 on Pins D9/D10 + Piezo on D8 via 100Ω resistor.",
      recipeLink: "02-Sensors/Ultrasonic"
    },
    "ultrasonic-servo": {
      title: "Automated Sonar Radar Scanner & Smart Bin Lid",
      desc: "Sweeps a servo-mounted ultrasonic sensor to detect obstacles and open automated mechanical lids.",
      difficulty: "Intermediate",
      logic: "Continuously sweeps 0-180 degrees while sampling distance and plotting polar radar maps.",
      wiring: "Servo signal on D9 (PWM), Ultrasonic on D10/D11 with external 5V power supply.",
      recipeLink: "06-Automation/Motor-Automation"
    },
    "temp-relay": {
      title: "Automated Greenhouse Climate Thermostat",
      desc: "Controls high-voltage AC heating or cooling fans when temperatures drift outside safety limits.",
      difficulty: "Intermediate",
      logic: "Monitors 1-Wire DS18B20 digital temperature with software hysteresis (ON at 30°C, OFF at 26°C).",
      wiring: "DS18B20 on D4 with 4.7kΩ pull-up + 5V optoisolated relay module on D7.",
      recipeLink: "06-Automation/Environment-Monitoring"
    },
    "light-led": {
      title: "Smart Daylight-Harvesting Breathing Mood Lamp",
      desc: "Automatically adjusts ambient room lighting and fades in warm LEDs as the sun sets.",
      difficulty: "Beginner",
      logic: "Samples LDR voltage divider on A0; computes inverted gamma 2.2 curve to drive PWM duty cycle.",
      wiring: "LDR with 10kΩ resistor on A0 + NeoPixel / PWM LED on D6/D9.",
      recipeLink: "06-Automation/Smart-Lighting"
    },
    "imu-servo": {
      title: "6-DOF Active Gyroscopic Camera Gimbal",
      desc: "Stabilizes a camera or robotic payload in real-time by counteracting physical pitch and roll tilt.",
      difficulty: "Advanced",
      logic: "Fuses accelerometer and gyro registers over I2C with complementary filter to drive servos at 50Hz.",
      wiring: "MPU6050 on I2C pins (A4/A5) + SG90 Servos on D9 & D10.",
      recipeLink: "02-Sensors/IMU"
    },
    "humidity-lcd": {
      title: "Digital Environmental Weather Station UI",
      desc: "Displays real-time ambient temperature, humidity, and comfort heat index on a 16x2 LCD.",
      difficulty: "Beginner",
      logic: "Samples DHT sensor every 2 seconds; formats fixed-width telemetry on I2C LCD lines.",
      wiring: "DHT on D5 + 16x2 LCD on shared I2C bus (A4 SDA, A5 SCL).",
      recipeLink: "04-Displays/LCD"
    }
  };

  function updateMixerRecipe() {
    const sensor = mixerSensorSelect.value;
    const actuator = mixerActuatorSelect.value;
    const display = mixerDisplaySelect.value;

    const key = `${sensor}-${actuator}`;
    const customRecipe = RECIPES_DB[key];

    if (customRecipe) {
      resultTitle.textContent = customRecipe.title;
      resultDesc.textContent = customRecipe.desc;
      resultDifficulty.textContent = customRecipe.difficulty;
      resultLogic.textContent = customRecipe.logic;
      resultWiring.textContent = customRecipe.wiring;
      mixerFindRecipeBtn.style.display = 'inline-flex';
      mixerFindRecipeBtn.onclick = () => {
        const match = PROJECTS_DATA.find(p => p.githubPath.includes(customRecipe.recipeLink));
        if (match) openProjectModal(match);
      };
    } else {
      const sensorName = mixerSensorSelect.options[mixerSensorSelect.selectedIndex].text.split(' ')[1] || 'Sensor';
      const actuatorName = mixerActuatorSelect.options[mixerActuatorSelect.selectedIndex].text.split(' ')[1] || 'Actuator';
      const displayName = mixerDisplaySelect.options[mixerDisplaySelect.selectedIndex].text.split(' ')[1] || 'Interface';

      resultTitle.textContent = `Custom ${sensorName} + ${actuatorName} Automation System`;
      resultDesc.textContent = `A responsive embedded controller pairing ${sensorName} input with ${actuatorName} control and real-time ${displayName} feedback.`;
      resultDifficulty.textContent = "Modular Build";
      resultLogic.textContent = `Continuous non-blocking polling of ${sensorName} executing state transitions to command ${actuatorName}.`;
      resultWiring.textContent = `Shared 5V/GND power rails with dedicated digital control and analog ADC pins.`;
      mixerFindRecipeBtn.style.display = 'none';
    }
  }

  mixerSensorSelect.addEventListener('change', updateMixerRecipe);
  mixerActuatorSelect.addEventListener('change', updateMixerRecipe);
  mixerDisplaySelect.addEventListener('change', updateMixerRecipe);

  mixerCopySpecBtn.addEventListener('click', () => {
    const text = `${resultTitle.textContent}\n${resultDesc.textContent}\nLogic: ${resultLogic.textContent}\nWiring: ${resultWiring.textContent}`;
    navigator.clipboard.writeText(text);
    showToast("Project specification copied to clipboard!");
  });

  updateMixerRecipe();

  /* --------------------------------------------------------------------------
     Modal Dialog & Project Detail Viewer
     -------------------------------------------------------------------------- */
  function openProjectModal(project) {
    activeModalProject = project;

    modalCategoryBadge.textContent = `${project.categoryIcon} ${project.categoryTitle}`;
    modalTitle.textContent = project.title;
    modalHook.textContent = project.hook;
    modalSketchFilename.textContent = project.sketchName;
    modalGithubLink.href = project.githubPath;

    // What you'll learn
    modalLearnList.innerHTML = project.learn.map(l => `<li>${l}</li>`).join('');

    // Components Table
    modalComponentsTable.innerHTML = project.components.map(c => `
      <tr>
        <td><strong>${c[0]}</strong></td>
        <td>${c[1]}</td>
        <td>${c[2]}</td>
      </tr>
    `).join('');

    // Pin Connections Table
    modalPinsTable.innerHTML = project.pins.map(p => `
      <tr>
        <td><code>${p[0]}</code></td>
        <td><code>${p[1]}</code></td>
        <td>${p[2]}</td>
      </tr>
    `).join('');

    // ASCII Diagram
    modalAsciiDiagram.textContent = project.asciiDiagram;

    // Code Snippet
    modalCodeSnippet.textContent = project.code;
    if (window.hljs) {
      hljs.highlightElement(modalCodeSnippet);
    }

    // Explanation & Challenges
    modalExplanation.textContent = project.howItWorks;
    modalChallengesList.innerHTML = project.challenges.map(c => `<li>${c}</li>`).join('');

    // Combinations Grid
    modalCombinationsList.innerHTML = project.combinations.map(comb => `
      <div class="combination-card">
        <span class="combination-title">🔗 ${comb[0]}</span>
        <span class="combination-desc">${comb[1]}</span>
      </div>
    `).join('');

    // Reset Tabs
    switchModalTab('guide');

    // Show Modal
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (window.lucide) lucide.createIcons();
  }

  function closeProjectModal() {
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    activeModalProject = null;
  }

  function switchModalTab(tabId) {
    modalTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    modalTabContents.forEach(content => {
      content.classList.toggle('active', content.id === `tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
    });
  }

  modalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchModalTab(btn.getAttribute('data-tab'));
    });
  });

  modalCloseBtn.addEventListener('click', closeProjectModal);
  modalDoneBtn.addEventListener('click', closeProjectModal);

  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  // Modal Code Copy & Download
  modalCopyCodeBtn.addEventListener('click', () => {
    if (activeModalProject) {
      navigator.clipboard.writeText(activeModalProject.code);
      showToast(`Copied ${activeModalProject.sketchName} to clipboard!`);
    }
  });

  modalDownloadCodeBtn.addEventListener('click', () => {
    if (activeModalProject) {
      const blob = new Blob([activeModalProject.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeModalProject.sketchName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Downloading ${activeModalProject.sketchName}`);
    }
  });

  // Git Clone Copy Button
  copyCloneBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('git clone https://github.com/PrerithM/Arduino-Projects.git');
    showToast("Git clone command copied to clipboard!");
  });

  // Back to Top Button
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      document.getElementById('explorer').scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Initial Render
  renderCategories();
  renderProjects();
});
