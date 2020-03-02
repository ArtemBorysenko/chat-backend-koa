class ServerError extends Error {
    status: number
    errors: { msg: string }[] | Error
    constructor(message: string, status: number, type: string, errors: Error) {
        super(message)
        const defaultError = [
            {
                msg: message,
            },
        ]
        this.status = status
        this.message = type
        this.errors = errors ? errors : defaultError
    }
}

export default ServerError
