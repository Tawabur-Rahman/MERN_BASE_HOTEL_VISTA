const express = require("express");
const router = express.Router();
//Joi for Validation
const { listingSchema } = require("../schema.js");
//Error Handel===============
const WrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
//Require Schema==============
const Listing = require("../models/listing");
//MiddleWare
let { isLoggedIn, isOwner } = require("../middleware.js");
//MVC=======================
const listingController=require("../controllers/listing.js")
//Require Multer ============
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage})

//Validation===========
const ValidateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Router Route==============
router.route("/")
.get(WrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),ValidateListing,WrapAsync(listingController.createListing));


//Create Route==============
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(WrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
 ValidateListing,
  WrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  WrapAsync(listingController.destroyListing)
);

//Update Route==========
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  ValidateListing,
  WrapAsync(listingController.renderEditForm)
);

router
module.exports = router;
