export class Logger {
  log<T>(message: T) {
    console.log(message);
  }

  info<T>(message: T) {
    console.log(message);
  }

  error<T>(message: T) {
    console.error(message);
  }
}

export const logger = new Logger();
