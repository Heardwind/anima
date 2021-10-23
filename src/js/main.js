/**
  * название функции
  *
  * @param {number} first - первое число
  * @returns {number}
  */



function canvasApp(sphereRad = 180, color = [70,255,140]) {
    // if (!canvasSupport()) {
    //     return;
    // }

    var radius_sp=.7;

    var theCanvas = document.getElementById("canvasOne");
    var context = theCanvas.getContext("2d");

    var displayWidth;
    var displayHeight;
    var timer;
    var wait;
    var count;
    var numToAddEachFrame;
    var particleList;
    var recycleBin;
    var particleAlpha;
    var r,g,b;
    var fLen;
    var m;
    var projCenterX;
    var projCenterY;
    var zMax;
    var turnAngle;
    var turnSpeed;
    var sphereCenterX, sphereCenterY, sphereCenterZ;
    var particleRad;
    var zeroAlphaDepth;
    var randAccelX, randAccelY, randAccelZ;
    var gravity;
    var rgbString;
    //we are defining a lot of variables used in the screen update functions globally so that they don't have to be redefined every frame.
    var p;
    var outsideTest;
    var nextParticle;
    var sinAngle;
    var cosAngle;
    var rotX, rotZ;
    var depthAlphaFactor;
    var i;
    var theta, phi;
    var x0, y0, z0;

    init();

    function init() {
        wait = 1;
        count = wait - 1;
        numToAddEachFrame = 8;

        //particle color
        r = color[0];
        g = color[1];
        b = color[2];

        rgbString = "rgba("+r+","+g+","+b+","; //partial string for color which will be completed by appending alpha value.
        particleAlpha = 1; //maximum alpha

        displayWidth = theCanvas.width;
        displayHeight = theCanvas.height;

        fLen = 320; //represents the distance from the viewer to z=0 depth.

        //projection center coordinates sets location of origin
        projCenterX = displayWidth/2;
        projCenterY = displayHeight/2;

        //we will not draw coordinates if they have too large of a z-coordinate (which means they are very close to the observer).
        zMax = fLen-2;

        particleList = {};
        recycleBin = {};

        //random acceleration factors - causes some random motion
        randAccelX = 0.1;
        randAccelY = 0.1;
        randAccelZ = 0.1;

        gravity = -0; //try changing to a positive number (not too large, for example 0.3), or negative for floating upwards.

        particleRad = 2.5;

        sphereCenterX = 0;
        sphereCenterY = 0;
        sphereCenterZ = -3 - sphereRad;

        //alpha values will lessen as particles move further back, causing depth-based darkening:
        zeroAlphaDepth = -750;

        turnSpeed = 2*Math.PI/5000; //the sphere will rotate at this speed (one complete rotation every 1600 frames).
        turnAngle = 0; //initial angle

        timer = setInterval(onTimer, 10/24);

    }

    function onTimer() {
        //if enough time has elapsed, we will add new particles.
        count++;
        if (count >= wait) {

            count = 0;
            for (i = 0; i < numToAddEachFrame; i++) {
                theta = Math.random()*2*Math.PI;
                phi = Math.acos(Math.random()*2-1);
                x0 = sphereRad*Math.sin(phi)*Math.cos(theta);
                y0 = sphereRad*Math.sin(phi)*Math.sin(theta);
                z0 = sphereRad*Math.cos(phi);

                //We use the addParticle function to add a new particle. The parameters set the position and velocity components.
                //Note that the velocity parameters will cause the particle to initially fly outwards away from the sphere center (after
                //it becomes unstuck).
                var p = addParticle(x0, sphereCenterY + y0, sphereCenterZ + z0, 0.002*x0, 0.002*y0, 0.002*z0);

                //we set some "envelope" parameters which will control the evolving alpha of the particles.
                p.attack = 50;
                p.hold = 50;
                p.decay = 100;
                p.initValue = 0;
                p.holdValue = particleAlpha;
                p.lastValue = 0;

                //the particle will be stuck in one place until this time has elapsed:
                p.stuckTime = 90 + Math.random()*20;

                p.accelX = 0;
                p.accelY = gravity;
                p.accelZ = 0;
            }
        }

        //update viewing angle
        turnAngle = (turnAngle + turnSpeed) % (2*Math.PI);
        sinAngle = Math.sin(turnAngle);
        cosAngle = Math.cos(turnAngle);

        //background fill
        context.fillStyle = "#000000";
        context.fillRect(0,0,displayWidth,displayHeight);

        //update and draw particles
        p = particleList.first;
        while (p != null) {
            //before list is altered record next particle
            nextParticle = p.next;

            //update age
            p.age++;

            //if the particle is past its "stuck" time, it will begin to move.
            if (p.age > p.stuckTime) {
                p.velX += p.accelX + randAccelX*(Math.random()*2 - 1);
                p.velY += p.accelY + randAccelY*(Math.random()*2 - 1);
                p.velZ += p.accelZ + randAccelZ*(Math.random()*2 - 1);

                p.x += p.velX;
                p.y += p.velY;
                p.z += p.velZ;
            }

            /*
            We are doing two things here to calculate display coordinates.
            The whole display is being rotated around a vertical axis, so we first calculate rotated coordinates for
            x and z (but the y coordinate will not change).
            Then, we take the new coordinates (rotX, y, rotZ), and project these onto the 2D view plane.
            */
            rotX =  cosAngle*p.x + sinAngle*(p.z - sphereCenterZ);
            rotZ =  -sinAngle*p.x + cosAngle*(p.z - sphereCenterZ) + sphereCenterZ;
            m =radius_sp* fLen/(fLen - rotZ);
            p.projX = rotX*m + projCenterX;
            p.projY = p.y*m + projCenterY;

            //update alpha according to envelope parameters.
            if (p.age < p.attack+p.hold+p.decay) {
                if (p.age < p.attack) {
                    p.alpha = (p.holdValue - p.initValue)/p.attack*p.age + p.initValue;
                }
                else if (p.age < p.attack+p.hold) {
                    p.alpha = p.holdValue;
                }
                else if (p.age < p.attack+p.hold+p.decay) {
                    p.alpha = (p.lastValue - p.holdValue)/p.decay*(p.age-p.attack-p.hold) + p.holdValue;
                }
            }
            else {
                p.dead = true;
            }

            //see if the particle is still within the viewable range.
            if ((p.projX > displayWidth)||(p.projX<0)||(p.projY<0)||(p.projY>displayHeight)||(rotZ>zMax)) {
                outsideTest = true;
            }
            else {
                outsideTest = false;
            }

            if (outsideTest||p.dead) {
                recycle(p);
            }

            else {
                //depth-dependent darkening
                depthAlphaFactor = (1-rotZ/zeroAlphaDepth);
                depthAlphaFactor = (depthAlphaFactor > 1) ? 1 : ((depthAlphaFactor<0) ? 0 : depthAlphaFactor);
                context.fillStyle = rgbString + depthAlphaFactor*p.alpha + ")";

                //draw
                context.beginPath();
                context.arc(p.projX, p.projY, m*particleRad, 0, 2*Math.PI, false);

                context.fill();
                context.closePath();

            }

            p = nextParticle;
        }
    }

    function addParticle(x0,y0,z0,vx0,vy0,vz0) {
        var newParticle;
        var color;

        //check recycle bin for available drop:
        if (recycleBin.first != null) {
            newParticle = recycleBin.first;
            //remove from bin
            if (newParticle.next != null) {
                recycleBin.first = newParticle.next;
                newParticle.next.prev = null;
            }
            else {
                recycleBin.first = null;
            }
        }
        //if the recycle bin is empty, create a new particle (a new ampty object):
        else {
            newParticle = {};
        }

        //add to beginning of particle list
        if (particleList.first == null) {
            particleList.first = newParticle;
            newParticle.prev = null;
            newParticle.next = null;
        }
        else {
            newParticle.next = particleList.first;
            particleList.first.prev = newParticle;
            particleList.first = newParticle;
            newParticle.prev = null;
        }

        //initialize
        newParticle.x = x0;
        newParticle.y = y0;
        newParticle.z = z0;
        newParticle.velX = vx0;
        newParticle.velY = vy0;
        newParticle.velZ = vz0;
        newParticle.age = 0;
        newParticle.dead = false;
        if (Math.random() < 0.5) {
            newParticle.right = true;
        }
        else {
            newParticle.right = false;
        }
        return newParticle;
    }

    function recycle(p) {
        //remove from particleList
        if (particleList.first == p) {
            if (p.next != null) {
                p.next.prev = null;
                particleList.first = p.next;
            }
            else {
                particleList.first = null;
            }
        }
        else {
            if (p.next == null) {
                p.prev.next = null;
            }
            else {
                p.prev.next = p.next;
                p.next.prev = p.prev;
            }
        }
        //add to recycle bin
        if (recycleBin.first == null) {
            recycleBin.first = p;
            p.prev = null;
            p.next = null;
        }
        else {
            p.next = recycleBin.first;
            recycleBin.first.prev = p;
            recycleBin.first = p;
            p.prev = null;
        }
    }

    return function changeColor (color = [r,g,b]) {
        rgbString = "rgba("+color[0]+","+color[1]+","+color[2]+",";
    }
}





class Anima {

    constructor(classParent) {
        this.element = document.querySelector(classParent);
        this.sentinelElement = document.querySelector('.sentinel');
        this.cloudguardElement = document.querySelector('.cloudguard');
        this.navigationItems = this.element.querySelectorAll('.navigation li');
        this.steps = 4;
        this.step = 1;
        this.delay = 2000;
        this.lastAnimation = 0;
        this.setup ();
        this.changeColor = canvasApp(160, [1,136,245]);
        this.renderStaticPath(this.sentinelElement);

    }

    handleScroll = (e) => {
        e.preventDefault();

        let timeNow = Date.now(),
            prevStep = this.step;

        if (timeNow - this.lastAnimation < this.delay) {
            return;
        }

        if (e.deltaY < 0) {
            // Up

        } else {
            // Down
            this.step = this.step === this.steps ? this.steps : ++this.step;
        }

        if(prevStep!=this.step) {
            this.upd();
        }

        this.lastAnimation = timeNow;
    }

    setup() {

        // window.addEventListener('scroll', function (e) {
        //     e.preventDefault();
        //     console.log('scroll')
        //     console.log(e)
        // } );
        document.addEventListener('wheel', this.handleScroll, {passive: false} )
        document.addEventListener('touchmove', this.handleScroll, {passive: false} )
        document.addEventListener('touchstart', this.handleScroll, {passive: false} )
        document.addEventListener('touchend', this.handleScroll, {passive: false} )
    }

    getCoords(elem,centered = false) {
        let domRect = elem.getBoundingClientRect(),
            x = centered ? domRect.x + (domRect.width / 2) : domRect.x + 20,
            y = centered ? domRect.y + (domRect.height / 2) : domRect.y + 20;
        return [x,y];
    }

    renderStaticPath(parentElem) {

        let bindElems1 = parentElem.querySelectorAll('[data-bind]');
        let bindElems2 = Array.from(bindElems1).map(elem => parentElem.querySelector(elem.dataset.bind));

        if(bindElems1.length && bindElems2.length) {
            const viewPort = document.createElementNS('http://www.w3.org/2000/svg','svg');
            const viewBox = `0 0 ${parentElem.offsetWidth} ${parentElem.offsetHeight}`;
            viewPort.classList.add('path');
            viewPort.setAttribute('viewBox',viewBox);

            let coords1 = Array.from(bindElems1).map(elem => this.getCoords(elem));
            let coords2 = Array.from(bindElems2).map(elem => this.getCoords(elem,true));
            const total = bindElems1.length;
            const pathArr = [];

            Array.from(Array(total).keys()).forEach((count,index) => {
                let path = document.createElementNS('http://www.w3.org/2000/svg','line');
                path.setAttribute('x1', coords1[index][0]);
                path.setAttribute('y1', coords1[index][1]);
                path.setAttribute('x2', coords2[index][0]);
                path.setAttribute('y2', coords2[index][1]);
                path.setAttribute('stroke', 'white');
                path.setAttribute('stroke-opacity', '0.3');
                path.setAttribute('stroke-dasharray', '2 2');
                if(bindElems1[index].dataset.frame) path.classList.add(`path_frame_${bindElems1[index].dataset.frame}`);
                viewPort.appendChild(path)
                pathArr.push(path);
            })

            parentElem.appendChild(viewPort);

            // add dot

            bindElems1.forEach(elem => {
                let dot = document.createElement('div');
                dot.classList.add('dot');
                let dotSpan = document.createElement('span');
                dot.appendChild(dotSpan)
                elem.appendChild(dot);
            });

            return {
                lines: pathArr,
                elems1: bindElems1,
                elems2: bindElems2,
            };

        }

        return null;

    }

    renderDynamicPath(parentElem) {
        const data = this.renderStaticPath(parentElem);

        if(data) {
            setInterval(() => {
                let coords1 = Array.from(data.elems1).map(elem => this.getCoords(elem));
                let coords2 = Array.from(data.elems2).map(elem => this.getCoords(elem,true));
                data.lines.forEach((path,index) => {
                    path.setAttribute('x1', coords1[index][0]);
                    path.setAttribute('y1', coords1[index][1]);
                    path.setAttribute('x2', coords2[index][0]);
                    path.setAttribute('y2', coords2[index][1]);
                });
            },100);
        }
    }

    delayI(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    rotateHandler (elemClass = '.cloudguard .content') {
        let duration = 90000;
        let rotateElem = this.element.querySelector(elemClass);
        let rotateReverse = false,
            styleValue;

        setInterval(() => {
            styleValue = rotateReverse ? 'rotate(60deg)' : 'rotate(-60deg)'
            rotateElem.style.transform = styleValue;
            rotateReverse = !rotateReverse;
        },duration);
    }

    setNavItem(step) {
        if(this.navigationItems.length) {
            this.navigationItems[step-1].classList.remove('active');
            this.navigationItems[step].classList.add('active');
        }
    }

    upd() {
        switch (this.step) {
            case 1:
                break;
            case 2:
                this.element.classList.add('frame_1');
                this.changeColor([70, 240, 157]);
                setTimeout(() => {
                    this.element.classList.add('frame_2');
                    this.renderDynamicPath(this.cloudguardElement);
                },1000);
                break;
            case 3:
                this.rotateHandler();
                this.element.classList.add('frame_3');
                break;
            case 4:
                this.element.classList.add('frame_4');
                break;
        }
        this.setNavItem(this.step-1);
    }

}


function init() {

    const anima = new Anima('.anima');

}

document.addEventListener("DOMContentLoaded", init);