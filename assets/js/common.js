var webSmartArray 	= ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','f'];
var webSafeArray  	= ['0','3','6','9','c','f','f'];

//key used for localStorage to persist data
var dataKey = "wsmm";
//history json
var historico = [];
//history size
var h_size = 10;

ColorConverter = 
{
	WebSmart: 
	{
		closest: function (a) 
		{
			var i, j, n = null;
			
			i = parseInt(a[0],16);
			j = parseInt(a[1],16);
			n = 16;
			
			if(i - j < (-1 * n / 2))
			{
				i++;
			}
			else
			{
				if(i - j > (n / 2))
				{
					i--;
				}
			}
			
			return webSmartArray[i] + webSmartArray[i];
		},
		convert: function (a)
		{
			var r,g,b = null;
			//finds the closest R value
			r = ColorConverter.WebSmart.closest(a.slice(1,3));
			//finds the closest G value
			g = ColorConverter.WebSmart.closest(a.slice(3,5));
			//finds the closest B value
			b = ColorConverter.WebSmart.closest(a.slice(5,7));
			//concatenates the values into a #RRGGBB string and returns it
			return "#" + r + g + b; 
		},
	},
	WebSafe:
	{
		closest: function (a) 
		{
			//parse the HEX value to a DEC value tha varies from 0 to 255
			a = parseInt(a, 16);
			//finds 1 of 6 colours within a
			a = a / 49; 
			//rounds the value
			a = Math.round(a); 
			//finds the colour on the a index
			a = webSafeArray[a]; 
			//duplicates the value
			//eg.
			//from '0' to '00'
			//from '9' to '99'
			//from 'f' to 'ff'
			a += a; 
			//returns a
			return a; 
		},
		convert: function (a)
		{
			var r,g,b = null;
			//finds the closest R value
			r = ColorConverter.WebSafe.closest(a.slice(1,3));
			//finds the closest G value
			g = ColorConverter.WebSafe.closest(a.slice(3,5));
			//finds the closest B value
			b = ColorConverter.WebSafe.closest(a.slice(5,7));
			//concatenates the values into a #RRGGBB string and returns it
			return "#" + r + g + b;
		},
	}
};

History = 
{
	add: function(original, webSmartColor, webSafeColor)
	{
		if(History.isFull())
		{
			History.removeFIFO();
		}
		historico.push({0:original, 1:webSmartColor, 2:webSafeColor});
	},
	removeFIFO: function()
	{
		if(!History.isEmpty())
		{
			historico.shift();
			return true;
		}
		else 
		{
			return false;
		}
	},
	removeLIFO: function()
	{
		if(!History.isEmpty())
		{
			historico.pop();
			return true;
		} 
		else
		{
			return true;
		}
			
	},
	removeAt: function(index)
	{
		if(!History.isEmpty())
		{
			historico.splice(index, 1);
			return true;
		}
		else
		{
			return false;
		}

	},
	isFull: function()
	{
		if(historico === null || historico.length < h_size)
			return false;
		else
			return true;
	},
	isEmpty: function()
	{
		if(historico === null)
			return true;
		else
			return false;
	},
};

Data = 
{
	load: function(dataKey)
	{
		//loads the stored string and converts it to a dataObject and returns it
		return JSON.parse(localStorage.getItem(dataKey));
	},
	save: function(dataKey, data)
	{
		//converts the dataObject to a string and stores it
		localStorage.setItem(dataKey, JSON.stringify(data));
	},
};

function updateResult(originalColor, webSmartColor, webSafeColor)
{
	$(".output").show();

	//empties the table cells
	$(".output .hex-white").empty();
	$(".output .hex-black").empty();
	
	//fills the original-color column
	$(".output .original-col").attr("bgcolor", originalColor);
	$(".output .original-col .hex-white").append(originalColor);	
	$(".output .original-col .hex-black").append(originalColor);	
	
	//fills the web-smart column
	$(".output .web-smart-col").attr("bgcolor", webSmartColor);
	$(".output .web-smart-col .hex-white").append(webSmartColor);	
	$(".output .web-smart-col .hex-black").append(webSmartColor);	
	
	//fills the safe-color column
	$(".output .web-safe-col").attr("bgcolor", webSafeColor);
	$(".output .web-safe-col .hex-white").append(webSafeColor);	
	$(".output .web-safe-col .hex-black").append(webSafeColor);
	
}

function updateHistory()
{
	$(".history").empty();

	var row = null;

	for(i = 0; i < historico.length; i++)
	{
		row = "";
		
		//row start
		row += '<tr>';
		
			//original color column
			row += '<td id="" class="original-col" align="center" valign="middle" width="30%" height="32" bgcolor="' + historico[i][0] + '">';
				//white text
				row += '<span class="hex-white">';
				row += historico[i][0];
				row += '</span>';
				//black text
				row += '<span class="hex-black">';
				row += historico[i][0];
				row += '</span>';
			row += '</td>';
			
			//web-smart color column
			row += '<td id="" class="web-smart-col" align="center" valign="middle" width="30%" height="32" bgcolor="' + historico[i][1] + '">';
				//white text
				row += '<span class="hex-white">';
				row += historico[i][1];
				row += '</span>';
				//black text
				row += '<span class="hex-black">';
				row += historico[i][1];
				row += '</span>';
			row += '</td>';
			
			//web-safe color column
			row += '<td id="" class="web-safe-col" align="center" valign="middle" width="30%" height="32" bgcolor="' + historico[i][2] + '">';
				//white text
				row += '<span class="hex-white">';
				row += historico[i][2];
				row += '</span>';
				//black text
				row += '<span class="hex-black">';
				row += historico[i][2];
				row += '</span>';
			row += '</td>';
			
			//remove history item btn
			row += '<td id="" class="" align="center" valign="middle" width="10%" height="32" >'
			row += '<button id="" class="clear-this-btn" atIndex="' + i + '"></button>'
			row += '</td>'
		
		//row end
		row += '</tr>';
		
		$(".history").prepend(row);
	}
	
	$(".clear-this-btn").on('click', function(e){
		//gets the current element index
		var index = $(this).attr("atIndex");
		
		History.removeAt(index);
	
		//persists data
		Data.save(dataKey, historico);
		
		//updatesHistory
		updateHistory();
	});
	
	$(".history").show();
}

//fires when document is ready
$(document).ready(function(e){
	
	//sets a mask that only allows hexadecimal values within the input
	$.mask.definitions['h'] = "[A-Fa-f0-9]";
	$("#input-color").mask("#hhhhhh");
	
	//creates the color wheel
	$('#colorpicker').farbtastic('#input-color');
	
	//inits the custom scrollbar
	$(".history-container").mCustomScrollbar({
		theme: "inset-dark",
		scrollButtons: {enable:true},
		alwaysShowScrollbar: 1,
	});
	
	var original, webSmart, webSafe = null; 
	
	original = $("#input-color").val();
	webSmart = ColorConverter.WebSmart.convert(original);
	webSafe  = ColorConverter.WebSafe.convert(original);
	
	//updates the table
	updateResult(original, webSmart, webSafe);
	
	//loads the data if data != null
	if(Data.load(dataKey))
		historico = Data.load(dataKey);
	
	//update the history
	if(History.isEmpty()) { } else
		updateHistory();
});

//fires when the DOM is fully loaded
$(window).load(function(e){
	
	//convert the color
	$(".input-btn").on('click', function(e){
		var original, webSmart, webSafe = null; 
		
		//original attribute receives the original color
		original = $("#input-color").val();
		//webSmart attribute receives the converted original color in the web-smart format
		webSmart = ColorConverter.WebSmart.convert(original);
		//webSafe attribute receives the converted original color in the web-safe format
		webSafe  = ColorConverter.WebSafe.convert(original);
		
		//updates the Result table
		updateResult(original, webSmart, webSafe);
		
		//adds the new value to the history
		History.add(original, webSmart, webSafe);
		
		//persists the data
		Data.save(dataKey, historico);

		//update the history
		updateHistory();
	});
});