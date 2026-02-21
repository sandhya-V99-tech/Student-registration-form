document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const successModal = document.getElementById('successModal');
    
    // Eye toggle functionality
    const eyeToggles = document.querySelectorAll('.eye-toggle');
    eyeToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                targetInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Form validation
    function validateForm() {
        console.log('Validation started');
        let isValid = true;
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = '';
            }
        });
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Form data for validation:', data);
        
        // Required field validation
        const requiredFields = ['fullName', 'email', 'phone', 'course', 'branch', 'year', 'college', 'rollNumber', 'password', 'confirmPassword'];
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!data[field] || data[field].trim() === '') {
                console.log(`Missing required field: ${field}`);
                showError(field, 'This field is required');
                isValid = false;
            }
        });
        
        // Email validation
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Phone number validation
        if (data.phone) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
                showError('phone', 'Phone number must be 10 digits');
                isValid = false;
            }
        }
        
        // Alternate phone validation (if provided)
        if (data.altPhone) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(data.altPhone.replace(/\D/g, ''))) {
                showError('altPhone', 'Phone number must be 10 digits');
                isValid = false;
            }
        }
        
        // PIN code validation (if provided)
        if (data.pinCode) {
            const pinRegex = /^[0-9]{6}$/;
            if (!pinRegex.test(data.pinCode)) {
                showError('pinCode', 'PIN code must be 6 digits');
                isValid = false;
            }
        }
        
        // Password validation
        if (data.password) {
            if (data.password.length < 6) {
                showError('password', 'Password must be at least 6 characters');
                isValid = false;
            }
        }
        
        // Password confirmation
        if (data.password && data.confirmPassword) {
            if (data.password !== data.confirmPassword) {
                showError('confirmPassword', 'Passwords do not match');
                isValid = false;
            }
        }
        
        console.log('Validation completed, isValid:', isValid);
        return isValid;
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        errorMessage.textContent = message;
    }
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('Form submission started');
        
        if (!validateForm()) {
            console.log('Form validation failed');
            // Scroll to first error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        console.log('Form validation passed');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        loadingOverlay.style.display = 'block';
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            console.log('Form data:', data);
            
            const response = await fetch('/register-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Response result:', result);
            
            if (result.success) {
                // Hide loading
                loadingOverlay.style.display = 'none';
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Show success modal
                successModal.style.display = 'block';
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    form.reset();
                    closeModal();
                }, 3000);
                
            } else {
                // Show error message
                loadingOverlay.style.display = 'none';
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Find which field has the error based on the message
                if (result.message.includes('email')) {
                    showError('email', result.message);
                } else if (result.message.includes('Phone')) {
                    showError('phone', result.message);
                } else if (result.message.includes('PIN')) {
                    showError('pinCode', result.message);
                } else {
                    // Show general error
                    alert(result.message || 'Registration failed. Please try again.');
                }
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            loadingOverlay.style.display = 'none';
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            alert('Network error. Please check your connection and try again.');
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            const formGroup = this.closest('.form-group');
            formGroup.classList.remove('error');
            const errorMessage = formGroup.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = '';
            }
            
            // Validate individual field
            const fieldId = this.id;
            const value = this.value.trim();
            
            if (this.hasAttribute('required') && !value) {
                showError(fieldId, 'This field is required');
                return;
            }
            
            if (fieldId === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showError(fieldId, 'Please enter a valid email address');
                }
            }
            
            if ((fieldId === 'phone' || fieldId === 'altPhone') && value) {
                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                    showError(fieldId, 'Phone number must be 10 digits');
                }
            }
            
            if (fieldId === 'pinCode' && value) {
                const pinRegex = /^[0-9]{6}$/;
                if (!pinRegex.test(value)) {
                    showError(fieldId, 'PIN code must be 6 digits');
                }
            }
            
            if (fieldId === 'password' && value && value.length < 6) {
                showError(fieldId, 'Password must be at least 6 characters');
            }
            
            if (fieldId === 'confirmPassword' && value) {
                const password = document.getElementById('password').value;
                if (value !== password) {
                    showError(fieldId, 'Passwords do not match');
                }
            }
        });
    });
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove non-numeric characters
            this.value = this.value.replace(/\D/g, '');
            
            // Limit to 10 digits
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
        });
    });
    
    // PIN code formatting
    const pinInput = document.getElementById('pinCode');
    if (pinInput) {
        pinInput.addEventListener('input', function(e) {
            // Remove non-numeric characters
            this.value = this.value.replace(/\D/g, '');
            
            // Limit to 6 digits
            if (this.value.length > 6) {
                this.value = this.value.slice(0, 6);
            }
        });
    }
});

// Modal functions
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeModal();
    }
}
