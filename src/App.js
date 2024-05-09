import { useReducer } from "react"
import DigitButton from "./DigitVButton"
import OperationButton from "./OperationButton"
import "./App.css"

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'

}

// function reducer(state, action)
function reducer(state, {type, payload}) {

    switch(type) {
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite) {
                return{
                    // overwrite if user hits a new number
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false,
                }
            }
            if (payload.digit === "0" && state.currentOperand === "0") {
                return state
            }
            if (payload.digit === "." && state.currentOperand.includes(".")) {
                return state
            }
            return {
                ...state,
                // string interpolation
                currentOperand:`${state.currentOperand || ""}${payload.digit}`
            }
        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand == null && state.previousOperand == null) {
                return state
            }

            // if user wants to switch the operator
            if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                }
            }

            if (state.previousOperand == null ) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }

            return {
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null
            }

        case ACTIONS.CLEAR:
            return {}
        case ACTIONS.DELETE_DIGIT:
            if(state.overwrite) {
                return {
                    ...state,
                    // to be more specific for the status where we are in
                    overwrite: false,
                    currentOperand: null            
                }
            }
            // if we don't have a currentOperand, we can't delete anything from it
            if (state.currentOperand == null) return state
            // remove it if there is only one digit left in the currentOperand
            if (state.currentOperand.length === 1) { 
                // the last digit user wants to reset the value to null instead of leaving it as a value of an empty string
                return { ...state, currentOperand: null } 
            }

            return {
                ...state,
                // remove the last digit from this currentOperand
                currentOperand: state.currentOperand.slice(0, -1) // 0: save it form, -1 : delet from, -1 means the last item
            }


        case ACTIONS.EVALUATE:
            if (
                // no action if user doesn't put any numbers
                state.operation == null || 
                state.currentOperand == null ||
                state.previousOperand == null
            ) {
                return state 
            }

            return {
                
                ...state,
                // overwrite it when every time we do the evaluate
                overwrite: true,
                // show the result in currentOperand from previourOperand
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state)

            }
    }
}

function evaluate({ currentOperand, previousOperand, operation}) {
    const prev = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)
    if (isNaN(prev) || isNaN(current)) return "" // isNaN: if they are not a num
    // by default, the computation is nothing
    let computation = ""
    // otherwise switch through a bunch of different statements for the operation
    switch (operation) {
        case "+":
            computation = prev + current
            break
        case "-":
            computation = prev - current
            break
        case "×":
            computation = prev * current
            break
        case "÷":
            computation = prev / current
            break

    }

    return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", { // English format
    maximumFractionDigits: 0, // make sure there is no fractions
})
function formatOperation(operand) {
    if (operand == null) return 
    // split it on the decimal
    // to get the integer portion and the decimal portion
    // if user doesn't put decimal then it will be null
    const [integer, decimal] = operand.split(".")
    // calls the format founction for integer portion
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

    const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(
        reducer,
    {}
)
    
    return (
        <div className="calculator-grid">
            <div className="output">
                <div className="previous-operand">{formatOperation(previousOperand)} {operation}</div>
                <div className="current-operand">{formatOperation(currentOperand)}</div>
            </div>
            <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
            <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
            <OperationButton operation="÷" dispatch={dispatch} />
            <DigitButton digit="1" dispatch={dispatch} />
            <DigitButton digit="2" dispatch={dispatch} />
            <DigitButton digit="3" dispatch={dispatch} />
            <OperationButton id="operators" operation="×" dispatch={dispatch} />
            <DigitButton digit="4" dispatch={dispatch} />
            <DigitButton digit="5" dispatch={dispatch} />
            <DigitButton digit="6" dispatch={dispatch} />
            <OperationButton id="operators" operation="+" dispatch={dispatch} />
            <DigitButton className="operators" digit="7" dispatch={dispatch} />
            <DigitButton digit="8" dispatch={dispatch} />
            <DigitButton digit="9" dispatch={dispatch} />
            <OperationButton id="operators" operation="-" dispatch={dispatch} />
            <DigitButton digit="." dispatch={dispatch} />
            <DigitButton digit="0" dispatch={dispatch} />
            <button className="span-two"
            onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
            >
            =
            </button>
            <div className="footer">
                <p>© 2024 React Calculator. All rights reserved.</p>
            </div>
        </div>
    )
}

export default App

// Title JSX
const Title = (
    <div className="title">
        <h1>Simple React Calculator App</h1>
    </div>
);

// Footer JSX
const Footer = (
    <div className="footer">
        <p>© 2024 Simple React Calculator App. All rights reserved.</p>
    </div>
);