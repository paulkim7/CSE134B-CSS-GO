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
                location.href = "welcome.html";
	}).catch(function(err){
		alert("Error: " + err["message"]);
		// Handle error here
		console.log(err["message"]);
	});
}

function onClickLogin() {
	var email = document.getElementById("usermail").value;
	var pass = document.getElementById("password").value;

	login(email,pass).then(function(user) {
		alert("Welcome " + user.get("username"));
		window.location.href = "list.html";
	}).catch(function(err){
		// Handle error here
		console.log(err);
	});
}

function switchButton() {
	
	var button = document.getElementsByClassName("loginButton")[0];
	var accountQues = document.getElementById("loginOrSignup");

	if(button.value === "Login") {
		button.value = "Signup";
		accountQues.innerHTML = "Already have an account? <a href='#'' onclick='switchButton()'>Login</a>";
	}
	else {
		button.value = "Login";
		accountQues.innerHTML = "Don't have an account? <a href='#'' onclick='switchButton()'>Signup</a>";
	}

	// Change later
	localStorage.setItem("buttonStatus", button.value);
	
}

window.onload = function() {

	if(localStorage.getItem("buttonStatus") === null) {
		return;
	}

	var button = document.getElementsByClassName("loginButton")[0];
	var accountQues = document.getElementById("loginOrSignup");

	if(localStorage.getItem("buttonStatus") === "Signup") {
		button.value = "Signup";
		button.onclick = function(){ 
			onClickSignup(); 
			mixpanel.track('Login');
		};
		accountQues.innerHTML = "Already have an account? <a href='#'' onclick='switchButton()'>Login</a>";
		//alert("Signup Button");
	}
	else {
		button.value = "Login";
		button.onclick = function(){ 
			onClickLogin(); 
			mixpanel.track('SignUp');
		};
		accountQues.innerHTML = "Don't have an account? <a href='#'' onclick='switchButton()'>Signup</a>";
		//alert("Login Button");
	}

}

