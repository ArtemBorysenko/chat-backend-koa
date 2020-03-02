import Router from "koa-router"
import {UploadFileCtrl} from "../../../controllers"

export default () : Router => {
    const router = new Router()

    const UploadFileController = new UploadFileCtrl() //TODO cloudinary

    //TODO multer
    // router.post("/", multer.single("file"), UploadFileController.create);

    // router.delete("/", UploadFileController.delete)

    return router
}