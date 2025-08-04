const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const numberOfParticles = 200;
const mouse = {
  x: null,
  y: null,
  radius: 150
};

var words = document.getElementsByClassName('word');
var wordArray = [];
var currentWord = 0;
var words = document.getElementsByClassName('word');


words[currentWord].style.opacity = 1;
for (var i = 0; i < words.length; i++) {
  splitLetters(words[i]);
}


// Define gradient colors array
const gradientColors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96c93d"];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5; // Slightly smaller particles
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
    this.color =
      gradientColors[Math.floor(Math.random() * gradientColors.length)];
    this.alpha = Math.random() * 0.5 + 0.5; // Add transparency
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

function changeWord() {
  var cw = wordArray[currentWord];
  var nw = currentWord == words.length-1 ? wordArray[0] : wordArray[currentWord+1];
  for (var i = 0; i < cw.length; i++) {
    animateLetterOut(cw, i);
  }
  
  for (var i = 0; i < nw.length; i++) {
    nw[i].className = 'letter behind';
    nw[0].parentElement.style.opacity = 1;
    animateLetterIn(nw, i);
  }
  
  currentWord = (currentWord == wordArray.length-1) ? 0 : currentWord+1;
}

function animateLetterOut(cw, i) {
  setTimeout(function() {
		cw[i].className = 'letter out';
  }, i*80);
}

function animateLetterIn(nw, i) {
  setTimeout(function() {
		nw[i].className = 'letter in';
  }, 340+(i*80));
}

function splitLetters(word) {
  var content = word.innerHTML;
  word.innerHTML = ''; // Clear original content
  var letters = [];

  for (var i = 0; i < content.length; i++) {
    var letter = document.createElement('span');
    letter.className = 'letter';
    
    // Use &nbsp; to preserve spacing
    letter.innerHTML = content.charAt(i) === ' ' ? '&nbsp;' : content.charAt(i);

    word.appendChild(letter);
    letters.push(letter);
  }

  wordArray.push(letters);
}


function init() {
  particles = [];
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  requestAnimationFrame(animate);
}

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

window.addEventListener("mouseout", () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

document.querySelectorAll('.css-typing .line').forEach((line, index) => {
  line.addEventListener('animationend', () => {
    line.classList.add('animated');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const typingSection = document.querySelector('.css-typing');
  const lines = document.querySelectorAll('.css-typing .line');
  

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTypingAnimation();
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.5 }); 

  if (typingSection) {
    observer.observe(typingSection);
  }

  function startTypingAnimation() {
    lines.forEach((line, index) => {
      const delay = index * 3000; 
      
      setTimeout(() => {
        line.classList.add('animate');
        
        line.addEventListener('animationend', () => {
          line.classList.remove('animate');
          line.classList.add('animated');
        });
      }, delay);
    });
  }
});

init();
animate();
changeWord();
setInterval(changeWord, 4000);