"use strict";

let statement = {};
let emptyStatement = {};
const principalAmtSlider = document.getElementById("loanAmtSlider");
const interestRateSlider = document.getElementById("interestRateSlider");
const loanTermSlider = document.getElementById("loanTermSlider");
const toolsTitle = document.getElementById("tools-title");

const principalAmtInput = document.getElementById("loan-input");
const rateInput = document.getElementById("rate-input");
const termInput = document.getElementById("term-input");

// for EMI output
const emiPrincipalOutput = document.getElementById("emi-principal-output");
const emiInterestPayableOutput = document.getElementById(
  "emi-total-interest-output"
);
const monthlyEMI = document.getElementById("monthlyEMI");
const emiTotalPayableOutput = document.getElementById(
  "emi-total-payable-output"
);

// for Interest Output

const siPrincipalOutput = document.getElementById("si-principal-output");
const siInterestPayableOutput = document.getElementById(
  "si-total-interest-output"
);
const siTotalPayableOutput = document.getElementById("si-total-payable-output");

// Compound Output
const comPrincipalOutput = document.getElementById("com-principal-output");
const comInterestPayableOutput = document.getElementById(
  "com-total-interest-output"
);
const comTotalPayableOutput = document.getElementById(
  "com-total-payable-output"
);

const comTime = document.getElementById("com-time");

const tableBody = document.getElementById("table-body");

// variable definition for interest
const siTab = document.getElementById("si-tab");
const emiTab = document.getElementById("emi-tab");
const compoundTab = document.getElementById("compound-tab");

// Default values
let principalvalue = 4000000;
let rateValue = 16.68;
let termValue = 2;
let balance = principalvalue;
let comTimeValue = comTime.value;
console.log(comTime);
principalAmtSlider.value = principalvalue;
interestRateSlider.value = rateValue;
loanTermSlider.value = termValue;

// Converted Values for rate and month
let termToMonth;
let rateToMonth;

let interest;
let EMI;

let interestPayable;
let totalPayable;

// remaining values
let principalPaidThisMonth;
let interestPaidThisMonth;

const calculateEMI = () => {
  // converting value and logics
  for (let i = 1; i <= termToMonth; i++) {
    delete statement[i];
  }

  tableBody.innerHTML = "";
  statement = emptyStatement;
  console.log(`The value is printed in the function ${comTimeValue}`);
  rateToMonth = rateValue / 1200;
  termToMonth = termValue * 12;
  interest = principalvalue * rateToMonth;
  // Main formula to calculate EMI
  EMI =
    (principalvalue * rateToMonth * (1 + rateToMonth) ** termToMonth) /
    ((1 + rateToMonth) ** termToMonth - 1);

  interestPayable =
    EMI * termToMonth - principalvalue > 0
      ? Math.abs(EMI * termToMonth - principalvalue)
      : EMI * termToMonth - principalvalue;
  totalPayable = interestPayable + principalvalue;
  balance = principalvalue;

  // Updating text content for EMI

  emiPrincipalOutput.textContent = principalvalue.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  monthlyEMI.textContent = EMI.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  emiInterestPayableOutput.textContent = interestPayable.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }
  );
  emiTotalPayableOutput.textContent = totalPayable.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  // Updating text content for Interest
  siPrincipalOutput.textContent = principalvalue.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  let siIntPayable = 12 * interest * termValue;
  siInterestPayableOutput.textContent = siIntPayable.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  siTotalPayableOutput.textContent = (
    principalvalue +
    12 * interest * termValue
  ).toLocaleString(
    "en-US",

    {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }
  );

  // Updating text content for Compound Interest
  comPrincipalOutput.textContent = principalvalue.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  let comTotalValue =
    principalvalue *
    (1 + (rateValue * 0.01) / comTimeValue) ** (comTimeValue * termValue);

  comTotalPayableOutput.textContent = comTotalValue.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  console.log(`This is ${comTimeValue}`);

  comInterestPayableOutput.textContent = (
    comTotalValue - principalvalue
  ).toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  // Loop for each months
  // console.clear();

  for (let i = 1; i <= termToMonth; i++) {
    interestPaidThisMonth = balance * rateToMonth;
    principalPaidThisMonth = EMI - interestPaidThisMonth;
    balance -= principalPaidThisMonth;

    // Creating objects

    const objName = `${i}`;
    statement[objName] = {
      SN: i,
      Installment: 0,
      Interest: 0,
      Principal: 0,
      Balance: principalvalue,
    };
    // Adding value to objects
    statement[`${i}`].Installment = EMI;
    statement[`${i}`].Interest = interestPaidThisMonth;
    statement[`${i}`].Principal = principalPaidThisMonth;
    statement[`${i}`].Balance = i == termToMonth ? 0 : balance;

    // Table Loop Ends

    if (i == termToMonth) {
      // After completing for final month - balance will be the Principal value again
      balance = principalvalue;
      interestPaidThisMonth = balance * rateToMonth;
    }
  }

  // Each month loop ends

  // To display records on table

  for (const month in statement) {
    const tr = document.createElement("tr");
    tr.classList.add(
      "bg-white",
      "border-b",
      "dark:bg-gray-800",
      "dark:border-gray-700",
      "hover:bg-gray-50",
      "dark:hover:bg-gray-600"
    );
    const monthTd = document.createElement("td");
    monthTd.textContent = month;
    monthTd.classList.add("px-6", "py-4");

    const InstallmentTd = document.createElement("td");
    InstallmentTd.textContent = statement[month].Installment.toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }
    );
    InstallmentTd.classList.add("px-6", "py-4");

    const InterestTd = document.createElement("td");
    InterestTd.textContent = statement[month].Interest.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    InterestTd.classList.add("px-6", "py-4");

    const PrincipalTd = document.createElement("td");
    PrincipalTd.textContent = statement[month].Principal.toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }
    );
    PrincipalTd.classList.add("px-6", "py-4");

    const BalanceTd = document.createElement("td");
    BalanceTd.textContent = statement[month].Balance.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    BalanceTd.classList.add("px-6", "py-4");

    tr.appendChild(monthTd);
    tr.appendChild(InstallmentTd);
    tr.appendChild(InterestTd);
    tr.appendChild(PrincipalTd);
    tr.appendChild(BalanceTd);

    tableBody.appendChild(tr);
  }
};

// Calculate Default Values to prevent NaN
calculateEMI();

rateInput.addEventListener("input", (e) => {
  if (e.target.value.length < 1) rateValue = 1;
  else rateValue = Number(e.target.value);
  interestRateSlider.value = rateValue;
  calculateEMI();
});

termInput.addEventListener("input", (e) => {
  if (e.target.value.length < 1) termValue = 1;
  else termValue = Number(e.target.value);
  loanTermSlider.value = termValue;
  calculateEMI();
});

principalAmtInput.addEventListener("input", (e) => {
  if (e.target.value.length < 1) principalvalue = 1;
  else principalvalue = Number(e.target.value);
  principalAmtSlider.value = principalvalue;
  calculateEMI();
});

principalAmtSlider.addEventListener("input", (e) => {
  principalvalue = Number(e.target.value);
  principalAmtInput.value = principalvalue;
  calculateEMI();
});

interestRateSlider.addEventListener("input", (e) => {
  rateValue = Number(e.target.value);
  rateInput.value = rateValue;
  calculateEMI();
});

loanTermSlider.addEventListener("input", (e) => {
  termValue = Number(e.target.value);
  termInput.value = termValue;
  calculateEMI();
});

comTime.addEventListener("click", (e) => {
  comTimeValue = Number(e.target.value);
  comTimeValue *= termValue;
  console.log(`New con time = ${comTimeValue}`);
  // calculateEMI();
});

comTime.addEventListener("change", (e) => {
  comTimeValue = Number(e.target.value);
  calculateEMI();
});

// *************************************** For Tab Click

// siTab, emiTab, compoundTab
const tableWrapper = document.getElementById("tableWrapper");
let tabcontent;
let tablinks;
tablinks = document.getElementsByClassName("tablinks");

const openContent = (evt, cityName) => {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
};

for (let i = 0; i < tablinks.length; i++) {
  tablinks[i].addEventListener("click", () => {
    if (i == 0) {
      tableWrapper.classList.remove("hidden");
      toolsTitle.textContent = "EMI Calculator";
    } else if (i == 1) {
      tableWrapper.classList.add("hidden");
      toolsTitle.textContent = "Simple Interest Calculator";
    } else {
      tableWrapper.classList.add("hidden");
      toolsTitle.textContent = "Compound Interest Calculator";
    }
  });
}
