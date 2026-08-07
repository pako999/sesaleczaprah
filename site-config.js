window.STORE_CONFIG = {
  originalPrice: "24,90 €",
  price: "14,90 €",
  currency: "EUR",
  volumeOffers: [
    { quantity: 1, discount: 0, total: 14.90, unit: 14.90 },
    { quantity: 2, discount: 10, total: 26.82, unit: 13.41 },
    { quantity: 3, discount: 20, total: 35.76, unit: 11.92 },
    { quantity: 5, discount: 30, total: 52.15, unit: 10.43 },
    { quantity: 10, discount: 35, total: 96.85, unit: 9.685 }
  ],
  checkoutUrl: "",
  contactEmail: "info@example.com"
};

// Compatibility elements expected by app.js. Kept invisible because the real sale price is rendered in the page.
(() => {
  const box = document.createElement('div');
  box.id = 'priceBox';
  box.style.display = 'none';
  const price = document.createElement('span');
  price.id = 'priceText';
  box.appendChild(price);
  document.body.appendChild(box);
})();
