$(document).ready(function(){
   $("#signin").click(function(event){
   	event.preventDefault;
   	$.ajax({
   		type: "GET",
        url: "/register" // Modify the url according to your application logic
   	}).done(function(){
   		$("#modal1").show();
   	});
});
