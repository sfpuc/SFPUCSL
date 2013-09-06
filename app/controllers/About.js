$.button.addEventListener("click", function(){
	var emailDialog = Titanium.UI.createEmailDialog();
	emailDialog.subject = "Regarding StreetlightsSF";
	emailDialog.toRecipients = ['YOUREMALADDRESSHERE']; 
	emailDialog.messageBody = 'To whom it may concern,\n\n\n\nStreetlights SF';
	emailDialog.open(); 
});
