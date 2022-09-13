import { AbstractException }        from '../exceptions/abstract.exception';

export const WrapExceptions = async (callback: () => Promise<any>) => {
  try {
    await callback();
  } catch (err) {
    if (err instanceof AbstractException) {
      console.log(`[${Object.getPrototypeOf(err).constructor.name}]: ${err.message}`);
    } else {
      throw err;
    }
  }
}
