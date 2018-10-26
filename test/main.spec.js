"use strict";

import { main, killSpaces, isVariableName, getOperationType } from '../main.js';
import assert from 'assert';

describe("killSpaces", function () {
    it("убрать пробелы из функции", function () {
        assert.equal(killSpaces("hello my world"), "hellomyworld");
    });
});

describe("isVariableName", function () {
    it("является ли строка именем переменной", function () {
        assert.equal(isVariableName("A"), true);
        assert.equal(isVariableName("Aa"), false);
    });
});

describe("getOperationType", function () {
   it("получение типа операции", function () {
       assert.equal(getOperationType("A"), "WRITE_VARIABLE");
       assert.equal(getOperationType("A=B"), "VARIABLE_SET_VARIABLE");
       assert.equal(getOperationType("X=555"), "VARIABLE_SET_NUMBER");
       assert.equal(getOperationType(""), "EMPTY");
       assert.equal(getOperationType("A=B+C"), "MATH_OPERATION");
   });
});

describe("main", function() {
    it("вывод на экран существующей переменной", function() {
        assert.equal(main("A=25;A;"), 25);
    });

    it("вывод на экран незаданной переменной", function() {
        assert.equal(main("A=12;B;"), 0);
    });

    it("использование базовых арифметических операций", function() {
        assert.equal(main("A=12;B=18;C=A+B;C;"), 30);
        assert.equal(main("A=12;B=18;C=A-B;C;"), -6);
        assert.equal(main("A=12;B=18;C=A*B;C;"), 216);
        assert.equal(main("A=12;B=6;C=A/B;C;"), 2);
        assert.equal(main("A=21;B=18;C=A%B;C;"), 3);
    });

    it("попытка деления на ноль", function () {
        assert.equal(main("N=25;X=0;A=N/X;A;"), "ERROR");
    });

    it("попытка взять остаток от деления на ноль", function() {
        assert.equal(main("T=12;P=0;F=T%P;F;"), "ERROR");
    });

    it("составные арифметические операции", function () {
        assert.equal(main("A=12;B=15;S=A+B;D=2;K=S*D;P=K;P;"), 54);
    });

    it("ввод некорректных данных", function() {
        assert.equal(main("HELLO"), "ERROR");
        assert.equal(main("A=5;B=6;C=7;X=A+B+C;X;"), "ERROR");
        assert.equal(main("7;"), "ERROR");
        assert.equal(main("4=5;"), "ERROR");
    });

    it("присвоение значения несуществующей переменной", function () {
        assert.equal(main("A=B;A;"), 0);
    });
});

