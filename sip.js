let regularDeposit = 2000;
let finalBalance = regularDeposit;
let prevBalance;
let sipTerm = 30;
let sipInterval = 12;
let time = sipTerm * sipInterval;
// time = sipTerm * interval
// interval = monthly = 12, quarterly = 4, semi annually = 6, sipTermly =1
let rate = 17;
let rateToMonth = rate / 1200;
// rate = interest in sipTerm/1200
let totalInvested = 0;
let monthlyReturn;

// balance = regularDeposit * (((1 + rateT0Month) ** time - 1) / rateT0Month) * (1 + rateT0Month);
for (i = 1; i <= time; i++) {
  prevBalance = finalBalance;
  totalInvested += regularDeposit;
  finalBalance =
    regularDeposit *
    (((1 + rateToMonth) ** i - 1) / rateToMonth) *
    (1 + rateToMonth);

  monthlyReturn = finalBalance - prevBalance - regularDeposit;
  console.log(
    `${i} SIP Amount : ${regularDeposit} Returns : ${monthlyReturn.toFixed(
      0
    )}  Balance : ${finalBalance.toFixed(0)}`
  );
}
console.log(totalInvested);
