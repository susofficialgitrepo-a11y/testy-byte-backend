#  Testy Byte - Full Stack Recipe Application

A responsive, full-stack web application designed for discovering, saving, and printing recipes. Built as a college project to demonstrate modern web development techniques.

##  Features
* **Live Recipe Search:** Fetches real-time data using the public TheMealDB API.
* **Custom Backend API:** Built with Node.js/Express to serve custom data for Chefs, TV Schedules, and Shop items.
* **Save to Favorites:** Uses browser `localStorage` to save favorite recipes persistently.
* **Surprise Me:** Random recipe generator.
* **Print-Ready:** Custom CSS media queries to format recipes cleanly for paper printing.
* **Optimized Rendering:** Features loading spinners, local caching, and lazy-loading images to ensure lightning-fast speeds.

##  Technologies Used
* **Frontend:** HTML5, CSS3 (Glassmorphism, CSS Grid/Flexbox), Vanilla JavaScript.
* **Backend:** Node.js, Express.js, CORS.
* **Hosting:** Netlify (Frontend) & Render (Backend API).

##  How to Run Locally
1. Clone the repository.
2. Open the terminal and run `npm install` to install dependencies.
3. Run `node server.js` to start the backend API.
4. Open `index.html` in your web browser.