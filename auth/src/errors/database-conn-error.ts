import { CustomError } from './custom-error'

export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to database';
  statusCode = 500

  constructor() {
    super('something went bad in the database connection');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  };

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}