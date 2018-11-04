$("document").ready(function(){
    var cartoons = ["bugs bunny", "tasmanian devil", "road runner", "tweety"];   

    // create function that appends the value on the array into screen
    function dynamicButtons(){
        $("#gifButtons").empty();
        for(var i = 0; i<cartoons.length; i++){
            //create newbutton
            var btn = $("<button>");
            //add a class
            btn.addClass("data-gif");
            // give it an attr value
            btn.attr('data-value', cartoons[i]);
            //label
            btn.text(cartoons[i]).css("text-transform", "uppercase");

            //add favorite symbol
            if(i > 3){
                var toLove = $('<button>');
                toLove.attr("data-love", cartoons[i])
                toLove.addClass("love");
                toLove.text('♡');
                btn = btn.prepend(toLove);
                
                //add delete symbol
                var remove = $('<button>');
                remove.attr("data-remove", i);
                remove.addClass("delete");
                remove.text('X');
                btn = btn.append(remove);
            }
            //append
              $("#gifButtons").append(btn);

        }
    }

    //create function that adds element to cartoons arr 
    $("#submitBtn").on("click", function(event){
        event.preventDefault();
        var newCartoon = $("#gifInput").val().trim();
        //prevent empty string
        if(newCartoon){
            cartoons.push(newCartoon);
            dynamicButtons();
            $("#gifInput").val("");
        }
       
    })

    // add favorite to array permanantly  
    $(document).on('click', '.love', function(event){
          event.preventDefault();
          var newFavorite = $(this).attr("data-love");
          console.log(cartoons.indexOf(newFavorite));
          localStorage.setItem("favorite", JSON.stringify(cartoons));
      })
      
      //delete favorite
      $(document).on('click', '.delete', function(event){
          event.preventDefault();
          var deleteIndex = $(this).attr("data-remove");
          cartoons.splice(deleteIndex, 1);
          dynamicButtons();
          localStorage.setItem("favorite", JSON.stringify(cartoons));
      })


    //display images using ajax
    function displayGif (){
        var gif = $(this).attr("data-value"); 

        //intentionally pulling 9 images for esthetic reasons
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gif + "&api_key=dc6zaTOxFJmzC&limit=9";
  
        $.ajax({
          url: queryURL,
          method: "GET"
        })
          .then(function(response) {
            var results = response.data; 
  
            for (var i = 0; i < results.length; i++) {
                
              var gifDiv = $("<div>");
  
              stillState = results[i].images.fixed_height_still.url 
              animateState = results[i].images.fixed_height.url 
             
              // nice to have but meses up the flow and I have no time to fix... to revisit
            //   title = results[i].title
            //   title=  title.replace("GIF", "")
            //   var gifTitle = $("<p>").text(title).css("text-transform", "capitalize");
            //   gifDiv.append(gifTitle);
  
              var cartoonImage = $("<img>");
              cartoonImage.addClass('cartoon');
              cartoonImage.attr('data-state', 'still');  
              cartoonImage.attr("src", stillState);
              cartoonImage.attr("data-still", stillState);
              cartoonImage.attr("data-animate", animateState);
              gifDiv.prepend(cartoonImage);
              $("#gifPlacement").prepend(gifDiv);
            }
          });
        }
      
      // still and animate logic  
       $(document).on('click', '.cartoon', function(){
           var state = $(this).attr("data-state"); 
           if(state === 'still'){
                $(this).attr("src", $(this).attr("data-animate"));
                $(this).attr("data-state", "animate");
            }else{
                $(this).attr("src", $(this).attr("data-still"));
                $(this).attr("data-state", "still");
            }
      })
      
    $(document).on("click", ".data-gif", displayGif);
    var cartoons = JSON.parse(localStorage.getItem("favorite"));
    dynamicButtons();
    
})//end of ducument.ready
