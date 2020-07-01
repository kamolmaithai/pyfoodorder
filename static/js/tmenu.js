'use strict';
var storeConfig;
getStoreConfig();
function getStoreConfig() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200){
				if(this.responseText) {
				var line2 = this.responseText.split("\n")[1];
				storeConfig = line2.split(",");
				}
			}
	}
	request.open('GET', '/getconfig', true);
	request.send();

}

var saveposrecord = false;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
//alert(JSON.stringify(cart));
var cartDOM ,addToCartButtonsDOM ;
	

function initcart() {
cartDOM = document.querySelector('.cart');
addToCartButtonsDOM = document.querySelectorAll('[data-action="ADD_TO_CART"]');
	
if (cart.length > 0) {
	cart.forEach(product => {
		insertItemToDOM(product);
		countCartTotal();

		addToCartButtonsDOM.forEach(addToCartButtonDOM => {
			const productDOM = addToCartButtonDOM.parentNode;

			if (productDOM.querySelector('.product__name').innerText === product.name) {
				handleActionButtons(addToCartButtonDOM, product);
			}
		});
	});
}

addToCartButtonsDOM.forEach(addToCartButtonDOM => {
	addToCartButtonDOM.addEventListener('click', () => {
		const productDOM = addToCartButtonDOM.parentNode;
		const product = {
			state: "",
			image: productDOM.querySelector('.product__image').getAttribute('src'),
			name: productDOM.querySelector('.product__name').innerText,
			price: productDOM.querySelector('.product__price').innerText,
			quantity: 1

		};

		const isInCart = cart.filter(cartItem => cartItem.name === product.name && cartItem.state == "").length > 0;
		if (!isInCart) {
			cart.push(product);
			insertItemToDOM(product);
			handleActionButtons(addToCartButtonDOM, product);
			saveCart();
		} else {
			alert("Exist in Cart, please use +/- button to adjust Quantity");
		}
	});
});

}
// Function to Insert Item to DOM
function insertItemToDOM(product) {
	cartDOM.insertAdjacentHTML(
		'beforeend',
		`
    <div class="cart__item" data-foo="${product.state}">
      <img class="cart__item__image" src="${product.image}" alt="${product.name}">
      <p class="cart__item__name">${product.name}</p>
      <p class="cart__item__price">${product.price}</p>
      <button class="btn btn--primary btn--small${product.quantity === 1 ? ' btn--danger' : ''}" data-action="DECREASE_ITEM">&minus;</button>
      <p class="cart__item__quantity">${product.quantity}</p>
      <button class="btn btn--primary btn--small" data-action="INCREASE_ITEM">&plus;</button>
      <button class="btn btn--danger btn--small" data-action="REMOVE_ITEM">&times;</button>
    </div>
  `
	);

	addCartFooter();
	document.querySelectorAll('.cart__item[data-foo="kitchen"]').forEach(cartItemDOM => {
			cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]').style.display = "none";
			cartItemDOM.querySelector('[data-action="INCREASE_ITEM"]').style.display = "none";
			cartItemDOM.querySelector('[data-action="REMOVE_ITEM"]').style.display = "none";
	});
	
	const InCart = cart.filter(cartItem => cartItem.state == "").length > 0; //was <1 ??
	if (InCart) {
		document.querySelector('[data-action="CHECKOUT"]').disabled = false;
		document.querySelector('[data-action="CLEAR_CART"]').disabled = false;
	} else {
	document.querySelector('[data-action="CHECKOUT"]').disabled = true;
	document.querySelector('[data-action="CLEAR_CART"]').disabled = true;
	}
}

// Funtion to Handle Buttons in the cart
function handleActionButtons(addToCartButtonDOM, product) {
	//addToCartButtonDOM.innerText = 'In Cart';
	//addToCartButtonDOM.disabled = true;

	const cartItemsDOM = cartDOM.querySelectorAll('.cart__item');
	cartItemsDOM.forEach(cartItemDOM => {
		if (cartItemDOM.querySelector('.cart__item__name').innerText === product.name) {
			cartItemDOM.querySelector('[data-action="INCREASE_ITEM"]').addEventListener('click', () => increaseItem(product, cartItemDOM));
			cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]').addEventListener('click', () => decreaseItem(product, cartItemDOM, addToCartButtonDOM));
			cartItemDOM.querySelector('[data-action="REMOVE_ITEM"]').addEventListener('click', () => removeItem(product, cartItemDOM, addToCartButtonDOM));
		
		}
	});
}

// Function to increase item in cart
function increaseItem(product, cartItemDOM) {
	cart.forEach(cartItem => {
		if (cartItem.name === product.name && cartItem.state == "") {
			cartItemDOM.querySelector('.cart__item__quantity').innerText = ++cartItem.quantity;
			cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]').classList.remove('btn--danger');
			saveCart();
		}
	});
}

// Function to decrease item in cart
function decreaseItem(product, cartItemDOM, addToCartButtonDOM) {
	cart.forEach(cartItem => {
		if (cartItem.name === product.name && cartItem.state == "") {
			if (cartItem.quantity > 1) {
				cartItemDOM.querySelector('.cart__item__quantity').innerText = --cartItem.quantity;
				saveCart();
			} else {
				removeItem(product, cartItemDOM, addToCartButtonDOM);
			}

			if (cartItem.quantity === 1) {
				cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]').classList.add('btn--danger');
			}
		}
	});
}

// Function to remove item from cart
function removeItem(product, cartItemDOM, addToCartButtonDOM) {
	cartItemDOM.classList.add('cart__item--removed');
	setTimeout(() => cartItemDOM.remove(), 250);
	cart = cart.filter(cartItem => cartItem.name !== product.name);
	saveCart();
	//addToCartButtonDOM.innerText = 'Add To Cart';
	//addToCartButtonDOM.disabled = false;             cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
	
	const InCart = cart.filter(cartItem => cartItem.state == "").length > 0; //was < 1 ???
	//alert(cart.filter(cartItem => cartItem.state == "").length);
	if (InCart) {
		//document.querySelector('.cart-footer').remove();
		document.querySelector('[data-action="CHECKOUT"]').disabled = false;
		document.querySelector('[data-action="CLEAR_CART"]').disabled = false;
	} else {
		document.querySelector('[data-action="CHECKOUT"]').disabled = true;
		document.querySelector('[data-action="CLEAR_CART"]').disabled = true;
	}
}

// Function to add cart footer
function addCartFooter() {
	if (document.querySelector('.cart-footer') === null) {
		cartDOM.insertAdjacentHTML(
			'afterend',
			`
      <div class="cart-footer">
      <button class="btn btn--danger" data-action="CLEAR_CART">Clear Cart</button>
		<button class="btn btn--primary" data-action="CHECKOUT">Check</button>
      </div>
    `
		);
		document.querySelector('[data-action="CLEAR_CART"]').addEventListener('click', () => clearCart());
		document.querySelector('[data-action="CHECKOUT"]').addEventListener('click', () => checkout());
	}
}

function clearCart() {
	document.querySelectorAll('.cart__item').forEach(cartItemDOM => {
			cartItemDOM.querySelector('[data-action="REMOVE_ITEM"]').click();
	});
		document.querySelector('[data-action="CHECKOUT"]').disabled = true;

}
function clearAllCart() {
	var plainText = prompt("Please enter your Password here", "password");
//	var asterisks = (new Array(plainText.length+1).join("*"));
	if (plainText == 9191) {
		document.querySelectorAll('.cart__item').forEach(cartItemDOM => {
			cartItemDOM.classList.add('cart__item--removed');
			setTimeout(() => cartItemDOM.remove(), 250);
		});

		cart = [];
		localStorage.removeItem('cart');
		countCartTotal();
		document.querySelector('.cart-footer').remove();

		addToCartButtonsDOM.forEach(addToCartButtonDOM => {
			addToCartButtonDOM.innerText = 'Add To Cart';
			addToCartButtonDOM.disabled = false;
		});
	document.getElementById("cartTotal").innerHTML = 0;
		saveposrecord = false;
		
	}

}
function clearAllCartNow() {
	document.querySelectorAll('.cart__item').forEach(cartItemDOM => {
		cartItemDOM.classList.add('cart__item--removed');
		setTimeout(() => cartItemDOM.remove(), 250);
	});

	cart = [];
	localStorage.removeItem('cart');
	countCartTotal();
	document.querySelector('.cart-footer').remove();

	addToCartButtonsDOM.forEach(addToCartButtonDOM => {
		addToCartButtonDOM.innerText = 'Add To Cart';
		addToCartButtonDOM.disabled = false;
	});
	document.getElementById("cartTotal").innerHTML = 0;
	saveposrecord = false;

}
function checkoutpaypal() {
	let paypalFormHTML = `
    <form id="paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post">
      <input type="hidden" name="cmd" value="_cart">
      <input type="hidden" name="upload" value="1">
      <input type="hidden" name="business" value="sachin0321@gmail.com">
    `;

	cart.forEach((cartItem, index) => {
		++index;
		paypalFormHTML += `
        <input type="hidden" name="item_name_${index}" value="${cartItem.name}">
        <input type="hidden" name="amount_${index}" value="${cartItem.price}">
        <input type="hidden" name="quantity_${index}" value="${cartItem.quantity}">
      `;
	});

	paypalFormHTML += `
    <input type="submit" value="PayPal">
    </form>
    <div class="overlay"></div>
  `;

	document.querySelector('body').insertAdjacentHTML('beforeend', paypalFormHTML);
	document.getElementById('paypal-form').submit();
	clearAllCartNow();
}
	
function checkout() {
	var payamount = document.querySelector('[data-action="CHECKOUT"]').innerText;
	var confirmYN = confirm("Payment without Tax is $" + payamount + ",please confirm?");
	if (confirmYN) {
		var CSVtext = "";
		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var harr = ["item","Name","Qauntity","Status","Time"];
				if(this.responseText) {
					var posid = this.responseText;
					var date = new Date();
					var timestamp =  date.getFullYear().toString().substr(-2) + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours() + 1 ).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);
					cart.forEach((cartItem, index) => {
						++index;
						if(cartItem.state !== "_cancel"){
							//CSVtext += `${posid},${index},${tno},noname,${cartItem.name},${cartItem.name},${cartItem.name},${cartItem.quantity},${cartItem.price},${timestamp}.\r\n`;
							CSVtext += posid +","+index+","+"noname"+","+cartItem.name+","+cartItem.name+","+cartItem.name+","+cartItem.quantity+","+cartItem.price+","+timestamp+"|||";
						
						}
					});	
						if ((CSVtext !== "") && (saveposrecord == false)) {
						CSVtext = CSVtext.substring(0, CSVtext.length-3); 
						addPosCSV(encodeURI(CSVtext));
						}
				}
			}

		  };
		  xhttp.open("GET", "/getposid", false);
		  xhttp.send();
	

		
	}
}



function addPosCSV(text) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
			saveposrecord = true;
			document.querySelector('[data-action="CHECKOUT"]').disabled = true;
			printreciept();		 
    }
  };
  xhttp.open('POST', '/addposcsv', true);
  xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
  xhttp.send("CSV=" + text);
}


function updateCartStatus(){
		//set number of cart
	var carti = document.querySelectorAll('.cart__item');	
	document.getElementById("cartTotal").innerHTML = carti.length;
	
}


// Function to calculate total amount
function countCartTotal() {
	let cartItems = 0;
	let cartTotal = 0;
	cart.forEach(cartItem => {
			if (cartItem.state !== '_cancel') {
				cartTotal += cartItem.quantity * cartItem.price;
				cartItems += cartItem.quantity;
			}
	});

	//cart.forEach(cartItem => (cartTotal += cartItem.quantity * cartItem.price));
	document.querySelector('[data-action="CHECKOUT"]').innerText = `Check $${cartTotal}`;
	document.getElementById("cartTotal").innerHTML = cartItems;
	
}

// Function to save cart on changes
function saveCart() {
	localStorage.setItem('cart', JSON.stringify(cart));
	countCartTotal();
}

function printreciept(){
var date = new Date();
var timestamp =  date.getFullYear().toString()+"-" + ("0" + (date.getMonth() + 1)).slice(-2) +"-"+ ("0" + date.getDate()).slice(-2) +" "+ ("0" + date.getHours() + 1 ).slice(-2)+":" + ("0" + date.getMinutes()).slice(-2) +":"+ ("0" + date.getSeconds()).slice(-2);
var texts = " Date Time :" + timestamp  + ",";
texts += createMultiLineLCR("",storeConfig[0],"",60,3,40,16).join(",") + ",";
texts += createMultiLineLCR("",storeConfig[1] + " Tax Id " +storeConfig[2],"",60,3,40,16).join(",") + ",";
texts += createMultiLineLCR("Id","Description","ea  price",60,3,40,16).join(",") + ",";
var textline = "";
	cart.forEach((cartItem, index) => {
		++index;
		if(cartItem.state !== '_cancel'){
			textline = createMultiLineLCR(index.toString(),cartItem.name,cartItem.quantity+"    "+cartItem.price,60,3,40,16).join(",");
			texts += textline + ",";
		}
	});
	var tot = document.querySelector('[data-action="CHECKOUT"]').innerText.replace("Check $","") ;
	var tax = tot * storeConfig[3]/100;
	texts += createMultiLineLCR(" ","Totol",tot.toString(),60,3,40,16).join(",") + ",";
	texts += createMultiLineLCR(" ","Tax",tax.toString(),60,3,40,16).join(",") + ",";
	texts += createMultiLineLCR(" ","Grand Total",(tot + tax).toString(),60,3,40,16).join(",") + ",";
	texts = texts.slice(0, -1);
	alert(texts);
	var c = document.createElement('canvas');
	c.width  = 260;
	c.height = 400;
	var ctx = c.getContext('2d');
	c.font = '18px Courier';
	var x = 30;
	var y = 30;
	var lineheight = 20;
	var lines = texts.split(',');
	alert(lines.length);
for (var i = 0; i<lines.length; i++)  ctx.fillText(lines[i], x, y + (i*lineheight) );
var imageurl = c.toDataURL("jpg");
var blob = dataURItoBlob(imageurl,"image/jpg");
	var a = document.createElement('a');
    a.style = "display: none";  
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "reciept"+timestamp+".jpg";
    document.body.appendChild(a);
    a.click();
	setTimeout(function(){
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 100); 
var win = window.open("", "_blank", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=260,height=400,top="+(screen.height/2- 200)+",left="+(screen.width/2 -130));
try {
	win.document.write("<html><head><title>Your Recript </title></head><body><img src='" +imageurl+ "'></body></html>");
} catch(e) {
	console.log(e);
}
clearAllCartNow();
	
}
function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}
function cutText2arr(str, maxLen, separator = ' ') {
	var tarr =[];
	var tstr = str;
	var loop = Math.round(str.length/maxLen) + 1;
	var cutstr = '';
  for (var i = 0; i < loop; i++) {
		  if (tstr.length <= maxLen) {
			  tarr.push(tstr);
			  return tarr;
		  }
		cutstr = tstr.substr(0,tstr.lastIndexOf(separator, maxLen) );
		tarr.push(cutstr);
		tstr = tstr.replace(cutstr,"");
		tstr = tstr.trim();
	}

  return tarr;
}

function createLineLR(left,right,width){
	var space = Math.round(width - left.length - right.length );
	if (space < 0) space = 0;
	var printText = left + " ".repeat(space) + right;
return printText;
}

function createLineC(center,width){
	var space = Math.round((width - center.length)/2);
	if (space < 0) space = 0;
	var printText =  " ".repeat(space) + center + " ".repeat(space);
	if(printText.length < width){
		printText =  printText + " ".repeat(width - printText.length);
	}
return printText;
}

function createLineLCR(left,center,right,width){
	var space = Math.round((width - left.length - right.length - center.length)/2);
	if (space < 0) space = 0;
	var printText = left + " ".repeat(space) + center + " ".repeat(space) + right;
return printText;
}

function createMultiLineLR(left,right,width,lwidth,rwidth){
	var printText = [];
	var LineLeft = cutText2arr(left, lwidth);
	var LineRight = cutText2arr(right, rwidth);
	var nloop = Math.max(LineLeft.length,LineRight.length);
	var tleft,tright;
	for (var i = 0; i < nloop; i++) {
		tleft = LineLeft[i] || "";
		tright = LineRight[i] || "";
		tleft = createLineC(tleft,lwidth);
		tright = createLineC(tright,rwidth);
		var space = Math.round(width - tleft.length - tright.length );
		if (space < 0) space = 0;
		printText.push(tleft + " ".repeat(space) + tright);	
	}

return printText;
}


function createMultiLineLCR(left,center,right,width,lwidth,cwidth,rwidth){
	var printText = [];
	var LineLeft = cutText2arr(left, lwidth);
	var LineCenter = cutText2arr(center, cwidth);
	var LineRight = cutText2arr(right, rwidth);

	var nloop = Math.max(LineLeft.length,LineCenter.length,LineRight.length);
	var tleft,tcenter, tright;
	for (var i = 0; i < nloop; i++) {
		tleft = LineLeft[i] || "";
		tcenter = LineCenter[i] || "";
		tright = LineRight[i] || "";
		tleft = createLineC(tleft,lwidth);
		//alert(tleft.length);
		tcenter = createLineC(tcenter,cwidth);
		//alert(tcenter.length);
		tright = createLineC(tright,rwidth);
		//alert(tright.length);
		var space = Math.round((width - tleft.length - tcenter.length - tright.length)/2);
		if (space < 0) space = 0;
		printText.push(tleft + " ".repeat(space) + tcenter + " ".repeat(space) + tright);	
	}

return printText;
}