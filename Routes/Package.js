const {getPackages,getPackageDetails,getPackageById}=require('../Controllers/PackageController')
const express= require('express')
const router= express();

router.get('/',getPackages);
router.get('/details/:id',getPackageById)

module.exports=router;