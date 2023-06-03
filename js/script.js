import * as calculator from "./calculator.js";

const regex = /([+\-*\/÷\^\.]+$)|($)/;
let inputBuff = "";

const buttonsContainer = document.getElementById("grid-container");
const buttonsContainerConv = document.getElementById("grid-container-conv");

const lenList = document.getElementById("len-list");
const massList = document.getElementById("mass-list");
const areaList = document.getElementById("area-list");
const input = document.getElementById('input-data');
const output = document.getElementById('output-data');

let select_from;
let select_to;

input.addEventListener('keydown', function (event) { event.preventDefault() });
output.addEventListener('keydown', function (event) { event.preventDefault() });

const buttons = document.getElementsByTagName('button');
localStorage.setItem("memory", 0);

function closeConvertMenu(){
  lenList.style.display = "none";
  massList.style.display = "none";
  areaList.style.display = "none";
}

function openConvertMenu(list){
  closeConvertMenu();
  buttonsContainer.style.display = "none";
  buttonsContainerConv.style.display = "grid"
  list.style.display = "flex";
}

function numToString(num) {
  let str = num.toFixed(50);
  return str.replace(/\.?0*$/, "");
}

/**
 * Main function of processing(makes a handling string and process it).
 */
function total_processing() {
  var handlingString = "";
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      if (inputBuff === "") {
        inputBuff = "0";
        handlingString = "0";
      }
      if (buttons[i].id === "clear") {
        handlingString = "0";
        inputBuff = "0";
        output.value = "";
      }
      else {
        if (buttons[i].id === "+") {
          handlingString = handlingString.replace(regex, buttons[i].id);
          inputBuff = inputBuff.replace(regex, buttons[i].id);
        }
        else if (buttons[i].id === "-" && inputBuff.length > 0) {
          if (/\^$/.exec(handlingString) !== null) {
            handlingString = handlingString.replace(regex, "^" + buttons[i].id);
            inputBuff = inputBuff.replace(regex, "^" + buttons[i].id);
          }
          else {
            handlingString = handlingString.replace(regex, "+" + buttons[i].id);
            inputBuff = inputBuff.replace(regex, buttons[i].id);
          }
        }
        else if (buttons[i].id === "*" && inputBuff.length > 0) {
          handlingString = handlingString.replace(regex, buttons[i].id);
          inputBuff = inputBuff.replace(regex, buttons[i].id);
        }
        else if (buttons[i].id === "÷" && inputBuff.length > 0) {
          handlingString = handlingString.replace(regex, "*" + buttons[i].id);
          inputBuff = inputBuff.replace(regex, buttons[i].id);
        }
        else if (buttons[i].id === "equal" && inputBuff.length > 0) {
          output.value = inputBuff.replace(regex, "");
          if (String(calculator.calculate(handlingString)).length > 8) {
            inputBuff = calculator.calculate(handlingString).toExponential(3);
          }
          else {
            inputBuff = String(calculator.calculate(handlingString));
          }
          handlingString = numToString(calculator.calculate(handlingString));
        }
        else if (buttons[i].id === ".") {
          if (inputBuff === "") {
            inputBuff = "0";
            handlingString = "0";
          }
          let num = /[\d\.]+$/.exec(inputBuff);
          if (num !== null && /\./.exec(num) === null) {
            handlingString += buttons[i].id;
            inputBuff += buttons[i].id;
          }
        }
        else if (buttons[i].id === "percent") {
          let num = (/[\d\.]+$/.exec(inputBuff) / 100);
          handlingString = handlingString.replace(/[\d\.]+$/, num);
          inputBuff = inputBuff.replace(/[\d\.]+$/, num);
        }
        else if (buttons[i].id === "sign") {
          let result = calculator.sign(handlingString, inputBuff);
          handlingString = result.handlingString;
          inputBuff = result.inputBuff;
        }
        else if (buttons[i].id === "fac") {
          let num = /[\d\.]+$/.exec(inputBuff);
          if (num !== null && /\./.exec(num) === null) {
            handlingString = handlingString.replace(/[\d\.]+$/, calculator.factorial(parseFloat(num)));
            inputBuff = inputBuff.replace(/[\d\.]+$/, calculator.factorial(parseFloat(num)));
          }
          else {
            output.value = "Can't get factorial";
          }
        }
        else if (buttons[i].id === "sqrt") {
          let num = /[\d\.]+$/.exec(inputBuff);
          handlingString = handlingString.replace(/[\d\.]+$/, Math.sqrt(parseFloat(num)));
          inputBuff = inputBuff.replace(/[\d\.]+$/, Math.sqrt(parseFloat(num)));
        }
        else if (buttons[i].id === "power") {
          handlingString = handlingString.replace(regex, "^");
          inputBuff = inputBuff.replace(regex, "^");
        }
        else if (buttons[i].id === "memory-plus") {
          localStorage.setItem("memory", parseFloat(localStorage.getItem("memory")) + calculator.calculate(handlingString));
        }
        else if (buttons[i].id === "memory-minus") {
          localStorage.setItem("memory", parseFloat(localStorage.getItem("memory")) - calculator.calculate(handlingString));
        }
        else if (buttons[i].id === "add-memory") {
          let item = localStorage.getItem("memory");
          if (/\-/.exec(item) === null) {
            handlingString = handlingString.replace(/[\d\.]*$/, item);
            inputBuff = inputBuff.replace(/[\d\.]*$/, item);
          }
          else {
            handlingString = handlingString.replace(/[\d\.]*$/, item.replace(/-/, ""));
            inputBuff = inputBuff.replace(/[\d\.]*$/, item.replace(/-/, ""));
            let result = calculator.sign(handlingString, inputBuff);
            handlingString = result.handlingString;
            inputBuff = result.inputBuff;
          }
          console.log("inputBuff" + inputBuff + typeof (inputBuff));
        }
        else if (buttons[i].id === "reset-memory") {
          localStorage.clear();
          localStorage.setItem("memory", 0);
        }
        else if (buttons[i].id === "delete") {
          if (/e[\+\-]\d+$/.exec(inputBuff) === null) {
            handlingString = handlingString.replace(/\d$|\+$|\+\-$|\*$|\*÷$|\.$|\^$|(\^)-$|(\*)-$|(\*)-(÷)$|0\.$/, "$1$2$3$4");
            inputBuff = inputBuff.replace(/.$/, "");
          }
        }
        else if(buttons[i].id === "convert" || buttons[i].id === "convert-len"){
          if (buttons[i].id === "convert") {
            inputBuff = "";
            handlingString = "";
          }
          select_from = document.getElementById("len-from");
          select_to = document.getElementById("len-to");
          openConvertMenu(lenList);
        }
        else if(buttons[i].id === "convert-mass"){
          select_from = document.getElementById("mass-from");
          select_to = document.getElementById("mass-to");
          openConvertMenu(massList);
        }
        else if(buttons[i].id === "convert-area"){
          select_from = document.getElementById("area-from");
          select_to = document.getElementById("area-to");
          openConvertMenu(areaList); 
        }
        else if (buttons[i].id === "return"){
          closeConvertMenu();
          buttonsContainerConv.style.display = "none";
          buttonsContainer.style.display = "grid";
        }
        else if (buttons[i].id === "equal-conv"){
          output.value = inputBuff;
          handlingString = numToString(parseFloat(handlingString) * parseFloat(select_from.value) / parseFloat(select_to.value));
          if (String(parseFloat(inputBuff) * parseFloat(select_from.value) / parseFloat(select_to.value)).length > 8) {
            inputBuff = (parseFloat(inputBuff) * parseFloat(select_from.value) / parseFloat(select_to.value)).toExponential(3);
          }
          else {
            inputBuff = String(parseFloat(inputBuff) * parseFloat(select_from.value) / parseFloat(select_to.value));
          }
        }
        else {
          if (inputBuff === "0") {
            inputBuff = "";
            handlingString = "";
          }
          if (inputBuff === "-0") {
            inputBuff = "-";
            handlingString = "-";
          }
          handlingString += buttons[i].id;
          inputBuff += buttons[i].id;
        }
        //console.log(handlingString);
      }
      if (inputBuff == "") {
        input.value = "0";
      }
      else {
        input.value = inputBuff;
      }
    });
  }
}

function main() {
  total_processing();
}

main();
