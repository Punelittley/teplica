const fs = require('fs');

let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');

// Replace state definition and setup in setupCalculator
const oldCalcStart = `  const state = {
    type: "arch",
    length: "6m",
    step: "100",
    poly: "eco4",
    timber: false,
    assembly: true,
    beds: false,
    autovent: false
  };`;

const newCalcStart = `  const state = {
    type: "arch",
    length: "6m",
    step: "100",
    poly: "eco4",
    timber: false,
    assembly: true,
    beds: false,
    autovent: false,
    tape: false
  };`;

mainJs = mainJs.replace(oldCalcStart, newCalcStart);

// Add tapeCheckbox
const oldCheckboxes = `  const bedsCheckbox = document.getElementById("calcOptionBeds");
  const autoventCheckbox = document.getElementById("calcOptionAutovent");`;

const newCheckboxes = `  const bedsCheckbox = document.getElementById("calcOptionBeds");
  const autoventCheckbox = document.getElementById("calcOptionAutovent");
  const tapeCheckbox = document.getElementById("calcOptionTape");`;

mainJs = mainJs.replace(oldCheckboxes, newCheckboxes);

// In update() function add tapeCost calculation
const oldCostCalc = `    // Автопроветриватель
    let autoventCost = 0;
    if (state.autovent) {
      autoventCost = p.autovent?.price || 2400;
      const autoventOldCost = p.autovent?.oldPrice || 2900;
      total += autoventCost;
      oldTotal += autoventOldCost;
    }`;

const newCostCalc = `    // Автопроветриватель
    let autoventCost = 0;
    if (state.autovent) {
      autoventCost = p.autovent?.price || 2400;
      const autoventOldCost = p.autovent?.oldPrice || 2900;
      total += autoventCost;
      oldTotal += autoventOldCost;
    }

    // Стяжная оцинкованная лента
    let tapeCost = 0;
    if (state.tape) {
      tapeCost = p.tape?.price || 1800;
      const tapeOldCost = p.tape?.oldPrice || 2400;
      total += tapeCost;
      oldTotal += tapeOldCost;
    }`;

mainJs = mainJs.replace(oldCostCalc, newCostCalc);

// In update() breakdown type
const oldBreakdownType = `    if (breakdownTypeEl) {
      breakdownTypeEl.textContent = state.type === "arch" ? "Арочная теплица" : "Каплевидная теплица";
    }`;

const newBreakdownType = `    if (breakdownTypeEl) {
      if (state.type === "arch") {
        breakdownTypeEl.textContent = "Арочная теплица";
      } else if (state.type === "drop") {
        breakdownTypeEl.textContent = "Каплевидная теплица";
      } else {
        breakdownTypeEl.textContent = "Прямостенная «Домиком»";
      }
    }`;

mainJs = mainJs.replace(oldBreakdownType, newBreakdownType);

// In extras breakdown
const oldExtras = `      if (state.autovent) extras.push(\`Автопроветриватель (\${autoventCost.toLocaleString("ru-RU")} ₽)\`);`;
const newExtras = `      if (state.autovent) extras.push(\`Автопроветриватель (\${autoventCost.toLocaleString("ru-RU")} ₽)\`);
      if (state.tape) extras.push(\`Оцинкованная лента (\${tapeCost.toLocaleString("ru-RU")} ₽)\`);`;

mainJs = mainJs.replace(oldExtras, newExtras);

// In submitBtn extraList
const oldSubmitExtra = `      if (state.autovent) extraList.push("Автопроветриватель");`;
const newSubmitExtra = `      if (state.autovent) extraList.push("Автопроветриватель");
      if (state.tape) extraList.push("Стяжная лента");`;

mainJs = mainJs.replace(oldSubmitExtra, newSubmitExtra);

// In submitBtn desc type text
const oldSubmitDesc = `const desc = \`\${state.type === "arch" ? "Арочная" : "Каплевидная"} \${baseItem.name}`;
const newSubmitDesc = `const typeName = state.type === "arch" ? "Арочная" : (state.type === "drop" ? "Каплевидная" : "Домиком");
      const desc = \`\${typeName} \${baseItem.name}`;

mainJs = mainJs.replace(oldSubmitDesc, newSubmitDesc);

// Add event listener for tapeCheckbox
const oldTapeListener = `  if (autoventCheckbox) {
    autoventCheckbox.addEventListener("change", (e) => {
      state.autovent = e.target.checked;
      update();
    });
  }`;

const newTapeListener = `  if (autoventCheckbox) {
    autoventCheckbox.addEventListener("change", (e) => {
      state.autovent = e.target.checked;
      update();
    });
  }

  if (tapeCheckbox) {
    tapeCheckbox.addEventListener("change", (e) => {
      state.tape = e.target.checked;
      update();
    });
  }`;

mainJs = mainJs.replace(oldTapeListener, newTapeListener);

fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');
console.log('main.js updated with tape & 3 greenhouse forms');
