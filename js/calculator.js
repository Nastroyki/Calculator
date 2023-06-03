const output = document.getElementById('output-data');
const signRegex = /([+\-÷*]+)([\d\.]+$)/;
const signRegex2 = /([\d\.]+$)/;

/**
 * Fuction of addtion of each number value of each string in array.
 * @param {*} array - array of strings
 * @returns - returns a value of addtied numbers
 */
function totalValue(array) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    const value = parseFloat(array[i], 10);
    if (!isNaN(value)) {
      total += value;
    }
  }
  return total;
}

/**
 * Fuction of reproduction of each number value of each string in array.
 * @param {*} array - array of strings
 * @returns - returns a value of multiplied numbers
 */
function totalMultiply(array) {
  let total = 1;
  for (let i = 0; i < array.length; i++) {
    const value = parseFloat(array[i], 10);
    if (!isNaN(value)) {
      total *= value;
    }
  }
  return total;
}

/**
 * Function of processing of muptiplication statements.
 * Statement is divided to parts by 'x' sign.
 * Division is counted as multiplication with 1/number;
 * @param {*} data - multiplication statement
 * @returns - returns a value of multiplied numbers
 */
function multiply(data) {
  let elements = data.split("*");

  for (let i = 0; i < elements.length; i++) {
    if (elements[i].includes("^")) {
      elements[i] = elements[i].replace(/\^$/, "");
      let match = elements[i].match(/([\d\.]+)\^(\-*[\d\.]+)/);
      while (match !== null) {
        elements[i] = elements[i].replace(/([\d\.]+)\^(\-*[\d\.]+)/, String(Math.pow(match[1], match[2])));
        match = elements[i].match(/([\d\.]+)\^(\-*[\d\.]+)/);
      }
    }
    if (elements[i].includes("÷")) {
      let base = parseFloat(elements[i].replace("÷", ""));
      if (base === 0.0) {
        output.value = "Can't divide by zero";
        //inputBuff = "0";
        return "Error";
      }
      else {
        elements[i] = String(1 / base);
      }
    }
  }
  return totalMultiply(elements);
}



/**
 * Function of processing a handling string.
 * Splits a statement into parts by "+" sign, multiply processes separatety.
 * Subtraction is counted as addition of negative value.
 * Division is counted as multiplication with 1/number;
 * @param {*} data - string of aryfmetic statements
 * @returns - total sum of statements results(separate number is also a statement)
*/

export function calculate(data) {

  let elements = data.split("+");
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].includes("*") || elements[i].includes("÷") || elements[i].includes("^")) {
      let result = multiply(elements[i]);
      if (result === "Error") {
        return 0;
      }
      else {
        elements[i] = String(result);
      }
    }
  }
  return totalValue(elements);
}

/**
 * Searches a factorial of some number n=>0
 * @param {*} n - string of aryfmetic statements
 * @returns - factorial of number n
*/
export function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

/**
 * Changes current sign of number to opposite.
 * @param {*} handlingString - Current statement used by program
 * @param {*} inputBuff - Result statement user sees
 * @returns - an object containing handlingString and inputBuff
*/
export function sign(handlingString, inputBuff) {
  let match = handlingString.match(signRegex);
  if (match !== null) {
    let symbol = match[1];
    if (symbol === "+") {
      handlingString = handlingString.replace(signRegex, "+-$2");
      inputBuff = inputBuff.replace(signRegex, "-$2");
    }
    else if (symbol === "+-") {
      handlingString = handlingString.replace(signRegex, "+$2");
      inputBuff = inputBuff.replace(signRegex, "+$2");
    }
    else if (symbol === "*-") {
      handlingString = handlingString.replace(signRegex, "*$2");
      inputBuff = inputBuff.replace(signRegex, "*$2");
    }
    else if (symbol === "*÷") {
      handlingString = handlingString.replace(signRegex, "*-÷$2");
      inputBuff = inputBuff.replace(signRegex, "÷-$2");
    }
    else if (symbol === "*-÷") {
      handlingString = handlingString.replace(signRegex, "*÷$2");
      inputBuff = inputBuff.replace(signRegex, "÷$2");
    }
    else if (symbol === "*") {
      handlingString = handlingString.replace(signRegex, "*-$2");
      inputBuff = inputBuff.replace(signRegex, "*-$2");
    }
    else if (symbol === "-") {
      handlingString = handlingString.replace(signRegex, "$2");
      inputBuff = inputBuff.replace(signRegex, "$2");
    }
  } else {
    handlingString = handlingString.replace(signRegex2, "-$1");
    inputBuff = inputBuff.replace(signRegex2, "-$1");
  }
  let result = {
    handlingString: handlingString,
    inputBuff: inputBuff
  };
  return result;
}
