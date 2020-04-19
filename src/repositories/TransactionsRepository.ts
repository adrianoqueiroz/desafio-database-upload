import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance: Balance = { income: 0, outcome: 0, total: 0 };

    balance.income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => +total + +transaction.value, 0);

    balance.outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((total, transaction) => +total + +transaction.value, 0);

    balance.total = balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsRepository;
