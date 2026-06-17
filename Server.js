const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  const defaultData = {
    products: [
      {id:1,title:'Premium Lawn Suit',gender:'women',category:'clothing',fabric:'Lawn',price:3500,qty:30,description:'Beautiful printed lawn unstitched suit with embroidered dupatta. Perfect for summer.',images:[],emoji:'👗',rating:4.8,ratingCount:24,bestSeller:true},
      {id:2,title:'Boski Shalwar Qameez',gender:'men',category:'clothing',fabric:'Boski',price:4200,qty:25,description:'Premium Boski fabric shalwar qameez. Lightweight and comfortable for all seasons.',images:[],emoji:'👔',rating:4.7,ratingCount:18,bestSeller:true},
      {id:3,title:'Khaddar Winter Suit',gender:'women',category:'clothing',fabric:'Khaddar',price:2800,qty:40,description:'Warm and cozy Khaddar suit perfect for winters. 3-piece unstitched with embroidery.',images:[],emoji:'🧥',rating:4.6,ratingCount:12,bestSeller:false},
      {id:4,title:'Cotton Casual Kurta',gender:'men',category:'clothing',fabric:'Cotton',price:1800,qty:60,description:'Comfortable everyday cotton kurta. Available in multiple colors.',images:[],emoji:'👕',rating:4.5,ratingCount:31,bestSeller:true},
      {id:5,title:'Chiffon Party Dress',gender:'women',category:'clothing',fabric:'Chiffon',price:5500,qty:20,description:'Elegant chiffon party dress with heavy embroidery. Perfect for weddings.',images:[],emoji:'💃',rating:4.9,ratingCount:8,bestSeller:true},
      {id:6,title:'Classic Leather Shoes',gender:'men',category:'shoes',fabric:'',price:3200,qty:15,description:'Handcrafted genuine leather shoes. Comfortable, durable, and stylish.',images:[],emoji:'👞',rating:4.7,ratingCount:22,bestSeller:true},
      {id:7,title:'Ladies Heels',gender:'women',category:'shoes',fabric:'',price:2400,qty:18,description:'Elegant block heels perfect for formal and casual wear.',images:[],emoji:'👠',rating:4.5,ratingCount:14,bestSeller:false},
      {id:8,title:'Classic Dress Watch',gender:'men',category:'watches',fabric:'',price:6500,qty:10,description:'Premium dress watch with genuine leather strap. Water resistant.',images:[],emoji:'⌚',rating:4.8,ratingCount:19,bestSeller:true}
    ],
    orders: [],
    reviews: [],
    settings: {insta:"#",tiktok:"#",facebook:"#",whatsapp:"923163475925"},
    adminpass: "nobel01",
    orderCounter: 1000
  };
  fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
}

// GET all products
app.get('/api/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.json(data.products);
});

// POST new product
app.post('/api/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  const newProduct = {
    id: Date.now(),
    ...req.body,
    bestSeller: req.body.bestSeller === true || req.body.bestSeller === 'true'
  };
  data.products.unshift(newProduct);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.json(newProduct);
});

// UPDATE product
app.put('/api/products/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  const idx = data.products.findIndex(p => p.id == req.params.id);
  if (idx !== -1) {
    data.products[idx] = { ...data.products[idx], ...req.body };
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json(data.products[idx]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  data.products = data.products.filter(p => p.id != req.params.id);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// GET all orders
app.get('/api/orders', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.json(data.orders);
});

// POST new order
app.post('/api/orders', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  data.orderCounter++;
  const newOrder = { id: data.orderCounter, ...req.body, date: new Date().toLocaleString('en-PK') };
  data.orders.unshift(newOrder);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.json(newOrder);
});

// UPDATE order status
app.put('/api/orders/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  const idx = data.orders.findIndex(o => o.id == req.params.id);
  if (idx !== -1) {
    data.orders[idx] = { ...data.orders[idx], ...req.body };
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json(data.orders[idx]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// DELETE order
app.delete('/api/orders/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  data.orders = data.orders.filter(o => o.id != req.params.id);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// GET reviews
app.get('/api/reviews', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.json(data.reviews);
});

// POST review
app.post('/api/reviews', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  const newReview = { id: Date.now(), ...req.body, date: new Date().toLocaleDateString('en-PK') };
  data.reviews.unshift(newReview);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.json(newReview);
});

// DELETE review
app.delete('/api/reviews/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  data.reviews = data.reviews.filter(r => r.id != req.params.id);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// GET settings
app.get('/api/settings', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.json(data.settings);
});

// UPDATE settings
app.post('/api/settings', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  data.settings = { ...data.settings, ...req.body };
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.json(data.settings);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Nobel Wear Server running at http://localhost:${PORT}`);
  console.log(`📱 Access from other devices: http://YOUR_IP:${PORT}`);
});
