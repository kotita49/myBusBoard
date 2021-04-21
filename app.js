function geek() {
    var doc = prompt("Please enter some text",
        "GeeksforGeeks");
    if (doc != null) {
        document.getElementById("g").innerHTML =
            "Welcome to " + doc;
    }
}