export function formatIndianCurrency(price) {
  let priceString = parseFloat(price).toFixed(2).toString();
  let [whole] = priceString.split(".");

  let lastThree = whole.slice(-3);
  let otherNumbers = whole.slice(0, -3);

  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }

  otherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return `₹ ${otherNumbers}${lastThree}`;
}
