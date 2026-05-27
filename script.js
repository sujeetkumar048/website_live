// ----------------------------------------------------------------
// GOOGLE SHEETS CONFIGURATION
// ----------------------------------------------------------------
// Paste your Google Apps Script Web App URL here after deploying:
const GOOGLE_SHEET_URL = "YOUR_APPS_SCRIPT_URL_HERE";

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
    // 3. BMI & Weight Target Calculator
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
                const heightMeters = heightVal / 100;
                bmi = weightVal / (heightMeters * heightMeters);
                healthyWeightMin = 18.5 * (heightMeters * heightMeters);
                healthyWeightMax = 24.9 * (heightMeters * heightMeters);
            } else {
                bmi = (weightVal / (heightVal * heightVal)) * 703;
                healthyWeightMin = (18.5 * (heightVal * heightVal)) / 703;
                healthyWeightMax = (24.9 * (heightVal * heightVal)) / 703;
                unit = 'lbs';
            }

            bmi = bmi.toFixed(1);
            healthyWeightMin = Math.round(healthyWeightMin);
            healthyWeightMax = Math.round(healthyWeightMax);

            const scoreDisplay = document.getElementById('bmiScoreDisplay');
            const statusDisplay = document.getElementById('bmiStatusDisplay');
            const recommendationDisplay = document.getElementById('bmiRecDisplay');

            if (scoreDisplay) scoreDisplay.textContent = bmi;

            let status = 'Normal';
            let recText = '';
            let styleColor = 'var(--accent)';

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

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // ----------------------------------------------------------------
    // 6. Google Sheets Submission Logic
    // ----------------------------------------------------------------
    const saveSubmission = async (data) => {
        // Check if user set up the URL
        const isLive = GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== "YOUR_APPS_SCRIPT_URL_HERE";
        
        if (isLive) {
            try {
                const response = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'text/plain', // Avoid CORS preflight options issues with Apps Script
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.result === 'success') {
                    console.log('Saved successfully to Google Sheet.');
                    return true;
                } else {
                    console.error('Apps Script Error:', result.error);
                }
            } catch (err) {
                console.error('Network error saving to Google Sheet:', err);
            }
        }
        
        // Local fallback (Local Storage)
        let submissions = JSON.parse(localStorage.getItem('vlcc_submissions')) || getInitialMockData();
        const newRecord = {
            timestamp: new Date().toISOString(),
            type: data.type === 'booking' ? 'Booking' : 'Newsletter',
            name: data.name || 'Subscriber',
            contactinfo: data.type === 'booking' ? `${data.phone} (${data.email})` : data.email,
            service: data.service || '-',
            location: data.location || '-',
            schedule: data.dateTime || '-'
        };
        submissions.unshift(newRecord);
        localStorage.setItem('vlcc_submissions', JSON.stringify(submissions));
        console.log('Saved to Local Storage (Fallback Mode).');
        return true;
    };

    // Prepopulate Local Storage with some realistic data so the Dashboard looks premium initially
    function getInitialMockData() {
        return [
            {
                timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hrs ago
                type: 'Booking',
                name: 'Karan Malhotra',
                contactinfo: '+91 9891234567 (karan.malhotra@gmail.com)',
                service: 'Weight Management & Slimming',
                location: 'VLCC Centre - Greater Kailash, Delhi',
                schedule: '2026-05-28 at 10:00 AM - 11:30 AM'
            },
            {
                timestamp: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hrs ago
                type: 'Newsletter',
                name: 'Subscriber',
                contactinfo: 'sanya.verma@yahoo.com',
                service: '-',
                location: '-',
                schedule: '-'
            },
            {
                timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
                type: 'Booking',
                name: 'Pooja Hegde',
                contactinfo: '+91 9120098765 (pooja.hegde@hotmail.com)',
                service: 'Laser & Aesthetic Dermatology',
                location: 'VLCC Centre - Bandra West, Mumbai',
                schedule: '2026-05-29 at 03:00 PM - 04:30 PM'
            },
            {
                timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
                type: 'Booking',
                name: 'Anirudh Rao',
                contactinfo: '+91 8055674321 (ani.rao@outlook.com)',
                service: 'Beauty Salon & Grooming',
                location: 'VLCC Centre - Indiranagar, Bangalore',
                schedule: '2026-05-28 at 12:00 PM - 01:30 PM'
            },
            {
                timestamp: new Date(Date.now() - 3600000 * 60).toISOString(), // 2.5 days ago
                type: 'Newsletter',
                name: 'Subscriber',
                contactinfo: 'rohit.singh@gmail.com',
                service: '-',
                location: '-',
                schedule: '-'
            }
        ];
    }

    // ----------------------------------------------------------------
    // 7. Booking Wizard Submission Trigger
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

        const selectCards = document.querySelectorAll('.option-select-card');
        selectCards.forEach(card => {
            card.addEventListener('click', () => {
                const radio = card.querySelector('input[type="radio"]');
                if (radio) {
                    const name = radio.getAttribute('name');
                    document.querySelectorAll(`input[name="${name}"]`).forEach(sibling => {
                        sibling.closest('.option-select-card').classList.remove('selected');
                    });
                    
                    radio.checked = true;
                    card.classList.add('selected');
                }
            });
        });

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

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address.');
                    return false;
                }
            }
            return true;
        };

        nextBtn.addEventListener('click', async () => {
            if (!validateCurrentStep()) return;

            if (currentStep < stepPanels.length - 1) {
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
                // Final Submit Trigger
                const originalText = nextBtn.textContent;
                nextBtn.disabled = true;
                nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Reserving...';

                const serviceName = document.querySelector('input[name="booking_service"]:checked').value;
                const locationName = document.querySelector('input[name="booking_location"]:checked').value;
                const dateVal = document.getElementById('bookingDate').value;
                const timeVal = document.getElementById('bookingTime').value;
                const name = document.getElementById('bookingName').value.trim();
                const phone = document.getElementById('bookingPhone').value.trim();
                const email = document.getElementById('bookingEmail').value.trim();

                const bookingData = {
                    type: 'booking',
                    name: name,
                    email: email,
                    phone: phone,
                    service: serviceName,
                    location: locationName,
                    dateTime: `${dateVal} at ${timeVal}`
                };

                const success = await saveSubmission(bookingData);

                nextBtn.disabled = false;
                nextBtn.textContent = originalText;

                if (success) {
                    const bookingFormEl = document.getElementById('appointmentBookingForm');
                    const stepsBar = document.querySelector('.booking-form-steps');
                    const successMsg = document.getElementById('bookingSuccessState');

                    if (bookingFormEl && successMsg) {
                        bookingFormEl.style.display = 'none';
                        if (stepsBar) stepsBar.style.display = 'none';
                        successMsg.style.display = 'block';
                        
                        const confirmedService = document.getElementById('confirmedService');
                        const confirmedLoc = document.getElementById('confirmedLocation');
                        const confirmedTime = document.getElementById('confirmedDateTime');

                        if (confirmedService) confirmedService.textContent = serviceName;
                        if (confirmedLoc) confirmedLoc.textContent = locationName;
                        if (confirmedTime) confirmedTime.textContent = `${dateVal} at ${timeVal}`;
                    }
                } else {
                    alert('There was a connection issue booking your appointment. Please call us directly.');
                }
            }
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateBookingUI();
                }
            });
        }

        updateBookingUI();
    }

    // ----------------------------------------------------------------
    // 8. Newsletter Form Submit
    // ----------------------------------------------------------------
    const nForm = document.getElementById('newsletterForm');
    if (nForm) {
        nForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = nForm.querySelector('input[type="email"]');
            const submitBtn = nForm.querySelector('button');
            const originalText = submitBtn.textContent;

            if (emailInput && emailInput.value.trim()) {
                submitBtn.disabled = true;
                submitBtn.textContent = '...';

                const newsletterData = {
                    type: 'newsletter',
                    email: emailInput.value.trim()
                };

                const success = await saveSubmission(newsletterData);

                submitBtn.disabled = false;
                submitBtn.textContent = originalText;

                if (success) {
                    alert('Thank you for subscribing to VLCC newsletter!');
                    nForm.reset();
                } else {
                    alert('Could not subscribe. Please try again later.');
                }
            }
        });
    }

    // ----------------------------------------------------------------
    // 9. Dashboard Data Retrieval & Populator
    // ----------------------------------------------------------------
    const dashboardTable = document.getElementById('dashboardTableBody');
    if (dashboardTable) {
        const refreshBtn = document.getElementById('refreshDashboardBtn');
        const filterLoc = document.getElementById('filterLocation');
        const filterType = document.getElementById('filterType');
        const searchInput = document.getElementById('dashboardSearch');

        let rawSubmissions = [];

        const loadDashboard = async () => {
            dashboardTable.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-spinner fa-spin fa-2x"></i><br><br>Loading live clinical sheet records...</td></tr>';
            
            const isLive = GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== "YOUR_APPS_SCRIPT_URL_HERE";
            
            if (isLive) {
                try {
                    const response = await fetch(GOOGLE_SHEET_URL, {
                        method: 'GET',
                        mode: 'cors'
                    });
                    rawSubmissions = await response.json();
                } catch (err) {
                    console.error('Fetch error loading sheet records. Falling back to local storage...', err);
                    rawSubmissions = JSON.parse(localStorage.getItem('vlcc_submissions')) || getInitialMockData();
                }
            } else {
                // Read from Local Storage / Initial mocks
                rawSubmissions = JSON.parse(localStorage.getItem('vlcc_submissions')) || getInitialMockData();
            }

            renderDashboard();
        };

        const renderDashboard = () => {
            const locVal = filterLoc.value;
            const typeVal = filterType.value;
            const searchVal = searchInput.value.toLowerCase().trim();

            // Clear table
            dashboardTable.innerHTML = '';

            let totalBookings = 0;
            let totalNewsletters = 0;
            let delhiCount = 0;
            let mumbaiCount = 0;
            let blrCount = 0;
            let filteredCount = 0;

            rawSubmissions.forEach(sub => {
                // Standardize keys coming from Google Apps Script (all lowercase, clean letters)
                const type = sub.type || sub.submissiontype || '';
                const name = sub.name || '';
                const contact = sub.contactinfo || sub.phone || '';
                const service = sub.service || '';
                const location = sub.location || '';
                const schedule = sub.schedule || sub.dateandtime || '';
                const stamp = sub.timestamp ? new Date(sub.timestamp).toLocaleString() : '-';

                // Tally Stats totals
                if (type.toLowerCase().includes('book')) {
                    totalBookings++;
                    if (location.includes('Delhi')) delhiCount++;
                    if (location.includes('Mumbai')) mumbaiCount++;
                    if (location.includes('Bangalore')) blrCount++;
                } else if (type.toLowerCase().includes('news')) {
                    totalNewsletters++;
                }

                // Filtering conditions
                const matchesType = (typeVal === 'all' || type.toLowerCase().includes(typeVal));
                
                let matchesLoc = true;
                if (locVal !== 'all') {
                    matchesLoc = location.includes(locVal);
                }

                const matchesSearch = (
                    name.toLowerCase().includes(searchVal) ||
                    contact.toLowerCase().includes(searchVal) ||
                    service.toLowerCase().includes(searchVal) ||
                    location.toLowerCase().includes(searchVal)
                );

                if (matchesType && matchesLoc && matchesSearch) {
                    filteredCount++;
                    const row = document.createElement('tr');
                    
                    const badgeClass = type.toLowerCase().includes('book') ? 'badge-booking' : 'badge-news';
                    const displayType = type.toLowerCase().includes('book') ? 'Consultation' : 'Newsletter';

                    row.innerHTML = `
                        <td style="font-weight: 600;">${name}</td>
                        <td><span class="badge ${badgeClass}">${displayType}</span></td>
                        <td style="font-size: 13px;">${contact}</td>
                        <td>${service}</td>
                        <td style="font-size: 13px; color: var(--text-muted);">${location}</td>
                        <td>${schedule}</td>
                    `;
                    dashboardTable.appendChild(row);
                }
            });

            // If empty after filters
            if (filteredCount === 0) {
                dashboardTable.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">No records match your active search filters.</td></tr>';
            }

            // Update KPI numbers
            const cardBookings = document.getElementById('statTotalBookings');
            const cardNewsletters = document.getElementById('statTotalNewsletters');
            const cardDelhi = document.getElementById('statDelhiCount');
            const cardMumbai = document.getElementById('statMumbaiCount');
            const cardBlr = document.getElementById('statBlrCount');

            if (cardBookings) cardBookings.textContent = totalBookings;
            if (cardNewsletters) cardNewsletters.textContent = totalNewsletters;
            if (cardDelhi) cardDelhi.textContent = delhiCount;
            if (cardMumbai) cardMumbai.textContent = mumbaiCount;
            if (cardBlr) cardBlr.textContent = blrCount;
        };

        // Event listeners for Dashboard controls
        if (refreshBtn) refreshBtn.addEventListener('click', loadDashboard);
        if (filterLoc) filterLoc.addEventListener('change', renderDashboard);
        if (filterType) filterType.addEventListener('change', renderDashboard);
        if (searchInput) searchInput.addEventListener('input', renderDashboard);

        // Initial fetch
        loadDashboard();
    }
});
