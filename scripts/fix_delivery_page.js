const fs = require('fs');

let html = fs.readFileSync('dostavka-sborka.html', 'utf8');

// 1. Add responsive CSS for delivery grids and cards
const cssInsert = `
    /* Адаптив для карточек доставки и шагов (чтобы не выезжали на мобильных) */
    @media (max-width: 960px) {
      .delivery-features-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 14px !important;
      }
      .del-steps-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 14px !important;
      }
      .delivery-regions-grid {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
      }
      .delivery-map-container {
        height: 320px !important;
      }
    }

    @media (max-width: 580px) {
      .delivery-features-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }
      .del-feat-card {
        padding: 18px 16px !important;
        border-radius: 16px !important;
      }
      .del-steps-grid {
        grid-template-columns: 1fr !important;
        gap: 10px !important;
      }
      .del-steps-card {
        padding: 20px 14px !important;
        border-radius: 18px !important;
        margin-bottom: 25px !important;
      }
      .delivery-regions-box {
        padding: 18px 12px !important;
        border-radius: 18px !important;
        margin-bottom: 25px !important;
      }
      .delivery-map-container {
        height: 280px !important;
        border-radius: 14px !important;
      }
      .delivery-region-card {
        padding: 12px 14px !important;
      }
      .delivery-region-header {
        flex-wrap: wrap !important;
        gap: 6px !important;
      }
    }
`;

html = html.replace('</style>', cssInsert + '\n  </style>');

// 2. Extract map section and move it right above .delivery-features-grid
const mapStartTag = '<!-- КАРТА РЕГИОНОВ ДОСТАВКИ ЗАВОДА «ТЕПЛИЦЫ ТУТ» -->';
const mapEndTag = '<!-- КОМПАКТНЫЙ БЛОК СТОИМОСТИ ДОСТАВКИ -->';

const mapStartIndex = html.indexOf(mapStartTag);
const mapEndIndex = html.indexOf(mapEndTag);

if (mapStartIndex !== -1 && mapEndIndex !== -1) {
  const mapSection = html.substring(mapStartIndex, mapEndIndex);
  // remove from current position
  html = html.substring(0, mapStartIndex) + html.substring(mapEndIndex);
  
  // insert right before <!-- 4 КЛЮЧЕВЫХ ГАРАНТИИ
  const guaranteesTag = '<!-- 4 КЛЮЧЕВЫХ ГАРАНТИИ (Светлые аккуратные карточки) -->';
  html = html.replace(guaranteesTag, mapSection + '\n      ' + guaranteesTag);
  console.log('Successfully raised map section higher in dostavka-sborka.html');
}

fs.writeFileSync('dostavka-sborka.html', html, 'utf8');
console.log('dostavka-sborka.html updated');
