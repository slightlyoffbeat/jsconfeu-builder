function performCheckerboard(ctx) {
    const WHITE = 0xFFFFFFFF;
    const BLACK = 0x000000FF;
    for(let y=0; ctx.getHeight(); y++) {
        for(let x=0;x<ctx.getWidth();x++) {
            ctx.setPixelRGBA(x,y,Math.floor((x+y)/2)%2 === 0?WHITE:BLACK)
        }
    }
}

function performVerticalLines(ctx) {
    const WHITE = 0xFFFFFFFF;
    const offset = (ctx.getTime() % 10)
    for(let y=0; ctx.getHeight(); y++) {
        for(let x=-offset;x<ctx.getWidth();x++) {
            if(Math.floor(x/10)%2===0) {
                ctx.setPixelRGBA(x, y, WHITE)
            }
        }
    }
}

class ModuleStore {
    constructor() {
        this.library = {
            checkerboard: {
                name: 'checkerboard',
                author: 'jmarinacci@mozilla.com',
                fun: performCheckerboard,
            },
            'vertical-lines': {
                name: 'vertical-lines',
                author: 'jmarinacci@mozilla.com',
                fun: performVerticalLines
            },
        }

        this.document = [this.library.checkerboard, this.library['vertical-lines']]
        this.listeners = {}
    }
    on(type,cb) {
        if(!this.listeners[type]) this.listeners[type] = []
        this.listeners[type].push(cb)
        return cb
    }
    getLibraryModules() {
        return o2a(this.library)
    }
    getActiveModules() {
        return this.document
    }
}


function o2a(obj) {
    return Object.keys(obj).map((key)=>obj[key])
}


export default new ModuleStore()