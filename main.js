"use strict";

"use strict";

/**
 * убрать из строки все пробелы
 * @param codeParam
 * @returns {string}
 */
export function killSpaces(codeParam) {
    return codeParam.toString().split(" ").join("");
}

/**
 * убрать из строки все переносы строк
 * @param codeParam
 * @returns {string}
 */
export function killNextLineChar(codeParam) {
    return codeParam.toString().split("\n").join("");
}

/**
 * разбить строку на массив операций по разделителю
 * @param codeParam
 * @returns {string[]}
 */
export function getOperationsArray(codeParam) {
    return codeParam.toString().split(";");
}

/**
 * проверка: является ли строка именем переменной
 * @param strParam
 * @returns {boolean}
 */
export function isVariableName(strParam) {
    if(strParam.length !== 1) {
        return false;
    }
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(strParam) !== -1;
}

/**
 * проверка: является ли строка математической операцией
 * @param charParam
 * @returns {boolean}
 */
export function isMath(charParam) {
    if(charParam.toString() === "+") return true;
    if(charParam.toString() === "-") return true;
    if(charParam.toString() === "*") return true;
    if(charParam.toString() === "/") return true;
    return charParam.toString() === "%";
}

/**
 * определение типа операции
 * @param operationString
 * @returns {string}
 */
export function getOperationType(operationString) {
    if(operationString.length === 0) {
        return "EMPTY";
    }

    if(operationString.length === 1) {
        if(isVariableName(operationString.charAt(0))) {
            return "WRITE_VARIABLE";
        }
    }

    if(operationString.length === 3) {
        if(isVariableName(operationString.charAt(0))) {
            if(isVariableName(operationString.charAt(2))) {
                if(operationString.charAt(1) === "=") {
                    return "VARIABLE_SET_VARIABLE";
                }
            }
        }
    }

    if(operationString.length === 5) {
        if (isVariableName(operationString.charAt(0))) {
            if (isVariableName(operationString.charAt(2))) {
                if (isVariableName(operationString.charAt(4))) {
                    if (operationString.charAt(1) === "=") {
                        if (isMath(operationString.charAt(3))) {
                            return "MATH_OPERATION";
                        }
                    }
                }
            }
        }
    }

    if(isVariableName(operationString.charAt(0))) {
        if(operationString.charAt(1) === "=") {
            const rightPart = operationString.split("=")[1].toString();
            if(Number.isInteger(rightPart - 1 + 1)) {
                return "VARIABLE_SET_NUMBER";
            }
        }
    }

    throw new Error();
}

/**
 * задать значение переменной
 * @param variables
 * @param key
 * @param value
 */
export function setVariable(variables, key, value) {
    variables[key.toString()] = parseInt(value.toString());
}

/**
 * получить значение переменной
 * @param variables
 * @param key
 * @returns {number}
 */
export function getVariable(variables, key) {
    const value = variables[key.toString()];
    if(!value) {
        return 0;
    }
    return parseInt(value);
}

/**
 * операция присвоения одной переменной значения другой переменной
 * @param operationString
 * @param variables
 */
export function variableSetVariable(operationString, variables) {
    const value = getVariable(variables, operationString.charAt(2));
    setVariable(variables, operationString.charAt(0), value);
}

/**
 * операция присвоения переменной числового значения
 * @param operationString
 * @param variables
 */
export function variableSetNumber(operationString, variables) {
    const value = parseInt(operationString.split("=")[1]);
    setVariable(variables, operationString.charAt(0), value);
}

/**
 * операция выполнения математического действия над переменными
 * @param operationString
 * @param variables
 * @returns {null}
 */
export function mathOperation(operationString, variables) {
    const key_1 = operationString.charAt(0);
    const key_2 = operationString.charAt(2);
    const key_3 = operationString.charAt(4);
    const math = operationString.charAt(3);
    const value_2 = parseInt(getVariable(variables, key_2).toString());
    const value_3 = parseInt(getVariable(variables, key_3).toString());
    if(math === "+") {
        setVariable(variables, key_1, parseInt(value_2 + value_3));
        return null;
    }
    if(math === "-") {
        setVariable(variables, key_1, parseInt(value_2 - value_3));
        return null;
    }
    if(math === "*") {
        setVariable(variables, key_1, parseInt(value_2 * value_3));
        return null;
    }
    if(math === "/") {
        if(value_3 !== 0) {
            setVariable(variables, key_1, parseInt(value_2 / value_3));
        } else {
            throw new Error();
        }
        return null;
    }
    if(math === "%") {
        if(value_3 !== 0) {
            setVariable(variables, key_1, parseInt(value_2 % value_3));
        } else {
            throw new Error();
        }
        return null;
    }
}

/**
 * последовательное выполнение всех операций
 * @param operationsArray
 * @returns {number}
 */
export function visitAllOperations(operationsArray) {
    const variables = {};
    for(let i = 0; i < operationsArray.length; i++) {
        const operationString = operationsArray[i].toString();
        const operation = getOperationType(operationString.toString());
        switch (operation) {
            case "VARIABLE_SET_VARIABLE": variableSetVariable(operationString, variables); break;
            case "VARIABLE_SET_NUMBER": variableSetNumber(operationString, variables); break;
            case "MATH_OPERATION": mathOperation(operationString, variables); break;
        }
        if(operation === "WRITE_VARIABLE") {
            return parseInt(getVariable(variables, operationString.charAt(0)).toString());
        }
    }
    return 0;
}

/**
 * главная функция для вызова
 * @param code
 * @returns {*}
 */
export function main(code) {
    let result = undefined;
    try {
        result = visitAllOperations(getOperationsArray(killNextLineChar(killSpaces(code.toString()))));
        return parseInt(result.toString());
    } catch (err) {
        return "ERROR";
    }
}
