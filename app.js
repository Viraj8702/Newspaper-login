const express=require("express");
const bodyparser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();
const port=3000;
app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static("Public"));    //making the css file static along with images

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");

});

app.post("/",function(req,res){
  console.log("post recieved");
  console.log(req.body.fname);
  console.log(req.body.lname);
  console.log(req.body.emailadd);

  const firstname=req.body.fname;
  const lastname=req.body.lname;
  const email=req.body.emailadd;

  var data={
    members: [
      {
        email_address: email,
        status:"subscribed",
        merge_fields:{
          FNAME:firstname,
          LNAME:lastname
        }
      }
    ]
  };

  const jsonData=JSON.stringify(data);

  const url="https://us18.api.mailchimp.com/3.0/lists/633963f952/";

  const options = {
    method:"POST",
    auth:"Viraj:09631fda4cdaf3dce985ea49089d57e4-us18"
  }

  const request = https.request(url,options,function(response){
    if(response.statusCode===200)
    {
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  })
  // request.write(jsonData);
  request.end();
});


app.post("/failure",function(req,res){
  res.redirect("/");
});


app.listen(process.env.PORT || port ,function(){
  console.log("Server is running on port "+port);
});
//api key
// 09631fda4cdaf3dce985ea49089d57e4-us18 (https://us18.admin.mailchimp.com/account/api/)

//list id
// 633963f952 (https://us18.admin.mailchimp.com/lists/settings/defaults?id=299150)
