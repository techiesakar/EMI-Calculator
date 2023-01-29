"use strict";

let statement = {};
let emptyStatement = {};
const principalAmtSlider = document.getElementById("loanAmtSlider");
const interestRateSlider = document.getElementById("interestRateSlider");
const loanTermSlider = document.getElementById("loanTermSlider");

const principalAmtInput = document.getElementById("loan-input");
const rateInput = document.getElementById("rate-input");
const termInput = document.getElementById("term-input");

// for output
const principalOutput = document.getElementById("principal-output");
const interestPayableOutput = document.getElementById("total-interest-output");
const monthlyEMI = document.getElementById("monthlyEMI");
const totalPayableOutput = document.getElementById("total-payable-output");

const tableBody = document.getElementById("table-body");

// Default values
let principalvalue = 4000000;
let rateValue = 16.68;
let termValue = 2;
let balance = principalvalue;
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

  // Updating text content

  principalOutput.textContent = principalvalue.toLocaleString("en-US");
  monthlyEMI.textContent = EMI.toLocaleString("en-US");
  interestPayableOutput.textContent = interestPayable.toLocaleString("en-US");
  totalPayableOutput.textContent = totalPayable.toLocaleString();

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
    statement[`${i}`].Installment = EMI.toFixed(3);
    statement[`${i}`].Interest = interestPaidThisMonth.toFixed(3);
    statement[`${i}`].Principal = principalPaidThisMonth.toFixed(3);
    statement[`${i}`].Balance = i == termToMonth ? 0 : balance.toFixed(3);

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

    const InterestTd = document.createElement("td");
    InterestTd.textContent = statement[month].Interest;
    InterestTd.classList.add("px-6", "py-4");

    const PrincipalTd = document.createElement("td");
    PrincipalTd.textContent = statement[month].Principal;
    PrincipalTd.classList.add("px-6", "py-4");

    const InstallmentTd = document.createElement("td");
    InstallmentTd.textContent = statement[month].Installment;
    InstallmentTd.classList.add("px-6", "py-4");

    const BalanceTd = document.createElement("td");
    BalanceTd.textContent = statement[month].Balance;
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

// Creating Table
