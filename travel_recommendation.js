  // DOM elements
        const searchInput = document.getElementById('search-input');
        const resultsDropdown = document.getElementById('resultsDropdown');
        const closeDropdown = document.getElementById('closeDropdown');
        const clearButton = document.getElementById('clear-button');

        // Function to create a destination card
        function createCard(item, category, searchTerm = '') {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Create highlighted text with the search term
            const highlightText = (text, term) => {
                if (!term) return text;
                const regex = new RegExp(`(${term})`, 'gi');
                return text.replace(regex, '<span class="highlight">$1</span>');
            };
            
            const highlightedName = highlightText(item.name, searchTerm);
            const highlightedDescription = highlightText(item.description, searchTerm);
            
            card.innerHTML = `
                <div class="card-image">
                    <span>Image</span>
                </div>
                <div class="card-content">
                    <span class="card-category">${category}</span>
                    <h3 class="card-title">${highlightedName}</h3>
                    <p class="card-description">${highlightedDescription}</p>
                </div>
            `;
            
            // Add click event to select this result
            card.addEventListener('click', () => {
                searchInput.value = item.name;
                hideDropdown();
            });
            
            return card;
        }

        // Function to show the dropdown
        function showDropdown() {
            resultsDropdown.classList.add('active');
            closeDropdown.classList.add('active');
        }

        // Function to hide the dropdown
        function hideDropdown() {
            resultsDropdown.classList.remove('active');
            closeDropdown.classList.remove('active');
        }

        // Function to search through all data
        async function searchDestinations(searchTerm) {
            console.log("search");
            resultsDropdown.innerHTML = '';
            searchTerm = searchTerm.trim().toLowerCase();
            
            // Show dropdown if there's any search text
            if (searchTerm !== '') {
                showDropdown();
            } else {
                hideDropdown();
                return;
            }
            
            let results = [];

            await fetch('travel_recommendation_api.json')
            .then(response => response.json())
            .then(data => {
                // Search through countries
                data.countries.forEach(country => {
                    if (country.name.toLowerCase().includes(searchTerm)) {
                        results.push({
                            item: { 
                                name: country.name, 
                                description: `Country with ${country.cities.length} featured cities` 
                            },
                            category: 'Country'
                        });
                    }
                    
                    // Search through cities of each country
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(searchTerm) || 
                            city.description.toLowerCase().includes(searchTerm)) {
                            results.push({
                                item: city,
                                category: 'City'
                            });
                        }
                    });
                });
                
                // Search through temples
                data.temples.forEach(temple => {
                    if (temple.name.toLowerCase().includes(searchTerm) || 
                        temple.description.toLowerCase().includes(searchTerm)) {
                        results.push({
                            item: temple,
                            category: 'Temple'
                        });
                    }
                });
                
                // Search through beaches
                data.beaches.forEach(beach => {
                    if (beach.name.toLowerCase().includes(searchTerm) || 
                        beach.description.toLowerCase().includes(searchTerm)) {
                        results.push({
                            item: beach,
                            category: 'Beach'
                        });
                    }
                });
                
                // Display results or show no results message
                if (results.length > 0) {
                    console.log("search card");
                    results.forEach(result => {
                        resultsDropdown.appendChild(createCard(result.item, result.category, searchTerm));
                    });
                } else {
                    console.log("no search");
                    const noResults = document.createElement('div');
                    noResults.className = 'no-results';
                    noResults.textContent = 'No destinations found matching your search.';
                    resultsDropdown.appendChild(noResults);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultDiv.innerHTML = 'An error occurred while fetching data.';
            });
            
            
        }

        // Event listener for search input
        searchInput.addEventListener('input', (e) => {
            searchDestinations(e.target.value);
        });

        // Event listener for focus on search input
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim() !== '') {
                showDropdown();
            }
        });

        // Event listener to close dropdown when clicking outside
        closeDropdown.addEventListener('click', hideDropdown);

        // Event listener for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && resultsDropdown.classList.contains('active')) {
                hideDropdown();
            }
        });

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            searchResultsContainer.innerHTML = '';
            searchResultsContainer.classList.remove('show');
        });