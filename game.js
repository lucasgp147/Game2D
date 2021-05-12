const sprite = new Image();
sprite.src = "sprite.png"
var frame = 0;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
var aux = true;

function createGround() {
    const ground = {
        srcX: 0,
        srcY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atua() {
            const groundMoving = 1;
            const repeatIn = ground.largura / 2;
            const moving = ground.x - groundMoving

            ground.x = moving % repeatIn;
        },
        draw() {

            ctx.drawImage(
                sprite, ground.srcX, ground.srcY, ground.altura, ground.altura, ground.x, ground.y, ground.largura, ground.altura,
            );
            ctx.drawImage(
                sprite, ground.srcX, ground.srcY, ground.altura, ground.altura, (ground.x + ground.largura), ground.y, ground.largura, ground.altura,
            );
        }
    }
    return ground;

}

function createGreen() {
    const green = {
        largura: 52,
        altura: 400,
        ground: {
            spriteX: 0,
            spriteY: 169,
        },
        sky: {
            spriteX: 52,
            spriteY: 169,
        },
        space: 80,
        draw() {
            green.pares.forEach(function(par) {
                const random = par.y;
                const spaceBetween = 90;

                const greenSkyX = par.x;
                const greenSkyY = random;
                ctx.drawImage(
                    sprite, green.sky.spriteX, green.sky.spriteY, green.largura, green.altura, greenSkyX, greenSkyY, green.largura, green.altura,
                )
                const greenGroundX = par.x;
                const greenGroundY = green.altura + spaceBetween + random;
                ctx.drawImage(
                    sprite, green.ground.spriteX, green.ground.spriteY, green.largura, green.altura, greenGroundX, greenGroundY, green.largura, green.altura,
                )
                par.greenSky = {
                    x: greenSkyX,
                    y: green.altura + greenSkyY,
                }
                par.greenGround = {
                    x: greenGroundX,
                    y: greenGroundY,
                }

            })

        },
        pares: [{ x: 0 }],
        atua() {
            green.pares[0].x--;

            if (green.pares[0].x <= 0) {
                green.pares = [];
                green.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });

            }

        }


    }
    return green;
}



function groundFind(flappy, ground) {
    const flappyY = flappy.y + flappy.altura
    const groundY = ground.y

    if (flappyY >= groundY) {
        return true;
    }

    return false

}

function createFlappy() {
    const flappy = {
        srcX: 0,
        srcY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        jum: 4.6,
        jump() {
            flappy.velocidade = -flappy.jum
        },
        grav: 0.25,
        velocidade: 0,

        atua() {
            if (groundFind(flappy, global.ground)) {

                changeScreen(screen.start)
                return

            }



            flappy.velocidade = flappy.velocidade + flappy.grav;

            flappy.y = flappy.y + flappy.velocidade;
        },
        draw() {
            ctx.drawImage(sprite, flappy.srcX, flappy.srcY, flappy.largura, flappy.altura, flappy.x, flappy.y, flappy.largura, flappy.altura);
        }
    }
    return flappy;
}





const background = {
    srcX: 390,
    srcY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    draw() {
        ctx.fillStyle = "cyan"
        ctx.fillRect(0, 0, canvas.width, canvas.height)


        ctx.drawImage(
            sprite, background.srcX, background.srcY, background.largura, background.altura, background.x, background.y, background.largura, background.altura,
        );

        ctx.drawImage(
            sprite, background.srcX, background.srcY, background.largura, background.altura, (background.x + background.largura), background.y, background.largura, background.altura,
        );
    }
}

const ready = {
    sx: 134,
    sy: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    draw() {
        ctx.drawImage(
            sprite, ready.sx, ready.sy, ready.w, ready.h, ready.x, ready.y, ready.w, ready.h,
        );
    }
}

const global = {};

var screenOn = {};

function changeScreen(newScreen) {
    screenOn = newScreen;
    if (screenOn.starting) {
        screenOn.starting();

    }

}
const screen = {
    start: {
        starting() {
            global.flappy = createFlappy();
            global.ground = createGround();
            global.green = createGreen();
        },
        draw() {
            background.draw();
            global.ground.draw();
            global.flappy.draw();
            global.green.draw();

            ready.draw();
        },
        click() {

            changeScreen(screen.game);

        },
        atua() {
            global.ground.atua();
            global.green.atua();

        }
    }
};

screen.game = {
    draw() {
        background.draw();
        global.ground.draw();
        global.flappy.draw();
        global.green.draw();
    },
    click() {
        global.flappy.jump();
    },
    atua() {
        global.flappy.atua();
        global.green.atua();
    }
}


function looping() {
    screenOn.draw();
    screenOn.atua()
    requestAnimationFrame(looping);
}


window.addEventListener("click", function() {
    if (screenOn.click) {

        screenOn.click();
    }
});

changeScreen(screen.start);

looping()