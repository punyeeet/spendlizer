import { Transaction, TRANSACTION_TYPE } from "@/archetypes/Transaction";

export function calculateTotalCredit(transactions: Transaction[]): number {
    return transactions.reduce((total, transaction) => {
        return transaction.type === TRANSACTION_TYPE.CREDIT ? total + transaction.amount : total;
    }, 0);
}

export function calculateTotalDebit(transactions: Transaction[]): number {
    return transactions.reduce((total, transaction) => {
        return transaction.type === TRANSACTION_TYPE.DEBIT ? total + transaction.amount : total;
    }, 0);
}