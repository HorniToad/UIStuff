let div = document.getElementsByClassName("hideBoxOuter");
for(let i = 0; i < div.length; i++) {
	let divHideBox = div[i].querySelector(".hideBoxInner"); 
	let divBtn = div[i].querySelector(".hideBtn");

	divBtn.addEventListener("click", function() {
		$("#" + div[i].id).children(".hideBoxInner").slideToggle();
	})
}