var system, first;
var sat = 0.5, bright = 35.0;
var burstOn = false;
var lastArr = 0;
export default function main(ctx) {
  let self = ctx;
  return function(_p5) {
    let p5 = _p5;
    p5.setup = function() {
      p5.frameRate(30);
      p5.pixelDensity(1);
      var cnv = p5.createCanvas(p5.windowWidth, window.innerHeight);
      cnv.position(0,0);
      cnv.style("z-index", "-1");
      cnv.style("position", "fixed");
      system = new ParticleSystem(p5.createVector(p5.width/2, 50));
      //image(img, 0,0);
    }
    p5.draw = function() {
      p5.colorMode("rgb");
      if(self.drawQueue) {
        self.drawQueue.forEach( (el) => {
          burst(el.elt, el.scroll);
        })
        self.drawQueue = [];
      }
      if(system.particles.length > 0) {
        system.run();
      }
      //sat += 0.000275;
      //bright += 0.0166;
    }
    p5.windowResized = function() {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }
    function burst(elt) {
      var xpos = elt.offsetLeft;
      var ypos = elt.offsetTop - window.pageYOffset;
      var w = elt.width;
      var h = elt.height;
      var xStart = xpos + w/6;
      var yStart = ypos + h/6;
      p5.colorMode("rgb");
      var pageColor = p5.color(elt.getAttribute("burst"));
      var hsb = rgbToHsv(pageColor.levels[0], pageColor.levels[1], pageColor.levels[2]);
      p5.colorMode("hsb");
      var x, y, particle;
      let max = 7;
      for(let i = 0; i < max; i++) {
        for(let j = 0; j < max; j++) {
          var hColor = hsb[0] + Math.random()*14-7;
          var sColor = (hsb[1] + Math.random()*20-10)*sat;
          var bColor = Math.random()*20+bright;
          let drawX = xStart + i*(w/max/3*2);
          let drawY = yStart + j*(h/max/3*2);
          particle = new Particle([drawX, drawY], p5.color(hColor, sColor, bColor));
          if(system.particles.length > 200) {
            system.particles.splice(0, 1);
          }
          system.addParticle(particle);
        }
      }
      burstOn = true;
      //$(this.elt).css("visibility", "hidden");
    }

    function rgbToHsv(r, g, b) {
      r /= 255; 
      g /= 255; 
      b /= 255;

      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, v = max;

      var d = max - min;
      s = max == 0 ? 0 : d / max;

      if (max == min) {
        h = 0; // achromatic
      } else {
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
      }

      return [ h*360, s*100, v*100 ];
    }

    var Particle = function(position, color) {
      //this.acceleration = createVector(0, 0.05);
      this.accel = 3;
      let negX = Math.random() > 0.5 ? -1 : 1;
      let negY = Math.random() > 0.5 ? -1 : 1;
      this.velocity = [(Math.random()*18+1)*negX, (Math.random()*15+5)*negY];
      this.position = position;
      this.color = color;
      this.lifespan = 15;
    };

    Particle.prototype.run = function() {
      this.update();
      this.display();
    };

    // Method to update position
    Particle.prototype.update = function(){
      this.position[0] = this.position[0] + this.velocity[0]*0.95;
      this.position[1] = this.position[1] + (this.velocity[1]+this.accel);
      this.lifespan -= 1;
    };

    // Method to display
    Particle.prototype.display = function() {
      let start = p5.millis();
      p5.stroke(p5.color(0,0,0));
      p5.strokeWeight(1);
      p5.fill(this.color);
      let wMult = 1;
      var w = Math.random()*10+5;
      p5.rect(this.position[0], this.position[1], w*wMult, w*wMult);
      w = Math.random()*5+5;
      p5.rect(this.position[0]+p5.random(5,10), this.position[1], w*wMult, w*wMult);
      w = Math.random()*5+3;
      p5.rect(this.position[0], this.position[1]+Math.random()*5+5, w*wMult, w*wMult);
      w = Math.random()*5+5;
      p5.rect(this.position[0]-p5.random(5,10), this.position[1]+2, w*wMult, w*wMult);
      w = Math.random()*5+5;
      p5.rect(this.position[0]+2, this.position[1]-(Math.random()*5+5), w*wMult, w*wMult);
      /*p5.textSize(20);
      p5.text("greg!", this.position[0], this.position[1]);
      p5.text("!", this.position[0]+p5.random(5,20), this.position[1]);
      p5.text("%", this.position[0], this.position[1]+p5.random(5,20));
      p5.text("@", this.position[0]-p5.random(5,20), this.position[1]+2);
      p5.text("#", this.position[0]+2, this.position[1]-p5.random(5,20));*/
    };

    // Is the particle still useful?
    Particle.prototype.isDead = function(){
      return this.lifespan < 0;
    };

    var ParticleSystem = function(position) {
      this.origin = position.copy();
      this.particles = [];
    };

    ParticleSystem.prototype.addParticle = function(particle) {
      this.particles.push(particle);
    };

    ParticleSystem.prototype.run = function() {
      for (var i = this.particles.length-1; i >= 0; i--) {
        var p = this.particles[i];
        p.run();
        if (p.isDead()) {
          this.particles.splice(i, 1);
        }
      }
    };
  }
}