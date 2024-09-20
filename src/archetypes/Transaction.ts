export enum TRANSACTION_TYPE {
    CREDIT = 'credit',
    DEBIT = 'debit'
}

export interface Transaction {
    date: Date,
    amount: number,
    type: TRANSACTION_TYPE,
    tag: string[],
    description: string,
    _id?: string
}

export interface Tag {
    _id: string,
    tag: string,
    color: string
}