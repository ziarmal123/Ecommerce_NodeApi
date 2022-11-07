class ApiFeatures{
    constructor(query,queryStr){
    this.query=query;
    this.queryStr=queryStr
}
    search(){
        const keyword=this.queryStr.keyword ?{
            name:{
                $regex:this.queryStr.keyword,$options: "i",
            },
        }:{};
        // console.log(keyword)
        this.query=this.query.find({...keyword})
        return this;
    }

    filter(){
        const queryCopy={...this.queryStr};
        //Removing Some Feilds for Category
        const removeFeilds=["keyword","page","limit"];
        removeFeilds.forEach((key)=>delete queryCopy[key]);
        //Filter For pricing and Rating
        let queryStr=JSON.stringify(queryCopy);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`);

        
        // console.log("Filter data",queryStr)
        this.query= this.query.find(JSON.parse(queryStr));
        return this;
    }
    pagination(ResultPerPage){
        const currentPage=Number(this.queryStr.page) || 1;
        // console.log("Current Page",currentPage)
        const skip = ResultPerPage * (currentPage - 1)
        this.query=this.query.limit(ResultPerPage).skip(skip)
        return this;
    }

}
module.exports=ApiFeatures