// 1.
let num1=3; let num2=4;
function multiply(num1,num2){
    return num1*num2;
}
console.log(multiply(num1,num2));

// 2.
// Input number 
let number =4;
// Determine if the number is even or odd
function checkEvenOdd(number) {
    if (number % 2 === 0) {
        return `The number ${number} is even`;
    } else {
        return `The number ${number} is odd`;
    }
}
console.log(checkEvenOdd(number)); 

// 3. 
// Calculate sum of numbers using for loop
function calculatesumofnumbers(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}
console.log(calculatesumofnumbers(9));

// 4.
// A list of my favourite fruits
let Myfavouritefruits = ["Pineapple", "Strawberry", "Apple", "Grapes", "Oranges"];
console.log(Myfavouritefruits);
// For loop array to print each fruit
for (let i = 0; i < Myfavouritefruits.length; i++) {
    console.log(Myfavouritefruits[i]);
}
// Change the value of the second fruit on the list
Myfavouritefruits[1] = "Kiwi";
console.log(Myfavouritefruits);

// 5.
// Input a standard function to greet a user
function greetUser(name) {
    if (name === undefined)
        name = "Guest";
    return `Hello, ${name}!`;
}
// Example: 
console.log(greetUser("Bhoke")); 
console.log(greetUser());
// Refactor it into an ES6 arrow function
const greet= (name = "Guest") => {
    return `Hello, ${name}!`;
};
console.log(greet("Bhoke")); 
console.log(greet());

// 6.
// Create a student class
class student {
    constructor(name, grade) {
        this.name = name;
        this.grade = grade;
    }
}
// Create a method to determine whether the student has passed or failed
class person {
    constructor(name, grade) {
        this.name = name;
        this.grade = grade;
        this.passingGrade = 50;
    }
    checkPassFail() {
        if (this.grade >= this.passingGrade) {
            return `${this.name} has passed.`;
        } else {
            return `${this.name} has failed.`;
        }
    }
}
// Example:
let student1 = new person("Bhoke", "85");
console.log(student1.checkPassFail());
let student2 = new person("Mwita", "45");
console.log(student2.checkPassFail()); 

// 7.
// Create a promise that resolves after 2 seconds delay using setTimeout
const myPromise = new Promise((resolve) => {
    setTimeout(() => {
        resolve("task complete!");
    }, 2000);
});

// Use .then() to log the resolved value
myPromise.then((message) => {
    console.log(message);
});

console.log(" Promise started - waiting 2 seconds...");

// 8.
// A function to calaculate the factorial of a number 
function calculateFactorial(number) {
    try {
        // Validate input
        if (number === undefined || number === null) {
            throw new ReferenceError("Input is undefined or null");
        }
        
        if (typeof number !== 'number') {
            throw new TypeError(`Expected a number, but received ${typeof number}`);
        }
        
        if (isNaN(number)) {
            throw new Error("Input is NaN (Not a Number)");
        }
        
        if (!Number.isInteger(number)) {
            throw new Error(`Factorial is only defined for integers. Received: ${number}`);
        }
        
        if (number < 0) {
            throw new RangeError(`Factorial is not defined for negative numbers. Received: ${number}`);
        }
        
        // Recursive factorial calculation
        if (number === 0 || number === 1) {
            return 1;
        }
        
        return number * calculateFactorial(number - 1);
        
    } catch (error) {
        console.error(` ${error.name}: ${error.message}`);
        return null;
    }
}

// Examples with various inputs
console.log("=== Robust Factorial Calculator ===\n");

const testValues = [5, 0, 1, undefined, "test", null, NaN, -2, 3.7, 10];

testValues.forEach(value => {
    const result = calculateFactorial(value);
    if (result !== null) {
        console.log(` factorial(${value}) = ${result}`);
    }
    console.log("---");
});