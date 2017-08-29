$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append(
        "<div class='article' data-id='" + data[i]._id + "'> <h2>" + data[i].title + "</h2>" +
        "<a href='" + data[i].link + "' class='articleLink'>Read article</a>" +
        "</div>");
  }
});

$("#date").append(moment().format("MMMM Do YYYY"));


$("#articles").on("click", "h2", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");
  var previousThis = this;
  // var thisA = $("h2", this);
  // console.log(thisA);

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .done(function(data) {
      console.log(data);
      
      $(previousThis).append("<div id='noteForm'><textarea id='bodyinput' name='body'></textarea>"
      + "<button data-id='" + data._id + "' id='savenote'>Save Note</button></div>");

      if (data.note) {
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .done(function(data) {
      console.log(data);
      $("#noteForm").empty();
   });
});
 