// Game State
const gameState = {
    isPlaying: false,
    gameTime: 0,
    maxGameTime: 180, // 3 minutes
    speed: 2, // 1 = slow, 2 = moderate, 3 = fast
    indicators: {
        innovation: 50,
        trust: 50,
        stability: 50,
        regulatory: 30
    },
    latentRisks: {
        bias: 0,
        privacy: 0,
        labor: 0,
        safety: 0
    },
    pipelineProgress: 0,
    eventsHandled: 0,
    currentEvent: null,
    lastEventTime: 0,
    eventInterval: 20, // seconds between events
    playerStrategy: {
        speedPreference: 'moderate',
        regulationFocus: 0,
        innovationFocus: 0,
        ignoredEvents: 0
    }
};

// Event Library - Real AI News Scenarios
const eventLibrary = [
    {
        title: "AI System Shows Discriminatory Outcomes",
        description: "A major AI hiring tool has been found to systematically disadvantage certain demographic groups. Public criticism is mounting.",
        type: "crisis",
        actions: [
            {
                text: "Immediately halt deployment and conduct review",
                effects: { innovation: -10, trust: +15, stability: +10, regulatory: -5, bias: -20 }
            },
            {
                text: "Implement quick fixes while maintaining service",
                effects: { innovation: -5, trust: +5, stability: 0, regulatory: 0, bias: -10 }
            },
            {
                text: "Issue statement, continue monitoring",
                effects: { innovation: 0, trust: -10, stability: -5, regulatory: +10, bias: +5 }
            }
        ]
    },
    {
        title: "Breakthrough in AI Productivity",
        description: "A new AI model demonstrates unprecedented efficiency gains. Competitors are racing to deploy similar systems.",
        type: "opportunity",
        actions: [
            {
                text: "Accelerate deployment to gain market advantage",
                effects: { innovation: +15, trust: -5, stability: -5, regulatory: +5, safety: +10 }
            },
            {
                text: "Proceed with careful testing and validation",
                effects: { innovation: +8, trust: +5, stability: +5, regulatory: 0, safety: +3 }
            },
            {
                text: "Wait for more data and peer review",
                effects: { innovation: +3, trust: +10, stability: +8, regulatory: -5, safety: 0 }
            }
        ]
    },
    {
        title: "Government Proposes Emergency AI Regulation",
        description: "Lawmakers are drafting rapid regulatory measures following recent AI-related incidents. Industry pushback is expected.",
        type: "regulatory",
        actions: [
            {
                text: "Support regulation, advocate for industry input",
                effects: { innovation: -8, trust: +15, stability: +10, regulatory: -15, safety: -5 }
            },
            {
                text: "Oppose regulation publicly, lobby against it",
                effects: { innovation: +5, trust: -15, stability: -10, regulatory: +20, safety: +5 }
            },
            {
                text: "Quietly comply while seeking modifications",
                effects: { innovation: -3, trust: +5, stability: +5, regulatory: -5, safety: 0 }
            }
        ]
    },
    {
        title: "Mass Layoffs Linked to AI Automation",
        description: "Thousands of workers face displacement as AI systems take over routine tasks. Social tensions are rising.",
        type: "social",
        actions: [
            {
                text: "Slow automation, invest in retraining programs",
                effects: { innovation: -10, trust: +15, stability: +15, regulatory: -5, labor: -15 }
            },
            {
                text: "Continue automation with minimal support",
                effects: { innovation: +10, trust: -15, stability: -15, regulatory: +10, labor: +20 }
            },
            {
                text: "Partial slowdown with targeted support",
                effects: { innovation: 0, trust: +5, stability: +5, regulatory: 0, labor: -5 }
            }
        ]
    },
    {
        title: "AI Model Data Privacy Concerns",
        description: "Reports reveal that training data may contain sensitive personal information. Privacy advocates demand answers.",
        type: "crisis",
        actions: [
            {
                text: "Audit data immediately, remove sensitive content",
                effects: { innovation: -12, trust: +20, stability: +10, regulatory: -10, privacy: -20 }
            },
            {
                text: "Review practices, implement gradual changes",
                effects: { innovation: -5, trust: +8, stability: +5, regulatory: -3, privacy: -10 }
            },
            {
                text: "Defend current practices, cite legal compliance",
                effects: { innovation: +3, trust: -15, stability: -10, regulatory: +15, privacy: +15 }
            }
        ]
    },
    {
        title: "AI Safety Researchers Issue Warning",
        description: "Leading experts warn that current AI systems lack adequate safety measures. They call for deployment pauses.",
        type: "warning",
        actions: [
            {
                text: "Pause deployment, strengthen safety protocols",
                effects: { innovation: -15, trust: +18, stability: +12, regulatory: -8, safety: -20 }
            },
            {
                text: "Enhance safety measures without pausing",
                effects: { innovation: -5, trust: +8, stability: +5, regulatory: 0, safety: -10 }
            },
            {
                text: "Acknowledge concerns but maintain timeline",
                effects: { innovation: +5, trust: -10, stability: -8, regulatory: +8, safety: +12 }
            }
        ]
    },
    {
        title: "AI Powers Medical Diagnosis Breakthrough",
        description: "AI system achieves remarkable accuracy in early disease detection. Medical community is excited but cautious.",
        type: "opportunity",
        actions: [
            {
                text: "Fast-track deployment to healthcare systems",
                effects: { innovation: +18, trust: +10, stability: +5, regulatory: +5, safety: +8 }
            },
            {
                text: "Conduct extensive clinical trials first",
                effects: { innovation: +8, trust: +15, stability: +10, regulatory: -5, safety: +3 }
            },
            {
                text: "Limit to research settings for now",
                effects: { innovation: +3, trust: +8, stability: +8, regulatory: -8, safety: 0 }
            }
        ]
    },
    {
        title: "AI-Generated Misinformation Spreads",
        description: "Sophisticated AI-generated fake content is spreading rapidly online. Public confusion and mistrust are growing.",
        type: "crisis",
        actions: [
            {
                text: "Implement strict content verification systems",
                effects: { innovation: -10, trust: +12, stability: +10, regulatory: -5, safety: -10 }
            },
            {
                text: "Educate users, add AI detection tools",
                effects: { innovation: -3, trust: +5, stability: +5, regulatory: 0, safety: -5 }
            },
            {
                text: "Focus on existing policies and user reporting",
                effects: { innovation: 0, trust: -8, stability: -10, regulatory: +10, safety: +8 }
            }
        ]
    },
    {
        title: "International AI Competition Intensifies",
        description: "Other nations are heavily investing in AI development. There's pressure to accelerate deployment to maintain advantage.",
        type: "pressure",
        actions: [
            {
                text: "Significantly increase deployment speed",
                effects: { innovation: +20, trust: -10, stability: -8, regulatory: +8, safety: +15 }
            },
            {
                text: "Balance speed with safety standards",
                effects: { innovation: +10, trust: 0, stability: 0, regulatory: +3, safety: +8 }
            },
            {
                text: "Maintain current pace, focus on quality",
                effects: { innovation: +5, trust: +8, stability: +5, regulatory: 0, safety: +3 }
            }
        ]
    },
    {
        title: "Workers Protest AI Surveillance Systems",
        description: "Employees at major companies protest against AI monitoring tools that track their productivity and behavior.",
        type: "social",
        actions: [
            {
                text: "Remove invasive monitoring, respect privacy",
                effects: { innovation: -8, trust: +15, stability: +12, regulatory: -5, privacy: -15 }
            },
            {
                text: "Adjust systems based on worker feedback",
                effects: { innovation: -3, trust: +8, stability: +8, regulatory: 0, privacy: -8 }
            },
            {
                text: "Defend monitoring as necessary for business",
                effects: { innovation: +5, trust: -15, stability: -12, regulatory: +12, privacy: +15 }
            }
        ]
    },
    {
        title: "AI Model Shows Unexpected Behavior",
        description: "Testing reveals that an AI system occasionally produces unpredictable outputs. The cause is unclear.",
        type: "warning",
        actions: [
            {
                text: "Halt deployment, conduct thorough investigation",
                effects: { innovation: -15, trust: +12, stability: +10, regulatory: -8, safety: -18 }
            },
            {
                text: "Add monitoring and safety constraints",
                effects: { innovation: -8, trust: +5, stability: +5, regulatory: 0, safety: -10 }
            },
            {
                text: "Continue with enhanced observation",
                effects: { innovation: +3, trust: -8, stability: -5, regulatory: +8, safety: +12 }
            }
        ]
    },
    {
        title: "Public Trust in AI Technology Declines",
        description: "Recent surveys show growing public skepticism about AI benefits. Trust erosion could impact adoption and regulation.",
        type: "warning",
        actions: [
            {
                text: "Launch transparency initiative, engage public",
                effects: { innovation: -5, trust: +20, stability: +10, regulatory: -8, bias: -5 }
            },
            {
                text: "Improve communication about AI benefits",
                effects: { innovation: 0, trust: +10, stability: +5, regulatory: -3, bias: -3 }
            },
            {
                text: "Continue operations, trust will rebuild",
                effects: { innovation: +5, trust: -5, stability: -5, regulatory: +5, bias: +3 }
            }
        ]
    }
];

// Initialize Game
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateSpeedIndicator();
});

function setupEventListeners() {
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('speed-slider').addEventListener('input', updateSpeed);
    document.getElementById('event-close').addEventListener('click', closeEvent);
}

function startGame() {
    // Reset game state
    gameState.isPlaying = true;
    gameState.gameTime = 0;
    gameState.pipelineProgress = 0;
    gameState.eventsHandled = 0;
    gameState.lastEventTime = 0;
    gameState.currentEvent = null;
    gameState.indicators = { innovation: 50, trust: 50, stability: 50, regulatory: 30 };
    gameState.latentRisks = { bias: 0, privacy: 0, labor: 0, safety: 0 };
    gameState.playerStrategy = {
        speedPreference: 'moderate',
        regulationFocus: 0,
        innovationFocus: 0,
        ignoredEvents: 0
    };

    // Show game screen
    showScreen('game-screen');

    // Update UI
    updateAllIndicators();
    updatePipelinePosition();

    // Start game loop
    gameLoop();
}

function gameLoop() {
    if (!gameState.isPlaying) return;

    // Update timer
    gameState.gameTime++;
    document.getElementById('timer').textContent = gameState.gameTime;

    // Update pipeline progress based on speed
    const speedMultiplier = gameState.speed * 0.5;
    gameState.pipelineProgress += speedMultiplier;
    updatePipelinePosition();

    // Accumulate risks based on speed
    accumulateRisks();

    // Check for risk manifestations
    checkRiskThresholds();

    // Passive indicator changes based on speed
    applyPassiveChanges();

    // Update indicators
    updateAllIndicators();

    // Check for events
    if (gameState.gameTime - gameState.lastEventTime >= gameState.eventInterval) {
        if (!gameState.currentEvent) {
            triggerRandomEvent();
        }
    }

    // Check win/lose conditions
    if (checkGameOver()) {
        endGame();
        return;
    }

    // Check time limit
    if (gameState.gameTime >= gameState.maxGameTime) {
        endGame();
        return;
    }

    // Continue loop
    setTimeout(gameLoop, 1000);
}

function updateSpeed() {
    const slider = document.getElementById('speed-slider');
    gameState.speed = parseInt(slider.value);
    updateSpeedIndicator();

    // Track strategy
    if (gameState.speed === 1) gameState.playerStrategy.speedPreference = 'slow';
    else if (gameState.speed === 2) gameState.playerStrategy.speedPreference = 'moderate';
    else gameState.playerStrategy.speedPreference = 'fast';
}

function updateSpeedIndicator() {
    const indicator = document.getElementById('speed-indicator');
    const speed = gameState.speed;
    if (speed === 1) {
        indicator.textContent = 'Slow - High Safety';
        indicator.style.color = '#48bb78';
    } else if (speed === 2) {
        indicator.textContent = 'Moderate - Balanced';
        indicator.style.color = '#4299e1';
    } else {
        indicator.textContent = 'Fast - High Innovation';
        indicator.style.color = '#f56565';
    }
}

function accumulateRisks() {
    // Faster speed = more risk accumulation
    const baseRisk = (gameState.speed - 1) * 0.3;

    // Risks accumulate faster when indicators are low
    if (gameState.indicators.trust < 40) {
        gameState.latentRisks.bias += baseRisk * 1.5;
        gameState.latentRisks.privacy += baseRisk * 1.5;
    } else {
        gameState.latentRisks.bias += baseRisk;
        gameState.latentRisks.privacy += baseRisk;
    }

    if (gameState.indicators.stability < 40) {
        gameState.latentRisks.labor += baseRisk * 1.5;
    } else {
        gameState.latentRisks.labor += baseRisk;
    }

    gameState.latentRisks.safety += baseRisk;
}

function checkRiskThresholds() {
    // Check if any latent risk has exceeded threshold
    for (const [riskType, value] of Object.entries(gameState.latentRisks)) {
        if (value >= 50 && Math.random() < 0.3) {
            manifestRisk(riskType);
            gameState.latentRisks[riskType] = 0; // Reset after manifestation
        }
    }
}

function manifestRisk(riskType) {
    const riskMessages = {
        bias: { title: "Bias Crisis", text: "Accumulated bias issues have triggered public scandal.", severity: "crisis" },
        privacy: { title: "Privacy Breach", text: "Privacy concerns have resulted in regulatory action.", severity: "crisis" },
        labor: { title: "Labor Unrest", text: "Automation impacts have caused social instability.", severity: "warning" },
        safety: { title: "Safety Incident", text: "Safety concerns have emerged, affecting public trust.", severity: "warning" }
    };

    const risk = riskMessages[riskType];
    showRiskAlert(risk.title, risk.text, risk.severity);

    // Apply negative effects
    gameState.indicators.trust -= 15;
    gameState.indicators.stability -= 10;
    gameState.indicators.regulatory += 15;
}

function applyPassiveChanges() {
    // Slow speed gradually increases trust and stability
    if (gameState.speed === 1) {
        gameState.indicators.trust += 0.15;
        gameState.indicators.stability += 0.1;
        gameState.indicators.innovation -= 0.1;
    }

    // Fast speed increases innovation but decreases trust
    if (gameState.speed === 3) {
        gameState.indicators.innovation += 0.2;
        gameState.indicators.trust -= 0.1;
        gameState.indicators.regulatory += 0.15;
    }

    // High regulatory pressure slows innovation
    if (gameState.indicators.regulatory > 70) {
        gameState.indicators.innovation -= 0.2;
    }

    // Very low trust increases regulatory pressure
    if (gameState.indicators.trust < 30) {
        gameState.indicators.regulatory += 0.2;
    }

    // Keep indicators in bounds
    constrainIndicators();
}

function triggerRandomEvent() {
    // Select random event from library
    const event = eventLibrary[Math.floor(Math.random() * eventLibrary.length)];
    gameState.currentEvent = event;
    gameState.lastEventTime = gameState.gameTime;

    showEventCard(event);
}

function showEventCard(event) {
    const card = document.getElementById('event-card');
    document.getElementById('event-type').textContent = event.type.toUpperCase();
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-description').textContent = event.description;

    // Setup action buttons
    const actionButtons = [
        document.getElementById('action-1'),
        document.getElementById('action-2'),
        document.getElementById('action-3')
    ];

    event.actions.forEach((action, index) => {
        actionButtons[index].textContent = action.text;
        actionButtons[index].onclick = () => handleEventAction(action.effects);
    });

    card.classList.remove('hidden');
}

function handleEventAction(effects) {
    // Apply effects to indicators
    gameState.indicators.innovation += effects.innovation || 0;
    gameState.indicators.trust += effects.trust || 0;
    gameState.indicators.stability += effects.stability || 0;
    gameState.indicators.regulatory += effects.regulatory || 0;

    // Apply effects to latent risks
    gameState.latentRisks.bias += effects.bias || 0;
    gameState.latentRisks.privacy += effects.privacy || 0;
    gameState.latentRisks.labor += effects.labor || 0;
    gameState.latentRisks.safety += effects.safety || 0;

    // Track strategy
    if (effects.innovation > 5) gameState.playerStrategy.innovationFocus++;
    if (effects.regulatory < 0) gameState.playerStrategy.regulationFocus++;

    // Keep latent risks non-negative
    for (const risk in gameState.latentRisks) {
        if (gameState.latentRisks[risk] < 0) gameState.latentRisks[risk] = 0;
    }

    constrainIndicators();
    updateAllIndicators();

    gameState.eventsHandled++;
    closeEvent();
}

function closeEvent() {
    const card = document.getElementById('event-card');
    card.classList.add('hidden');
    gameState.currentEvent = null;

    // If closed without action, count as ignored
    if (gameState.currentEvent) {
        gameState.playerStrategy.ignoredEvents++;
    }
}

function constrainIndicators() {
    for (const key in gameState.indicators) {
        if (gameState.indicators[key] > 100) gameState.indicators[key] = 100;
        if (gameState.indicators[key] < 0) gameState.indicators[key] = 0;
    }
}

function updateAllIndicators() {
    updateIndicator('innovation', gameState.indicators.innovation);
    updateIndicator('trust', gameState.indicators.trust);
    updateIndicator('stability', gameState.indicators.stability);
    updateIndicator('regulatory', gameState.indicators.regulatory);
}

function updateIndicator(name, value) {
    const bar = document.getElementById(`${name}-bar`);
    const valueDisplay = document.getElementById(`${name}-value`);

    bar.style.width = `${value}%`;
    valueDisplay.textContent = `${Math.round(value)}%`;

    // Change color based on value
    if (name === 'regulatory') {
        // For regulatory, higher is worse
        if (value > 80) bar.style.opacity = '1';
        else if (value > 60) bar.style.opacity = '0.8';
        else bar.style.opacity = '0.6';
    } else {
        // For others, lower is worse
        if (value < 30) bar.style.opacity = '0.5';
        else if (value < 50) bar.style.opacity = '0.7';
        else bar.style.opacity = '1';
    }
}

function updatePipelinePosition() {
    const aiPackage = document.getElementById('ai-package');
    const pipeline = document.querySelector('.pipeline');
    const maxWidth = pipeline.offsetWidth - aiPackage.offsetWidth - 40;

    const progress = Math.min(gameState.pipelineProgress / 100, 1);
    const position = progress * maxWidth;

    aiPackage.style.left = `${position + 20}px`;
}

function showRiskAlert(title, text, severity = 'crisis') {
    const alertsContainer = document.getElementById('risk-alerts');
    const alert = document.createElement('div');
    alert.className = `risk-alert ${severity}`;
    alert.innerHTML = `
        <div class="risk-alert-title">${title}</div>
        <div class="risk-alert-text">${text}</div>
    `;

    alertsContainer.appendChild(alert);

    // Remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => alert.remove(), 500);
    }, 5000);
}

function checkGameOver() {
    // Lose conditions
    if (gameState.indicators.trust <= 0) {
        gameState.loseReason = "Public trust has completely collapsed.";
        return true;
    }

    if (gameState.indicators.stability <= 0) {
        gameState.loseReason = "Social stability has reached critical failure.";
        return true;
    }

    if (gameState.indicators.regulatory >= 100) {
        gameState.loseReason = "Emergency AI bans have been triggered by overwhelming regulatory pressure.";
        return true;
    }

    return false;
}

function endGame() {
    gameState.isPlaying = false;

    // Determine win/lose
    const won = !gameState.loseReason &&
                 gameState.indicators.innovation >= 30 &&
                 gameState.indicators.trust >= 25 &&
                 gameState.indicators.stability >= 25;

    // Show end screen
    showScreen('end-screen');

    // Set title
    document.getElementById('end-title').textContent = won ?
        "Session Complete - Balance Maintained" :
        "Session Complete - System Failure";

    // Display final stats
    document.getElementById('final-innovation').textContent = `${Math.round(gameState.indicators.innovation)}%`;
    document.getElementById('final-trust').textContent = `${Math.round(gameState.indicators.trust)}%`;
    document.getElementById('final-stability').textContent = `${Math.round(gameState.indicators.stability)}%`;
    document.getElementById('final-regulatory').textContent = `${Math.round(gameState.indicators.regulatory)}%`;

    // Generate analysis
    generateAnalysis(won);
}

function generateAnalysis(won) {
    const strategy = gameState.playerStrategy;
    let strategyText = '';
    let outcomeText = '';
    let editorialText = '';

    // Strategy analysis
    if (strategy.speedPreference === 'fast') {
        strategyText = "You prioritized rapid deployment. Innovation increased significantly, but this pace created challenges for oversight and public trust.";
    } else if (strategy.speedPreference === 'slow') {
        strategyText = "You took a cautious approach. This maintained higher trust and stability, but potentially limited competitive advantage and innovation speed.";
    } else {
        strategyText = "You balanced speed and safety. This moderate approach sought to maintain equilibrium between innovation and societal concerns.";
    }

    if (strategy.regulationFocus > strategy.innovationFocus) {
        strategyText += " You tended to favor regulatory compliance and safety measures over pure innovation metrics.";
    } else if (strategy.innovationFocus > strategy.regulationFocus) {
        strategyText += " You prioritized innovation and market advantage, sometimes at the expense of regulatory alignment.";
    }

    // Outcome analysis
    if (!won) {
        outcomeText = gameState.loseReason + " ";
        if (gameState.indicators.trust <= 0) {
            outcomeText += "This illustrates how neglecting public concerns can lead to loss of social license to operate.";
        } else if (gameState.indicators.stability <= 0) {
            outcomeText += "This shows how technological change without adequate social support can destabilize communities.";
        } else if (gameState.indicators.regulatory >= 100) {
            outcomeText += "This demonstrates how accumulated concerns can trigger emergency regulatory intervention.";
        }
    } else {
        if (gameState.indicators.innovation > 60 && gameState.indicators.trust > 40) {
            outcomeText = "You successfully maintained both innovation momentum and public trust—a difficult balance achieved through careful navigation of trade-offs.";
        } else if (gameState.indicators.trust > 60) {
            outcomeText = "You prioritized social stability and trust. While innovation was more modest, you maintained strong public support.";
        } else {
            outcomeText = "You maintained basic viability across all metrics. The system remained functional, though various tensions persist.";
        }
    }

    // Editorial context
    editorialText = `Your gameplay reflects real tensions in AI governance. There is no single "correct" approach—every choice involves trade-offs between competing values.

    In reality, these decisions are made by technology companies, regulators, civil society, and markets—often without coordination. The game's mechanics mirror how risks accumulate gradually, how speed creates oversight challenges, and how ignoring problems doesn't make them disappear.

    Current debates about AI regulation globally reflect these same tensions: between innovation and caution, between market competition and public welfare, between technological possibility and social readiness.`;

    // Update UI
    document.getElementById('strategy-analysis').textContent = strategyText;
    document.getElementById('outcome-analysis').textContent = outcomeText;
    document.getElementById('editorial-text').textContent = editorialText;
}

function restartGame() {
    startGame();
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Add fade out animation for alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
`;
document.head.appendChild(style);
