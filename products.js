const productLists = document.querySelectorAll('[data-product-list]');

const formatPrice = (price) => {
  const numericPrice = Number(price);
  return Number.isFinite(numericPrice)
    ? `${new Intl.NumberFormat('ko-KR').format(numericPrice)}원`
    : String(price);
};

const createProductCard = (product) => {
  const article = document.createElement('article');
  article.className = 'catalog-card reveal is-visible';

  const imageLink = document.createElement('a');
  imageLink.className = 'catalog-card-image';
  imageLink.href = product.url;
  imageLink.target = '_blank';
  imageLink.rel = 'noopener noreferrer';
  imageLink.setAttribute('aria-label', `${product.name} 구매 페이지 열기`);

  const image = document.createElement('img');
  image.src = product.image;
  image.alt = product.name;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.addEventListener('error', () => {
    if (!image.dataset.fallback) {
      image.dataset.fallback = 'true';
      image.src = 'assets/abrahammoon-merino-muffler.png';
    }
  });
  imageLink.append(image);

  const content = document.createElement('div');
  content.className = 'catalog-card-content';

  const title = document.createElement('h3');
  title.textContent = product.name;

  const footer = document.createElement('div');
  footer.className = 'catalog-card-footer';

  const price = document.createElement('p');
  price.textContent = formatPrice(product.price);

  const buyLink = document.createElement('a');
  buyLink.href = product.url;
  buyLink.target = '_blank';
  buyLink.rel = 'noopener noreferrer';
  buyLink.textContent = '구매하기';
  buyLink.setAttribute('aria-label', `${product.name} 구매하기 (새 탭)`);

  footer.append(price, buyLink);
  content.append(title, footer);
  article.append(imageLink, content);
  return article;
};

const renderProducts = (container, products) => {
  const limit = Number(container.dataset.limit);
  const featuredPatterns = ['머플러 25cm', '숄 70cm', '블랭킷'];
  const featuredProducts = featuredPatterns
    .map((pattern) => products.find((product) => product.name.includes(pattern)))
    .filter(Boolean);
  const sourceProducts = container.hasAttribute('data-featured') && featuredProducts.length
    ? featuredProducts
    : products;
  const visibleProducts = Number.isFinite(limit) && limit > 0
    ? sourceProducts.slice(0, limit)
    : sourceProducts;

  container.replaceChildren(...visibleProducts.map(createProductCard));
};

const loadProducts = async () => {
  if (!productLists.length) return;

  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error(`상품 데이터를 불러오지 못했습니다: ${response.status}`);
    const data = await response.json();
    const products = Array.isArray(data.products) ? data.products : [];

    productLists.forEach((container) => renderProducts(container, products));
    document.querySelectorAll('[data-product-count]').forEach((element) => {
      element.textContent = new Intl.NumberFormat('ko-KR').format(products.length);
    });
  } catch (error) {
    productLists.forEach((container) => {
      const message = document.createElement('p');
      message.className = 'catalog-message';
      message.textContent = '상품 정보를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.';
      container.replaceChildren(message);
    });
    console.error(error);
  }
};

loadProducts();
