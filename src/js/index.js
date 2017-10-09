/* jshint browser: true, node: true */
/* globals view, project, Color, Group, Path, Point */

"use strict";

// TODO: convert to ES6 and add transpiler
var paper = require( "paper" );  

/**
* scene object responsible for creating the background and elements.  It also handles the animation
* resize and user scroll events.
*/ 
var scene = {
    
    decelerationTime: 2000,	// Time that it takes for a shape to stop moving
    lastScroll: 0,			// Track the amount of the last user's scroll
    colors: null,			// Colours to use for the shape transitions. TODO: dynamically set colours based on time of day.
    triangles: null,		// Group to hold the triangle elements
                
    /**
    * Initalize the canvas element and draw the scene.
    */
    init: function(){
        paper.setup( document.getElementById( "scene" ) );
        paper.install( window );

        scene.colors =  {
            min: new Color( "blue" ),
            max: new Color( "purple" )
        };

        scene.draw();

        // Bind event handlers for animation, resize and window scroll
        view.onFrame = scene.animate;
        view.onResize = scene.resize;
        window.onscroll = scene.scroll;        
    },    

    /**
    * Draw background and elements.  Element count and placement is dynamic
    * and based on the size of the viewport.
    */    
    draw: function(){
        var shapeOffsetX = 50,												// Distance each shape is placed from its neighbour
            shapeRadius = view.bounds.height * 0.7,							// Radius of each shape (based on view height)
            shapeCount = Math.floor( view.bounds.width / shapeOffsetX ), 	// Number of shapes on the canvas (based on the total width of the view)
            shapePositionY = view.bounds.height - shapeRadius / 2,			// The y axis position of each shap (based on view height and shape radius)
            shapeTriangle = new Path.RegularPolygon({
                center: [ 0, 0 ],
                sides: 3,
                radius: shapeRadius,
                fillColor: scene.colors.min,
                opacity: 0.1
            }),
            background = new Path.Rectangle({
                from: [ 0, 0 ],
                to: [ view.bounds.width, view.bounds.height ],
                fillColor: {
                    gradient: {
                        stops: ["#d3ecf5", "#6bbfde", "#2ea3ce"],
                        radial: true
                    },
                    origin: [ view.center.x, 0 ],
                    destination: [ view.center.x, view.bounds.height + 500 ]
                }					
            }),
            triangleMouseEnter = function( event ){
                this.data.animate = true;
                this.data.hueDelta = 1;
            },
            triangleMouseLeave = function( event ){
                this.data.animate = false;
                this.data.stopTimestamp = ( new Date() ).getTime() + scene.decelerationTime;
                this.data.stopDelta = 1;
            };

        // Create and place the triangles elements
        scene.triangles = new Group();
        for (var i = 0; i < shapeCount; i++) {
            var pointRandom = new Point( 0, 250 ).multiply( Point.random() ),
                triangle = shapeTriangle.clone();
            
            // Position the triangle and bind mouse event handlers.  Triangles are positioned from the center outwards, alternating from left to right.
            triangle.position = new Point( view.center.x + ( i % 2 ? -1 : 1 ) * shapeOffsetX * i, shapePositionY + pointRandom.y );					
            triangle
                .on( "mouseenter", triangleMouseEnter )					
                .on( "mouseleave", triangleMouseLeave );
            
            scene.triangles.addChild( triangle );
        }

        // Reset the last scroll so that the triangles can be properly positioned with the window's existing scroll
        scene.lastScroll = 0;
    },
    
    /**
    * Animate the scene.  This is called by paper.js' onFrame event handler and is reponsible for repositioning
    * elements in relation to how the user is interacting with the page.
    * @param Event The paper.js Event object passed by the onFrame event handler.
    */
    animate: function( event ){
        var eventTimestamp = ( new Date() ).getTime();
    
        // Loop through the triangles that have been placed on the active layer
        for ( var i = 0, len = scene.triangles.children.length; i < len; i++ ) {
            var item = scene.triangles.children[ i ];

            // Item is intersected by the mouse: animate its position
            if( item.data.animate ){
                item.position.y += Math.sin( event.time + i );
                item.fillColor.hue += 1 * item.data.hueDelta;
                
                // Check if the colour has cycled to the max or min colours and reverse cycle direction as needed.
                item.data.hueDelta = item.fillColor.hue > scene.colors.max.hue ? -1 : item.fillColor.hue < scene.colors.min.hue ? 1 : item.data.hueDelta;						
            
            // Item is no longer intersected, but it hasn't finished decelerating yet
            } else if( item.data.stopDelta > 0 ){										
                item.position.y += Math.sin( event.time + i ) * item.data.stopDelta / scene.decelerationTime;
                item.data.stopDelta = item.data.stopTimestamp - eventTimestamp;
            }
        }
    },

    /**
    * Redraw the scene when the browser is resized.  Does this by clearing all elements and re-drawing.
    * @param Event The paper.js Event object passed by the onFrame event handler.
    */
    resize: function( event ){
        project.clear();
        scene.draw();
        scene.scroll();
    },
    
    /**
    * Handle user scroll events.  Moves the elements in the scene relative to the amount the user has scrolled the window.
    */
    scroll: function(){
        var triangle,
            scrollTop = window.pageYOffset,
            scrollDelta = scrollTop - scene.lastScroll;
    
        // Change the triangle position in relation to how much the user has scrolled.  
        for ( var i = 0, len = scene.triangles.children.length; i < len; i++ ) {
            triangle = scene.triangles.children[ i ];
            triangle.position.y += ( i * scrollDelta ) / 10;						
        }
        
        // Track the current scrollTop so that we can calculate the scoll delta when the event fires again
        scene.lastScroll = scrollTop;
    }
};

// Make the magic happen
scene.init();

module.exports = scene;
