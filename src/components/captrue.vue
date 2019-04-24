<template>
    <keep-alive>
        <div v-if="view" class="captrue" @click="showCaptrue">captrue</div>
        <canvas v-else id="captrue-canvas" @mouseup="mouseup" v-drag @mousemove="mousemove" @mousedown="mousedown"></canvas>
    </keep-alive>
</template>

<script>

import html2canvas from 'html2canvas';

export default {
    data() {
        return {
            view: true,
            isMouseDown: false,
            start: { x: 0, y: 0 },
            ctx: null,
            originCanvas: null
        }
    },
    directives: {
        drag: {
            inserted(el) {
                console.log(el);
            }
        }
    },
    methods: {
        mousemove(evt) {
            if (!this.isMouseDown) return;
            const width = evt.clientX - this.start.x;
            const height = evt.clientY - this.start.y

            this.clipCanvasAction(this.ctx, this.start.x, this.start.y, width, height);
        },
        mousedown(evt) {
            this.isMouseDown = true;
            this.start.x = evt.clientX;
            this.start.y = evt.clientY;
        },
        mouseup(evt) {
            this.isMouseDown = false;
            const width = evt.clientX - this.start.x;
            const height = evt.clientY - this.start.y

            this.clipCanvasAction(this.ctx, this.start.x, this.start.y, width, height);
            this.downloadImage(this.ctx.canvas, this.start.x, this.start.y, width, height);
        },
        showCaptrue() {
            this.view = !this.view;
            this.beginCaptrue();
        },
        formatCanvas(canvas) {

            const url = canvas.toDataURL();
            const [dom] = document.body.getClientRects();
            const { width, height } = dom;

            const promise = new Promise((resole, reject) => {

                const cv = document.createElement('canvas');

                cv.width = width;
                cv.height = height;

                const ctx = cv.getContext('2d');

                ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, cv.width, cv.height);
                
                resole(cv);
            })

            return promise;

        },
        beginCaptrue() {

            html2canvas(document.body)
               .then(this.formatCanvas)
               .then(canvas => {
                   const { width, height } = canvas;
                   const cv = document.querySelector('#captrue-canvas');
                   const ctx = cv.getContext('2d');

                   cv.width = width;
                   cv.height = height;
                   this.ctx = ctx;
                   this.originCanvas = canvas;

                   ctx.save();
                   ctx.drawImage(canvas, 0, 0, width, height, 0, 0, width, height);
                   ctx.restore();

                   this.clipCanvasAction(ctx);
               })
        },
        clipCanvasAction(ctx, sx = 0, sy = 0, w = 0, h = 0) {
        
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.beginPath();
            ctx.save();

            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.clearRect(sx, sy, w, h);
            ctx.restore();
            ctx.closePath();
        },
        downloadImage(cv, x, y, w, h) {

            const { width, height } = this.originCanvas;
            const canvas = document.createElement('canvas');

            canvas.width = w;
            canvas.height = h;
            
            const ctx = canvas.getContext('2d');

            ctx.drawImage(this.originCanvas, x, y, w, h, 0, 0, w, h);
            const url = canvas.toDataURL();

            const img = new Image();

            img.onload = function() {
                const a = document.createElement('a');
                a.href = url;
                a.download = `${Date.now()}.jpg`;
                a.click();
            }

            this.view = !this.view;
            img.src = url;
        }
    }
}
</script>


<style lang="less" scoped>

.captrue {
    width: 60px;
    height: 60px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    border: 1px solid grey; 
    cursor: pointer;

    position: fixed;
    bottom: 100px;
    right: 100px;
}

#captrue-canvas {
    width: 100vw;
    height: 100vh;

    position: absolute;
    top: 0;
    left: 0;
}

</style>
