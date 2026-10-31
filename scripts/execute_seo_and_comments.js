const fs = require('fs');
const path = require('path');

// 1. JS comment stripper function (safe state machine)
function stripJsComments(code) {
  let result = '';
  let i = 0;
  const n = code.length;
  let inString = false;
  let stringChar = '';
  let inRegex = false;
  let inBlockComment = false;
  let inLineComment = false;

  while (i < n) {
    const c = code[i];
    const next = code[i + 1];

    if (inLineComment) {
      if (c === '\n') {
        inLineComment = false;
        result += c;
      }
      i++;
      continue;
    }

    if (inBlockComment) {
      if (c === '*' && next === '/') {
        inBlockComment = false;
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    if (inString) {
      result += c;
      if (c === '\\') {
        result += next || '';
        i += 2;
        continue;
      }
      if (c === stringChar) {
        inString = false;
      }
      i++;
      continue;
    }

    if (inRegex) {
      result += c;
      if (c === '\\') {
        result += next || '';
        i += 2;
        continue;
      }
      if (c === '/') {
        inRegex = false;
      }
      i++;
      continue;
    }

    if (c === '"' || c === "'" || c === '`') {
      inString = true;
      stringChar = c;
      result += c;
      i++;
      continue;
    }

    if (c === '/' && next === '/') {
      inLineComment = true;
      i += 2;
      continue;
    }

    if (c === '/' && next === '*') {
      inBlockComment = true;
      i += 2;
      continue;
    }

    if (c === '/') {
      const prevNonWhitespace = result.trimEnd().slice(-1);
      if (/[\(\[,:=!&|;?\{\}]/.test(prevNonWhitespace) || /(return|case|delete|typeof|void)$/.test(result.trimEnd())) {
        inRegex = true;
        result += c;
        i++;
        continue;
      }
    }

    result += c;
    i++;
  }

  return result;
}

// 2. CSS comment stripper function
function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

// 3. HTML comment stripper function
function stripHtmlComments(html) {
  // Remove HTML comments <!-- ... -->
  let cleaned = html.replace(/<!--[\s\S]*?-->/g, '');

  // Clean inline styles
  cleaned = cleaned.replace(/(<style[\s\S]*?>)([\s\S]*?)(<\/style>)/gi, (m, open, styleBody, close) => {
    return open + stripCssComments(styleBody) + close;
  });

  // Clean inline scripts (skip ld+json)
  cleaned = cleaned.replace(/(<script(?![^>]*ld\+json)[\s\S]*?>)([\s\S]*?)(<\/script>)/gi, (m, open, scriptBody, close) => {
    return open + stripJsComments(scriptBody) + close;
  });

  return cleaned;
}

// 4. SEO metadata
const SEO_REGISTRY = {
  'index.html': {
    title: 'Купить теплицу из поликарбоната в Ярославле от производителя — цены с доставкой и сборкой | Теплицы ТУТ',
    description: 'Производство и продажа усиленных теплиц из поликарбоната и оцинкованных грядок в Ярославле и области от завода «Теплицы ТУТ». Честная труба 30×20 мм на ребро, 0 ₽ предоплаты, доставка и сборка под ключ, гарантия до 10 лет.',
    keywords: 'купить теплицу ярославль, теплицы из поликарбоната ярославль от производителя, усиленная теплица 3х6 3х4 цена, оцинкованные грядки, теплицы тут ярославль',
    url: 'https://teplicy-tut.ru/',
    image: 'https://teplicy-tut.ru/assets/images/products/arch_3x4/1.jpg',
    breadcrumbs: []
  },
  'arochnye.html': {
    title: 'Арочные теплицы из поликарбоната от производителя в Ярославле — цены от 25 500 ₽ | Теплицы ТУТ',
    description: 'Усиленные арочные теплицы 3х4, 3х6, 3х8, 3х10 м из оцинкованной трубы 30×20 мм на ребро. Толщина металла 1.0 мм, поликарбонат 4 мм с УФ-защитой, 2 двери и 2 форточки. Доставка и сборка без предоплаты.',
    keywords: 'арочная теплица купить ярославль, теплица 3х4 3х6 3х8 3х10 оцинкованная, теплица из поликарбоната от производителя цена',
    url: 'https://teplicy-tut.ru/arochnye.html',
    image: 'https://teplicy-tut.ru/assets/images/products/arch_3x4/1.jpg',
    breadcrumbs: [
      { name: 'Каталог', url: 'https://teplicy-tut.ru/#katalog' },
      { name: 'Арочные теплицы', url: 'https://teplicy-tut.ru/arochnye.html' }
    ],
    product: {
      name: 'Арочная теплица оцинкованная 30×20 мм',
      description: 'Усиленная арочная теплица из профильной оцинкованной трубы 30×20 мм на ребро. Поликарбонат 4 мм с УФ-защитой, 2 двери, 2 форточки.',
      lowPrice: 25500,
      highPrice: 38500,
      image: 'https://teplicy-tut.ru/assets/images/products/arch_3x4/1.jpg'
    }
  },
  'kaplevidnye.html': {
    title: 'Каплевидные теплицы «Капелька» 3 м усиленные — цены от 26 500 ₽ от завода | Теплицы ТУТ',
    description: 'Купить теплицу «Капелька» с заостренной крышей: снег скатывается сам! Оцинкованная труба 30×20 мм на ребро, поликарбонат 4 мм с УФ-защитой. Доставка по Ярославской, Ивановской и Костромской областям без предоплаты.',
    keywords: 'теплица капелька ярославль, каплевидная теплица купить цена, теплица со снегосбросом от производителя',
    url: 'https://teplicy-tut.ru/kaplevidnye.html',
    image: 'https://teplicy-tut.ru/assets/images/products/kapelka/1.jpg',
    breadcrumbs: [
      { name: 'Каталог', url: 'https://teplicy-tut.ru/#katalog' },
      { name: 'Каплевидные теплицы', url: 'https://teplicy-tut.ru/kaplevidnye.html' }
    ],
    product: {
      name: 'Каплевидная теплица «Капелька»',
      description: 'Теплица со стрельчатой крышей для эффективного схода снега. Профиль 30×20 мм, 2 двери, 2 форточки.',
      price: 26500,
      image: 'https://teplicy-tut.ru/assets/images/products/kapelka/1.jpg'
    }
  },
  'domikom.html': {
    title: 'Прямостенные теплицы «Домиком» из оцинкованной трубы — цены от производителя | Теплицы ТУТ',
    description: 'Купить прямостенную теплицу «Домиком» из оцинкованной трубы в Ярославле. Вертикальные стены для удобного выращивания высокорослых растений и максимального объема. Доставка и сборка.',
    keywords: 'теплица домиком прямостенная ярославль, прямостенная теплица из поликарбоната купить от производителя',
    url: 'https://teplicy-tut.ru/domikom.html',
    image: 'https://teplicy-tut.ru/assets/images/products/p2/2.jpg',
    breadcrumbs: [
      { name: 'Каталог', url: 'https://teplicy-tut.ru/#katalog' },
      { name: 'Теплицы «Домиком»', url: 'https://teplicy-tut.ru/domikom.html' }
    ],
    product: {
      name: 'Прямостенная теплица «Домиком»',
      description: 'Теплица с прямыми боковыми стенами и двухскатной крышей для максимального полезного объема.',
      price: 28500,
      image: 'https://teplicy-tut.ru/assets/images/products/p2/2.jpg'
    }
  },
  'gryadki.html': {
    title: 'Оцинкованные грядки в теплицу и открытый грунт — купить в Ярославле от 1 550 ₽, комплекты от 6 000 ₽ | Теплицы ТУТ',
    description: 'Купить оцинкованные металлические грядки от производителя. Готовые комплекты в теплицу 3×4 м (6 000 ₽) и 3×6 м (9 500 ₽), штучные грядки высотой 150 и 200 мм от 1 550 ₽. Завальцованные края, перемычка через каждый метр.',
    keywords: 'оцинкованные грядки ярославль, комплект грядок в теплицу 3х4 3х6 цена, металлические грядки купить от производителя',
    url: 'https://teplicy-tut.ru/gryadki.html',
    image: 'https://teplicy-tut.ru/assets/images/products/gryadki/gryadki_3x6.jpg',
    breadcrumbs: [
      { name: 'Каталог', url: 'https://teplicy-tut.ru/#katalog' },
      { name: 'Оцинкованные грядки', url: 'https://teplicy-tut.ru/gryadki.html' }
    ],
    product: {
      name: 'Оцинкованные грядки для теплиц и открытого грунта',
      description: 'Готовые комплекты грядок для теплиц 3×4 и 3×6 м, а также штучные грядки высотой борта 150 и 200 мм.',
      lowPrice: 1550,
      highPrice: 9500,
      image: 'https://teplicy-tut.ru/assets/images/products/gryadki/gryadki_3x6.jpg'
    }
  },
  'polikarbonat.html': {
    title: 'Сотовый поликарбонат 4 мм и 6 мм Eurotek для теплиц — цены от 3 500 ₽ за лист | Теплицы ТУТ',
    description: 'Купить сотовый поликарбонат Eurotek 4 мм (3 500 ₽) и 6 мм (4 700 ₽) в Ярославле. Плотность 0,52, слой УФ-защиты, не желтеет, 15 лет гарантия. Продажа от 3 листов, замена обшивки под ключ.',
    keywords: 'сотовый поликарбонат купить ярославль, поликарбонат 4 мм 6 мм eurotek цена за лист, замена поликарбоната на теплице',
    url: 'https://teplicy-tut.ru/polikarbonat.html',
    image: 'https://teplicy-tut.ru/assets/images/products/poly/eurotek_4mm.jpg',
    breadcrumbs: [
      { name: 'Каталог', url: 'https://teplicy-tut.ru/#katalog' },
      { name: 'Сотовый поликарбонат', url: 'https://teplicy-tut.ru/polikarbonat.html' }
    ],
    product: {
      name: 'Сотовый поликарбонат Eurotek с УФ-защитой',
      description: 'Качественный сотовый поликарбонат 4 мм и 6 мм Eurotek для теплиц и навесов. Заводская гарантия 15 лет.',
      lowPrice: 3500,
      highPrice: 4700,
      image: 'https://teplicy-tut.ru/assets/images/products/poly/eurotek_4mm.jpg'
    }
  },
  'dostavka-sborka.html': {
    title: 'Доставка и сборка теплиц под ключ, фундамент из бруса 100х100 от 6 000 ₽ | Теплицы ТУТ',
    description: 'Бережная доставка и монтаж теплиц опытными бригадами за 3-4 часа по Ярославской, Костромской и Ивановской областям. Фундамент из пропитанного бруса 100×100 от 6 000 ₽. Оплата после приемки!',
    keywords: 'доставка теплиц ярославль, сборка теплицы цена под ключ, фундамент из бруса для теплицы 100х100 купить',
    url: 'https://teplicy-tut.ru/dostavka-sborka.html',
    image: 'https://teplicy-tut.ru/assets/images/products/foundation/brus_1.jpg',
    breadcrumbs: [
      { name: 'Услуги', url: 'https://teplicy-tut.ru/#services' },
      { name: 'Доставка и сборка', url: 'https://teplicy-tut.ru/dostavka-sborka.html' }
    ]
  },
  'nashi-raboty.html': {
    title: 'Реальные фото установленных теплиц на участках — наши работы | Теплицы ТУТ',
    description: 'Фотографии установленных арочных и каплевидных теплиц, фундаментов из бруса и грядок в Ярославле, Рыбинске, Тутаеве и Костроме. Реальные объекты наших клиентов.',
    keywords: 'теплицы фото на участке, установленные теплицы ярославль примеры работ, отзывы теплицы тут',
    url: 'https://teplicy-tut.ru/nashi-raboty.html',
    image: 'https://teplicy-tut.ru/assets/images/products/arch_3x6/1.jpg',
    breadcrumbs: [
      { name: 'О компании', url: 'https://teplicy-tut.ru/' },
      { name: 'Наши работы', url: 'https://teplicy-tut.ru/nashi-raboty.html' }
    ]
  },
  'otzyvy.html': {
    title: 'Отзывы покупателей о теплицах и сборке — честные оценки садоводов | Теплицы ТУТ',
    description: 'Отзывы дачников и садоводов о теплицах завода «Теплицы ТУТ». Оценка качества каркаса, поликарбоната и профессиональной сборки. Рейтинг 4.9 из 5 на основе 128 отзывов.',
    keywords: 'теплицы тут отзывы, отзывы о теплицах из поликарбоната ярославль, производитель теплиц рейтинг',
    url: 'https://teplicy-tut.ru/otzyvy.html',
    image: 'https://teplicy-tut.ru/assets/images/teplica.png',
    breadcrumbs: [
      { name: 'О компании', url: 'https://teplicy-tut.ru/' },
      { name: 'Отзывы', url: 'https://teplicy-tut.ru/otzyvy.html' }
    ]
  },
  'kontakty.html': {
    title: 'Контакты завода «Теплицы ТУТ» в Ярославле — телефон, адрес склада, выставка',
    description: 'Контакты производителя теплиц «Теплицы ТУТ»: г. Ярославль, ул. Промышленная, д. 12. Ежедневно с 8:00 до 20:00 без выходных. Консультации и расчет стоимости по телефону.',
    keywords: 'теплицы тут ярославль телефон адрес, склад теплиц ярославль, выставка теплиц часы работы',
    url: 'https://teplicy-tut.ru/kontakty.html',
    image: 'https://teplicy-tut.ru/assets/images/logo_teplicy_tut.png',
    breadcrumbs: [
      { name: 'Главная', url: 'https://teplicy-tut.ru/' },
      { name: 'Контакты', url: 'https://teplicy-tut.ru/kontakty.html' }
    ]
  },
  'preimushchestva.html': {
    title: 'Преимущества завода «Теплицы ТУТ» — честная оцинковка, 0 ₽ предоплаты, гарантия 10 лет',
    description: 'Почему дачники выбирают «Теплицы ТУТ»: оцинкованный профиль 30×20 мм на ребро, толщина металла 1.0 мм, честный поликарбонат с УФ-защитой, бесплатное зимнее хранение и оплата при получении.',
    keywords: 'производство теплиц ярославль преимущества, заводские теплицы из оцинкованной трубы, гарантия на теплицу',
    url: 'https://teplicy-tut.ru/preimushchestva.html',
    image: 'https://teplicy-tut.ru/assets/images/teplica.png',
    breadcrumbs: [
      { name: 'О компании', url: 'https://teplicy-tut.ru/' },
      { name: 'Преимущества', url: 'https://teplicy-tut.ru/preimushchestva.html' }
    ]
  }
};

function generateHeadTags(meta, filename) {
  let breadcrumbJson = '';
  if (meta.breadcrumbs && meta.breadcrumbs.length > 0) {
    const items = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://teplicy-tut.ru/"
      }
    ];
    meta.breadcrumbs.forEach((b, idx) => {
      items.push({
        "@type": "ListItem",
        "position": idx + 2,
        "name": b.name,
        "item": b.url
      });
    });
    breadcrumbJson = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    });
  }

  let productJson = '';
  if (meta.product) {
    const prodObj = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": meta.product.name,
      "image": meta.product.image,
      "description": meta.product.description,
      "brand": {
        "@type": "Brand",
        "name": "Теплицы ТУТ"
      }
    };
    if (meta.product.price) {
      prodObj.offers = {
        "@type": "Offer",
        "url": meta.url,
        "priceCurrency": "RUB",
        "price": meta.product.price,
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      };
    } else if (meta.product.lowPrice) {
      prodObj.offers = {
        "@type": "AggregateOffer",
        "url": meta.url,
        "priceCurrency": "RUB",
        "lowPrice": meta.product.lowPrice,
        "highPrice": meta.product.highPrice,
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      };
    }
    productJson = JSON.stringify(prodObj);
  }

  return `  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}">
  <meta name="keywords" content="${meta.keywords}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${meta.url}">
  <link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg">
  <link rel="stylesheet" href="assets/fonts/fonts.css">
  <link rel="stylesheet" href="assets/css/style.css?v=3.2">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">

  <meta property="og:locale" content="ru_RU">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Теплицы ТУТ">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:url" content="${meta.url}">
  <meta property="og:image" content="${meta.image}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${meta.image}">

  <meta name="geo.region" content="RU-YAR">
  <meta name="geo.placename" content="Ярославль">
  <meta name="geo.position" content="57.6521;39.8543">
  <meta name="ICBM" content="57.6521, 39.8543">${breadcrumbJson ? `\n  <script type="application/ld+json">\n  ${breadcrumbJson}\n  </script>` : ''}${productJson ? `\n  <script type="application/ld+json">\n  ${productJson}\n  </script>` : ''}`;
}

// 5. Process CSS files
const cssFiles = ['assets/css/style.css', 'assets/fonts/fonts.css', 'admin/admin.css'];
cssFiles.forEach(f => {
  if (fs.existsSync(f)) {
    const original = fs.readFileSync(f, 'utf8');
    const cleaned = stripCssComments(original);
    fs.writeFileSync(f, cleaned, 'utf8');
    console.log(`Cleaned CSS comments from ${f} (${original.length} -> ${cleaned.length} bytes)`);
  }
});

// 6. Process JS files
const jsFiles = ['assets/js/main.js', 'assets/js/catalog-data.js', 'admin/admin.js'];
jsFiles.forEach(f => {
  if (fs.existsSync(f)) {
    const original = fs.readFileSync(f, 'utf8');
    const cleaned = stripJsComments(original);
    fs.writeFileSync(f, cleaned, 'utf8');
    console.log(`Cleaned JS comments from ${f} (${original.length} -> ${cleaned.length} bytes)`);
  }
});

// 7. Process HTML files
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
htmlFiles.forEach(f => {
  let html = fs.readFileSync(f, 'utf8');
  const meta = SEO_REGISTRY[f];

  if (meta) {
    // Replace <head> content
    const headOpenIdx = html.indexOf('<head>');
    const headCloseIdx = html.indexOf('</head>');
    if (headOpenIdx !== -1 && headCloseIdx !== -1) {
      let existingHead = html.substring(headOpenIdx + 6, headCloseIdx);
      // If index.html, keep organization JSON-LD
      let orgSchema = '';
      if (f === 'index.html') {
        const schemaMatch = existingHead.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i);
        if (schemaMatch) {
          orgSchema = '\n' + schemaMatch[0];
        }
      }
      const newHeadContent = '\n' + generateHeadTags(meta, f) + orgSchema + '\n';
      html = html.substring(0, headOpenIdx + 6) + newHeadContent + html.substring(headCloseIdx);
    }
  }

  // Strip all comments from HTML
  const originalLen = html.length;
  html = stripHtmlComments(html);
  fs.writeFileSync(f, html, 'utf8');
  console.log(`Updated SEO and stripped comments from ${f} (${originalLen} -> ${html.length} bytes)`);
});

// 8. Update robots.txt
const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin-gate-x79kd4.html
Disallow: /scratch/
Disallow: /scripts/
Disallow: /*?*
Disallow: /*&

User-agent: Yandex
Allow: /
Disallow: /admin/
Disallow: /admin-gate-x79kd4.html
Disallow: /scratch/
Disallow: /scripts/
Disallow: /*?*
Disallow: /*&
Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&gclid&fbclid /

User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /admin-gate-x79kd4.html
Disallow: /scratch/
Disallow: /scripts/
Disallow: /*?*
Disallow: /*&

Host: https://teplicy-tut.ru
Sitemap: https://teplicy-tut.ru/sitemap.xml
`;
fs.writeFileSync('robots.txt', robotsTxt, 'utf8');
console.log('Updated robots.txt with top-tier Yandex & Google directives');

// 9. Update sitemap.xml with image extensions and all pages
const today = new Date().toISOString().split('T')[0];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://teplicy-tut.ru/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://teplicy-tut.ru/assets/images/products/arch_3x4/1.jpg</image:loc>
      <image:title>Теплицы из поликарбоната от производителя в Ярославле</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://teplicy-tut.ru/arochnye.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://teplicy-tut.ru/assets/images/products/arch_3x4/1.jpg</image:loc>
      <image:title>Арочная оцинкованная теплица 3х4 м</image:title>
    </image:image>
    <image:image>
      <image:loc>https://teplicy-tut.ru/assets/images/products/arch_3x6/1.jpg</image:loc>
      <image:title>Арочная оцинкованная теплица 3х6 м</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://teplicy-tut.ru/kaplevidnye.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://teplicy-tut.ru/assets/images/products/kapelka/1.jpg</image:loc>
      <image:title>Каплевидная теплица Капелька со снегосбросом</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://teplicy-tut.ru/domikom.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://teplicy-tut.ru/assets/images/products/p2/2.jpg</image:loc>
      <image:title>Прямостенная теплица Домиком</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://teplicy-tut.ru/gryadki.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://teplicy-tut.ru/assets/images/products/gryadki/gryadki_3x6.jpg</image:loc>
      <image:title>Комплект оцинкованных грядок для теплицы 3х6 м</image:title>
    </image:image>
    <image:image>
      <image:loc>https://teplicy-tut.ru/assets/images/products/gryadki/gryadki_3x4.jpg</image:loc>
      <image:title>Комплект оцинкованных грядок для теплицы 3х4 м</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://teplicy-tut.ru/polikarbonat.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://teplicy-tut.ru/assets/images/products/poly/eurotek_4mm.jpg</image:loc>
      <image:title>Сотовый поликарбонат 4 мм Eurotek</image:title>
    </image:image>
    <image:image>
      <image:loc>https://teplicy-tut.ru/assets/images/products/poly/eurotek_6mm.jpg</image:loc>
      <image:title>Сотовый поликарбонат 6 мм Eurotek</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://teplicy-tut.ru/dostavka-sborka.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://teplicy-tut.ru/assets/images/products/foundation/brus_1.jpg</image:loc>
      <image:title>Фундамент для теплиц из бруса 100х100</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://teplicy-tut.ru/nashi-raboty.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://teplicy-tut.ru/otzyvy.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://teplicy-tut.ru/preimushchestva.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://teplicy-tut.ru/kontakty.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
`;
fs.writeFileSync('sitemap.xml', sitemapXml, 'utf8');
console.log('Updated sitemap.xml with image schemas and updated lastmod');
