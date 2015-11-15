// function onClickSignUp() {
//   var signUpText = document.getElementById("signInMessage");
//   signUpText.style.display = "block";
// }

	function onClickSignup() {
		var email = document.getElementById("usermail");
		var pass = document.getElementById("password");

		authenticate(email,pass).then(function(parseObj) {
			if(parseObj != null) {
				alert("Login success!");
				window.href = "list.html";
			}
		});
	}
