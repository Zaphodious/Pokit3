import { Types, AssetManager } from "../assetmanager.js";
import { PokitOS } from "../pokitos.js";

export function addTileMapSupport(pokitOS: PokitOS) {
    pokitOS.assets.registerType("TILED") 
    pokitOS.assets.registerDecoder(Types.TILED, decodeTiled)
    // AssetManager.prototype.getTileMap = async function(tilemapName, src) {
    //     let j =  await this.getJson(tilemapName, src)
    // }
}

async function decodeTiled(_, response) {
    let ob = await response.json();
    let {tilewidth, tileheight, width, height, layers} = ob
    let tilelayers = []
    let objects = {}
    let zind = 1;
    for (let layer of layers) {
            console.log('processing layer')
            console.log(layer)
        if (layer.visible) {
            layer.z = zind;
            if (layer.type == "tilelayer") {
                tilelayers.push(layer)
            }
            if (layer.type == "objectgroup") {
                tilelayers.push([]);
                for (let o of layer.objects) {
                    console.log(o)
                    o.x += layer.x
                    o.y += layer.y
                    o.x -= o.width/2
                    o.y -= o.height/2
                }
                layer.objects.filter((a) => a.visable)
                objects[layer.name] = layer.objects
            }
        }
        zind++;
    }
    let ret = {
        tileLayers: tilelayers,
        objects: objects,
        tileheight: tileheight,
        tilewidth: tilewidth,
        height: height,
        width: width,
        maxZ: zind
    }
    return ret
}