 const QS = (sel, el = document) => el.querySelector(sel);
 const QSA = (sel, el = document) => Array.from(el.querySelectorAll(sel));
 
 const STORE_KEY = "quickkart_cart_v1";
 
 // EmailJS Configuration - YOU MUST FILL THESE TO SEND REAL EMAILS
 const EMAILJS_PUBLIC_KEY = "Xt0ifZ8cu2MVq_lYo"; 
 const EMAILJS_SERVICE_ID = "service_au4sirs"; 
 const EMAILJS_TEMPLATE_ID = "template_5i7ozl8"; // FOR CUSTOMER BILLING
 const EMAILJS_ADMIN_TEMPLATE_ID = "template_u405mvv"; // FOR ADMIN ACCESS REQUESTS
 
 if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
   emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
 }

 function hash32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function moneyFromName(name, min, max) {
  const h = hash32(name);
  const n = min + (h % (max - min + 1));
  return Math.round(n);
}

function httpsFoodImage(name, subCategory) {
  // Legacy (no longer used for food): kept for compatibility.
  const text = encodeURIComponent(name.length > 28 ? name.slice(0, 28) + "…" : name);
  const bg = subCategory === "Chinese" ? "0f172a" : subCategory === "Chaat" ? "3b0764" : subCategory === "Snacks" ? "064e3b" : "7c2d12";
  const fg = "ffffff";
  return `https://placehold.co/600x400/${bg}/${fg}?text=${text}`;
}

function generateFoodItems(subCategory, targetCount = 100) {
  const bases = {
    Chinese: [
      "Veg Hakka Noodles", "Chicken Hakka Noodles", "Schezwan Noodles", "Chilli Garlic Noodles",
      "Veg Fried Rice", "Egg Fried Rice", "Chicken Fried Rice", "Schezwan Fried Rice",
      "Gobi Manchurian", "Paneer Manchurian", "Chicken Manchurian", "Chilli Paneer",
      "Chilli Chicken", "Dragon Chicken", "Honey Chilli Potato", "Spring Roll",
      "Veg Momos", "Chicken Momos", "Fried Momos", "Tandoori Momos",
      "Manchow Soup", "Hot & Sour Soup", "Sweet Corn Soup", "Clear Soup",
      "Veg Chowmein", "Chicken Chowmein", "Schezwan Momos", "Paneer Chilli",
      "Kung Pao Chicken", "Schezwan Chicken", "Crispy Corn", "Chilli Mushroom",
      "Salt & Pepper Babycorn", "Singapore Noodles", "American Chopsuey", "Chinese Bhel",
    ],
    Chaat: [
      "Pani Puri", "Dahi Puri", "Sev Puri", "Bhel Puri", "Masala Puri",
      "Aloo Tikki Chaat", "Dahi Aloo Tikki", "Papdi Chaat", "Samosa Chaat",
      "Ragda Pattice", "Raj Kachori", "Kachori Chaat", "Dahi Vada",
      "Chana Chaat", "Corn Chaat", "Moong Dal Chaat", "Fruit Chaat",
      "Pav Bhaji", "Misal Pav", "Vada Pav", "Bombay Sandwich",
      "Chole Bhature", "Chole Kulche", "Aloo Chaat", "Jhalmuri",
    ],
    Snacks: [
      "Samosa", "Kachori", "Pakoda", "Onion Pakoda", "Bread Pakoda",
      "Cutlet", "Veg Puff", "Egg Puff", "Chicken Puff", "Paneer Puff",
      "French Fries", "Peri Peri Fries", "Nachos", "Cheese Nachos",
      "Burger (Veg)", "Burger (Chicken)", "Sandwich", "Club Sandwich",
      "Shawarma Roll", "Kathi Roll", "Paneer Roll", "Egg Roll",
      "Pizza (Margherita)", "Pizza (Chicken)", "Garlic Bread", "Cheese Garlic Bread",
      "Chicken 65", "Chicken Wings", "Popcorn Chicken", "Grilled Chicken",
    ],
    Sweets: [
      "Gulab Jamun", "Jalebi", "Rasgulla", "Rasmalai", "Kaju Katli",
      "Motichoor Laddu", "Besan Laddu", "Mysore Pak", "Halwa", "Gajar Halwa",
      "Badam Halwa", "Kheer", "Payasam", "Shrikhand", "Peda",
      "Barfi", "Soan Papdi", "Malpua", "Kulfi", "Ice Cream",
    ],
  }[subCategory] || [];

  const variants = [
    "Regular", "Special", "Classic", "Extra Spicy", "Less Spicy", "Cheese", "Jumbo", "Mini",
    "Combo", "Family Pack", "With Mayo", "With Extra Sauce", "Masala", "Tandoori", "Butter",
  ];

  const units = subCategory === "Sweets" ? ["250 g", "500 g", "1 kg", "2 pcs", "4 pcs", "1 cup"] : ["1 plate", "1 box", "1 portion", "1 set", "1 roll"];

  const items = [];
  let idx = 0;
  while (items.length < targetCount) {
    const base = bases[idx % bases.length] || `Food Item ${idx + 1}`;
    const v = variants[Math.floor((hash32(base + idx) % variants.length))];
    const name = `${base} • ${v}`;
    const unit = units[Math.floor(hash32(name) % units.length)];

    const priceRange = subCategory === "Chinese" ? [99, 299] : subCategory === "Chaat" ? [39, 159] : subCategory === "Snacks" ? [49, 249] : [59, 399];
    const price = moneyFromName(name, priceRange[0], priceRange[1]);
    const popular = (hash32(name) % 11) === 0;

    const id = `food-${subCategory.toLowerCase()}-${idx + 1}`;
    const image = realFoodImageForName(base, subCategory);
    items.push({
      id,
      name,
      category: "Food",
      subCategory,
      price,
      unit,
      popular,
      image,
    });
    idx++;
  }
  return items;
}

function generateGroceryItems(subCategory, targetCount = 70) {
  const bases = {
    Rice: ["Basmati Rice", "Ponni Rice", "Sona Masoori", "Brown Rice", "Idli Rice", "Jasmine Rice", "Red Rice", "Black Rice"],
    Cereals: ["Wheat", "Ragi", "Jowar", "Bajra", "Oats", "Corn Flakes", "Muesli", "Barley"],
    Pulses: ["Toor Dal", "Moong Dal", "Chana Dal", "Urad Dal", "Masoor Dal", "Rajma", "Kabuli Chana", "Green Peas"],
    Fruits: ["Apple", "Banana", "Orange", "Mango", "Grapes", "Pineapple", "Watermelon", "Papaya", "Pomegranate", "Guava"],
    Vegetables: ["Onion", "Potato", "Tomato", "Carrot", "Beans", "Cabbage", "Cauliflower", "Spinach", "Okra", "Brinjal"],
    Sugars: ["White Sugar", "Brown Sugar", "Jaggery", "Honey", "Stevia", "Palm Sugar"],
    Spices: ["Turmeric", "Red Chilli", "Coriander", "Cumin", "Black Pepper", "Cardamom", "Clove", "Cinnamon", "Mustard"],
    "Cooking Powders": ["Sambar Powder", "Rasam Powder", "Garam Masala", "Chicken Masala", "Mutton Masala", "Turmeric Powder", "Chilli Powder"],
  }[subCategory] || [];

  const weights = ["500 g", "1 kg", "2 kg", "5 kg", "10 kg"];
  const items = [];
  let idx = 0;

  while (items.length < targetCount) {
    const base = bases[idx % bases.length] || `${subCategory} Item ${idx + 1}`;
    const weight = weights[Math.floor(hash32(base + idx) % weights.length)];
    const name = `${base} (${weight})`;
    
    const price = moneyFromName(name, 40, 500);
    const popular = (hash32(name) % 15) === 0;
    const id = `groc-${subCategory.toLowerCase().replace(/\s+/g, "-")}-${idx + 1}`;
    
    // Simple placeholder for groceries
    const image = `https://placehold.co/600x400/064e3b/ffffff?text=${encodeURIComponent(base)}`;

    items.push({
      id,
      name,
      category: "Groceries",
      subCategory,
      price,
      unit: weight,
      popular,
      image,
    });
    idx++;
  }
  return items;
}

function realFoodImageForName(baseName, subCategory) {
  const n = String(baseName || "").toLowerCase();

  const map = [
    // Chinese
    { k: ["noodles", "chowmein", "chow mein", "hakka"], img: "assets/img/food-real/hakka-noodles.jpg" },
    { k: ["fried rice", "rice"], img: "assets/img/food-real/veg-fried-rice.jpg" },
    { k: ["manchurian"], img: "assets/img/food-real/gobi-manchurian.jpg" },
    { k: ["momos", "momo"], img: "assets/img/food-real/momos.jpg" },
    { k: ["spring roll", "roll"], img: "assets/img/food-real/samosa.jpg" },

    // Chaat
    { k: ["pani puri", "golgappa", "gol gappa"], img: "assets/img/food-real/pani-puri.jpg" },
    { k: ["papdi", "papri"], img: "assets/img/food-real/papdi-chaat.jpg" },
    { k: ["bhel"], img: "assets/img/food-real/bhel-puri.jpg" },
    { k: ["pav bhaji"], img: "assets/img/food-real/pav-bhaji.jpg" },

    // Snacks
    { k: ["samosa", "pakoda", "pakora"], img: "assets/img/food-real/samosa.jpg" },
    { k: ["shawarma"], img: "assets/img/food-real/shawarma.jpg" },
    { k: ["pizza"], img: "assets/img/food-real/pizza.jpg" },
    { k: ["burger"], img: "assets/img/food-real/burger.jpg" },

    // Sweets
    { k: ["gulab jamun"], img: "assets/img/food-real/gulab-jamun.jpg" },
    { k: ["jalebi"], img: "assets/img/food-real/jalebi.jpg" },
    { k: ["rasgulla", "rasgulla"], img: "assets/img/food-real/rasgulla.jpg" },
  ];

  for (const row of map) {
    for (const kw of row.k) {
      if (kw && n.includes(kw)) return row.img;
    }
  }

  // Category fallback (always real photos)
  if (subCategory === "Chinese") return "assets/img/food-real/hakka-noodles.jpg";
  if (subCategory === "Chaat") return "assets/img/food-real/pani-puri.jpg";
  if (subCategory === "Snacks") return "assets/img/food-real/samosa.jpg";
  if (subCategory === "Sweets") return "assets/img/food-real/gulab-jamun.jpg";
  return "assets/img/food-real/hakka-noodles.jpg";
}

const PRODUCTS = [
  ...generateFoodItems("Chinese"),
  ...generateFoodItems("Chaat"),
  ...generateFoodItems("Snacks"),
  ...generateFoodItems("Sweets"),
  
  // Groceries
  ...generateGroceryItems("Rice"),
  ...generateGroceryItems("Cereals"),
  ...generateGroceryItems("Pulses"),
  ...generateGroceryItems("Fruits"),
  ...generateGroceryItems("Vegetables"),
  ...generateGroceryItems("Sugars"),
  ...generateGroceryItems("Spices"),
  ...generateGroceryItems("Cooking Powders"),

  // Products
  { id: "pro-1", name: "Water Bottle (Steel)", category: "Products", price: 399, unit: "1 pc" },
  { id: "pro-2", name: "Backpack 25L", category: "Products", price: 899, unit: "1 pc", popular: true },
  { id: "pro-3", name: "LED Desk Lamp", category: "Products", price: 649, unit: "1 pc" },
  { id: "pro-4", name: "Bluetooth Speaker", category: "Products", price: 1299, unit: "1 pc" },
  // E-Products
  { id: "epro-1", name: "Wireless Mouse", category: "E-Products", price: 499, unit: "1 pc" },
  { id: "epro-2", name: "Keyboard (Mechanical)", category: "E-Products", price: 2199, unit: "1 pc", popular: true },
  { id: "epro-3", name: "USB-C Cable", category: "E-Products", price: 199, unit: "1 pc" },
  { id: "epro-4", name: "Power Bank 20000mAh", category: "E-Products", price: 1499, unit: "1 pc" },
];
 
 function formatINR(n) {
   try {
     return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
   } catch {
     return `₹${Math.round(n)}`;
   }
 }
 
 function getCart() {
   try {
     const raw = localStorage.getItem(STORE_KEY);
     const cart = raw ? JSON.parse(raw) : {};
     return cart && typeof cart === "object" ? cart : {};
   } catch {
     return {};
   }
 }
 
 function setCart(cart) {
   localStorage.setItem(STORE_KEY, JSON.stringify(cart));
   updateCartBadge();
 }
 
 function updateCartBadge() {
   const cart = getCart();
   const count = Object.values(cart).reduce((a, b) => a + (Number(b) || 0), 0);
   QSA("[data-cart-count]").forEach((el) => (el.textContent = String(count)));
 }
 
 function addToCart(productId, qty = 1) {
   const cart = getCart();
   const next = Math.max(1, (Number(cart[productId]) || 0) + Number(qty || 1));
   cart[productId] = next;
   setCart(cart);
 }
 
 function removeFromCart(productId) {
   const cart = getCart();
   delete cart[productId];
   setCart(cart);
 }
 
 function setQty(productId, qty) {
   const q = Number(qty);
   const cart = getCart();
   if (!Number.isFinite(q) || q <= 0) {
     delete cart[productId];
   } else {
     cart[productId] = Math.min(99, Math.floor(q));
   }
   setCart(cart);
 }
 
 function productById(id) {
   return PRODUCTS.find((p) => p.id === id) || null;
 }
 
 function renderProducts({ category = null, subCategory = null, query = "", sort = "popular" } = {}) {
   const host = QS("[data-products]");
   if (!host) return;
 
   const q = String(query || "").trim().toLowerCase();
 
   let list = PRODUCTS.slice();
   if (category) list = list.filter((p) => p.category === category);
  if (subCategory) list = list.filter((p) => p.subCategory === subCategory);
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        String(p.subCategory || "").toLowerCase().includes(q),
    );
  }
 
   if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
   if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
   if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
   if (sort === "popular") list.sort((a, b) => Number(!!b.popular) - Number(!!a.popular) || a.price - b.price);
 
   if (list.length === 0) {
     host.innerHTML = `<div class="empty">No products found. Try a different search.</div>`;
     return;
   }
 
   host.innerHTML = list
     .map((p) => {
      const badge = p.popular
        ? `<span class="tag">Popular</span>`
        : `<span class="tag">${escapeHtml(p.subCategory || p.category)}</span>`;
      const media = p.image
        ? `<div class="card-media" role="img" aria-label="${escapeHtml(p.name)}" style="background-image:url('${escapeHtml(p.image)}'); background-size:cover; background-position:center;"></div>`
        : `<div class="card-media"></div>`;
       return `
         <article class="card">
          ${media}
           <div class="card-inner">
             ${badge}
             <h3>${escapeHtml(p.name)}</h3>
             <div class="small muted">${escapeHtml(p.unit || "")}</div>
             <div class="price-row">
               <div>
                 <div class="price">${formatINR(p.price)}</div>
                 <div class="small muted">QuickKart price</div>
               </div>
               <div style="display:flex; gap:8px; align-items:center;">
                 <button class="btn-sm" data-compare="${p.id}">Compare</button>
                 <button class="btn-sm primary" data-add="${p.id}">Add to cart</button>
               </div>
             </div>
           </div>
         </article>
       `;
     })
     .join("");
 
   QSA("[data-add]", host).forEach((btn) => {
     btn.addEventListener("click", () => addToCart(btn.getAttribute("data-add")));
   });
 
   QSA("[data-compare]", host).forEach((btn) => {
     btn.addEventListener("click", () => {
       const id = btn.getAttribute("data-compare");
       const url = new URL("compare.html", window.location.href);
       url.searchParams.set("id", id);
       window.location.href = url.toString();
     });
   });
 }
 
 function renderCart() {
   const listEl = QS("[data-cart-items]");
   const summaryEl = QS("[data-cart-summary]");
   if (!listEl || !summaryEl) return;
 
   const cart = getCart();
   const entries = Object.entries(cart)
     .map(([id, qty]) => ({ product: productById(id), qty: Number(qty) || 0 }))
     .filter((x) => x.product && x.qty > 0);
 
   if (entries.length === 0) {
     listEl.innerHTML = `<div class="empty">Your cart is empty. Add items from Food/Groceries/Products/E‑Products.</div>`;
     summaryEl.innerHTML = `
       <div class="panel-card">
         <h3 style="margin:0 0 8px;">Summary</h3>
         <div class="small muted">0 items</div>
         <div style="height:12px"></div>
         <div class="price">Total: ${formatINR(0)}</div>
         <div class="small muted">This is a demo checkout.</div>
       </div>
     `;
     return;
   }
 
   const subtotal = entries.reduce((sum, x) => sum + x.product.price * x.qty, 0);
   const itemsCount = entries.reduce((sum, x) => sum + x.qty, 0);
   
   const shipping = subtotal > 0 ? 50 : 0;
   const tax = Math.round(subtotal * 0.05);
   const finalTotal = subtotal + shipping + tax;
 
   listEl.innerHTML = entries
     .map(({ product, qty }) => {
       return `
         <div class="cart-item">
           <div>
             <div class="tag">${escapeHtml(product.category)}</div>
             <h3 style="margin:10px 0 4px; font-size:16px;">${escapeHtml(product.name)}</h3>
             <div class="small muted">${escapeHtml(product.unit || "")}</div>
             <div style="margin-top:8px;" class="price">${formatINR(product.price)} <span class="small muted">each</span></div>
           </div>
           <div style="display:flex; flex-direction:column; gap:10px; align-items:flex-end;">
             <div class="qty">
               <button data-dec="${product.id}" aria-label="Decrease quantity">−</button>
               <input data-qty="${product.id}" inputmode="numeric" value="${qty}" />
               <button data-inc="${product.id}" aria-label="Increase quantity">+</button>
             </div>
             <button class="btn-sm" data-remove="${product.id}">Remove</button>
           </div>
         </div>
       `;
     })
     .join("");
 
   summaryEl.innerHTML = `
     <div class="panel-card">
       <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid var(--stroke); padding-bottom:10px;">
         <h3 style="margin:0;">Order Summary</h3>
         <button class="btn-sm" data-clear-cart style="color:var(--accent);">Clear Cart</button>
       </div>
       
       <div class="checkout-form">
         <div class="checkout-field">
           <label for="checkout-phone">Phone Number</label>
           <input type="tel" id="checkout-phone" placeholder="+91 98765 43210" required />
         </div>
         <div class="checkout-field">
           <label for="checkout-email">Email Address</label>
           <input type="email" id="checkout-email" placeholder="you@example.com" required />
         </div>
       </div>

       <div style="display:grid; gap:8px; margin-top:16px;">
         <div style="display:flex; justify-content:space-between; color:var(--muted); font-size:14px;">
           <span>Items count:</span>
           <span>${itemsCount}</span>
         </div>
         <div style="display:flex; justify-content:space-between; color:var(--muted); font-size:14px;">
           <span>Subtotal:</span>
           <span>${formatINR(subtotal)}</span>
         </div>
         <div style="display:flex; justify-content:space-between; color:var(--muted); font-size:14px;">
           <span>Shipping:</span>
           <span>${formatINR(shipping)}</span>
         </div>
         <div style="display:flex; justify-content:space-between; color:var(--muted); font-size:14px;">
           <span>Tax (5%):</span>
           <span>${formatINR(tax)}</span>
         </div>
         <div style="display:flex; justify-content:space-between; font-weight:800; font-size:18px; margin-top:8px; padding-top:8px; border-top:1px solid var(--stroke);">
           <span>Total Amount:</span>
           <span class="price" style="color:#fff;">${formatINR(finalTotal)}</span>
         </div>
       </div>

       <div style="height:20px"></div>
       <div style="display:grid; gap:10px;">
         <button class="btn accent" data-checkout style="width:100%; padding:14px 16px; font-size:15px;">Purchase & Send Email</button>
       </div>
       <div style="height:12px"></div>
       <div class="small muted" style="text-align:center;">By clicking Purchase, you agree to our demo terms.</div>
     </div>
   `;
 
   QSA("[data-inc]").forEach((b) => b.addEventListener("click", () => setQty(b.dataset.inc, (Number(getCart()[b.dataset.inc]) || 0) + 1)));
   QSA("[data-dec]").forEach((b) => b.addEventListener("click", () => setQty(b.dataset.dec, (Number(getCart()[b.dataset.dec]) || 0) - 1)));
   QSA("[data-remove]").forEach((b) => b.addEventListener("click", () => removeFromCart(b.dataset.remove)));
   QS("[data-clear-cart]")?.addEventListener("click", () => { if(confirm("Clear all items?")) { setCart({}); renderCart(); } });
 
   QSA("[data-qty]").forEach((inp) => {
     inp.addEventListener("change", () => setQty(inp.dataset.qty, inp.value));
     inp.addEventListener("keydown", (e) => {
       if (e.key === "Enter") {
         e.preventDefault();
         setQty(inp.dataset.qty, inp.value);
       }
     });
   });
 
   const checkout = QS("[data-checkout]");
   if (checkout) {
     checkout.addEventListener("click", () => {
       const phone = QS("#checkout-phone").value.trim();
       const email = QS("#checkout-email").value.trim();

       if (!phone || !email || !email.includes("@")) {
         alert("Please enter a valid phone number and email address.");
         return;
       }
 
       const order_id = "QK-" + Math.floor(Math.random() * 1000000);
       const ordersArray = entries.map(x => ({
         name: x.product.name,
         units: x.qty,
         price: x.product.price * x.qty
       }));

       const isConfigured = typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY";
 
       if (isConfigured) {
         checkout.disabled = true;
         checkout.textContent = "Sending Email...";
 
         const templateParams = {
           to_email: email, 
           to_name: "Valued Customer",
           order_id: order_id,
           orders: ordersArray,
           cost_shipping: shipping, 
           cost_tax: tax,
           cost_total: finalTotal,
           user_phone: phone,
           user_email: email,
           reply_to: email 
         };
         
         console.log("EmailJS Send Attempt:", { service: EMAILJS_SERVICE_ID, template: EMAILJS_TEMPLATE_ID, params: templateParams });
 
         emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
           .then(() => {
             alert(`SUCCESS!\n\nOrder confirmation sent to: ${email}`);
             saveOrderToHistory(order_id, phone, email, finalTotal, itemsCount);
             setCart({});
             renderCart();
           })
           .catch((err) => {
             console.error("EmailJS Error:", err);
             const errorMsg = err.text || (err.status === 422 ? "Check template parameters (to_email, orders, etc.)" : "Check console for details");
             alert("Email failed: " + errorMsg);
             checkout.disabled = false;
             checkout.textContent = "Purchase & Send Email";
           });
       } else {
         alert(`Simulation: Order QK-${order_id} confirmed for ${email}.\nTotal: ${formatINR(finalTotal)}`);
         saveOrderToHistory(order_id, phone, email, finalTotal, itemsCount);
         setCart({});
         renderCart();
       }
     });
   }
 }

 function saveOrderToHistory(id, phone, email, total, itemsCount) {
   const orders = JSON.parse(localStorage.getItem('quickkart_orders_v1') || '[]');
   orders.push({
     id,
     phone,
     email,
     total,
     itemsCount,
     timestamp: new Date().toISOString()
   });
   localStorage.setItem('quickkart_orders_v1', JSON.stringify(orders));
 }
 
function buildCompareLinksForProduct(p) {
  const q = encodeURIComponent(p.name);
  const name = p.name.toLowerCase();
  const isFood = p.category === "Food";
 
  if (isFood) {
    const links = [
      { site: "Swiggy", hint: "Search Swiggy", url: `https://www.swiggy.com/search?query=${q}` },
      { site: "Zomato", hint: "Search Zomato", url: `https://www.zomato.com/search?q=${q}` },
      { site: "Uber Eats", hint: "Search Uber Eats (web)", url: `https://www.ubereats.com/search?q=${q}` },
    ];
 
    if (name.includes("pizza")) {
      links.push({ site: "Domino's", hint: "Search Domino's", url: `https://www.dominos.co.in/menu?search=${q}` });
    }
 
    if (name.includes("chicken") || name.includes("fried") || name.includes("kfc")) {
      links.push({ site: "KFC", hint: "Search KFC", url: `https://online.kfc.co.in/search?query=${q}` });
    }
 
    if (name.includes("shawarma") || name.includes("shwarma") || name.includes("wrap") || name.includes("roll")) {
      links.push({ site: "Swiggy (Shawarma)", hint: "Try shawarma results", url: `https://www.swiggy.com/search?query=shawarma` });
    }
 
    return links;
  }
 
  // Non-food (keep earlier style)
  return [
    { site: "Amazon", hint: "Search Amazon", url: `https://www.amazon.in/s?k=${q}` },
    { site: "Flipkart", hint: "Search Flipkart", url: `https://www.flipkart.com/search?q=${q}` },
    { site: "Blinkit", hint: "Search Blinkit", url: `https://blinkit.com/s/?q=${q}` },
  ];
}
 
 function renderCompare() {
   const select = QS("[data-compare-select]");
   const linksHost = QS("[data-compare-links]");
   const note = QS("[data-compare-note]");
   if (!select || !linksHost) return;
 
   select.innerHTML = `<option value="">Choose a product…</option>` + PRODUCTS
     .slice()
     .sort((a, b) => a.name.localeCompare(b.name))
     .map((p) => `<option value="${p.id}">${escapeHtml(p.name)} (${escapeHtml(p.category)})</option>`)
     .join("");
 
   const url = new URL(window.location.href);
   const pre = url.searchParams.get("id");
   if (pre && productById(pre)) select.value = pre;
 
   const draw = () => {
     const id = select.value;
     const p = productById(id);
     if (!p) {
       linksHost.innerHTML = `<div class="empty">Select a product to generate comparison links.</div>`;
       if (note) note.textContent = "Tip: You can click any link to check price on that site.";
       return;
     }
 
    const links = buildCompareLinksForProduct(p);
     linksHost.innerHTML = links
       .map((x) => {
         return `
           <div class="link-row">
             <div>
               <div style="font-weight:900;">${escapeHtml(x.site)}</div>
               <div class="small">${escapeHtml(x.hint)}</div>
             </div>
             <div style="display:flex; gap:8px; align-items:center;">
               <a href="${x.url}" target="_blank" rel="noreferrer">Open</a>
             </div>
           </div>
         `;
       })
       .join("");
 
    if (note) {
      note.textContent =
        p.category === "Food"
          ? "Food compare uses Swiggy/Zomato/Uber Eats (plus Domino's/KFC for some items)."
          : "Note: Live price fetching is blocked in static sites (CORS). This page generates safe search links instead.";
    }
   };
 
   select.addEventListener("change", () => {
     const u = new URL(window.location.href);
     if (select.value) u.searchParams.set("id", select.value);
     else u.searchParams.delete("id");
     window.history.replaceState({}, "", u.toString());
     draw();
   });
 
   draw();
 }
 
 function wireNavActive() {
   const page = document.body.getAttribute("data-page") || "";
   QSA("[data-nav]").forEach((a) => {
     if (a.getAttribute("data-nav") === page) a.classList.add("active");
   });
 }
 
 function wireGlobalSearch() {
   const homeSearch = QS("[data-home-search]");
   if (!homeSearch) return;
 
   homeSearch.addEventListener("keydown", (e) => {
     if (e.key === "Enter") {
       const q = homeSearch.value.trim();
       const url = new URL("products.html", window.location.href);
       if (q) url.searchParams.set("q", q);
       window.location.href = url.toString();
     }
   });
 }
 
 function wireListingControls(category) {
   const qInput = QS("[data-search]");
   const sortSel = QS("[data-sort]");
  const foodSub = QS("[data-food-subcat]");
  const subcatBtns = QSA("[data-subcat-btn]");
 
   const url = new URL(window.location.href);
   if (qInput) qInput.value = url.searchParams.get("q") || "";
   if (sortSel) sortSel.value = url.searchParams.get("sort") || "popular";
  if (foodSub) foodSub.value = url.searchParams.get("sub") || "";
 
   const run = () => {
    const activeSub = foodSub ? foodSub.value : "";
    subcatBtns.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-subcat-btn") === activeSub);
    });

     renderProducts({
       category,
      subCategory: activeSub || null,
       query: qInput ? qInput.value : "",
       sort: sortSel ? sortSel.value : "popular",
     });
   };
 
   if (qInput) qInput.addEventListener("input", run);
   if (sortSel) sortSel.addEventListener("change", () => {
     const u = new URL(window.location.href);
     if (sortSel.value) u.searchParams.set("sort", sortSel.value);
     window.history.replaceState({}, "", u.toString());
     run();
   });

  if (foodSub) {
    foodSub.addEventListener("change", () => {
      const u = new URL(window.location.href);
      if (foodSub.value) u.searchParams.set("sub", foodSub.value);
      else u.searchParams.delete("sub");
      window.history.replaceState({}, "", u.toString());
      run();
    });
  }

  subcatBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-subcat-btn");
      if (foodSub) {
        foodSub.value = val;
        foodSub.dispatchEvent(new Event("change"));
      }
    });
  });
 
   run();
 }
 
 function escapeHtml(s) {
   return String(s)
     .replaceAll("&", "&amp;")
     .replaceAll("<", "&lt;")
     .replaceAll(">", "&gt;")
     .replaceAll('"', "&quot;")
     .replaceAll("'", "&#039;");
 }
 
 function initPage() {
   wireNavActive();
   updateCartBadge();
   wireGlobalSearch();
 
   const page = document.body.getAttribute("data-page") || "";
 
   if (page === "home") {
     const q = QS("[data-home-search]");
     const go = (path) => (window.location.href = new URL(path, window.location.href).toString());
     QSA("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));
     if (q) q.focus();
   }
 
   if (page === "food") wireListingControls("Food");
   if (page === "groceries") wireListingControls("Groceries");
   if (page === "products") wireListingControls("Products");
   if (page === "eproducts") wireListingControls("E-Products");
   if (page === "compare") renderCompare();
   if (page === "cart") renderCart();
 
   window.addEventListener("storage", (e) => {
     if (e.key === STORE_KEY) {
       updateCartBadge();
       if (page === "cart") renderCart();
     }
   });
 }
 
 document.addEventListener("DOMContentLoaded", initPage);
