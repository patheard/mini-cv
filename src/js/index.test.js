'use strict'

var paper = require('paper');
var scene = require('./index');

describe(require('path').basename(__filename), function() {

    // Create the canvas element and initialize the scene
    before(function() {       
        var canvas = document.createElement('canvas');
        canvas.id = 'scene';
        document.body.appendChild(canvas);

        scene.init();
    });

    // Test initalization of the scene
    describe('scene.init():', function() {

        it('paper should have been initialized', function() {
            assert(paper.project, 'paper.project has been initialized');
            assert(paper.view, 'paper.view has been initialized');
        });

        // The helps confirm the design hasn't change.  I can't use an SVG diff lib since the triangle position is random on load.
        it('scene should have default values', function() {
            assert.equal(scene.decelerationTime, 2000, 'Deceleration time is 2000ms');
            assert.equal(scene.shapeOffsetX, 50, 'Shape offset X is 50');
            assert.equal(scene.lastScroll, 0, 'Last scroll is 0');
            assert.equal(scene.colors.min.hue, new paper.Color('blue').hue, 'Minimum colour is blue');
            assert.equal(scene.colors.max.hue, new paper.Color('purple').hue, 'Maximum colour is blue');
        });
        
        it('event handlers should be bound', function() {
            assert.equal(window.onscroll, scene.scroll, 'scene.scroll() has been bound to window.onscroll');
            assert.equal(paper.view.onFrame, scene.animate, 'scene.animate() has been bound to view frame event');
            assert.equal(paper.view.onResize, scene.resize, 'scene.resize() has been bound to view resize event');
        }); 
        
        it('scene objects should have been drawn', function() {
            assert(scene.triangles, 'triangle objects have been drawn and added to the scene');
        });
    });

    // Test drawing the scene
    describe('scene.draw():', function() {
        
        it('shape count corresponds to paper.view.bounds.width', function() {
            assert.equal(Math.floor(paper.view.bounds.width / scene.shapeOffsetX), scene.triangles.children.length, 'shape count should be related to paper.view.bounds.width');
        });

        // Taven't found a good way to get the shapes radius once its been created.
        // closest I've come is: 
        // assert.equal(scene.triangles.children[0].bounds.width / 2,  paper.view.bounds.height * 0.7, 'shape radius should be 70% of view height');        
        it('shape radius is related to view height', function() {
            this.skip();
        }); 

    });

});