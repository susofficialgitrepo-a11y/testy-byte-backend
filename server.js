const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// --- MOCK DATABASE (With Working Unsplash Images) ---

// 1. Data for "Chefs" Page
const chefs = [
    { 
        id: 1, 
        name: "Gordon Ramsay", 
        specialty: "British Cuisine", 
        // Using a high-quality chef image from Unsplash
        image: "https://static.india.com/wp-content/uploads/2017/07/Master-Chef.jpg" 
    },
    { 
        id: 2, 
        name: "Jamie Oliver", 
        specialty: "Organic/Healthy", 
        image: "https://i.ytimg.com/vi/PXJ9bsIYPgI/maxresdefault.jpg" 
    },
    { 
        id: 3, 
        name: "Rachael Ray", 
        specialty: "Quick Meals", 
        image: "https://cdn.prod.website-files.com/5f6906f7746ebfbc453b9250/632a09fd74821917f062cc09_Taste_Script_2_Rachael_cooking_shrimp_pasta_in_pan_0634_R2.webp" 
    }
];

// 2. Data for "Shop" Page
const shopItems = [
    { 
        id: 1, 
        name: "Professional Non-Stick Pan", 
        price: "$45.00", 
        image: "https://www.wonderchef.com/cdn/shop/files/6803868.jpg?v=1757414981&width=600" 
    },
    { 
        id: 2, 
        name: "Talon Series Chef Knife", 
        price: "$120.00", 
        image: "https://stahlkitchens.com/cdn/shop/files/01_Chef_14a16ecb-0781-466f-b844-5f18197bbea3_2000x.jpg?v=1762343858" 
    },
    { 
        id: 3, 
        name: "Testy Byte Apron", 
        price: "$20.00", 
        image: "https://cdn.qwenlm.ai/output/4be5d05f-46d8-4fa4-a2c7-891abff65952/t2i/08363f17-693e-4cd5-a049-8c11702da518/1767673873.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiNGJlNWQwNWYtNDZkOC00ZmE0LWEyYzctODkxYWJmZjY1OTUyIiwicmVzb3VyY2VfaWQiOiIxNzY3NjczODczIiwicmVzb3VyY2VfY2hhdF9pZCI6IjVlMmE3Y2Y4LTIxZTItNDk1Ni05YTg3LTZhMGNiYzQzODAwNyJ9.MjWZJSG9J1p2-Ts_x4tC7XZEX15msbmzXqk5ePSduT0" 
    }
];

// 3. Data for "TV Schedule"
// 3. TV SCHEDULE
const tvSchedule = [
    { time: "10:00 AM", show: "Morning Baking with Sarah" },
    { time: "12:00 PM", show: "Burger Battles: Live" },
    { time: "06:00 PM", show: "Testy Byte Main Event" },
    { time: "08:00 PM", show: "Late Night Snacks" }
];

// 4. SHOWS (New!)
const shows = [
    { title: "Chopped: Junior", host: "Ted Allen", image: "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?w=500&q=80" },
    { title: "Beat Bobby Flay", host: "Bobby Flay", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm4ISORDPoGYqmbi1GJqtpKyIOwWfpfOCXxn0qBfmYgKBiKLz1pMxmymIez385jWTbTIQD&s=10" },
    { title: "The Kitchen", host: "Sunny Anderson", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80" },
    { title: "Diners, Drive-Ins & Dives", host: "Guy Fieri", image: "https://m.media-amazon.com/images/M/MV5BYTQ0ZTU1ODEtYzU5My00N2VjLTk0YTktNmEyZjBjMzI3ZmE2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" }
];

// 5. TRENDING RECIPES (New!)
const trending = [
    { name: "Viral Feta Pasta", views: "2M Views", image: "https://images.unsplash.com/photo-1626844131082-256783844137?w=500&q=80" },
    { name: "Cloud Bread", views: "1.5M Views", image: "https://www.easyanddelish.com/wp-content/uploads/2022/07/keto-cloud-bread-featured-pao-nuvem-capa.jpg" },
    { name: "Dalgona Coffee", views: "5M Views", image: "https://www.vegrecipesofindia.com/wp-content/uploads/2020/05/whipped-coffee.jpg" }
];

// 6. VIDEOS (New!)
const videos = [
    { title: "How to Chop an Onion", duration: "2:30", image: "https://images.unsplash.com/photo-1615486511484-92e172cc416d?w=500&q=80" },
    { title: "Best Steak Technique", duration: "5:45", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80" },
    { title: "Cake Decorating 101", duration: "10:00", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80" }
];

// --- API ROUTES ---
app.get('/', (req, res) => res.send("Server Running"));
app.get('/api/chefs', (req, res) => res.json(chefs));
app.get('/api/shop', (req, res) => res.json(shopItems));
app.get('/api/schedule', (req, res) => res.json(tvSchedule));
app.get('/api/shows', (req, res) => res.json(shows));       // New
app.get('/api/trending', (req, res) => res.json(trending)); // New
app.get('/api/videos', (req, res) => res.json(videos));     // New

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});