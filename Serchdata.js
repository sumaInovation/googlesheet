App.post('/serch',async(req,res)=>{
    const readData=await FetchData('Sheet1');
    const startTimestamp = new Date(req.body.startDate).getTime();
    const endTimestamp = new Date(req.body.endDate).getTime();
    const query=readData.filter(row=>{
     return (new Date(row[0]).getTime() >= startTimestamp && new Date(row[0]).getTime() <= endTimestamp)
         
     }) 
      res.send(query);

 })

