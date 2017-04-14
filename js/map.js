    var gmarkers = [];
        var map = null;
        var ib = new InfoBox();

        // A function to create the marker and set up the event window
        function createMarker(latlng,name,html,category) {
            var boxText = document.createElement("div");
                boxText.style.cssText = "min-width: 368px; background: rgba(255,255,255,0.9); padding: 10px; color: #000; display: inline-block;";
                boxText.innerHTML = html;
            var mapOptions = {
                content: boxText,
                disableAutoPan: false,
                maxWidth: 0,
                pixelOffset: new google.maps.Size(-100, 0),
                zIndex: null,
                scrollwheel: false,

                boxStyle: { 
                    background: "transparent",
                    width: "250px",
                    },
                closeBoxURL: "",
                infoBoxClearance: new google.maps.Size(1, 1),
                isHidden: false,
                enableEventPropagation: false
            };

            var marker = new google.maps.Marker({
                position: latlng,
                icon: category + ".png",
                map: map,
                title: name,
                zIndex: Math.round(latlng.lat()*-100000)<<5
            });

          // === Store the category and name info as a marker properties ===
            marker.mycategory = category;                                 
            marker.myname = name;
            gmarkers.push(marker);

            google.maps.event.addListener(marker, 'click', function() {
            ib.setOptions(mapOptions)
            ib.open(map, this);
            });
        } // end createMarker

        // == shows all markers of a particular category, and ensures the checkbox is checked ==
        function show(category) {
          for (var i=0; i<gmarkers.length; i++) {
            if (gmarkers[i].mycategory == category) {
              gmarkers[i].setVisible(true);
            }
          }
          // == check the checkbox ==
          document.getElementById(category+"box").checked = true;
        }

        // == hides all markers of a particular category, and ensures the checkbox is cleared ==
        function hide(category) {
          for (var i=0; i<gmarkers.length; i++) {
            if (gmarkers[i].mycategory == category) {
              gmarkers[i].setVisible(false);
            }
          }
          // == clear the checkbox ==
          document.getElementById(category+"box").checked = false;
          // == close the info window, in case its open on a marker that we just hid
          ib.close();
        }

        // == a checkbox has been clicked ==
        function boxclick(box,category) {
          if (box.checked) {
            show(category);
          } else {
            hide(category);
          }
        }

        function myclick(i) {
          google.maps.event.trigger(gmarkers[i],"click");
        }

        function initialize() {
            var mapOptions = {
                zoom: 13,
                scrollwheel: false,
                center: new google.maps.LatLng(41.8781136,-87.7097982),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false
              }
              map = new google.maps.Map(document.getElementById("map"), mapOptions);

              google.maps.event.addListener(map, 'click', function() {
                ib.close();
              });

//             request = new XMLHttpRequest();
//             request.open('GET', '/js/post.json', true);
// 
//             request.onload = function() {
//               if (request.status >= 200 && request.status < 400){
//                 // Success!
//                 resp = request.responseText;
//               } else {
//                 // We reached our target server, but it returned an error
// 
//               }
//             };
// 
//             request.onerror = function() {
//               // There was a connection error of some sort
//             };
// 
//             request.send();

          $(document).ready(function(){

            $.getJSON('data.json', function(data) {
              for (var i = 0; i < data.length; i++) {
                // obtain the attribues of each marker
                var item = data[i];
                var point = new google.maps.LatLng(item.ltt, item.lgt);
                var name = item.name;
                var html = "<h5>"+item.name+"<\/h5><p class='addy'>"+item.place+"<\/p><div>"+ item.video +"<\/div><a href='"+ item.thumbUrl +"' title='"+ item.name +"'><img src='"+ item.thumbnail +"'/><\/a><p>"+ item.shortDesc +"<\/p><a href='"+ item.url +"' title='"+ item.name +"'>Read more<\/a>";
                var category = item.cat;
                // create the marker
                var marker = createMarker(point,name,html,category);
              }
              // == show or hide the categories initially ==
              show("stories");
              hide("environment");
              hide("education");
              hide("economic");
              hide("infrastructure");
              hide("parks");
            }); //end JSON
          }); //end jQuery
        } //end initialize  