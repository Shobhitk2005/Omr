// ===============================================
// MOBILE-FIRST OMR GENERATOR - ENHANCED UX
// Professional Interactive JavaScript
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    // Core Elements
    const form = document.getElementById('omrForm');
    const generateBtn = document.getElementById('generateBtn');
    const previewCard = document.getElementById('previewCard');
    const previewContent = document.getElementById('previewContent');
    
    // Form inputs
    const schoolNameInput = document.getElementById('school_name');
    const examNameInput = document.getElementById('exam_name');
    const subjectsInput = document.getElementById('subjects');
    const questionsInput = document.getElementById('questions_per_subject');
    const optionsInput = document.getElementById('num_options');
    const logoInput = document.getElementById('logo');

    // Real-time preview update
    function updatePreview() {
        const schoolName = schoolNameInput.value.trim();
        const examName = examNameInput.value.trim();
        const subjects = subjectsInput.value.trim();
        const questionsPerSubject = questionsInput.value;
        const numOptions = optionsInput.value;

        if (schoolName || examName || subjects) {
            const subjectList = subjects ? subjects.split(',').map(s => s.trim()).filter(s => s) : [];
            
            let previewHTML = '<div class="row">';
            
            if (schoolName) {
                previewHTML += `
                    <div class="col-md-6 mb-2">
                        <div class="preview-item">
                            <strong>Institution:</strong> ${escapeHtml(schoolName)}
                        </div>
                    </div>
                `;
            }
            
            if (examName) {
                previewHTML += `
                    <div class="col-md-6 mb-2">
                        <div class="preview-item">
                            <strong>Exam:</strong> ${escapeHtml(examName)}
                        </div>
                    </div>
                `;
            }
            
            if (subjectList.length > 0) {
                previewHTML += `
                    <div class="col-md-12 mb-2">
                        <div class="preview-item">
                            <strong>Subjects (${subjectList.length}):</strong> ${subjectList.map(s => escapeHtml(s)).join(', ')}
                            ${subjectList.length > 5 ? '<br><small class="text-warning">⚠️ Maximum 5 subjects allowed</small>' : ''}
                        </div>
                    </div>
                `;
            }
            
            previewHTML += `
                <div class="col-md-6 mb-2">
                    <div class="preview-item">
                        <strong>Questions per Subject:</strong> ${questionsPerSubject}
                    </div>
                </div>
                <div class="col-md-6 mb-2">
                    <div class="preview-item">
                        <strong>Answer Options:</strong> ${numOptions} (${getOptionLetters(parseInt(numOptions))})
                    </div>
                </div>
            </div>`;
            
            previewContent.innerHTML = previewHTML;
            previewCard.style.display = 'block';
        } else {
            previewCard.style.display = 'none';
        }
    }

    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Helper function to get option letters
    function getOptionLetters(count) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return Array.from({length: count}, (_, i) => letters[i]).join(', ');
    }

    // Add event listeners for real-time preview
    [schoolNameInput, examNameInput, subjectsInput, questionsInput, optionsInput].forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });

    // Form validation
    function validateForm() {
        let isValid = true;
        let errorMessage = '';

        // Check required fields
        if (!schoolNameInput.value.trim()) {
            errorMessage = 'School/Institution name is required.';
            isValid = false;
        } else if (!examNameInput.value.trim()) {
            errorMessage = 'Exam name is required.';
            isValid = false;
        } else if (!subjectsInput.value.trim()) {
            errorMessage = 'At least one subject is required.';
            isValid = false;
        } else {
            // Validate subjects count
            const subjects = subjectsInput.value.split(',').map(s => s.trim()).filter(s => s);
            if (subjects.length > 5) {
                errorMessage = 'Maximum 5 subjects are allowed.';
                isValid = false;
            }
        }

        // Validate logo file if uploaded
        if (logoInput.files.length > 0) {
            const file = logoInput.files[0];
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                errorMessage = 'Logo must be a PNG, JPG, JPEG, or GIF file.';
                isValid = false;
            } else if (file.size > maxSize) {
                errorMessage = 'Logo file size must be less than 5MB.';
                isValid = false;
            }
        }

        if (!isValid) {
            showAlert(errorMessage, 'danger');
        }

        return isValid;
    }

    // Show alert function
    function showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        // Create new alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insert at the top of the main container
        const mainContainer = document.querySelector('main.container');
        mainContainer.insertBefore(alertDiv, mainContainer.firstChild);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Form submission handling
    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            return false;
        }

        // Show loading state
        generateBtn.classList.add('btn-loading');
        generateBtn.disabled = true;
        
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating PDF...';

        // Reset button state after a delay (in case of errors)
        setTimeout(() => {
            generateBtn.classList.remove('btn-loading');
            generateBtn.disabled = false;
            generateBtn.innerHTML = originalText;
        }, 10000);
    });

    // Logo file input handling
    logoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // You could show a preview here if needed
                console.log('Logo loaded:', file.name);
            };
            reader.readAsDataURL(file);
        }
    });

    // Subject input helper
    subjectsInput.addEventListener('blur', function() {
        // Clean up subjects input
        const subjects = this.value.split(',').map(s => s.trim()).filter(s => s);
        this.value = subjects.join(', ');
        updatePreview();
    });

    // Quick Template Buttons
    const jeeTemplateBtn = document.getElementById('jeeTemplate');
    const neetTemplateBtn = document.getElementById('neetTemplate');

    if (jeeTemplateBtn) {
        jeeTemplateBtn.addEventListener('click', function() {
            subjectsInput.value = 'Physics, Chemistry, Mathematics';
            questionsInput.value = '25';
            optionsInput.value = '4';
            updatePreview();
            showAlert('JEE template applied! Physics, Chemistry, Mathematics with 25 questions each.', 'success');
        });
    }

    if (neetTemplateBtn) {
        neetTemplateBtn.addEventListener('click', function() {
            subjectsInput.value = 'Physics, Chemistry, Botany, Zoology';
            questionsInput.value = '45';
            optionsInput.value = '4';
            updatePreview();
            showAlert('NEET template applied! Physics, Chemistry, Botany, Zoology with 45 questions each.', 'success');
        });
    }

    // ===============================================
    // ADVANCED UX FUNCTIONS
    // ===============================================
    
    function animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);
        
        // Observe all cards and feature elements
        document.querySelectorAll('.card, .feature-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    function addTouchInteractions() {
        // Enhanced button touch feedback
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
        
        // Ripple effect for buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', createRippleEffect);
        });
    }
    
    function createRippleEffect(e) {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    function initializeProgressIndicator() {
        const formFields = [schoolNameInput, examNameInput, subjectsInput];
        let completedFields = 0;
        
        function updateProgress() {
            completedFields = formFields.filter(field => field.value.trim() !== '').length;
            const progress = (completedFields / formFields.length) * 100;
            
            // Update visual progress if needed
            if (progress === 100) {
                generateBtn.classList.add('btn-pulse');
            } else {
                generateBtn.classList.remove('btn-pulse');
            }
        }
        
        formFields.forEach(field => {
            field.addEventListener('input', updateProgress);
        });
    }
    
    function addFormFieldAnimations() {
        // Floating label effect
        document.querySelectorAll('.form-control, .form-select').forEach(field => {
            field.addEventListener('focus', function() {
                this.parentElement.classList.add('field-focused');
            });
            
            field.addEventListener('blur', function() {
                this.parentElement.classList.remove('field-focused');
                if (this.value) {
                    this.parentElement.classList.add('field-filled');
                } else {
                    this.parentElement.classList.remove('field-filled');
                }
            });
            
            // Check if field is pre-filled
            if (field.value) {
                field.parentElement.classList.add('field-filled');
            }
        });
        
        // Smooth transitions for form interactions
        document.querySelectorAll('.form-control, .form-select').forEach(field => {
            field.addEventListener('input', function() {
                this.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
    }
    
    function initializeMobileFeatures() {
        // Prevent zoom on input focus (iOS)
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.querySelectorAll('input[type="text"], input[type="email"], select').forEach(input => {
                input.addEventListener('focus', function() {
                    this.style.fontSize = '16px';
                });
            });
        }
        
        // Smooth scrolling for mobile
        if (window.innerWidth <= 768) {
            document.addEventListener('touchmove', function(e) {
                if (e.target.closest('.form-control, .form-select')) {
                    e.stopPropagation();
                }
            }, { passive: true });
        }
        
        // Enhanced mobile navigation
        let startY;
        document.addEventListener('touchstart', function(e) {
            startY = e.touches[0].pageY;
        }, { passive: true });
        
        document.addEventListener('touchmove', function(e) {
            if (window.scrollY === 0 && e.touches[0].pageY > startY) {
                // Pull to refresh simulation
                document.body.style.paddingTop = '10px';
                setTimeout(() => {
                    document.body.style.paddingTop = '';
                }, 300);
            }
        }, { passive: true });
    }
    
    // Enhanced alert system with mobile optimization
    function showAlert(message, type = 'info', duration = 5000) {
        // Remove existing alerts
        document.querySelectorAll('.alert').forEach(alert => {
            alert.style.animation = 'slideOutUp 0.3s ease-in forwards';
            setTimeout(() => alert.remove(), 300);
        });

        // Create new alert with enhanced styling
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-relative`;
        alertDiv.style.cssText = `
            animation: slideInDown 0.4s ease-out;
            border: none;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            margin-bottom: 20px;
        `;
        
        alertDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${getAlertIcon(type)} me-3"></i>
                <div class="flex-grow-1">${message}</div>
                <button type="button" class="btn-close ms-3" data-bs-dismiss="alert"></button>
            </div>
        `;

        // Insert at the top with smooth animation
        const mainContainer = document.querySelector('main.container');
        mainContainer.insertBefore(alertDiv, mainContainer.firstChild);

        // Auto-dismiss with countdown
        let timeLeft = duration / 1000;
        const countdownInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                if (alertDiv.parentNode) {
                    alertDiv.style.animation = 'slideOutUp 0.3s ease-in forwards';
                    setTimeout(() => alertDiv.remove(), 300);
                }
            }
        }, 1000);
        
        // Add swipe to dismiss on mobile
        if (window.innerWidth <= 768) {
            addSwipeToDismiss(alertDiv);
        }
    }
    
    function getAlertIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle',
            danger: 'times-circle'
        };
        return icons[type] || icons.info;
    }
    
    function addSwipeToDismiss(element) {
        let startX, startTime;
        
        element.addEventListener('touchstart', function(e) {
            startX = e.touches[0].pageX;
            startTime = Date.now();
        }, { passive: true });
        
        element.addEventListener('touchmove', function(e) {
            const currentX = e.touches[0].pageX;
            const diff = currentX - startX;
            
            if (Math.abs(diff) > 50) {
                this.style.transform = `translateX(${diff}px)`;
                this.style.opacity = Math.max(0.3, 1 - Math.abs(diff) / 200);
            }
        }, { passive: true });
        
        element.addEventListener('touchend', function(e) {
            const endTime = Date.now();
            const endX = e.changedTouches[0].pageX;
            const diff = endX - startX;
            const duration = endTime - startTime;
            
            if (Math.abs(diff) > 100 && duration < 500) {
                // Swipe to dismiss
                this.style.animation = `slideOut${diff > 0 ? 'Right' : 'Left'} 0.3s ease-in forwards`;
                setTimeout(() => this.remove(), 300);
            } else {
                // Snap back
                this.style.transform = '';
                this.style.opacity = '';
            }
        }, { passive: true });
    }
    
    // Replace the original showAlert function
    window.showAlert = showAlert;
    
    // Initialize preview with enhanced animations
    updatePreview();

    // Add tooltips with mobile optimization
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                trigger: window.innerWidth <= 768 ? 'click' : 'hover focus'
            });
        });
    }
    
    // Performance optimization for mobile
    if (window.innerWidth <= 768) {
        // Debounce preview updates on mobile
        const debouncedUpdatePreview = debounce(updatePreview, 300);
        [schoolNameInput, examNameInput, subjectsInput, questionsInput, optionsInput].forEach(input => {
            input.removeEventListener('input', updatePreview);
            input.addEventListener('input', debouncedUpdatePreview);
        });
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Animation and UX Enhancements
    function initializeApp() {
        // Add entrance animations to elements
        animateOnScroll();
        
        // Add touch-friendly interactions
        addTouchInteractions();
        
        // Initialize progress indicator
        initializeProgressIndicator();
        
        // Add form field animations
        addFormFieldAnimations();
        
        // Initialize mobile-specific features
        initializeMobileFeatures();
    }
    
    // Initialize Application after all functions are declared
    initializeApp();
});
