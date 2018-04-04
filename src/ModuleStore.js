const WHITE = 0xFFFFFFFF;
const BLACK = 0x000000FF;
const RED   = 0xFF0000FF;

function makeFrameset() {
    const f1 = []
    const w = 50
    const h = 30
    for(let x = 0; x<w*h; x++) {
        f1[x] = BLACK
    }
    return {
        width:w,
        height:h,
        frames:[f1]
    }
}

function getWidth(fs) { return fs.width }
function getHeight(fs) { return fs.height }
function getColorAt(fs, x,y, t) {
    const n = y * getWidth(fs) + x
    return fs.frames[t][n]
}

function getPixelRGBA(fs, x,y,   t) {
    const n = y * getWidth(fs) + x
    return fs.frames[t][n]
}
function setPixelRGBA(fs, x,y,c, t) {
    const n = y * getWidth(fs) + x
    fs.frames[t][n] = c
    return c
}


function performDiagonalLines(old,ctx) {
    for(let y=0; y<ctx.getHeight(); y++) {
        for(let x=0;x<ctx.getWidth();x++) {
            ctx.setPixelRGBA(x,y,Math.floor((x+y)/2)%2 === 0?WHITE:BLACK)
        }
    }
}

function performVerticalLines(old,ctx) {
    const offset = (ctx.getTime() % 10)
    for(let y=0; y<ctx.getHeight(); y++) {
        for(let x=-offset;x<ctx.getWidth();x++) {
            if(x%3===0) {
                ctx.setPixelRGBA(x, y, RED)
            } else {
                ctx.setPixelRGBA(x,y,old.getPixelRGBA(x,y))
            }
        }
    }
}

function makeContext(frameset) {
    return {
        getHeight: function() { return getHeight(frameset)},
        getWidth: function() { return getWidth(frameset)},
        setPixelRGBA: function(x,y,c) { return setPixelRGBA(frameset, x,y,c, 0) },
        getPixelRGBA: function(x,y,c) { return getPixelRGBA(frameset, x,y,   0) },
        getTime: function() { return 0 }
    }
}

class ModuleStore {
    constructor() {
        this.library = {
            'diagonal-lines': {
                name: 'diagonal-lines',
                author: 'jmarinacci@mozilla.com',
                fun: performDiagonalLines,
            },
            'vertical-lines': {
                name: 'vertical-lines',
                author: 'jmarinacci@mozilla.com',
                fun: performVerticalLines
            },
        }

        this.document = [
            {
                template: this.library['diagonal-lines'],
                current:null,
            },
            {
                template: this.library['vertical-lines'],
                current:null,
            }
        ]
        this.listeners = {}
    }
    on(type,cb) {
        if(!this.listeners[type]) this.listeners[type] = []
        this.listeners[type].push(cb)
        return cb
    }
    of(type,cb) {
        this.listeners[type] = this.listeners[type].filter((c)=> c!==cb)
    }
    getLibraryModules() {
        return o2a(this.library)
    }
    getActiveModules() {
        return this.document
    }

    start() {
        console.log("starting the animation")
        const frameset = this.executeModules()
        console.log("the final frameset is",frameset)
        this.listeners['changed'].forEach(cb => cb(this))
    }
    executeModules() {
        let frameset = makeFrameset()
        this.document.forEach((cur)=>{
            console.log("cur = ", cur)
            const fs2 = makeFrameset()
            cur.template.fun(makeContext(frameset), makeContext(fs2))
            cur.current = fs2
            frameset = fs2
        })
        console.log("final frameset = ", frameset)
        return frameset
    }


    drawCanvas(module,canvas) {
        const frameset = module.current
        const ctx = canvas.getContext('2d')
        const frame = 0
        const w = getWidth(frameset)
        const h = getHeight(frameset)
        const s = 5
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0,w*s,h*s)
        for(let j=0;j<h;j++) {
            for(let i=0; i<w; i++) {
                let col = getColorAt(frameset, i,j,frame).toString(16)
                while(col.length < 8) {
                    col = "0"+col
                }
                const scol = '#'+col+''
                ctx.fillStyle = scol
                ctx.fillRect(i*s,j*s,s,s)
            }
        }
    }
}


function o2a(obj) {
    return Object.keys(obj).map((key)=>obj[key])
}


export default new ModuleStore()