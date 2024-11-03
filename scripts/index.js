$.getJSON("assets/data/products.json", (data) => {
  const carousel = $("#carousel-component");
  if (!carousel) return;
  let toAppend = "";

  data.forEach((product, i) => {
    if (i % 4 === 0) {
      toAppend += 
        `<div class="carousel-item ${i === 0 ? "active" : ""}">
          <div class="row m-1">`;
    }

    toAppend += productToCard(product, i);

    if (i % 4 === 3) {
      toAppend += "</div></div>";
      carousel.append(toAppend);
      toAppend = "";
    }
  });
});

function productToCard(product, i) {
  const isModel = i === 0;
  const finalPrice = product.discount ? (product.price - product.discount).toFixed(2) : product.price.toFixed(2);
  const originalPrice = product.discount ? product.price.toFixed(2) : undefined;

  return `
    <div class="col card">
      <a href="${isModel ? "details.html" : "#"}" class="stretched-link"></a>
      <img src="assets/images/products/${product.image}" class="d-block w-100" alt="${product.name}">
        <div class="card-info">
          <h5 class="text-break">${product.name}</h5>
          <div class="price-div">
           <span class="price fw-bold">${finalPrice}€</span>
           ${originalPrice  ? `<span class="original-price fw-ligh"><strike>${originalPrice}€</strike></span>` : ""}
           ${originalPrice  ? `<span class="discount">- ${product.discount}%</span>` : ""}
        </div>
      </div>
    </div>
  `;
}
