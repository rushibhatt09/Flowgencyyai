// Hero canvas: two converging threads made of nodes
const canvas = document.getElementById('threadCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize(){
    W = canvas.width = canvas.offsetWidth * devicePixelRatio;
    H = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  function fitCanvas(){
    canvas.style.width = '100%';
    canvas.style.height = document.querySelector('.hero').offsetHeight + 'px';
    resize();
  }
  window.addEventListener('resize', fitCanvas);
  fitCanvas();

  let t = 0;
  function draw(){
    t += 0.006;
    ctx.clearRect(0,0,W,H);
    const midY = H*0.42;
    const amp = H*0.10;
    const segs = 60;

    function pathY(x, phase, ampMul, dir){
      const nx = x / W;
      return midY + dir*Math.sin(nx*Math.PI*2.1 + phase + t)*amp*ampMul*Math.sin(nx*Math.PI);
    }

    ctx.beginPath();
    for(let i=0;i<=segs;i++){
      const x = (i/segs)*W;
      const y = pathY(x, 0, 1, 1);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.strokeStyle = 'rgba(91,140,255,0.32)';
    ctx.lineWidth = 1.4*devicePixelRatio;
    ctx.stroke();

    ctx.beginPath();
    for(let i=0;i<=segs;i++){
      const x = (i/segs)*W;
      const y = pathY(x, 0, 1, -1);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.strokeStyle = 'rgba(255,107,74,0.32)';
    ctx.lineWidth = 1.4*devicePixelRatio;
    ctx.stroke();

    for(let i=0;i<=segs;i+=6){
      const x = (i/segs)*W;
      const y1 = pathY(x,0,1,1);
      const y2 = pathY(x,0,1,-1);
      ctx.beginPath();
      ctx.arc(x,y1,2.2*devicePixelRatio,0,Math.PI*2);
      ctx.fillStyle='rgba(91,140,255,0.55)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x,y2,2.2*devicePixelRatio,0,Math.PI*2);
      ctx.fillStyle='rgba(255,107,74,0.55)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
}
