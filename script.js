
const canvas = document.getElementById('gameWindow');
const ctx = canvas.getContext('2d');
let pauseBtn=document.getElementById('pausebtn');
let btnImage=document.getElementById('pauseImage');
let restartBtn=document.getElementById('restartBtn');
let msg=document.getElementById('msg');
let score;
let life;
let pause=false;
let rest=false;
let restConfirm=false;

let start=false;

colors=['#f51be6','#fc9d03','#fc0341','#03fcc2','#0314fc'];
// Particle class
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 2 - 1.5;
    this.speedY = Math.random() * 2 - 1.5;
    this.color = '#f51be6'; 
    this.lifespan = 50; 
  } 

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.lifespan -= 1;
  }

  draw() {
    let selected_color=Math.floor(Math.random()*3)+1;
    this.color=colors[selected_color];
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

// Particle array
const particles = [];

// Create particles
function createParticles(x, y) {
  
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(x, y));
  }
}

// Draw particles
function drawParticles() {
  
  particles.forEach((particle, index) => {
    if (particle.lifespan <= 0) {
      particles.splice(index, 1);
    } else { 
      particle.update();
      particle.draw();
    }
    
  });
}





// where the game starts
function startGame(){  
  const rows = 12;
let cols; 
canvas.style.display="block";
    score=0;
    life=3;

    
// Create ball props
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 6,
    speed: 4,
    dx: 4,
    dy: -4,
    visible: true
  };
  
  // Create paddle props
  const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 70,
    h: 1,
    speed: 8,
    dx: 0,
    visible: true
  };
  
  // Create brick props
  const brickInfo = {
    w: 45,
    h: 10,
    padding: 4,
    offsetX: 30,
    offsetY: 40,
    visible: true,
    strong: false 
  };
  


  // Create bricks
  const bricks = [];
  function CreateBricks(){
  
  const strline= Math.floor(Math.random() * 4) + 1;
  cols=Math.floor(Math.random() * 7)+5;
  for (let i = 0; i < rows; i++) { 
    bricks[i] = []; 
    
    for (let j = 0; j < cols; j++) { 
      brickInfo.strong=false;

      // creating strong line( requires double coliision)
      if(j===strline  || (i===strline+1 && ((i+strline)===j-1 || (i+strline)===j+2 )  )  ){ 
          brickInfo.strong=true; 
      } 
      const x = i * (brickInfo.w+ brickInfo.padding) + brickInfo.offsetX;
      const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
      
      // storing bricks properties in array of bricks
      bricks[i][j] = { x, y, ...brickInfo }; 
    } 
  
  } 
}
  //call to create bricks
 CreateBricks(); 

  // Draw ball on canvas
  function drawBall() {
    ctx.beginPath(); 
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = ball.visible ? '#660066' : 'transparent';
    ctx.fill();
    ctx.closePath();
    
  }
  
  // Draw paddle on canvas
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h+life*3);
    
    ctx.fillStyle = paddle.visible ? 'black' : 'transparent';
    ctx.fill();
    ctx.closePath();
  }
  
  // Draw score on canvas
  function drawScore() {
    ctx.font = '18px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
  } 

  //lifes
  function drawLives() {
    ctx.font = '18px Arial';
    ctx.fillStyle= 'red';
    ctx.fillText(`Lives: ${life}`, 30, 30);
  } 
  
  
  // Draw bricks on canvas
  function drawBricks() {
    bricks.forEach(column => {
      column.forEach(brick => {
        ctx.beginPath();
        ctx.strokeStyle = brick.visible ? 'black' : 'transparent'; // Choose the color of the border
          ctx.lineWidth = brick.visible ? 2 : 0; 
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        if(brick.strong==true){
          ctx.fillStyle = brick.visible ? 'green' : 'transparent';
        } 
        else{
        ctx.fillStyle = brick.visible ? '#ff9933' : 'transparent';
        } 
        ctx.fill(); 
        ctx.stroke();
        ctx.closePath();
        
      });
    });
  }
  
  // sound on brick break
  function playAudio(soundUrl){
    var audioUrl = soundUrl;
  
  // Create an Audio object
  var audio = new Audio(audioUrl);
   audio.play();
  }

  // Move paddle on canvas
  function movePaddle() {
    paddle.x += paddle.dx;
  
    // Wall detection
    if (paddle.x + paddle.w > canvas.width) {
      paddle.x = canvas.width - paddle.w;
    }
  
    if (paddle.x < 0) {
      paddle.x = 0;
      } 
  }
  
  // Move ball on canvas
  function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
  
    // Wall collision (right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
      ball.dx *= -1; // ball.dx = ball.dx * -1
    }
  
    // Wall collision (top/bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
      ball.dy *= -1;
    }
  
    // Paddle collision
    if (
      ball.x - ball.size > paddle.x &&
      ball.x + ball.size < paddle.x + paddle.w &&
      ball.y + ball.size > paddle.y
    ) { 
      ball.dy = -ball.speed; 
      playAudio("paddle.mp3");
    } 
  
    // Brick collision
    bricks.forEach(column => {
      column.forEach(brick => {
        if (brick.visible) {
          if (
            ball.x - ball.size > brick.x && // left brick side check
            ball.x + ball.size < brick.x + brick.w && // right brick side check
            ball.y + ball.size > brick.y && // top brick side check
            ball.y - ball.size < brick.y + brick.h // bottom brick side check
          ) { 
            ball.dy *= -1;
            if(brick.strong==false){
            brick.visible = false;
            playAudio("brick.mp3");
            createParticles(brick.x + brick.w / 2, brick.y + brick.h / 2);

            increaseScore();
            }
            if(brick.strong==true){
              brick.strong=false;
            }
            
          }
        }
      });
    });
  //kawish Ali 
    // Hit bottom wall - Lose
    if (ball.y + ball.size > canvas.height) {
      if(life<1){
        playAudio("gameover.mp3");
        gameOver("Game over! <br /> Click restart to try again.");
        if(restConfirm){
       showAllBricks();
        
      score = 0;
      life=3;
    }
      } 
     else if(life>0){
        life--;
        playAudio("loselife.mp3");
        drawPaddle();
      } 
    }
  }
  restartBtn.addEventListener("click",restart);
  // Increase score
  function increaseScore() {
    if(!rest){
    score++;
  }
    if (score % (rows * cols) === 0) {
      if(!rest && !restConfirm){
        playAudio("levelup.mp3");
     gameOver("You win! <br /> Click restart to play again."); 
     
      //  console.log("came here in 1st");
      } 
       
       
    
  }
  if(restConfirm){ 
    //console.log("came here");
     showAllBricks();
         score = 0;
         life=3;
         paddle.x = canvas.width / 2 - 40;
         paddle.y = canvas.height - 20;
         ball.x = canvas.width / 2;
          ball.y = canvas.height / 2;
         ball.visible = true;
         paddle.visible = true;   
     restConfirm=false;
 }
    
  } 

//game over()
function gameOver(m){
  restartBtn.style.display="inline-block";
     msg.innerHTML=m;
     pauseBtn.style.display="none";
        ball.visible = false;
        paddle.visible = false;
        rest=true;
}

  // to restart the game
   function restart(){
    if(rest){
      rest=false;
      msg.innerHTML=" ";
      restartBtn.style.display="none";
      pauseBtn.style.display="inline-block";
      restConfirm=true;
    } 
   // console.log("going to increase score");
    increaseScore();
    update();
   }
  
  // Make all bricks appear
  function showAllBricks() {
    bricks.forEach(column => {
      column.forEach(brick => {
        brick.visible=true;
        brick.strong=false;
      }); 
    });  
  CreateBricks();
  drawBricks();
  }
  
  
  // Draw everything
  function draw() {
    // clear canvas
    if(start==false){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawBricks();
    drawParticles();

  }
  } 
  
  // Update canvas drawing and animation
  function update() {
      
    // Draw everything
    movePaddle();
    moveBall();
    
    
  if(pause==false && rest==false){ 
    
    draw(); 
    requestAnimationFrame(update);
  } 
  
  
  }
  
  update();
  pauseBtn.addEventListener("click",paused);
//pause function
function paused(){
  if(!pause){
    pause=true;
    btnImage.src="play.png"; 
  }
  else{
    pause=false;
   btnImage.src="pause.png";
    update();
  }
}



  // Keydown event
  function keyDown(e) {
    if (e.key === 'ArrowRight') {
      paddle.dx = paddle.speed;
    } else if (e.key === 'ArrowLeft') {
      paddle.dx = -paddle.speed;
    }
    if (e.code === 'Space') {
      e.preventDefault();
    }
  }
  
  // Keyup event 
  function keyUp(e) {
    if ( 
      e.key === 'Right' ||
      e.key === 'ArrowRight' ||
      e.key === 'Left' ||
      e.key === 'ArrowLeft'
    ) {
      paddle.dx = 0; 
    }
  }
  
  // Keyboard event handlers
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);
    document.getElementById('strbtn').style.display="none";
    pauseBtn.style.display="inline-block";
    
    }

   





