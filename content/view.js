function hide(divName)
{
    var x = document.getElementById(divName);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }

}

function displayOptions()
{
    var selectedOption = document.getElementsByName("webAuthnRequestTypeMenu")[0].value;
    var getOptions = document.getElementById("getOptions");
    var createOptions = document.getElementById("createOptions");

    if (selectedOption === "get") {
      getOptions.style.display = "block";
      createOptions.style.display = "none";
    } 
    else if (selectedOption ==="create") {
        getOptions.style.display = "none";
        createOptions.style.display = "block";
    } 
    else {
        getOptions.style.display = "none";
        createOptions.style.display = "none";
    }

}