(() => {
  const buttons = [...document.querySelectorAll('.bundle')];
  const qtyInput = document.getElementById('quantityInput');
  const totalInput = document.getElementById('bundleTotalInput');
  const totalText = document.getElementById('checkoutTotal');
  const money = (value) => Number(value).toLocaleString('sl-SI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const qty = button.dataset.qty;
      const total = button.dataset.total;
      qtyInput.value = qty;
      totalInput.value = total;
      totalText.textContent = money(total);
    });
  });
})();
