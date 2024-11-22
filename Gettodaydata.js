const {FetchData}=require('./Fetchdatas')
async function Gettodaydata(params) {

    const today = new Date();

const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 since months are zero-based
const day = today.getDate().toString().padStart(2, '0'); // Adding padding for single-digit days

const formattedDate = `${year}/${month}/${day}`;
const startTimestamp = new Date(formattedDate ).getTime();
const endTimestamp = new Date(formattedDate ).getTime();
console.log(startTimestamp)


}
module.exports={Gettodaydata}