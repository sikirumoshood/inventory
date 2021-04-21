class ResponseHelper {
    /***
     * @description Sends http error response to the client
     * @param {Object} res
     * @param {string} errMsg
     */
    static Error (res: any, errMsg: string) : any {
        return res.status(400).json({ msg: errMsg });
    }


    /*** 
     * @description Sends http success response to the client
     * @param res 
     * @param data 
     */
    static Success (res: any, data: object) : any {
        return res.status(200).json(data);
    }
}

export default ResponseHelper;
