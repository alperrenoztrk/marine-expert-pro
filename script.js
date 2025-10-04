// Gemici Bağları Animasyon Kontrolü
class KnotAnimator {
    constructor() {
        this.currentKnot = 'bowline';
        this.isAnimating = false;
        this.animationSteps = {
            bowline: [
                { element: '.rope-1', animation: 'bowlineStep1', duration: 2000 },
                { element: '.rope-2', animation: 'bowlineStep2', duration: 2000 },
                { element: '.rope-3', animation: 'bowlineStep3', duration: 2000 },
                { element: '.rope-4', animation: 'bowlineStep1', duration: 2000 },
                { element: '.rope-5', animation: 'bowlineStep2', duration: 2000 }
            ],
            'figure-eight': [
                { element: '.rope-1', animation: 'figureEightStep1', duration: 2000 },
                { element: '.rope-2', animation: 'figureEightStep2', duration: 2000 },
                { element: '.rope-3', animation: 'figureEightStep1', duration: 2000 }
            ],
            'clove-hitch': [
                { element: '.rope-1', animation: 'cloveHitchStep1', duration: 2000 },
                { element: '.rope-2', animation: 'cloveHitchStep2', duration: 2000 },
                { element: '.rope-3', animation: 'cloveHitchStep1', duration: 2000 }
            ],
            'sheet-bend': [
                { element: '.rope-1', animation: 'bowlineStep1', duration: 2000 },
                { element: '.rope-2', animation: 'bowlineStep2', duration: 2000 },
                { element: '.rope-3', animation: 'bowlineStep3', duration: 2000 }
            ],
            'reef-knot': [
                { element: '.rope-1', animation: 'figureEightStep1', duration: 2000 },
                { element: '.rope-2', animation: 'figureEightStep2', duration: 2000 },
                { element: '.rope-3', animation: 'figureEightStep1', duration: 2000 }
            ],
            'anchor-bend': [
                { element: '.rope-1', animation: 'cloveHitchStep1', duration: 2000 },
                { element: '.rope-2', animation: 'cloveHitchStep2', duration: 2000 },
                { element: '.rope-3', animation: 'cloveHitchStep1', duration: 2000 }
            ]
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showKnot('bowline');
    }

    setupEventListeners() {
        // Knot selection buttons
        const knotButtons = document.querySelectorAll('.knot-btn');
        knotButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const knotType = e.target.dataset.knot;
                this.selectKnot(knotType);
            });
        });

        // Play and reset buttons for each knot
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('play-btn')) {
                this.playAnimation();
            } else if (e.target.classList.contains('reset-btn')) {
                this.resetAnimation();
            }
        });
    }

    selectKnot(knotType) {
        // Update active button
        document.querySelectorAll('.knot-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-knot="${knotType}"]`).classList.add('active');

        // Show selected knot
        this.showKnot(knotType);
        this.currentKnot = knotType;
    }

    showKnot(knotType) {
        // Hide all knot animations
        document.querySelectorAll('.knot-animation').forEach(animation => {
            animation.style.display = 'none';
        });

        // Show selected knot
        document.getElementById(knotType).style.display = 'block';
    }

    playAnimation() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        const currentKnotElement = document.getElementById(this.currentKnot);
        const steps = this.animationSteps[this.currentKnot];

        // Reset all ropes first
        this.resetRopes(currentKnotElement);

        // Animate each step
        steps.forEach((step, index) => {
            setTimeout(() => {
                const ropeElement = currentKnotElement.querySelector(step.element);
                if (ropeElement) {
                    ropeElement.style.animation = `${step.animation} ${step.duration}ms ease-in-out`;
                    
                    // Add visual feedback
                    ropeElement.style.boxShadow = '0 4px 20px rgba(231, 76, 60, 0.6)';
                    
                    setTimeout(() => {
                        ropeElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
                    }, step.duration);
                }
            }, index * 1000);
        });

        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, steps.length * 1000 + 2000);
    }

    resetAnimation() {
        const currentKnotElement = document.getElementById(this.currentKnot);
        this.resetRopes(currentKnotElement);
        this.isAnimating = false;
    }

    resetRopes(knotElement) {
        const ropes = knotElement.querySelectorAll('.rope');
        ropes.forEach(rope => {
            rope.style.animation = 'none';
            rope.style.transform = 'rotate(0deg)';
            rope.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        });
    }
}

// Step-by-step instructions
class StepInstructions {
    constructor() {
        this.instructions = {
            bowline: [
                "1. İpin ucunu bir halka oluşturacak şekilde bükün",
                "2. Halkanın altından ipi geçirin",
                "3. İpi halkanın üstünden geçirerek düğümü tamamlayın",
                "4. Düğümü sıkıştırın"
            ],
            'figure-eight': [
                "1. İpin ucunu sekiz şeklinde bükün",
                "2. Ucu halkanın içinden geçirin",
                "3. Düğümü sıkıştırın"
            ],
            'clove-hitch': [
                "1. İpi direğin etrafına sarın",
                "2. İpi çaprazlayarak ikinci turu atın",
                "3. Ucu altından geçirerek sabitleyin"
            ],
            'sheet-bend': [
                "1. İlk ipi halka şeklinde bükün",
                "2. İkinci ipin ucunu halkanın içinden geçirin",
                "3. Ucu halkanın etrafından dolayın",
                "4. Düğümü sıkıştırın"
            ],
            'reef-knot': [
                "1. İki ipi çaprazlayın",
                "2. Sağ ipi sol ipin altından geçirin",
                "3. Sol ipi sağ ipin altından geçirin",
                "4. Düğümü sıkıştırın"
            ],
            'anchor-bend': [
                "1. İpi çapanın halkasından geçirin",
                "2. İpi çaprazlayarak ikinci turu atın",
                "3. Ucu altından geçirerek sabitleyin",
                "4. Güvenlik için ek düğüm atın"
            ]
        };
        
        this.createInstructionPanel();
    }

    createInstructionPanel() {
        const instructionPanel = document.createElement('div');
        instructionPanel.className = 'instruction-panel';
        instructionPanel.innerHTML = `
            <h4>Adım Adım Talimatlar</h4>
            <div class="steps-container"></div>
        `;
        
        document.querySelector('.animation-container').appendChild(instructionPanel);
    }

    showInstructions(knotType) {
        const stepsContainer = document.querySelector('.steps-container');
        if (!stepsContainer) return;

        const steps = this.instructions[knotType] || [];
        stepsContainer.innerHTML = steps.map(step => `<div class="step">${step}</div>`).join('');
    }
}

// Enhanced animations with CSS keyframes
const addAdvancedAnimations = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bowlineStep1 {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(45deg) scale(1.1); }
            100% { transform: rotate(90deg) scale(1); }
        }

        @keyframes bowlineStep2 {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(90deg) scale(1.1); }
            100% { transform: rotate(180deg) scale(1); }
        }

        @keyframes bowlineStep3 {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(135deg) scale(1.1); }
            100% { transform: rotate(270deg) scale(1); }
        }

        @keyframes figureEightStep1 {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(90deg) scale(1.1); }
            100% { transform: rotate(180deg) scale(1); }
        }

        @keyframes figureEightStep2 {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(45deg) scale(1.1); }
            100% { transform: rotate(90deg) scale(1); }
        }

        @keyframes cloveHitchStep1 {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(45deg) scale(1.1); }
            100% { transform: rotate(90deg) scale(1); }
        }

        @keyframes cloveHitchStep2 {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(90deg) scale(1.1); }
            100% { transform: rotate(180deg) scale(1); }
        }

        .instruction-panel {
            background: rgba(46, 204, 113, 0.1);
            padding: 1.5rem;
            border-radius: 15px;
            margin-top: 2rem;
            border-left: 5px solid #2ecc71;
        }

        .instruction-panel h4 {
            color: #2c3e50;
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }

        .step {
            padding: 0.8rem 0;
            padding-left: 2rem;
            position: relative;
            color: #34495e;
            font-size: 1.1rem;
            border-bottom: 1px solid rgba(52, 152, 219, 0.2);
        }

        .step:last-child {
            border-bottom: none;
        }

        .step::before {
            content: "🔗";
            position: absolute;
            left: 0;
            top: 0.8rem;
            font-size: 1.2rem;
        }

        .rope {
            position: relative;
            overflow: hidden;
        }

        .rope::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        .rope.animating::after {
            animation: shimmer 0.5s ease-in-out;
        }
    `;
    
    document.head.appendChild(style);
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    addAdvancedAnimations();
    
    const knotAnimator = new KnotAnimator();
    const stepInstructions = new StepInstructions();
    
    // Show initial instructions
    stepInstructions.showInstructions('bowline');
    
    // Update instructions when knot changes
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('knot-btn')) {
            const knotType = e.target.dataset.knot;
            stepInstructions.showInstructions(knotType);
        }
    });
});

// Add some interactive features
const addInteractiveFeatures = () => {
    // Add hover effects to ropes
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('rope')) {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 4px 20px rgba(52, 152, 219, 0.6)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('rope')) {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
    });

    // Add click sound effect (visual feedback)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('play-btn') || e.target.classList.contains('reset-btn')) {
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
            }, 150);
        }
    });
};

// Initialize interactive features
document.addEventListener('DOMContentLoaded', addInteractiveFeatures);