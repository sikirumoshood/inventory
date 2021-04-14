const pgp = require('pg-promise');
class DbHelper {
    static getTxnMode () {
        const {TransactionMode, isolationLevel} = pgp.txMode;
        // Create a reusable transaction mode (serializable + read-only + deferrable):
        const mode = new TransactionMode({
            tiLevel: isolationLevel.serializable,
            readOnly: false,
            deferrable: false
        });

        return mode;
    }
}

export default DbHelper;
