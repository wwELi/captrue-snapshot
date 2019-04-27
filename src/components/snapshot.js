import html2canvas from 'html2canvas';

const bacStyle = {
    position: 'fixed',
    top: 0
};

export default class Snapshot {

    option = {
        width: '',
        height: '',
        canvas: null
    }

    origin = null;

    _clip = {
        x: 0,
        y: 0,
        height: 0,
        width: 0
    }

    _isMouseDown = false;

    _handler = () => {};

    captrue(handler) {

        this._handler = handler;

        html2canvas(document.body)
           .then(this.formatCanvas)
           .then(canvas => {
            this.origin = canvas;
            this.drawBackGround();
            this.clipCanvas();
           })
    }

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

    }

    drawBackGround() {

        const canvas = document.createElement('canvas');
        const [dom] = document.body.getClientRects();
        const { width, height } = dom;

        Object.assign(this.option, { width, height, canvas });
        Object.assign(canvas, { width, height });
        Object.assign(canvas.style, { ...bacStyle });

        this.bindEventOnCanvas();

        document.body.appendChild(canvas);
    }

    bindEventOnCanvas() {
        const { canvas } = this.option;

        canvas.addEventListener('mousemove', evt => this.mousemove(evt));
        canvas.addEventListener('mousedown', evt => this.mousedown(evt));
        canvas.addEventListener('mouseup', evt => this.mouseup(evt));
    }

    mousemove(evt) {
        if (!this._isMouseDown) return;
        const width = evt.clientX - this._clip.x;
        const height = evt.clientY - this._clip.y

        this.clipCanvas(this._clip.x, this._clip.y, width, height);
    }

    mousedown(evt) {
        this._isMouseDown = true;
        this._clip.x = evt.clientX;
        this._clip.y = evt.clientY;
    }

    mouseup(evt) {
        const width = evt.clientX - this._clip.x;
        const height = evt.clientY - this._clip.y

        this._isMouseDown = false;
        Object.assign(this._clip, { width, height })
        this.clipCanvas(this._clip.x, this._clip.y, width, height);
        this.createBase64Url();
    }

    clipCanvas(x = 0, y = 0, w = 0, h= 0) {

        const { canvas, width, height } = this.option;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, height);

        ctx.beginPath();
        ctx.save();

        ctx.clearRect(x, y, w, h);

        ctx.restore();
        ctx.closePath()
    }

    createBase64Url() {
    
        const canvas = document.createElement('canvas');
        const { x, y, width, height } = this._clip;

        canvas.width = width;
        canvas.height = height;
            
        const ctx = canvas.getContext('2d');

        ctx.drawImage(this.origin, x, y, width, height, 0, 0, width, height);
        const url = canvas.toDataURL();

        this._handler(url, () => this.destory());
    }

    destory() {
        const { canvas } = this.option;
        document.body.removeChild(canvas);
    }

}