const fs = require('fs');

let css = fs.readFileSync('assets/css/style.css', 'utf8');

const prodCss = `
/* ==========================================================================
   СОВРЕМЕННАЯ КАРТОЧКА ТОВАРА (ТЕПЛИЦЫ: АРОЧНАЯ, КАПЕЛЬКА, ДОМИКОМ)
   Референсы: teplitsastore.ru и teplitsa-rus.ru
   ========================================================================== */
.prod-hero-wrap {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 32px;
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  border: 1.5px solid #e1ece4;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  margin-bottom: 40px;
}

.prod-gallery-col {
  display: flex;
  flex-direction: column;
}

.prod-main-view {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 20px;
  overflow: hidden;
  background: #f4f7f4;
  border: 1.5px solid #e1ece4;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.prod-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.22s ease;
}

.prod-badge-overlay {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  gap: 8px;
  z-index: 2;
}

.prod-badge-pill {
  background: #1b4332;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 5px 12px;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
}
.prod-badge-pill.hit { background: #d90429; }

.prod-counter-pill {
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: rgba(27, 67, 50, 0.88);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 800;
  padding: 5px 14px;
  border-radius: 999px;
  z-index: 2;
}

.prod-nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  border: 1.5px solid #e1ece4;
  color: #1b4332;
  font-size: 1.6rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.prod-nav-arrow:hover {
  background: #1b4332;
  color: #ffffff;
  transform: translateY(-50%) scale(1.08);
}
.prod-nav-arrow.prev { left: 12px; }
.prod-nav-arrow.next { right: 12px; }

.prod-thumbs-strip {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 14px 2px 6px;
  scrollbar-width: thin;
  scrollbar-color: #74c69d #f0f0ec;
}
.prod-thumbs-strip::-webkit-scrollbar {
  height: 6px;
}
.prod-thumbs-strip::-webkit-scrollbar-thumb {
  background: #74c69d;
  border-radius: 3px;
}

.prod-thumb-item {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  border: 2.5px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #eef2ef;
}
.prod-thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.prod-thumb-item:hover {
  border-color: #74c69d;
  transform: scale(1.04);
}
.prod-thumb-item.active {
  border-color: #1b4332;
  box-shadow: 0 4px 12px rgba(27,67,50,0.3);
  transform: scale(1.06);
}

.prod-info-col {
  display: flex;
  flex-direction: column;
}

.prod-rating-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 0.88rem;
  color: #556b62;
}
.prod-stars { color: #f4a261; font-size: 1rem; }

.prod-title {
  font-family: var(--font-heading);
  font-size: 1.85rem;
  font-weight: 900;
  color: #1b4332;
  line-height: 1.25;
  margin: 0 0 14px;
}

.prod-price-box {
  background: #f8faf8;
  border: 1.5px solid #d8e8dc;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.prod-price-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.prod-price-current {
  font-size: 2.1rem;
  font-weight: 900;
  color: #1b4332;
}
.prod-price-old {
  font-size: 1.2rem;
  text-decoration: line-through;
  color: #999;
}
.prod-price-badge {
  background: #eaf4ed;
  color: #2d6a4f;
  font-size: 0.8rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
}

.prod-select-group {
  margin-bottom: 16px;
}
.prod-select-label {
  display: block;
  font-size: 0.88rem;
  font-weight: 800;
  color: #1b4332;
  margin-bottom: 8px;
}
.prod-select-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.prod-select-btn {
  background: #ffffff;
  border: 1.5px solid #cedcd2;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #2d4037;
  cursor: pointer;
  transition: all 0.2s;
}
.prod-select-btn:hover {
  border-color: #2d6a4f;
  color: #1b4332;
}
.prod-select-btn.active {
  background: #1b4332;
  border-color: #1b4332;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(27,67,50,0.25);
}

.prod-specs-bullets {
  list-style: none;
  padding: 0;
  margin: 16px 0 20px;
  font-size: 0.9rem;
  color: #40534c;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.prod-specs-bullets li {
  display: flex;
  align-items: center;
  gap: 8px;
}
.prod-specs-bullets li::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2d6a4f;
  flex-shrink: 0;
}

.prod-cta-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}
.prod-btn-primary {
  width: 100%;
  padding: 15px 24px;
  background: #d90429;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(217, 4, 41, 0.35);
  transition: all 0.25s ease;
  text-align: center;
}
.prod-btn-primary:hover {
  background: #b70322;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(217, 4, 41, 0.45);
}

.prod-trust-pills {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
  font-size: 0.8rem;
  color: #556b62;
}
.prod-trust-pill {
  display: flex;
  align-items: center;
  gap: 5px;
}

.prod-details-box {
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  border: 1.5px solid #e1ece4;
  margin-bottom: 35px;
}
.prod-details-title {
  font-family: var(--font-heading);
  font-size: 1.55rem;
  font-weight: 900;
  color: #1b4332;
  margin: 0 0 18px;
}
.prod-table-specs {
  width: 100%;
  border-collapse: collapse;
}
.prod-table-specs td {
  padding: 12px 14px;
  border-bottom: 1px solid #edf4ef;
  font-size: 0.94rem;
}
.prod-table-specs td:first-child {
  color: #556b62;
  width: 45%;
}
.prod-table-specs td:last-child {
  color: #1b4332;
  font-weight: 700;
}
.prod-table-specs tr:nth-child(even) {
  background: #f9fbf9;
}

@media (max-width: 960px) {
  .prod-hero-wrap {
    grid-template-columns: 1fr;
    padding: 24px 20px;
  }
  .prod-title {
    font-size: 1.55rem;
  }
}
@media (max-width: 580px) {
  .prod-hero-wrap {
    padding: 18px 14px;
    border-radius: 18px;
  }
  .prod-main-view {
    aspect-ratio: 1 / 1;
    border-radius: 14px;
  }
  .prod-thumb-item {
    width: 60px;
    height: 60px;
  }
  .prod-price-current {
    font-size: 1.7rem;
  }
  .prod-details-box {
    padding: 20px 14px;
    border-radius: 18px;
  }
}
`;

if (!css.includes('.prod-hero-wrap')) {
  css += '\n' + prodCss;
  fs.writeFileSync('assets/css/style.css', css, 'utf8');
  console.log('Appended prodCss to assets/css/style.css');
}
