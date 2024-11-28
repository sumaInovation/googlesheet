const {FetchData}=require('./Fetchdatas')
async function Gettodaydata(SHEET) {
const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 since months are zero-based
const day = today.getDate().toString().padStart(2, '0'); // Adding padding for single-digit days
const formattedDate = `${year}/${month}/${day}`;
const startTimestamp = new Date(formattedDate ).getTime();
const endTimestamp = new Date(formattedDate ).getTime();
const readData=await FetchData(SHEET);

try{

    const query=readData.filter(row=>{  
        return (new Date(row[0]).getTime() >= startTimestamp && new Date(row[0]).getTime() <= endTimestamp)
                  
    }) 
    const totalValue = query.reduce((acc, item) => {
        // Convert the string value to a number and add it to the accumulator
        return acc + Number(item[3]);
      }, 0); // Initialize the accumulator with 0
    
     return totalValue;

}catch(error){
  return 0;
  console.log("ERROR",error);  
}


}



module.exports={Gettodaydata}