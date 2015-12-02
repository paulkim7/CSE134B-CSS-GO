// function onClickSignUp() {
//   var signUpText = document.getElementById("signInMessage");
//   signUpText.style.display = "block";
// }

// Returns true on valid, false on invalid
function isValidEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Check for one cap letter, one numerical character, and a pass length of 5<=x<=15
function isValidPassword(pass) {
	var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,10}$/;
	return re.test(pass);

}


function onClickSignup() {
	var email = document.getElementById("usermail").value;
	var pass = document.getElementById("password").value;

	createUser(email,pass).then(function(user){
		alert("User sign in complete!");
		//window.location.href = "list.html";
	}).catch(function(err){
		// Handle error here
		console.log(err);
	});
}

function onClickLogin() {
	var email = document.getElementById("usermail").value;
	var pass = document.getElementById("password").value;

	login(email,pass).then(function(user) {
		alert("Welcome " + user.get("username"));
		//window.location.href = "list.html";
	}).catch(function(err){
		// Handle error here
		console.log(err);
	});
}