var xmlDoc;

/* Generates an XMLDoc based on the file name given */
function loadXMLDoc(dname) {
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {
		// code for IE6, IE5
		xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
	}
	xmlhttp.open('GET',dname,false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;
	xmlDoc = xmlDoc.getElementsByTagName('data')[0];
}