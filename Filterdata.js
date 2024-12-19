const {FetchData}=require('./Fetchdatas')
async function Filterdata(SHEET,starttime,endtime) {
const today = new Date();
const startTimestamp = new Date(starttime).getTime();
const endTimestamp = new Date(endtime ).getTime();
const readData=await FetchData(SHEET);//Fetching All data from sheet

try{

    const query=readData.filter(row=>{ 
       
        return (new Date(row[0]).getTime() >= startTimestamp && new Date(row[0]).getTime() <= endTimestamp)
                  
    }) 
    return query;
  
      

}catch(error){
  return null
  console.log("ERROR",error);  
}


}



module.exports={Filterdata}