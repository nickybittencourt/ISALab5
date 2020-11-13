function validateForm() {
    var x = document.forms["submit"]["word"].value;
    
    if (x == "" || x.match(/^[0-9]+$/) != null) {
        alert("You must enter a valid word");
        return false;
    }

    return true
}