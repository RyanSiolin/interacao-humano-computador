// Navigation for bottom navbar
function setupBottomNav() {
    const navLinks = document.querySelectorAll('.BottomNavBar .Link');
    navLinks.forEach((link, index) => {
        // Map index to page: 0=index, 1=rastreamento, 2=agendar-coleta
        link.addEventListener('click', () => {
            switch(index) {
                case 0:
                    window.location.href = 'index.html';
                    break;
                case 1:
                    window.location.href = 'rastreamento.html';
                    break;
                case 2:
                    window.location.href = 'agendar-coleta.html';
                    break;
            }
        });
    });
}

// Quick actions navigation on index.html
function setupQuickActions() {
    const quickActions = document.querySelectorAll('.Button.quick-action');
    if (quickActions.length > 0) {
        // First button: Rastrear
        quickActions[0].addEventListener('click', () => {
            window.location.href = 'rastreamento.html';
        });
        // Second button: Coleta em Casa
        quickActions[1].addEventListener('click', () => {
            window.location.href = 'agendar-coleta.html';
        });
    }
}

// Step navigation for agendar-coleta.html
let currentStep = 1;
const totalSteps = 4;

function setupStepNavigation() {
    // Add next/previous buttons if not present
    const main = document.querySelector('.Main');
    if (main && document.querySelector('.Agendar-Coleta-em-Casa')) {
        // Add sticky footer with buttons
        let footer = document.querySelector('.Sticky-Footer-Action');
        if (!footer) {
            footer = document.createElement('div');
            footer.className = 'Sticky-Footer-Action';
            main.appendChild(footer);
        }
        
        // Update buttons without re-adding event listeners every time
        footer.innerHTML = `
            <div style="display: flex; gap: 12px; width: 100%; padding: 0 20px;">
                <button class="Button CTA prev-btn" ${currentStep === 1 ? 'style="opacity: 0.5; pointer-events: none; background: #ccc;"' : ''}>
                    Anterior
                </button>
                <button class="Button CTA next-btn">
                    ${currentStep === totalSteps ? 'Finalizar' : 'Próximo'}
                </button>
            </div>
        `;
        
        const prevBtn = footer.querySelector('.prev-btn');
        const nextBtn = footer.querySelector('.next-btn');
        
        // Handle button clicks
        prevBtn.onclick = () => changeStep(-1);
        nextBtn.onclick = () => {
            if (currentStep === totalSteps) {
                alert('Agendamento realizado com sucesso!');
                window.location.href = 'index.html';
            } else {
                changeStep(1);
            }
        };
    }
}

function changeStep(direction) {
    const newStep = currentStep + direction;
    if (newStep < 1 || newStep > totalSteps) return;
    
    // Hide current step
    const currentSectionClass = currentStep === 1 ? 'Package-Details' : 
                                currentStep === 2 ? 'Pickup-Address' : 
                                currentStep === 3 ? 'Date-Time' : 'Confirmation';
    const currentSection = document.querySelector(`.Section-Step-${currentStep}-${currentSectionClass}`);
    if (currentSection) {
        currentSection.classList.add('hidden-section');
    }
    
    // Update current step
    currentStep = newStep;
    
    // Show new step
    const sectionClass = currentStep === 1 ? 'Package-Details' : 
                          currentStep === 2 ? 'Pickup-Address' : 
                          currentStep === 3 ? 'Date-Time' : 'Confirmation';
    const newSection = document.querySelector(`.Section-Step-${currentStep}-${sectionClass}`);
    if (newSection) {
        newSection.classList.remove('hidden-section');
    }
    
    // Update progress stepper
    const stepperItems = document.querySelectorAll('.Progress-Stepper .Container');
    stepperItems.forEach((item, index) => {
        const bg = item.querySelector('.Background');
        const text = item.querySelector('.Text');
        if (bg) {
            bg.classList.toggle('active', index < currentStep);
        }
        if (text) {
            text.classList.toggle('active', index < currentStep);
        }
    });
    
    // Update buttons
    setupStepNavigation();
}

// Rastrear button on index.html
function setupRastrearButton() {
    const rastrearBtn = document.querySelector('.Button.rastrear');
    if (rastrearBtn) {
        rastrearBtn.addEventListener('click', () => {
            window.location.href = 'rastreamento.html';
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupBottomNav();
    setupQuickActions();
    setupRastrearButton();
    setupStepNavigation();
});
