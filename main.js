// 获取画布元素和2D上下文
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const sw=document.getElementById("sw");

// 设置初始状态
// 设置初始状态
let isDrawing = false;
context.lineWidth = 20; // 修改笔触大小为20
context.lineCap = 'round';
context.strokeStyle = 'black';

let lx=0,ly=0;

// 开始绘制
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lx=e.clientX - rect.left;
    ly=e.clientY - rect.top;
    draw(e);
    update(identify());
}
function startTouching(e) {
    isDrawing = true;
    const touch=e.changedTouches[0];
    lx=e.pageX;
    ly=e.pageY;
    touching(e);
    update(identify());
    console.log(1);
}

// 绘制
function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    context.beginPath();
    context.moveTo(lx,ly);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    context.lineTo(x, y);
    lx=x;
    ly=y;
    context.stroke();
    context.closePath();
    update(identify());
}
function touching(e) {
    const touch=e.touches[0];
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    context.beginPath();
    context.moveTo(lx,ly);
    const x = touch.pageX - rect.left;
    const y = touch.pageY - rect.top;
    context.lineTo(x, y);
    lx=x;
    ly=y;
    context.stroke();
    context.closePath();
    update(identify());
    console.log(touch);
    // console.log(`touch at (${x},${y})`);
}

// 停止绘制
function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
    }
    update(identify());
}
function stopTouching() {
    if (isDrawing) {
        isDrawing = false;
    }
    update(identify());
}

// 添加事件监听器
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('touchstart', startTouching, false);
canvas.addEventListener('touchmove', touching, false);
canvas.addEventListener('touchend', stopTouching, false);
canvas.addEventListener('touchcancel', stopTouching, false);

sw.onclick=()=>{
    if(sw.checked){
        context.strokeStyle = 'rgba(255,255,255,1)';
    }else{
        context.strokeStyle = 'black';
    }
}

// 清除画布
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    resetDrawingState();
}

// 重置绘图状态
function resetDrawingState() {
    isDrawing = false;
    context.beginPath();
}

// 获取灰度归一化数据
function getNormalizedData() {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // 创建一个临时canvas来绘制28x28的图像
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');
    tempCanvas.width = 28;
    tempCanvas.height = 28;

    // 在临时canvas上绘制原始图像
    tempContext.drawImage(canvas, 0, 0, 28, 28);

    // 获取重新调整大小后的图像数据
    const resizedImageData = tempContext.getImageData(0, 0, 28, 28);
    // const resizedData = /*resizedImageData.*/data;
    const resizedData = resizedImageData.data;

    // 将数据转换为灰度值并归一化
    const normalizedData = [];
    for (let i = 0; i < resizedData.length; i += 4) {
        const grayValue = resizedData[i+3];
        normalizedData.push(grayValue / 255);
    }
    return normalizedData;
}

function identify(){
    let pic=getNormalizedData();
    let input=matVec(pic);
    let y=predict(input);
    return y;
}

function update(pr){
    let x=[];
    for(let y in pr){
        x.push({
            k:y,v:pr[y]
        });
    }
    x.sort((a,b)=>{
        return b.v-a.v;
    });

    let i0l=document.getElementById("i0l");
    let i0r=document.getElementById("i0r");
    i0l.textContent=`判定为:${x[0].k}`;
    i0r.textContent=`置信度:${toPercent(x[0].v)}`;
    for(let i=1;i<10;++i){
        let ie=document.getElementById(`i${i}`);
        ie.textContent=`${x[i].k} : ${toPercent(x[i].v)}`
    }
}

function toPercent(x){
    x*=10000;
    x=Math.round(x);
    x/=100;
    return x+"%";
}

update(identify());