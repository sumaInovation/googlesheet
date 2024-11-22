const express = require('express');
const router = express.Router();
const {FetchData}=require('./Fetchdatas')
router.post('/',async(req,res)=>{
    const readData=await FetchData(req.body.Sheet);
    console.log(req.body.Sheet)
    const startTimestamp = new Date(req.body.startDate).getTime();
    const endTimestamp = new Date(req.body.endDate).getTime();
    try{
        const query=readData.filter(row=>{  
        return (new Date(row[0]).getTime() >= startTimestamp && new Date(row[0]).getTime() <= endTimestamp)
                  
    }) 
    const totalValue = query.reduce((acc, item) => {
        // Convert the string value to a number and add it to the accumulator
        return acc + Number(item[3]);
      }, 0); // Initialize the accumulator with 0
       res.json({"Length":totalValue.toString()});
    }catch(err){
    res.json({"Length":"cannot read data"})
    }
   
        
     // Step 1: Sum the "Value" fields (which are the last element in each inner array)


 })

// Export the router
module.exports = router;                       