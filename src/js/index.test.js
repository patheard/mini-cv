'use strict'

var paper = require('paper');
var scene = require('./index');

describe('scene.init():', function() {

    before(function() {

        // Create the canvas element
        var canvas = document.createElement('canvas');
        canvas.id = 'scene';
        document.body.appendChild(canvas);

        // Initialize the scene
        scene.init();
    });

    it('paper should have been initialized', function() {
        assert(paper.project, 'paper.project has been initialized');
        assert(paper.view, 'paper.view has been initialized');
    });

    it('scene should have default values', function() {
        assert.equal(scene.decelerationTime, 2000, 'Deceleration time is 2000ms');
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