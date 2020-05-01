//heroku id:mceminem99@gmail.com , pass same as other heroku

var express = require("express"),
    app     = express(),
	flash   = require("connect-flash"),
	bodyParser    = require("body-parser"),
    request = require("request");

  app.set("view engine","ejs");
  app.use(flash());
  app.use(bodyParser.urlencoded({extended:true}));
app.set('trust proxy', 1);

  //require session for flash
    app.use(require("express-session")({
	cookie:{
    secure: true,
    maxAge:60000
       },
	secret:"rusty is the best dog in the world",
	resave: false,
	saveUninitialized:false
})); 
app.use(function(req,res,next){
	
	res.locals.error= req.flash("error");
	if(!req.session){
    return next(new Error('Oh no')) //handle error
}
	next(); 
})


//routes
app.get("/",function(req,res){
	res.render("search");
})

app.get("/results",function(req,res){
	var query=  req.query.search;
	var options = {
  method: 'GET',
  url: 'https://covid-19-data.p.rapidapi.com/country',
  qs: {format: 'json', name: query},
  headers: {
    'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
    'x-rapidapi-key': 'b2ca862059msh122f16c1ef6db19p1070a5jsnafea7d61da85'
  }
};
	
	request(options, function (error, response, body) {
	

	if(!error && response.statusCode== 200){
			var data = JSON.parse(body);
		   // console.log(data);
		   if(data.length===0){
			   req.flash("error","Type Country name correctly");
			   res.redirect("back");
		   }else{
			res.render("results",{data:data});
		   }
		}
});
});
app.listen(3000, () => {
    console.log(" server is listening now on 3000");
});


