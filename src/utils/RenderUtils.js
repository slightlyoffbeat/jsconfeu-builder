const WHITE = 0xFFFFFFFF;
const BLACK = 0x000000FF;
const RED   = 0xFF0000FF;
const GREEN   = 0x00FF00FF;

function getWidth(fs) { return fs.width }
function getHeight(fs) { return fs.height }
function getColorAt(fs, x,y, t) {
    const n = y * getWidth(fs) + x
    return fs.frames[t][n]
}

function getPixelRGBA(fs, x,y, f) {
    const n = y * getWidth(fs) + x
    return fs.frames[f][n]
}
function setPixelRGBA(fs, x,y, f, c) {
    const n = y * getWidth(fs) + x
    fs.frames[f][n] = c
    return c
}
function getFrameCount(fs) { return fs.frames.length }

module.exports.makeContext = function(frameset) {
    return {
        getHeight: function() { return getHeight(frameset)},
        getWidth: function() { return getWidth(frameset)},
        setPixelRGBA: function(x,y,f,c) { return setPixelRGBA(frameset, x,y,f,c) },
        getPixelRGBA: function(x,y,f  ) { return getPixelRGBA(frameset, x,y,f) },
        getFrameCount: function() { return getFrameCount(frameset)},
    }
}
module.exports.makeFrameset = function (w,h,frameCount) {
    const frames = []
    // const w = 44
    // const h = 36
    // const frameCount = 10;
    for(let i=0; i<frameCount; i++) {
        const f1 = []
        for(let x = 0; x<w*h; x++) {
            f1[x] = BLACK
        }
        frames.push(f1)
    }
    return {
        width:w,
        height:h,
        frames:frames
    }
}

module.exports.makePNG = function(anim,frame) {
    // console.log("rendering the frame",anim,frame)
    const canvas = document.createElement('canvas')
    canvas.width = anim.cols
    canvas.height = anim.rows
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'red'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    for(let i=0; i<anim.cols; i++) {
        for(let j=0; j<anim.rows; j++) {
            const c = frame[j][i]
            ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`
            ctx.fillRect(i,j,1,1)
        }
    }
    return canvas.toDataURL('image/png')
}

module.exports.data2png = function(anim, datas) {
    const canvas = document.createElement('canvas')
    canvas.width = anim.cols
    canvas.height = anim.rows
    function id2png(data,i) {
        return new Promise((res,rej) => {
            const context = canvas.getContext('2d')
            context.putImageData(data, 0, 0)
            res(canvas.toDataURL('image/png'))
        })
    }
    return Promise.all(datas.map((data,i) => id2png(data,i))).then((pngs)=>{
        console.log("fully done converting ImageData to PNGs")
        return pngs
    }).catch(e => {
        console.log('errors!',e)
    })

}

module.exports.png2data = function(anim, pngs) {
    console.log("expanding data from pngs",pngs.length)

    const canvas = document.createElement('canvas')
    canvas.width = anim.cols
    canvas.height = anim.rows
    function ld(png,i) {
        return new Promise((res,rej) =>{
            const img = new Image()
            img.onload = () => {
                const context = canvas.getContext('2d');
                context.fillStyle = (i%2==0)?'red':'blue'
                context.fillRect(0,0,canvas.width,canvas.height)
                context.drawImage(img,0,0)
                res(context.getImageData(0, 0, canvas.width, canvas.height))
            }
            img.src = png
        })
    }
    return Promise.all(pngs.map((png,i) => ld(png,i))).then((datas)=>{
        console.log("fully done loading them")
        return datas
    }).catch(e => {
        console.log('errors!',e)
    })
}

module.exports.json2data = function(anim, json) {
    const canvas = document.createElement('canvas')
    canvas.width = anim.cols
    canvas.height = anim.rows
    function json2id(frame, i) {
        return new Promise((res,rej)=>{
            const context = canvas.getContext('2d');
            const id = context.getImageData(0,0,canvas.width,canvas.height)
            for(let i=0; i<id.width; i++) {
                for(let j=0; j<id.height; j++) {
                    const n = (j*id.width + i)*4
                    id.data[n+0] = frame[j][i][0]
                    id.data[n+1] = frame[j][i][1]
                    id.data[n+2] = frame[j][i][2]
                    id.data[n+3] = 255 // force the alpha to 100% opaque
                }
            }
            res(id)
        })
    }

    return Promise.all(json.map((frame,i) => json2id(frame,i))).then((datas)=>{
        console.log("fully done converting json to ImageData")
        return datas
    }).catch(e => {
        console.log('errors!',e)
    })
}