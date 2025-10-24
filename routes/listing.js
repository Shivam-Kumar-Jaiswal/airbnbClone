const  express =require('express')
const router=express.Router();
const List=require("../models/listing.js");
const wrapAsync=require('../utils/wrapAsync.js');
const listingController=require("../controllers/listing.js")
const {isValidate,isOwner,validateListing}=require('../middleware.js')
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage })

router.route("/")
.get(wrapAsync(listingController.index))
.post(isValidate,upload.single('listing[image]'),validateListing,wrapAsync(listingController.add))

router.get("/new",isValidate,(listingController.create))

router .get("/search",wrapAsync(listingController.search))
//router.get("/book",isValidate,(listingController.book))
router.get("/:id/book",isValidate,(listingController.book))
router.get("/payment",listingController.payment)
router.get("/help",listingController.help)
router.route("/:id")
 .get(wrapAsync(listingController.details))
.put(isValidate,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.update)
)
.delete(isValidate,isOwner,wrapAsync(listingController.destroy))

router.get("/:id/edit",isValidate,isOwner,wrapAsync(listingController.edit))
module.exports=router;