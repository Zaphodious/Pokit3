export function main(pokitOS) {
    console.log('loaded')
    let e = pokitOS.ecs.makeEntity({height: 640, width: 640, depth: 10, x: 0, y: 0, z: 10})
            // .addCog("audioSource", {startOnInit: true, loop:true, spatial: true, id: 'cali'})
            .addCog("img", {id: "santasprites"})
            // .addCog('spriteActor')
            .addCog('tilemap', {id:"sampmap", alphaTile:1})
            // .addUniqueCog('inc', {
            //     c: 0,
            //     update () {
            //         this.c+=.01;
            //         e.x = Math.sin(this.c) * 16 * 20   
            //     }
            // })
}