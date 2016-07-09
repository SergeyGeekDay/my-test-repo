$(document).ready(function()
{

	function openMap()
	{
		$("#preload").hide()
	}

	window.setTimeout(openMap, 800)

	$("#markers").height($(document).height()-25)

	$("#mapContainer").css({"width":$(document).width()-130, "height":$("#markers").height()})
	$("#mapImg").show()
	var containerProp = $("#mapContainer").height()/$("#mapContainer").width()
	console.log(containerProp)

	var imgProp = $("#mapImg").height()/$("#mapImg").width()
	console.log(imgProp)
	
	function mapAlign()
	{
		if(containerProp <= imgProp)
		{
			$("#mapImg").css({"height":$("#mapContainer").height()})
			$("#mapImg").css({"margin": "0px " + ($("#mapContainer").width()-$("#mapImg").width())/2 + "px"})
		}
		else
		{
			$("#mapImg").css({"width":$("#mapContainer").width()})
			$("#mapImg").css({"margin":($("#mapContainer").height()-$("#mapImg").height())/2 + "px 0px"})
		}	

		$(".locationHv i").draggable({
			cursor: "url('../fonts/realCur.cur')",
		})

		$("#modalMark").draggable({
			cursor: "url('../fonts/realCur.cur')",
		})
		
	}

	window.setTimeout(mapAlign, 500)


	var markerCount = 1

	var realCount = 1

	for(key in positions)
	{
		$("#markers").append('<div class="oneMarker" id = "Location'+realCount+'"><span class = "number">'+realCount+'.</span><div class = "locationHv"><i class="fa fa-map-marker" aria-hidden="true"></i></div></div>')

		$("#Location" + realCount).css("background", positions[key].color)
		$("#Location" +realCount +" .locationHv i").css("color", positions[key].color)
		

		realCount++
	}

	window.setInterval(function()
	{
		var coords = $("#Location1 .locationHv i").offset()
		var posx = coords.left
		var posy = coords.top

		var mapCoords = $("#mapImg").offset()
		var mapX = mapCoords.left
		var mapY = mapCoords.top


		var percentX = ((posx-mapX) + ($("#Location1 .locationHv i").width()/2))/$("#mapImg").width()
		var percentY = ((posy-mapY) + ($("#Location1 .locationHv i").height()))/ $("#mapImg").height()

		console.log("Coordinates: "+percentX + " " +percentY)
	},1000)

	$("#CheckBtn").click(function()
	{
		var programEnd = true;

		var checkCount = 1

		perCount = 0;

		for(key in positions)
		{

			var coords = $("#Location"+checkCount+" .locationHv i").offset()
			var posx = coords.left
			var posy = coords.top

			var mapCoords = $("#mapImg").offset()
			var mapX = mapCoords.left
			var mapY = mapCoords.top


			var percentX = ((posx-mapX) + ($("#Location"+checkCount+" .locationHv i").width()/2))/$("#mapImg").width()
			var percentY = ((posy-mapY) + ($("#Location"+checkCount+" .locationHv i").height()))/ $("#mapImg").height()
			console.log(percentX +" "+percentY)
			var arr = positions[key].coords
			var dist = "x"

			var xcrd = []
			var ycrd = []

			arr.forEach(function(item) {
				if (dist == "x")
				{
					xcrd.push(item)
					dist = "y"
				}
				else
				{
					ycrd.push(item)
					dist = "x"
				}
			});	

			console.log(xcrd)
			console.log(ycrd)

			var leftX = undefined;
			var rightX = undefined;

			xcrd.forEach(function(item)
			{
				if ((item <= percentX) && (leftX == undefined || item >= leftX))
				{
					leftX = item
				}
				else if ((item>percentX) && (rightX == undefined || item < rightX))
				{
					rightX = item
				}
			})

			var topY = undefined;
			var bottomY = undefined;

			ycrd.forEach(function(item)
			{
				if ((item <= percentY) && (topY == undefined || item >= topY))
				{
					topY = item
				}
				else if ((item>percentY) && (bottomY == undefined || item < bottomY))
				{
					bottomY = item
				}
			})

			console.log("crdsX: "+ leftX + ";" + rightX)
			console.log("crdsY: "+ topY + ";" + bottomY)


			var modal_ins = '<h4><span class = "geoObj" style = "color: ' + positions[key].color + '">' +positions[key].topic

			if(leftX && rightX && topY && bottomY)
			{
				positions[key].mark = 1
				perCount++

				modal_ins = modal_ins + ': </span><span class = "trueAns">верно</span></h4>'
			}
			else
			{
				modal_ins = modal_ins + ': </span><span class = "falseAns">неверно</span></h4>'
			}


			$("#modalMark").append(modal_ins)

			checkCount++
		}
		
		$("#hover").show()
		$("#modalMark").show()
		$("#modalMark h1").html("Оценка: " + Math.round((perCount/(checkCount-1))*100) + "%")

	})


	$("#modalMark").draggable({
		grid: [100,50]
	});

})