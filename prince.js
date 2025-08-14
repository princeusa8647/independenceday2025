// Quiz Questions Database
        const quizQuestions = [
            {
                question: "When did India gain independence?",
                options: ["15th August 1947", "26th January 1950", "15th August 1948", "26th January 1947"],
                correct: 0
            },
            {
                question: "Who was the first Prime Minister of India?",
                options: ["Mahatma Gandhi", "Sardar Patel", "Jawaharlal Nehru", "Dr. Rajendra Prasad"],
                correct: 2
            },
            {
                question: "How many spokes are there in the Ashoka Chakra?",
                options: ["20", "22", "24", "26"],
                correct: 2
            },
            {
                question: "Who gave the famous speech 'Tryst with Destiny'?",
                options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Sardar Patel"],
                correct: 1
            },
            {
                question: "What is the national anthem of India?",
                options: ["Vande Mataram", "Jana Gana Mana", "Saare Jahan Se Achha", "Jai Hind"],
                correct: 1
            },
            {
                question: "Who designed the Indian National Flag?",
                options: ["Mahatma Gandhi", "Pingali Venkayya", "Jawaharlal Nehru", "Rabindranath Tagore"],
                correct: 1
            },
            {
                question: "Which movement was started by Mahatma Gandhi in 1942?",
                options: ["Non-Cooperation Movement", "Salt March", "Quit India Movement", "Khilafat Movement"],
                correct: 2
            },
            {
                question: "Who was known as 'Netaji'?",
                options: ["Bhagat Singh", "Chandrashekhar Azad", "Subhas Chandra Bose", "Ashfaqulla Khan"],
                correct: 2
            },
            {
                question: "In which year was the Indian National Congress founded?",
                options: ["1885", "1875", "1895", "1905"],
                correct: 0
            },
            {
                question: "Who wrote the Indian National Anthem?",
                options: ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Sarojini Naidu", "Kavi Pradeep"],
                correct: 1
            }
        ];

        // Game State
        let currentUser = {};
        let currentQuestionIndex = 0;
        let score = 0;
        let timeLeft = 30;
        let timer;
        let startTime;
        let totalTime = 0;
        let correctAnswers = 0;
        let leaderboard = JSON.parse(localStorage.getItem('independenceQuizLeaderboard')) || [];

        // Show User Form
        function showUserForm() {
            document.getElementById('user-form-modal').classList.remove('hidden');
            createFirework();
        }

        // Handle User Form Submission
        document.getElementById('user-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('user-name').value.trim();
            const village = document.getElementById('user-village').value.trim();
            
            if (name && village) {
                currentUser = { name, village };
                document.getElementById('user-form-modal').classList.add('hidden');
                startQuiz();
            }
        });

        // Start Quiz
        function startQuiz() {
            document.getElementById('quiz-section').classList.remove('hidden');
            document.getElementById('quiz-user-name').textContent = currentUser.name;
            document.getElementById('quiz-user-village').textContent = currentUser.village;
            
            // Reset game state
            currentQuestionIndex = 0;
            score = 0;
            correctAnswers = 0;
            totalTime = 0;
            
            showQuestion();
            document.querySelector('html').scrollIntoView({ behavior: 'smooth' });
        }

        // Show Current Question
        function showQuestion() {
            const question = quizQuestions[currentQuestionIndex];
            document.getElementById('question-text').textContent = question.question;
            document.getElementById('current-question').textContent = currentQuestionIndex + 1;
            document.getElementById('current-score').textContent = score;
            
            const optionsContainer = document.getElementById('options-container');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option bg-gray-100 p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300';
                optionDiv.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                            ${String.fromCharCode(65 + index)}
                        </div>
                        <span class="text-lg font-medium text-gray-800">${option}</span>
                    </div>
                `;
                optionDiv.addEventListener('click', () => selectAnswer(index));
                optionsContainer.appendChild(optionDiv);
            });
            
            // Start timer
            timeLeft = 30;
            startTime = Date.now();
            startTimer();
        }

        // Start Timer
        function startTimer() {
            timer = setInterval(() => {
                timeLeft--;
                document.getElementById('time-left').textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    selectAnswer(-1); // Time up
                }
            }, 1000);
        }

        // Select Answer
        function selectAnswer(selectedIndex) {
            clearInterval(timer);
            const question = quizQuestions[currentQuestionIndex];
            const options = document.querySelectorAll('.quiz-option');
            const timeTaken = Math.round((Date.now() - startTime) / 1000);
            totalTime += timeTaken;
            
            // Show correct/wrong answers
            options.forEach((option, index) => {
                if (index === question.correct) {
                    option.classList.add('correct-answer');
                } else if (index === selectedIndex && selectedIndex !== question.correct) {
                    option.classList.add('wrong-answer');
                }
                option.style.pointerEvents = 'none';
            });
            
            // Update score
            if (selectedIndex === question.correct) {
                score += 10;
                correctAnswers++;
                document.getElementById('current-score').textContent = score;
                createFirework();
            }
            
            // Show next button
            document.getElementById('next-question').classList.remove('hidden');
        }

        // Next Question
        document.getElementById('next-question').addEventListener('click', function() {
            this.classList.add('hidden');
            currentQuestionIndex++;
            
            if (currentQuestionIndex < quizQuestions.length) {
                showQuestion();
            } else {
                showResults();
            }
        });

        // Show Results
        function showResults() {
            document.getElementById('quiz-section').classList.add('hidden');
            document.getElementById('results-section').classList.remove('hidden');
            
            // Calculate stats
            const avgTime = Math.round(totalTime / quizQuestions.length);
            const percentage = Math.round((correctAnswers / quizQuestions.length) * 100);
            
            // Update results display
            document.getElementById('final-score').textContent = score;
            document.getElementById('correct-answers').textContent = correctAnswers;
            document.getElementById('avg-time').textContent = avgTime + 's';
            
            // Score message
            let message = '';
            if (percentage >= 90) message = '🏆 Outstanding! True Patriot!';
            else if (percentage >= 70) message = '🥇 Excellent! Great Knowledge!';
            else if (percentage >= 50) message = '🥈 Good Job! Keep Learning!';
            else message = '🥉 Nice Try! Study More About Our History!';
            
            document.getElementById('score-message').textContent = message;
            
            // Add to leaderboard
            const userResult = {
                name: currentUser.name,
                village: currentUser.village,
                score: score,
                correct: correctAnswers,
                avgTime: avgTime,
                timestamp: new Date().toISOString()
            };
            
            leaderboard.push(userResult);
            leaderboard.sort((a, b) => b.score - a.score);
            leaderboard = leaderboard.slice(0, 10); // Keep top 10
            localStorage.setItem('independenceQuizLeaderboard', JSON.stringify(leaderboard));
            
            // Update rank
            const userRank = leaderboard.findIndex(entry => 
                entry.name === currentUser.name && 
                entry.village === currentUser.village && 
                entry.timestamp === userResult.timestamp
            ) + 1;
            document.getElementById('user-rank').textContent = '#' + userRank;
            
            updateLeaderboard();
            createCelebrationFireworks();
            
            document.querySelector('#results-section').scrollIntoView({ behavior: 'smooth' });
        }

        // Update Leaderboard Display
        function updateLeaderboard() {
            const container = document.getElementById('leaderboard-container');
            container.innerHTML = '';
            
            if (leaderboard.length === 0) {
                container.innerHTML = '<p class="text-white text-center text-xl">No scores yet! Be the first to take the quiz!</p>';
                return;
            }
            
            leaderboard.forEach((entry, index) => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'leaderboard-entry bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-between';
                entryDiv.style.animationDelay = `${index * 0.1}s`;
                
                const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
                
                entryDiv.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <div class="text-3xl">${rankEmoji}</div>
                        <div>
                            <div class="text-xl font-bold text-white">${entry.name}</div>
                            <div class="text-sm text-gray-300">${entry.village}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-yellow-300">${entry.score}</div>
                        <div class="text-sm text-gray-300">${entry.correct}/10 correct</div>
                    </div>
                `;
                
                container.appendChild(entryDiv);
            });
        }

        // Share Score
        function shareScore() {
            const text = `🇮🇳 I scored ${score}/100 in the Independence Day Quiz at ACI Computer Institute! 🎉\n\nCorrect Answers: ${correctAnswers}/10\nFrom: ${currentUser.village}\n\nTake the quiz and test your knowledge about India's freedom struggle!\n\n#IndependenceDay #Quiz #ACI #JaiHind`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Independence Day Quiz Score',
                    text: text
                });
            } else {
                navigator.clipboard.writeText(text).then(() => {
                    alert('Score copied to clipboard! Share it with your friends! 🎉');
                });
            }
        }

        // Restart Quiz
        function restartQuiz() {
            document.getElementById('results-section').classList.add('hidden');
            showUserForm();
        }

        // Fireworks Animation
        function createFirework() {
            const container = document.getElementById('fireworks-container');
            const colors = ['#FF6B35', '#FFFFFF', '#138808', '#FFD700', '#FF1493'];
            
            for (let i = 0; i < 15; i++) {
                const firework = document.createElement('div');
                firework.className = 'fireworks';
                firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                firework.style.left = Math.random() * window.innerWidth + 'px';
                firework.style.top = Math.random() * window.innerHeight + 'px';
                firework.style.animationDelay = Math.random() * 2 + 's';
                
                container.appendChild(firework);
                
                setTimeout(() => {
                    firework.remove();
                }, 2000);
            }
        }

        // Celebration Fireworks
        function createCelebrationFireworks() {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => createFirework(), i * 300);
            }
        }

        // Initialize leaderboard on page load
        updateLeaderboard();

        // Auto fireworks every 15 seconds
        setInterval(() => {
            if (Math.random() > 0.8) {
                createFirework();
            }
        }, 15000);

        // Museum Content Database
        const museumContent = {
            flag: {
                title: "🇮🇳 Indian National Flag",
                content: `
                    <div class="space-y-4">
                        <p><strong>The Tricolor:</strong> Our national flag consists of three horizontal stripes of equal width.</p>
                        <p><strong>Saffron (Top):</strong> Represents courage, sacrifice, and the spirit of renunciation.</p>
                        <p><strong>White (Middle):</strong> Represents peace, truth, and purity with the Ashoka Chakra in navy blue.</p>
                        <p><strong>Green (Bottom):</strong> Represents faith, fertility, and the land.</p>
                        <p><strong>Ashoka Chakra:</strong> The 24-spoke wheel represents the eternal wheel of law (dharma).</p>
                        <p><strong>Designer:</strong> Pingali Venkayya designed the flag, adopted on July 22, 1947.</p>
                    </div>
                `
            },
            anthem: {
                title: "🎵 Jana Gana Mana",
                content: `
                    <div class="space-y-4">
                        <p><strong>Written by:</strong> Rabindranath Tagore in 1911</p>
                        <p><strong>Adopted:</strong> January 24, 1950</p>
                        <p><strong>Duration:</strong> 52 seconds</p>
                        <p><strong>Language:</strong> Bengali (sanskritized)</p>
                        <p><strong>Meaning:</strong> "Thou art the ruler of the minds of all people"</p>
                        <p><strong>First sung:</strong> At the Calcutta Session of Indian National Congress in 1911</p>
                        <p>The anthem celebrates the diversity and unity of India, mentioning various regions and communities.</p>
                    </div>
                `
            },
            symbols: {
                title: "🦚 National Symbols of India",
                content: `
                    <div class="space-y-4">
                        <p><strong>🦚 National Bird:</strong> Indian Peacock (Pavo cristatus)</p>
                        <p><strong>🐅 National Animal:</strong> Royal Bengal Tiger (Panthera tigris)</p>
                        <p><strong>🌸 National Flower:</strong> Lotus (Nelumbo nucifera)</p>
                        <p><strong>🌳 National Tree:</strong> Banyan Tree (Ficus benghalensis)</p>
                        <p><strong>🥭 National Fruit:</strong> Mango (Mangifera indica)</p>
                        <p><strong>🐬 National Aquatic Animal:</strong> River Dolphin (Platanista gangetica)</p>
                        <p><strong>🏛️ National Emblem:</strong> Lion Capital of Ashoka</p>
                    </div>
                `
            },
            freedom: {
                title: "📜 Freedom Struggle Timeline",
                content: `
                    <div class="space-y-4">
                        <p><strong>1857:</strong> First War of Independence (Sepoy Mutiny)</p>
                        <p><strong>1885:</strong> Formation of Indian National Congress</p>
                        <p><strong>1905:</strong> Partition of Bengal, Swadeshi Movement</p>
                        <p><strong>1919:</strong> Jallianwala Bagh Massacre</p>
                        <p><strong>1920:</strong> Non-Cooperation Movement by Gandhi</p>
                        <p><strong>1930:</strong> Salt March (Dandi March)</p>
                        <p><strong>1942:</strong> Quit India Movement</p>
                        <p><strong>1947:</strong> Independence on August 15th</p>
                    </div>
                `
            },
            constitution: {
                title: "⚖️ Indian Constitution",
                content: `
                    <div class="space-y-4">
                        <p><strong>Adopted:</strong> November 26, 1949</p>
                        <p><strong>Came into effect:</strong> January 26, 1950 (Republic Day)</p>
                        <p><strong>Chairman of Drafting Committee:</strong> Dr. B.R. Ambedkar</p>
                        <p><strong>Articles:</strong> 395 articles in 22 parts</p>
                        <p><strong>Schedules:</strong> 12 schedules</p>
                        <p><strong>Languages:</strong> Written in Hindi and English</p>
                        <p><strong>Features:</strong> Longest written constitution in the world</p>
                        <p>It establishes India as a sovereign, socialist, secular, democratic republic.</p>
                    </div>
                `
            },
            culture: {
                title: "🎭 Unity in Diversity",
                content: `
                    <div class="space-y-4">
                        <p><strong>Languages:</strong> 22 official languages, over 1600 spoken languages</p>
                        <p><strong>Religions:</strong> Hinduism, Islam, Christianity, Sikhism, Buddhism, Jainism</p>
                        <p><strong>Festivals:</strong> Diwali, Eid, Christmas, Holi, Dussehra, and many more</p>
                        <p><strong>Dance Forms:</strong> Bharatanatyam, Kathak, Odissi, Manipuri, Kuchipudi</p>
                        <p><strong>Cuisines:</strong> Diverse regional cuisines from North to South, East to West</p>
                        <p><strong>Art & Craft:</strong> Madhubani, Warli, Tanjore painting, handicrafts</p>
                        <p>India's strength lies in its ability to maintain unity despite incredible diversity.</p>
                    </div>
                `
            }
        };

        // Patriotic Quotes Database
        const patrioticQuotes = [
            {
                text: "Freedom is not worth having if it does not include the freedom to make mistakes.",
                author: "Mahatma Gandhi",
                icon: "🇮🇳"
            },
            {
                text: "Give me blood, and I shall give you freedom!",
                author: "Subhas Chandra Bose",
                icon: "⚔️"
            },
            {
                text: "Sarfaroshi ki tamanna ab hamare dil mein hai, dekhna hai zor kitna bazu-e-qatil mein hai.",
                author: "Bhagat Singh",
                icon: "🌹"
            },
            {
                text: "At the stroke of the midnight hour, when the world sleeps, India will awake to life and freedom.",
                author: "Jawaharlal Nehru",
                icon: "🌟"
            },
            {
                text: "The best way to find yourself is to lose yourself in the service of others.",
                author: "Mahatma Gandhi",
                icon: "🕊️"
            },
            {
                text: "Freedom is never dear at any price. It is the breath of life. What would a man not pay for living?",
                author: "Mahatma Gandhi",
                icon: "💨"
            },
            {
                text: "Citizenship consists in the service of the country.",
                author: "Jawaharlal Nehru",
                icon: "🏛️"
            },
            {
                text: "We are Indians, firstly and lastly.",
                author: "Dr. B.R. Ambedkar",
                icon: "🤝"
            }
        ];

        let currentQuoteIndex = 0;

        // Museum Functions
        function openMuseumItem(itemKey) {
            const item = museumContent[itemKey];
            if (item) {
                document.getElementById('museum-title').textContent = item.title;
                document.getElementById('museum-content').innerHTML = item.content;
                document.getElementById('museum-modal').classList.remove('hidden');
                createFirework();
            }
        }

        function closeMuseumItem() {
            document.getElementById('museum-modal').classList.add('hidden');
        }

        // Quote Carousel Functions
        function showQuote(index) {
            const quote = patrioticQuotes[index];
            document.getElementById('quote-text').textContent = `"${quote.text}"`;
            document.getElementById('quote-author').textContent = `- ${quote.author}`;
            document.getElementById('quote-icon').textContent = quote.icon;
        }

        function nextQuote() {
            currentQuoteIndex = (currentQuoteIndex + 1) % patrioticQuotes.length;
            showQuote(currentQuoteIndex);
            createFirework();
        }

        function previousQuote() {
            currentQuoteIndex = (currentQuoteIndex - 1 + patrioticQuotes.length) % patrioticQuotes.length;
            showQuote(currentQuoteIndex);
            createFirework();
        }

        // Auto-rotate quotes every 8 seconds
        setInterval(() => {
            nextQuote();
        }, 8000);

        // Animate statistics on scroll
        function animateStats() {
            const stats = [
                { id: 'states-count', target: 28, suffix: '' },
                { id: 'languages-count', target: 22, suffix: '' },
                { id: 'literacy-count', target: 77.7, suffix: '%' }
            ];

            stats.forEach(stat => {
                const element = document.getElementById(stat.id);
                if (element) {
                    let current = 0;
                    const increment = stat.target / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= stat.target) {
                            current = stat.target;
                            clearInterval(timer);
                        }
                        element.textContent = Math.round(current * 10) / 10 + stat.suffix;
                    }, 50);
                }
            });
        }

        // Initialize stats animation when section is visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        // Observe stats section
        const statsSection = document.querySelector('#states-count');
        if (statsSection) {
            statsObserver.observe(statsSection.closest('section'));
        }

        // Close museum modal when clicking outside
        document.getElementById('museum-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeMuseumItem();
            }
        });

        // Enhanced fireworks for special occasions
        function createSpecialFireworks() {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => createFirework(), i * 200);
            }
        }

        // Add special effects to museum items
        document.querySelectorAll('.museum-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05) rotateY(5deg)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotateY(0deg)';
            });
        });

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            showQuote(0);
            
            // Add smooth scrolling to all internal links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        });

        // Welcome message
        setTimeout(() => {
            console.log('🇮🇳 Welcome to ACI Computer Institute\'s Independence Day Mega Celebration! 🇮🇳');
            console.log('🎉 Features: Quiz Challenge, Virtual Museum, Live Stats, Quotes & More!');
            console.log('Coded with ❤️ by Prince Singh');
        }, 1000);
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'96f25c0b2524c177',t:'MTc1NTE5NDUwOC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();