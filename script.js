/* =========================================
   ELEMENTS
========================================= */

const display =
    document.getElementById("display");

const history =
    document.getElementById("history");

const buttons =
    document.querySelectorAll("button");


/* =========================================
   VARIABLES
========================================= */

let expression = "";

let justCalculated = false;


/* =========================================
   UPDATE DISPLAY
========================================= */

function updateDisplay() {

    if (expression === "") {

        display.textContent = "0";

        return;
    }

    let visualExpression =
    expression
        .replace(/\*/g, " \u00D7 ")
        .replace(/\//g, " \u00F7 ")
        .replace(/\+/g, " + ")
        .replace(/-/g, " - ");

    display.textContent =
        visualExpression;
}


/* =========================================
   NUMBER INPUT
========================================= */

function addNumber(value) {

    if (justCalculated) {

        expression = "";

        history.textContent = "0";

        justCalculated = false;
    }


    expression += value;

    updateDisplay();
}


/* =========================================
   DECIMAL
========================================= */

function addDecimal() {

    if (justCalculated) {

        expression = "";

        history.textContent = "0";

        justCalculated = false;
    }


    const parts =
        expression.split(
            /[+\-*/]/
        );

    const currentNumber =
        parts[parts.length - 1];


    if (
        currentNumber.includes(".")
    ) {

        return;
    }


    if (
        expression === "" ||
        /[+\-*/]$/.test(expression)
    ) {

        expression += "0.";
    }

    else {

        expression += ".";
    }


    updateDisplay();
}


/* =========================================
   OPERATOR
========================================= */

function addOperator(operator) {

    if (expression === "") {

        return;
    }


    justCalculated = false;


    if (
        /[+\-*/]$/.test(expression)
    ) {

        expression =
            expression.slice(0, -1)
            + operator;
    }

    else {

        expression += operator;
    }


    updateDisplay();
}


/* =========================================
   CLEAR
========================================= */

function clearCalculator() {

    expression = "";

    history.textContent = "0";

    display.textContent = "0";

    justCalculated = false;
}


/* =========================================
   BACKSPACE
========================================= */

function backspace() {

    if (justCalculated) {

        clearCalculator();

        return;
    }


    expression =
        expression.slice(0, -1);


    updateDisplay();
}


/* =========================================
   PLUS / MINUS
========================================= */

function changeSign() {

    if (expression === "") {

        return;
    }


    const match =
        expression.match(
            /(-?\d+\.?\d*)$/
        );


    if (!match) {

        return;
    }


    const number =
        match[0];


    const start =
        expression.length
        - number.length;


    const newNumber =
        number.startsWith("-")
            ? number.slice(1)
            : "-" + number;


    expression =
        expression.slice(0, start)
        + newNumber;


    updateDisplay();
}


/* =========================================
   PERCENTAGE
========================================= */

function percentage() {

    if (expression === "") {

        return;
    }


    const match =
        expression.match(
            /(\d+\.?\d*)$/
        );


    if (!match) {

        return;
    }


    const number =
        parseFloat(match[0]);


    const percent =
        number / 100;


    expression =
        expression.slice(
            0,
            expression.length
            - match[0].length
        )
        + percent;


    updateDisplay();
}


/* =========================================
   CALCULATE
========================================= */

function calculate() {

    if (expression === "") {

        return;
    }


    let cleanExpression =
        expression;


    /* Don't calculate incomplete expression */

    if (
        /[+\-*/]$/.test(
            cleanExpression
        )
    ) {

        cleanExpression =
            cleanExpression.slice(0, -1);
    }


    try {

        /*
         Only mathematical characters
         are allowed.
        */

        if (
            !/^[0-9+\-*/.()\s]+$/
                .test(cleanExpression)
        ) {

            throw new Error(
                "Invalid expression"
            );
        }


        const result =
            Function(
                `"use strict";
                 return (${cleanExpression})`
            ) ();


        if (
            !Number.isFinite(result)
        ) {

            throw new Error(
                "Invalid calculation"
            );
        }


        const roundedResult =
            Number(
                result.toFixed(10)
            );


        /* Show history */

        history.textContent =
            cleanExpression
                .replace(/\*/g, "\u00D7")
                .replace(/\//g, " \u00F7 ")
                .replace(/\+/g, " + ")
                .replace(/-/g, " - ")
            + " =";


        /* Show result */

        display.textContent =
            roundedResult;


        expression =
            String(roundedResult);


        justCalculated = true;

    }

    catch (error) {

        display.textContent =
            "Error";

        expression = "";

        justCalculated = true;
    }
}


/* =========================================
   BUTTON EVENTS
========================================= */

buttons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const value =
                button.dataset.value;

            const action =
                button.dataset.action;


            /* Number */

            if (
                button.classList
                    .contains("number")
            ) {

                if (value === ".") {

                    addDecimal();
                }

                else {

                    addNumber(value);
                }

                return;
            }


            /* Operator */

            if (
                button.classList
                    .contains("operator")
                && value
            ) {

                addOperator(value);

                return;
            }


            /* Clear */

            if (
                action === "clear"
            ) {

                clearCalculator();

                return;
            }


            /* Sign */

            if (
                action === "sign"
            ) {

                changeSign();

                return;
            }


            /* Percentage */

            if (
                action === "percent"
            ) {

                percentage();

                return;
            }


            /* Calculate */

            if (
                action === "calculate"
            ) {

                calculate();

                return;
            }

        }
    );

});


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key;


        /* Numbers */

        if (
            key >= "0" &&
            key <= "9"
        ) {

            addNumber(key);

            return;
        }


        /* Decimal */

        if (key === ".") {

            addDecimal();

            return;
        }


        /* Operators */

        if (
            ["+", "-", "*", "/"]
                .includes(key)
        ) {

            addOperator(key);

            return;
        }


        /* Enter */

        if (
            key === "Enter" ||
            key === "="
        ) {

            calculate();

            return;
        }


        /* Backspace */

        if (
            key === "Backspace"
        ) {

            backspace();

            return;
        }


        /* Escape */

        if (
            key === "Escape"
        ) {

            clearCalculator();

            return;
        }


        /* Percentage */

        if (key === "%") {

            percentage();

            return;
        }

    }
);
