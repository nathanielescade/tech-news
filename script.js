// js/script.js
document.addEventListener('DOMContentLoaded', () => {
  // Load all components
  loadComponent('header-component', 'components/header.html');
  loadComponent('hero-component', 'components/hero.html');
  loadComponent('live-news-component', 'components/live-news.html');
  loadComponent('trending-component', 'components/trending.html');
  loadComponent('exclusive-component', 'components/exclusive.html');
  loadComponent('tech-culture-component', 'components/tech-culture.html');
  loadComponent('contact-component', 'components/contact.html');
  loadComponent('footer-component', 'components/footer.html');
  
  // After components are loaded, initialize functionality
  setTimeout(() => {
    initializeMobileMenu();
    initializeLiveNews();
    initializeSubscribeForm();
  }, 500);
});

// Function to load components
async function loadComponent(componentId, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
    const html = await response.text();
    document.getElementById(componentId).innerHTML = html;
  } catch (error) {
    console.error(`Error loading component ${componentId}:`, error);
    document.getElementById(componentId).innerHTML = `<div class="error">Failed to load component: ${error.message}</div>`;
  }
}

// Mobile menu toggle
function initializeMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// Live news functionality
function initializeLiveNews() {
  const liveNewsContainer = document.getElementById('live-news-container');
  
  if (!liveNewsContainer) return;
  
  // Function to create a live news card
  function createLiveNewsCard(article, index) {
    const card = document.createElement('article');
    card.className = 'bg-gradient-to-r from-pink-900 via-black to-black rounded-xl shadow-lg overflow-hidden hover:shadow-pink-700 transition-shadow duration-300 flex flex-col cursor-pointer';
    
    const img = document.createElement('img');
    img.src = article.urlToImage || 'https://placehold.co/600x350/ff0055/000000/png?text=No+Image+Available';
    img.alt = article.title + ' - ' + (article.description || 'Tech news image');
    img.className = 'w-full h-48 object-cover';
    img.loading = 'lazy';
    
    const content = document.createElement('div');
    content.className = 'p-6 flex flex-col flex-grow';
    
    const title = document.createElement('h4');
    title.className = 'text-2xl font-semibold text-pink-400 mb-3 hover:text-pink-600';
    title.textContent = article.title;
    
    const description = document.createElement('p');
    description.className = 'text-gray-400 flex-grow';
    description.textContent = article.description || 'No description available.';
    
    const link = document.createElement('a');
    link.href = `news-detail.html?id=${index}`;
    link.className = 'mt-4 text-pink-500 font-bold hover:underline flex items-center space-x-2';
    link.innerHTML = '<span>Read Full Article</span> <i class="fas fa-arrow-right"></i>';
    
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(link);
    
    card.appendChild(img);
    card.appendChild(content);
    
    // Add click event to the entire card
    card.addEventListener('click', () => {
      window.location.href = `news-detail.html?id=${index}`;
    });
    
    return card;
  }

  // Fetch live news from NewsAPI.org - specifically tech news
  async function fetchLiveNews() {
    try {
      // Show loading indicator
      liveNewsContainer.innerHTML = '<div class="col-span-full flex justify-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-pink-500"></i></div>';
      
      const headers = new Headers();
      headers.append('User-Agent', 'TechNewsBlog/1.0');
      
      // Fetch tech news specifically
      const response = await fetch(
        'https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=9&apiKey=ffb531d30adb41eb9e180ae22b658f4f',
        { headers }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        liveNewsContainer.innerHTML = '';
        
        // Store articles in sessionStorage for detail page
        sessionStorage.setItem('techNewsArticles', JSON.stringify(data.articles));
        
        data.articles.forEach((article, index) => {
          liveNewsContainer.appendChild(createLiveNewsCard(article, index));
        });
      } else {
        liveNewsContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">No tech news available at the moment.</p>';
      }
    } catch (error) {
      liveNewsContainer.innerHTML = `<p class="text-center text-red-600 col-span-full">Failed to load tech news: ${error.message}. Please try again later.</p>`;
      console.error('Error fetching live news:', error);
    }
  }

  // Initial fetch
  fetchLiveNews();
  
  // Refresh live news every 5 minutes
  setInterval(fetchLiveNews, 300000);
}

// Subscribe form handler
function initializeSubscribeForm() {
  const subscribeForm = document.getElementById('subscribe-form');
  
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = subscribeForm.querySelector('input[name="email"]');
      const email = emailInput.value.trim();
      if (email) {
        alert(`Thank you for subscribing with ${email}! You will now receive tech news updates.`);
        emailInput.value = '';
      }
    });
  }
}