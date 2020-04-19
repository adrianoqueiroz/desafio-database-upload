import path from 'path';
import fs from 'fs';
import csv from 'csv-parse';
import Transaction from '../models/Transaction';

import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(importFilename: string): Promise<Transaction[]> {
    const importFilePath = path.join(uploadConfig.directory, importFilename);
    const importFileExists = fs.existsSync(importFilePath);

    const createTransaction = new CreateTransactionService();

    const rows: any[] = [];

    if (!importFileExists) {
      return [];
    }

    const finish = new Promise<Transaction[]>((resolve, reject) => {
      const transactions: Transaction[] = [];

      fs.createReadStream(importFilePath)
        .pipe(csv({ from_line: 1, trim: true }))
        .on('data', row => rows.push(row))
        .on('error', err => {
          reject(err);
        })
        .on('end', async () => {
          // eslint-disable-next-line no-plusplus
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];

            const [title, type, value, category] = row;
            // eslint-disable-next-line no-await-in-loop
            const transaction = await createTransaction.execute({
              title,
              value,
              type,
              category,
            });

            transactions.push(transaction);
          }

          fs.promises.unlink(importFilePath);
          resolve(transactions);
        });
    });

    const transactions = await finish;

    return transactions;
  }
}

export default ImportTransactionsService;
