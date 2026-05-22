document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------
    // 1. Header Scroll Effect & Mobile Menu
    // ----------------------------------------------------------------
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }

    // ----------------------------------------------------------------
    // 2. Before / After Comparison Slider
    // ----------------------------------------------------------------
    const sliderWrapper = document.querySelector('.comparison-wrapper');
    const afterImg = document.querySelector('.image-after');
    const handle = document.querySelector('.comparison-handle');

    if (sliderWrapper && afterImg && handle) {
        let isDragging = false;

        const updateSlider = (clientX) => {
            const rect = sliderWrapper.getBoundingClientRect();
            let position = ((clientX - rect.left) / rect.width) * 100;
            
            // Constrain between 0% and 100%
            if (position < 0) position = 0;
            if (position > 100) position = 100;

            afterImg.style.width = `${position}%`;
            handle.style.left = `${position}%`;
        };

        const onStart = (e) => {
            isDragging = true;
            updateSlider(e.touches ? e.touches[0].clientX : e.clientX);
        };

        const onMove = (e) => {
            if (!isDragging) return;
            updateSlider(e.touches ? e.touches[0].clientX : e.clientX);
        };

        const onEnd = () => {
            isDragging = false;
        };

        // Mouse Events
        handle.addEventListener('mousedown', onStart);
        sliderWrapper.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        // Touch Events
        handle.addEventListener('touchstart', onStart);
        sliderWrapper.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onEnd);
    }

    // ----------------------------------------------------------------
    // 3. BMI & Weight Target Calculator (Standard and Imperial support)
    // ----------------------------------------------------------------
    const calculateBmiBtn = document.getElementById('calculateBmiBtn');
    if (calculateBmiBtn) {
        calculateBmiBtn.addEventListener('click', () => {
            const heightInput = document.getElementById('bmiHeight');
            const weightInput = document.getElementById('bmiWeight');
            const systemSelect = document.getElementById('bmiSystem');

            const heightVal = parseFloat(heightInput.value);
            const weightVal = parseFloat(weightInput.value);

            if (isNaN(heightVal) || isNaN(weightVal) || heightVal <= 0 || weightVal <= 0) {
                alert('Please enter valid numeric measurements for height and weight.');
                return;
            }

            let bmi = 0;
            let healthyWeightMin = 0;
            let healthyWeightMax = 0;
            let unit = 'kg';

            if (systemSelect.value === 'metric') {
                // Height in cm, Weight in kg
                const heightMeters = heightVal / 100;
                bmi = weightVal / (heightMeters * heightMeters);
                healthyWeightMin = 18.5 * (heightMeters * heightMeters);
                healthyWeightMax = 24.9 * (heightMeters * heightMeters);
            } else {
                // Height in inches, Weight in lbs
                bmi = (weightVal / (heightVal * heightVal)) * 703;
                healthyWeightMin = (18.5 * (heightVal * heightVal)) / 703;
                healthyWeightMax = (24.9 * (heightVal * heightVal)) / 703;
                unit = 'lbs';
            }

            // Round values
            bmi = bmi.toFixed(1);
            healthyWeightMin = Math.round(healthyWeightMin);
            healthyWeightMax = Math.round(healthyWeightMax);

            // Display elements
            const scoreDisplay = document.getElementById('bmiScoreDisplay');
            const statusDisplay = document.getElementById('bmiStatusDisplay');
            const recommendationDisplay = document.getElementById('bmiRecDisplay');

            if (scoreDisplay) scoreDisplay.textContent = bmi;

            let status = 'Normal';
            let recText = '';
            let styleColor = 'var(--accent)'; // Sage Green for healthy

            if (bmi < 18.5) {
                status = 'Underweight';
                styleColor = '#E2B13C';
                recText = `Your BMI indicates you are underweight. We recommend our nutritional consultation and wellness body contouring therapies to build healthy mass. Recommended weight: ${healthyWeightMin}-${healthyWeightMax} ${unit}.`;
            } else if (bmi >= 18.5 && bmi < 25) {
                status = 'Healthy';
                styleColor = 'var(--accent)';
                recText = `Fantastic! You have a healthy weight. Maintain your vibrant physique with our customized grooming facials and light wellness detoxes. Recommended weight: ${healthyWeightMin}-${healthyWeightMax} ${unit}.`;
            } else if (bmi >= 25 && bmi < 30) {
                status = 'Overweight';
                styleColor = '#D97706';
                recText = `You fall into the overweight category. VLCC offers targeted body contouring (CoolSculpting / V-Fit) and DNA-based slimming programs. Recommended weight: ${healthyWeightMin}-${healthyWeightMax} ${unit}.`;
            } else {
                status = 'Obese';
                styleColor = '#EF4444';
                recText = `Your BMI falls into the obesity category. Our certified health practitioners specialize in medically supervised weight management programs and metabolic enhancement therapies. Recommended weight: ${healthyWeightMin}-${healthyWeightMax} ${unit}.`;
            }

            if (statusDisplay) {
                statusDisplay.textContent = status;
                statusDisplay.style.color = styleColor;
            }
            if (recommendationDisplay) {
                recommendationDisplay.textContent = recText;
            }
        });

        // Dynamic Label Updater on Dropdown Change
        const systemSelect = document.getElementById('bmiSystem');
        const heightLabel = document.getElementById('bmiHeightLabel');
        const weightLabel = document.getElementById('bmiWeightLabel');
        const heightSuffix = document.getElementById('bmiHeightSuffix');
        const weightSuffix = document.getElementById('bmiWeightSuffix');

        if (systemSelect && heightLabel && weightLabel) {
            systemSelect.addEventListener('change', () => {
                if (systemSelect.value === 'metric') {
                    heightLabel.textContent = 'Your Height (cm)';
                    weightLabel.textContent = 'Your Weight (kg)';
                    if (heightSuffix) heightSuffix.textContent = 'cm';
                    if (weightSuffix) weightSuffix.textContent = 'kg';
                } else {
                    heightLabel.textContent = 'Your Height (inches)';
                    weightLabel.textContent = 'Your Weight (lbs)';
                    if (heightSuffix) heightSuffix.textContent = 'in';
                    if (weightSuffix) weightSuffix.textContent = 'lbs';
                }
            });
        }
    }

    // ----------------------------------------------------------------
    // 4. Services Page Tabs
    // ----------------------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.service-tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                const activeContent = document.getElementById(targetTab);
                if (activeContent) activeContent.classList.add('active');
            });
        });
    }

    // ----------------------------------------------------------------
    // 5. Products Page: Filters, Search and Details Modal
    // ----------------------------------------------------------------
    const productCards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('productSearchInput');

    const filterProducts = () => {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const category = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';

        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const cardCategory = card.dataset.category;

            const matchesQuery = title.includes(query);
            const matchesCategory = (category === 'all' || cardCategory === category);

            if (matchesQuery && matchesCategory) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterProducts();
            });
        });
    }

    // Product Modal Quick View
    const modal = document.getElementById('productQuickViewModal');
    const modalClose = document.querySelector('.modal-close');
    const quickViewButtons = document.querySelectorAll('.product-view-btn');

    if (modal && modalClose) {
        const modalTitle = document.getElementById('modalProductTitle');
        const modalPrice = document.getElementById('modalProductPrice');
        const modalDesc = document.getElementById('modalProductDesc');
        const modalCategory = document.getElementById('modalProductCategory');
        const modalImage = document.getElementById('modalProductImage');

        quickViewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                if (card) {
                    const title = card.querySelector('.product-title').textContent;
                    const price = card.querySelector('.product-price').textContent;
                    const cat = card.querySelector('.product-category').textContent;
                    const desc = card.dataset.desc || "A premium skin-enriching and cell-restoring formula, clinically tested by VLCC experts to rejuvenate your body.";
                    const imgUrl = card.querySelector('.product-image-box img').getAttribute('src');

                    if (modalTitle) modalTitle.textContent = title;
                    if (modalPrice) modalPrice.textContent = price;
                    if (modalCategory) modalCategory.textContent = cat;
                    if (modalDesc) modalDesc.textContent = desc;
                    if (modalImage) modalImage.setAttribute('src', imgUrl);

                    modal.classList.add('active');
                }
            });
        });

        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('remove');
                modal.classList.remove('active');
            }
        });
    }

    // ----------------------------------------------------------------
    // 6. Booking Wizard Logic
    // ----------------------------------------------------------------
    const bookingForm = document.getElementById('appointmentBookingForm');
    const stepPanels = document.querySelectorAll('.form-step-panel');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');

    if (bookingForm && stepPanels.length > 0 && nextBtn) {
        let currentStep = 0;

        const updateBookingUI = () => {
            stepPanels.forEach((panel, index) => {
                panel.classList.toggle('active', index === currentStep);
            });

            stepIndicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentStep);
                indicator.classList.toggle('completed', index < currentStep);
            });

            // Toggle buttons
            if (currentStep === 0) {
                prevBtn.style.visibility = 'hidden';
            } else {
                prevBtn.style.visibility = 'visible';
            }

            if (currentStep === stepPanels.length - 1) {
                nextBtn.textContent = 'Confirm Booking';
                nextBtn.classList.add('btn-primary');
            } else {
                nextBtn.textContent = 'Next Step';
                nextBtn.classList.remove('btn-primary');
            }
        };

        // Interactive Selection Cards
        const selectCards = document.querySelectorAll('.option-select-card');
        selectCards.forEach(card => {
            card.addEventListener('click', () => {
                const radio = card.querySelector('input[type="radio"]');
                if (radio) {
                    // Unselect siblings
                    const name = radio.getAttribute('name');
                    document.querySelectorAll(`input[name="${name}"]`).forEach(sibling => {
                        sibling.closest('.option-select-card').classList.remove('selected');
                    });
                    
                    radio.checked = true;
                    card.classList.add('selected');
                }
            });
        });

        // Validate fields in current step
        const validateCurrentStep = () => {
            if (currentStep === 0) {
                const checkedService = document.querySelector('input[name="booking_service"]:checked');
                if (!checkedService) {
                    alert('Please select a wellness or beauty treatment to proceed.');
                    return false;
                }
            } else if (currentStep === 1) {
                const checkedLoc = document.querySelector('input[name="booking_location"]:checked');
                if (!checkedLoc) {
                    alert('Please select a clinic location near you.');
                    return false;
                }
            } else if (currentStep === 2) {
                const dateVal = document.getElementById('bookingDate').value;
                const timeVal = document.getElementById('bookingTime').value;
                if (!dateVal || !timeVal) {
                    alert('Please select both a date and a time slot.');
                    return false;
                }
            } else if (currentStep === 3) {
                const name = document.getElementById('bookingName').value.trim();
                const phone = document.getElementById('bookingPhone').value.trim();
                const email = document.getElementById('bookingEmail').value.trim();

                if (!name || !phone || !email) {
                    alert('Please complete all contact details before confirmation.');
                    return false;
                }

                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address.');
                    return false;
                }
            }
            return true;
        };

        // Event listener for Next Button
        nextBtn.addEventListener('click', () => {
            if (!validateCurrentStep()) return;

            if (currentStep < stepPanels.length - 1) {
                // Compile final review info when going to step 3 (index 3)
                if (currentStep === 2) {
                    const serviceName = document.querySelector('input[name="booking_service"]:checked').value;
                    const locationName = document.querySelector('input[name="booking_location"]:checked').value;
                    const dateVal = document.getElementById('bookingDate').value;
                    const timeVal = document.getElementById('bookingTime').value;

                    const reviewService = document.getElementById('reviewService');
                    const reviewLocation = document.getElementById('reviewLocation');
                    const reviewDateTime = document.getElementById('reviewDateTime');

                    if (reviewService) reviewService.textContent = serviceName;
                    if (reviewLocation) reviewLocation.textContent = locationName;
                    if (reviewDateTime) reviewDateTime.textContent = `${dateVal} at ${timeVal}`;
                }

                currentStep++;
                updateBookingUI();
            } else {
                // Form Submission Success Trigger
                const bookingWizard = document.getElementById('bookingWizard');
                const successMsg = document.getElementById('bookingSuccessState');

                if (bookingWizard && successMsg) {
                    bookingWizard.style.display = 'none';
                    successMsg.style.display = 'block';
                    
                    // Populate success details
                    const confirmedService = document.getElementById('confirmedService');
                    const confirmedLoc = document.getElementById('confirmedLocation');
                    const confirmedTime = document.getElementById('confirmedDateTime');
                    
                    const serviceName = document.querySelector('input[name="booking_service"]:checked').value;
                    const locationName = document.querySelector('input[name="booking_location"]:checked').value;
                    const dateVal = document.getElementById('bookingDate').value;
                    const timeVal = document.getElementById('bookingTime').value;

                    if (confirmedService) confirmedService.textContent = serviceName;
                    if (confirmedLoc) confirmedLoc.textContent = locationName;
                    if (confirmedTime) confirmedTime.textContent = `${dateVal} at ${timeVal}`;
                }
            }
        });

        // Event listener for Previous Button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateBookingUI();
                }
            });
        }

        // Run initial UI updates
        updateBookingUI();
    }
});
