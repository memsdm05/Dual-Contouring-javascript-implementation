window.addEventListener("load", Start);

function Start() {
    "use strict";
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.gl = canvas.getContext('experimental-webgl');
    var names = ["webgl", "experimental-webgl", "webkit-3d", "mozwebgl"];

    for(var i in names)
    {
        try 
        {
            gl = canvas.getContext(names[i], {stencil: true, premultipliedAlpha: false});
  
            if (gl && typeof gl.getParameter == "function") 
            {
                /* WebGL is enabled */
                break;
            }
        } catch(e) { }
    }


    window.projection = mat4.create();
    window.view       = mat4.create();
    projection        = mat4.perspective(projection, 45, innerWidth / innerHeight, 0.1, 100);

    window.camera = new createCamera();
    window.camera.pos = [0, 10, 30];

    window.octree = new Octree(new Vec3(-5, -5, -5), 10, 6);
    octree.isosurface(function(x,y,z) {
        var int = (x*x+y*y);
        var result = (3*x*x - y*y)*(3*x*x - y*y) + Math.sin(z);

        if(result >= 0.0) {
            return 0.0;
        } else {
            return 1.0;
        }
    });
    window.octreeRenderer = new OctreeRenderer(gl);
    octreeRenderer.createOcreeWireframeGeometry(octree.rootNode);
    octreeRenderer.createOcreePointsGeometry(octree.rootNode);
    octreeRenderer.projection = projection;
    octreeRenderer.view       = view;

    requestAnimationFrame(draw);
}

var then = 0;
function draw(now) {
    requestAnimationFrame(draw);
    now *= 0.001;
    var deltatime = now - then;
    then = now;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    octreeRenderer.view = camera.getViewMatrix(deltatime, 0.3);
    // octreeRenderer.drawOctreeWireFrame();
    octreeRenderer.drawOctreePoints();
}