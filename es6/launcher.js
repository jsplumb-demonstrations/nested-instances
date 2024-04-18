import {HelloWorld} from "./apps/hello-world/hello-world";
import {Flowchart} from "./apps/flowchart/flowchart";
import {EVENT_TAP} from "@jsplumbtoolkit/browser-ui";

export const FLOWCHART = "flowchart"
export const HELLO_WORLD = "hello-world"

let x = 50, y = 50, step = 100

/**
 * Launch an app of the type represented by the given node. Also creates a launcher icon for the given app and uses
 * the surface's `floatElement` method to position the icon in a static position on the "desktop".
 * @param surface
 * @param node
 */
export function launch(surface, node) {

    const el = surface.getRenderedElement(node.id)
    const type = node.data.app

    if (type === FLOWCHART) {
        new Flowchart(el.querySelector(".jtk-workspace-window-content"), el.querySelector(".jtk-workspace-window-controls"))
        attachIcon(surface, node, type)
    } else if (type === HELLO_WORLD) {
        new HelloWorld(el.querySelector(".jtk-workspace-window-content"), el.querySelector(".jtk-workspace-window-controls"))
        attachIcon(surface, node, type)
    } else {
        console.log(`Unsupported launcher ${type}`)
    }
}

function attachIcon(surface, node, type) {
    const launcher = new DOMParser().parseFromString(`<div id="${type}-launcher" class="jtk-workspace-icon"><div></div><span>${node.data.name}</span></div>`, "text/html").childNodes[0]
    surface.floatElement(launcher, {x, y})
    y += step

    // on click, show the associated app via the Surface's `setVisible` method.
    surface.on(launcher, EVENT_TAP, (e) => {
        surface.setVisible(node.id, true)
    })
}
