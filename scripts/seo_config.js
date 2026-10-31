const fs = require('fs');
const path = require('path');

// 1. Page SEO Metadata registry
const SEO_PAGES = {
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

console.log('SEO metadata configured for', Object.keys(SEO_PAGES).length, 'pages');
