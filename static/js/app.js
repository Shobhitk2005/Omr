// OMR Generator JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
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

    // Initialize preview
    updatePreview();

    // Add tooltips to help text
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
