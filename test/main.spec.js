"use strict";

import { main, killSpaces, isVariableName, getOperationType } from '../main.js';
import assert from 'assert';

describe("killSpaces", function () {
    it("убрать пробелы из функции", function () {
        assert.equal(killSpaces("hello my world"), "hellomyworld");
        assert.equal(killSpaces("aaa   bbb   ccc"), "aaabbbccc");
        assert.equal(killSpaces("abcd"), "abcd");
    });
});

describe("isVariableName", function () {
    it("является ли строка именем переменной", function () {
        assert.equal(isVariableName("A"), true);
        assert.equal(isVariableName("Z"), true);
        assert.equal(isVariableName("a"), false);
        assert.equal(isVariableName("z"), false);
        assert.equal(isVariableName("5"), false);
        assert.equal(isVariableName("Aa"), false);
        assert.equal(isVariableName(" "), false);
        assert.equal(isVariableName("+"), false);
    });
});

describe("getOperationType", function () {
   it("получение типа операции", function () {
       assert.equal(getOperationType("A"), "WRITE_VARIABLE");
       assert.equal(getOperationType("Z"), "WRITE_VARIABLE");
       assert.equal(getOperationType("A=B"), "VARIABLE_SET_VARIABLE");
       assert.equal(getOperationType("K=K"), "VARIABLE_SET_VARIABLE");
       assert.equal(getOperationType("X=5"), "VARIABLE_SET_NUMBER");
       assert.equal(getOperationType("X=555"), "VARIABLE_SET_NUMBER");
       assert.equal(getOperationType("X=-55"), "VARIABLE_SET_NUMBER");
       assert.equal(getOperationType("X=0"), "VARIABLE_SET_NUMBER");
       assert.equal(getOperationType(""), "EMPTY");
       assert.equal(getOperationType("A=B+C"), "MATH_OPERATION");
       assert.equal(getOperationType("A=B-C"), "MATH_OPERATION");
       assert.equal(getOperationType("A=B*C"), "MATH_OPERATION");
       assert.equal(getOperationType("A=B/C"), "MATH_OPERATION");
       assert.equal(getOperationType("A=B%C"), "MATH_OPERATION");
   });
});

describe("main", function() {
    it("вывод на экран существующей переменной", function() {
        assert.equal(main("A=25;A;"), 25);
        assert.equal(main("Z=123;Q=34;Z;"), 123);
    });

    it("вывод на экран незаданной переменной", function() {
        assert.equal(main("A;"), 0);
        assert.equal(main("A=12;B;"), 0);
        assert.equal(main("A=34;B=123;W;"), 0);
    });

    it("использование базовых арифметических операций", function() {
        assert.equal(main("A=12;B=18;C=A+B;C;"), 30);
        assert.equal(main("A=12;B=18;C=A-B;C;"), -6);
        assert.equal(main("A=12;B=18;C=A*B;C;"), 216);
        assert.equal(main("A=12;B=18;C=A/B;C;"), 0);
        assert.equal(main("A=12;B=18;C=A%B;C;"), 12);
        assert.equal(main("X=26;Y=7;A=X/Y;A;"), 3);
        assert.equal(main("X=26;Y=7;A=X%Y;A;"), 5);
    });

    it("попытка деления на ноль", function () {
        assert.equal(main("N=25;X=0;A=N/X;A;"), "ERROR");
        assert.equal(main("N=0;X=0;A=N/X;A;"), "ERROR");
    });

    it("попытка взять остаток от деления на ноль", function() {
        assert.equal(main("T=12;P=0;F=T%P;F;"), "ERROR");
        assert.equal(main("T=-123;P=0;F=T%P;F;"), "ERROR");
        assert.equal(main("T=0;P=0;F=T%P;F;"), "ERROR");
    });

    it("составные арифметические операции", function () {
        assert.equal(main("A=12;B=15;S=A+B;D=2;K=S*D;P=K;P;"), 54);
        assert.equal(main("X=56;Y=-123;Z=34;A=0;A=A+X;A=A+Y;A=A+Z;A;"), -33);
        assert.equal(main("A=19;B=15;X=A+B;C=10;D=7;Y=C+D;V=X/Y;V;"), 2);
    });

    it("ввод некорректных данных", function() {
        assert.equal(main("HELLO"), "ERROR");
        assert.equal(main("X=25+34;X;"), "ERROR");
        assert.equal(main("A=5;B=6;C=7;X=A+B+C;X;"), "ERROR");
        assert.equal(main("7;"), "ERROR");
        assert.equal(main("4=5;"), "ERROR");
    });

    it("присвоение значения несуществующей переменной", function () {
        assert.equal(main("A=B;A;"), 0);
        assert.equal(main("A=123;A=B;A;"), 0);
    });
});

