//we are creating a slot machine 

// 1. deposite some money 
//2. determine number of lines to bet on
//3. collect a bet ammount
//4. spin the slot machine
//5. chceck if the user won
//6. give the user their winnings
//7. play again


const prompt = require("prompt-sync")();   //for user input
//global variables are written in snake case 
const ROWS = 3;
const COLS = 3;
//objects 
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

const SYMBOLS_VALUE = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}



//function to deposit the money
const deposit = () => {
    //we will ask the user unless he gives a valid number
    while (true) {
        const depositAmount = prompt("Enter a deposit ammount: ");
        const numberDepositAmount = parseFloat(depositAmount)
        //parseFloat will take a floating point number and not do anything but if we were to input a string in it then it will rerturn NaN(not a number)

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again");
        }
        else //valid number is written
        {
            return numberDepositAmount;
        }
    }
};

//to determine the number of lines to bet on
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines)
        //parseFloat will take a floating point number and not do anything but if we were to input a string in it then it will rerturn NaN(not a number)

        if (isNaN(numberOfLines) || numberOfLines > 3 || numberOfLines < 1) {
            console.log("Incorrect number of lines, try again");
        }
        else //valid number is written
        {
            return numberOfLines;
        }
    }
};

//collecting a bet ammount
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the total bet: ");
        const numberBet = parseFloat(bet)
        //parseFloat will take a floating point number and not do anything but if we were to input a string in it then it will rerturn NaN(not a number)

        if (isNaN(numberBet) || numberBet > balance / lines || numberBet <= 0) {
            console.log("Invalid Bet, try again");
        }
        else //valid number is written
        {
            return numberBet;
        }
    }
}

//spininng -> for spinning we don;t need to take in diff parameters but just generate randomy select reel 
//we need to generrate individual column
const spin = () => {
    const symbols = []; //array
    //loop through all of the different entries of object for every key- value pair
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        // console.log(symbol,count);   
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);   //pushing into the array 
        }
        // console.log(symbols);
    }

    const reels = [];   //each array will denote the columns in our slot machine
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbol = [...symbols]; //copy of the symbols[]
        //we are gnereating the available symbol and then in the next for loop we are going to remove those elements
        for (let j = 0; j < ROWS; j++) {
            //random will give a floating point number in 0 to 1; and multiplying it with length will give us a random floating point number in 0 to length of the array but for indices we need a whole number so for that we will take a floor value instead of ceil so that at the last index we don't go out of bounds 
            const randomIndex = Math.floor(Math.random() * reelSymbol.length);
            const selectedSymbols = reelSymbol[randomIndex];
            reels[i].push(selectedSymbols);
            //splice will remove the element at that index and 1 signfies the number of elements to be removed from there
            reelSymbol.splice(randomIndex, 1);
        }
    }

    return reels

}
/* 
    But we will have to transpose the array because what we have now is
    [[A B C],[D D C], [C B A]]
    every array is actually a cloumn in our slot machine
    but for win or loss we will have to check on every row
    and that will be difficult instead we will just transpose it
    [[A D C], [B D B], [C C A]]
    now every array will have the row
    SO WE NEED TO TRANSPOSE
*/
const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};
const printRows = (rows) => {
    for (const row of rows) {
        //here row will be an array
        let rowString = ""; //what we want to see is A|B|C
        for (const [i, symbol] of row.entries()) {   //different way
            rowString += symbol;
            //if its the last index then we do not need the pipe
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

//checking if the user has won or not
const getWinning = (rows, bet, lines) => {
    let winnings = 0;
    //the bet on the number of lines
    for (let row = 0; row < lines; row++) {
        //for every line
        const symbols = rows[row];  //all the symbols in a row
        let allSame = true;
        //we will check if all the symbols are same or not
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        //if all of them are same then its a win in that line
        if (allSame) {
            winnings += bet * SYMBOLS_VALUE[symbols[0]];
        }
    }
    return winnings;
};
// let reels = spin();
// console.log(reels)
// let rows  = transpose(reels); 
// console.log(rows)
// printRows(rows);
// // const depositAmount = deposit();
// console.log(depositAmount);
// let balance  = deposit();
// const numberOfLines = getNumberOfLines();
//console.log(numberOfLines);
// const bet  = getBet(balance, numberOfLines);

const game = () => {
    let balance = deposit();
    while (true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet*numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinning(rows, bet, numberOfLines)
        balance+=winnings;
        console.log("You won, $" + winnings.toString());
        
        if(balance <= 0 ){
            console.log("Insufficient Money!");
            break;
        }

        const playAgain = prompt("Do u want to play again(y/n)?")

        if(playAgain != "y") break;
    }

};