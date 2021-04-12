class ResponseHelper {
    static Error (res: any, errMsg: string) : any {
        return res.status(400).json({ msg: errMsg });
    }

    static Success (res: any, data: object) : any {
        return res.status(200).json(data);
    }
}

export default ResponseHelper;
