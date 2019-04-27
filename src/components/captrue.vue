<template>
    <keep-alive>
        <div v-if="view" class="captrue" @click="showCaptrue">captrue</div>
    </keep-alive>
</template>

<script>

import html2canvas from 'html2canvas';
import Snapshot from './snapshot';

const snapshot = new Snapshot();

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
        showCaptrue() {
            this.view = !this.view;
            snapshot.captrue((url, close) => {
                console.log(this);
                // this.download();
                this.view = true;
                close();
            });
        },
        download(url) {
            const img = new Image();

            img.onload = function() {
                const a = document.createElement('a');
                a.href = url;
                a.download = `${Date.now()}.jpg`;
                a.click();
            }

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
</style>
