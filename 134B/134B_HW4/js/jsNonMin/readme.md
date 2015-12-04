CSS:Go

Members:
	Han Gwak
	Paul Kim
	Dennis Ku
	Abel John
	Aaron Leong

Live site:
https://cssgo134b.firebaseapp.com/


Login Credentials and Technologies Used:

	MixPanel(https://mixpanel.com/): 
		User: dennisku94@gmail.com
		Pass: CSSGO31

	RayGun(https://raygun.io/):
		User: dennisku94@gmail.com
		Pass: CSSGO331

	Parse(https://www.parse.com/):
		User: a3leong@gmail.com
		Pass: 1234567a

	Roost(https://goroost.com/):
		User: abeljohn@gmail.com
		Pass: cssgo331

	PhoneGap(http://phonegap.com/)

Reasons behind the Tech Choices:

	MixPanel: Allows us to easily monitor user activity as well as user recurrence (On a free trial, currently)

	RayGun: Simple method to track errors and display warnings. (On a free trial, currently)

	Parse: Allowed use to create a cloud storage database for both the user accounts and the user information.

	Roost: Allows us to broadcast notifications to users (On a free trial, currently). 
		There is an option in roost for individual notifications, and we know how to implement it. Unfortunately, the individual notifications is part of the roost pro package and would cost us 29.99 per month to use. As such, we have sent broadcasted a few notifactions to our live site but we will not be able to show you that we know how to send it to individuals at this point in time. 

		Desktop notifications/scheduling also require us to purchase the pro version. Essentially, we know exactly how to implement the required functions, but we are not willing to spend the money at this point in time.

	PhoneGap: Allows us to easily create a mobile app of our website using existing frameworks.

Issues, Limitations, Challenges:

	Individual Notifications - Individual notifications is a function of the Pro-version of GoRoost, and therefore we do not have it implemented. We do, 
	however, have an implementation for broadcast notifications to show that we know how to resolve the requirement.

	Minification - In order to minify our code, it was necessary to combine all the JS into one file. This created a rather large issue as we had multiple JS files that now required refactoring to ensure that everything worked as intended. This took a substantial amount of time and required multiple people several hours to ensure that the functionalities were working. 

	Parse - Transferring all the local storage to parse caused Asych issues that had to be dealt with, and forced us to redo many algorithms that we had in place. Parse also has substantial issues. Sometimes parse returns a bad request, when the request is actually okay. We looked through our functionalities and did research to find that the issue is in Parse and not in our code.

Functionalities Required + Status:
	1) Finish Application - COMPLETE
	2) Error Monitoring (RayGun) - COMPLETE 
	3) Usage Monitoring (MixPanel) - COMPLETE
	4) Minification(minify.js) - COMPLETE
	5) Phone App(PhoneGap) - COMPLETE
	6) Readme - COMPLETE

What each person did:
	Han Gwak
	Work Summary:
	Established phone gap and helped with all the other functionalities

	Paul Kim
	Work Summary:
	Worked on Parse, minification, and making sure the application was finished. Ran validation as well.

	Dennis Ku
	Work Summary:
	Worked on Error monitoring, usage monitoring, minification, and CSS

	Abel John
	Work Summary:
	Worked on Error monitoring, usage monitoring, CSS issues, and created the README.

	Aaron Leong 
	Work Summary:
	Wrote functions to handle Parse database including authentication and habit storage. Also worked on minification.


Functionalities that we added that were not required:

We added a no habit message on habit list and a log out and current user button on the top right of list.Additionally, depending on whether or not the user is currently logged in, the website will take you to the list page or the log in page, respectively. 