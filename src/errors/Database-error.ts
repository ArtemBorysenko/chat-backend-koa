class DatabaseError extends Error {
    status: number
    errors: { title: string, msg: string | undefined }[]
    constructor(errors: Error, status: number) {
        const message = "MongoDB error"
        super(message)
        this.status = status || 500
        this.message = message
        this.errors = [
            {
                title: errors.message,
                msg: errors.stack,
            },
        ]
    }
}

export default  DatabaseError
