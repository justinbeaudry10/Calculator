let inpArr= [];
let rpnNum = 0;

$(() => {
    $(".calc-btn").on("click", HandleString);
});

function HandleString(el) {
  let op = el == "c" ? "c" : el.target.attributes.operand.value; // The operand


  if(op == 'c') {
    inpArr = [];
    rpnNum = 0;
    $('#calc-inp').val("0");
    $('#calc-out').val("0");
  } else if (op == "s") {
    if(el.target.attributes.data_form.value == "infix") {
      $('#calc-out').css("display", "flex");
      //$("input").css('height', "50px");
      $("#calc-inp").addClass('rpn');
      $('#calc-type').text("RPN");
      el.target.attributes.data_form.value = "rpn";
    } else {
      $('#calc-out').css("display", "none");
      $('#calc-out').value("0");
      rpnNum = 0;
      $("#calc-inp").removeClass('rpn');
      $('#calc-type').text("INFIX");
      el.target.attributes.data_form.value = "infix";
    }
    HandleString("c"); // Resets the display when the type is selected
  }else if (op == '='){
    CalcResult(op);
  } else {
    if(document.getElementById("calc-type").attributes.data_form.value == "infix") {
      inpArr.push(op);
      DisplayInput();
    } else {
      if(['+','-','*', '/'].indexOf(inpArr[inpArr.length - 1]) >= 0) { 
        inpArr[inpArr.length - 1] = op;
        DisplayInput();
      } else {
        if(inpArr.length > 0) {
          inpArr.push(op);
          DisplayInput();
        } else if(!isNaN(op)) {
          inpArr.push(op);
          DisplayInput();
        }
      }
    }
  }
}

function DisplayInput() {
  let str = "";
  for(let i = 0; i < inpArr.length; i++) {
    str += inpArr[i];
    if (i + 1 == inpArr.length) {
      //console.log(inpArr);
      $('#calc-inp').val(str);
    }
  }
}

function CalcResult() {
  let opType = document.getElementById("calc-type").attributes.data_form.value;

  //DECIMAL CHECK MAY WANT TO BE +2 not +1
  if(opType == "infix") {
    new Promise(function(resolve, reject) {
      let arr = [];
      let str = "";
      for(let i = 0; i < inpArr.length; i++) {
        if (isNaN(inpArr[i])) {
          if(str != "") {
            arr.push(str);
            str = "";
          }
          arr.push(inpArr[i]);
        } else {
          str += inpArr[i];
        }

        if(i + 1 == inpArr.length) {
          if(str != "") {
            arr.push(str);
          }
          console.log("num check",arr);
          resolve( arr);
        }
      }
    }).then((a) => {
      let arr = [];
      for(let i = 0; i < a.length; i++) {
        if (!(a.length == i + 1) && a[i + 1] == ".") {
          arr.push(parseFloat(a[i] + "." + a[i + 2]));
          i += 2;
        } else {
          if (isNaN(a[i])) {
            arr.push(a[i]);
          } else {
            arr.push(parseFloat(a[i]));
          }
        }

        if(i + 1 == a.length) {
          console.log("dec check", arr);
          return(arr);
        }
      }
    }).then((a) => {
      let arr = [];
      for(let i = 0; i < a.length; i++) {
        if (!(a.length == i + 1) && (a[i + 1] == "/" || a[i + 1] == "*")) {
          if (a[i + 1] == "/") {
            arr.push(a[i] / a[i + 2]);
          } else {
            arr.push(a[i] * a[i + 2]);
          }
          i += 2;
        } else {
          arr.push(a[i]);
        }

        if(i + 1 == a.length) {
          console.log("mult/div", arr);
          return(arr);
        }
      }
    }).then((a) => {
      let num = a[0];
      if (a.length > 1) {
        for(let i = 1; i < a.length; i += 2) {
          if (a[i] == "+") {
            num += a[i + 1];
          } else {
            num -= a[i + 1];
          }

          if(i + 2 >= a.length) {
            console.log("final", num);
            return(num);
          }
        }
      } else {
        return num;
      }
    }).then((n) => {
      inpArr = [n.toString()];
      $('#calc-inp').val(n);
    });
  } else {
    new Promise(function(resolve, reject) {
      let arr = [];
      let str = "";
      for(let i = 0; i < inpArr.length; i++) {
        if (isNaN(inpArr[i])) {
          if(str != "") {
            arr.push(str);
            str = "";
          }
          arr.push(inpArr[i]);
        } else {
          str += inpArr[i];
        }

        if(i + 1 == inpArr.length) {
          if(str != "") {
            arr.push(str);
          }
          console.log("num check",arr);
          resolve( arr);
        }
      }
    }).then((a) => {
      let arr = [];
      for(let i = 0; i < a.length; i++) {
        if (!(a.length == i + 1) && a[i + 1] == ".") {
          arr.push(parseFloat(a[i] + "." + a[i + 2]));
          i += 2;
        } else {
          if (isNaN(a[i])) {
            arr.push(a[i]);
          } else {
            arr.push(parseFloat(a[i]));
          }
        }

        if(i + 1 == a.length) {
          console.log("dec check", arr);
          return(arr);
        }
      }
    }).then((a) => {
      switch(a[a.length - 1]) { //Should always be index 1 regardless tho
        case "+":
          return rpnNum + a[0];
        case "-":
          return rpnNum - a[0];
        case "*":
          return rpnNum * a[0];
        case "/":
          return rpnNum / a[0];
        default:
          return a[0];
      }
    }).then((num) => {
      inpArr = [];
      rpnNum = num;
      $('#calc-inp').val("0");
      $('#calc-out').val(num.toString());
    });
  }
}

