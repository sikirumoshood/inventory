
/**
 *
 * @param {Object} arg - Data to encode
 */
const encoder = (arg) => {
    const data = Buffer.from(arg).toString('base64');
    return data;
  };
  
  /**
   *
   * @param {Object} arg - Data to decode
   */
  const decoder = (arg) => {
    const data = Buffer.from(arg, 'base64').toString('ascii');
    return data;
  };
  
  export { encoder, decoder };
  