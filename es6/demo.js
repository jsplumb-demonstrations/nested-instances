import {
    newInstance,
    ready,
    AbsoluteLayout,
    EVENT_TAP,
    EVENT_DBL_TAP,
    MiniviewPlugin,
    DrawingToolsPlugin,
    uuid,
    EVENT_CANVAS_CLICK,
    consume
} from "@jsplumbtoolkit/browser-ui";
import {launch} from "./launcher";

ready(() => {

    const workspace = document.getElementById("workspace")

    // This is the top-level JsPlumb instance
    const mainInstance = newInstance()
    // Render to the workspace element.
    const mainSurface = mainInstance.render(workspace, {
        layout:{
            type:AbsoluteLayout.type
        },
        view:{
            nodes:{
                "default":{
                    template:`<div class="jtk-workspace-window" style="width:{{width}}px;height:{{height}}px">
                                <div>
                                    <header>
                                        <span>{{name}}</span>                                                    
                                        <svg:svg class="svg-icon" viewBox="0 0 1024 1024" width="16" height="16"><svg:path d="M147.4 187.1 283.7 323.4 322.7 284.3 324.6 282.5 190.4 148.2 329.8 148.2 329.8 90.3 89.5 90.3 89.5 329 147.4 329Z"  /><svg:path d="M322.5 739.5 283.4 700.4 281.6 698.5 147.4 832.7 147.4 693.4 89.5 693.4 89.5 933.7 328.1 933.7 328.1 875.8 186.2 875.8Z"  /><svg:path d="M694.2 90.3 694.2 148.2 833.6 148.2 701.2 280.6 699.4 282.5 738.5 321.6 740.3 323.3 876.6 187.1 876.6 329 934.5 329 934.5 90.3Z"  /><svg:path d="M876.6 832.8 742.3 698.6 703.2 737.7 701.5 739.5 837.7 875.8 695.8 875.8 695.8 933.7 934.5 933.7 934.5 693.4 876.6 693.4Z"  /><svg:path d="M512 291.1c-121.8 0-220.9 99.1-220.9 220.8S390.2 732.8 512 732.8 732.9 633.8 732.9 512 633.8 291.1 512 291.1zM675 512c0 89.9-73.1 163-163 163s-163-73.1-163-163c0-89.9 73.1-163 163-163S675 422.1 675 512z"  /></svg:svg>                                          
                                        <span class="jtk-workspace-window-close">X</span>
                                    </header>
                                    <div class="jtk-workspace-window-content">
                                        <div class="jtk-workspace-window-controls"></div>
                                    </div>
                                </div>
                             </div>`
                }
            }
        },
        dragOptions: {
            // these selectors identify parts of the DOM that should not start a drag
            filter: ".jtk-draw-handle, .node-action, .node-action i, .jtk-workspace-window-controls, .jtk-workspace-window-controls *"
        },
        consumeRightClick:false,
        plugins:[
            {
                type:MiniviewPlugin.type,
                options:{
                    container:document.getElementById("jtk-workspace-miniview")
                }
            },
            {
                type:DrawingToolsPlugin.type,
                options:{
                    widthAttribute:"width",
                    heightAttribute:"height"
                }
            }
        ],
        events:{
            // on canvas click, clear the selected object.
            [EVENT_CANVAS_CLICK]:() => mainInstance.clearSelection()
        },
        modelEvents:[
            {
                // on click on window close, set that window to invisible
                event:EVENT_TAP,
                selector:".jtk-workspace-window-close",
                callback:(event, eventTarget, modelObject) => {
                    consume(event)
                    mainSurface.setVisible(modelObject.id, false)
                }
            },
            {
                // on click on the resize icon, set the object to be the selected object. The drawing tools plugin will
                // attach a resizer frame to the window.
                event:EVENT_TAP,
                selector:".jtk-workspace-window header svg",
                callback:(event, eventTarget, modelObject) => {
                    consume(event)
                    mainInstance.setSelection(modelObject.id)
                }
            }
        ]
    })

    mainInstance.load({
        url:`dataset.json?cache=${uuid()}`,
        onload:() => {
            mainInstance.getNodes().forEach(node => {
                launch(mainSurface, node)
            })
        }
    })


})
