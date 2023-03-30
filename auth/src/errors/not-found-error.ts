import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super('this route is not found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  };

  serializeErrors() {
    return [{
      message: 'page not found'
    }]
  }
}