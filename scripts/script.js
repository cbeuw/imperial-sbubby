var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();


createHiDPICanvas = function (w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

const White = "#ffffff"
const Black = "#000000"

const Navy = "#002147"
const ImperialBlue = "#003E74"

const LightGrey = "#EBEEEE"
const CoolGrey = "#9D9D9D"
const LightBlue = "#D4EFFC"

// Cool
const Danube = "#679ac9" // the old 2 tone

const Blue = "#006EAF"
const ProcessBlue = "#0091D4"
const PoolBlue = "#00ACD7"
const DarkTeal = "#0F8291"
const Teal = "#009CBC"
const Seaglass = "#379F9F"
const DarkGreen = "#02893B"
const KermitGreen = "#66A40A"
const Lime = "#BBCE00"

// Warm
const Orange = "#D24000"
const Tangerine = "#EC7300"
const LemonYellow = "#FFDD00"
const Brick = "#A51900"
const Red = "#DD2501"
const Cherry = "#E40043"
const Raspberry = "#9F004E"
const MagentaPink = "#C81E78"
const Iris = "#751E66"
const Violet = "#960078"
const Plum = "#321E6D"
const Purple = "#653098"

var canvas
var ctx

var drawCanvas = function (w, h) {
    var canvasDiv = document.getElementById("canvasDiv")
    canvas = createHiDPICanvas(w, h)
    canvasDiv.firstChild.remove()
    canvasDiv.appendChild(canvas)
    ctx = canvas.getContext("2d")
}

var makeColourOption = function (colour, text) {
    var option = document.createElement("option")
    option.value = colour
    option.text = text
    if (colour != White) {
        option.style = "color: white; background-color:" + colour
    } else {
        option.style = "color: black; background-color:" + colour
    }
    return option
}

var populateMainColour = function () {
    var select = document.getElementById("mainColour")
    var pairs = [
        [ImperialBlue, "Imperial Blue"],
        [Black, "Black"],
        [White, "White"]
    ]
    for (var i = 0; i < pairs.length; i++) {
        select.add(makeColourOption(pairs[i][0], pairs[i][1]))
    }
}

var populateSubColour = function () {
    var select = document.getElementById("subColour")
    var pairs = [
        [ImperialBlue, "Imperial Blue"],
        [Danube, "Danube"],
        [ProcessBlue, "Process Blue"],
        [Black, "Black"],
        [White, "White"]
    ]
    for (var i = 0; i < pairs.length; i++) {
        select.add(makeColourOption(pairs[i][0], pairs[i][1]))
    }
}

var populateBgColour = function () {
    var select = document.getElementById("bgColour")
    var pairs = [
        [White, "White"],
        [ImperialBlue, "Imperial Blue"],
        [Navy, "Navy"],
        [Blue, "Blue"],
        [ProcessBlue, "Process Blue"],
        [PoolBlue, "Pool Blue"],
        [DarkTeal, "Dark Teal"],
        [Teal, "Teal"],
        [Seaglass, "Seaglass"],
        [DarkGreen, "Dark Green"],
        [KermitGreen, "KermitGreen"],
        [Lime, "Lime"],
        [Orange, "Orange"],
        [Tangerine, "Tangerine"],
        [LemonYellow, "Lemon Yellow"],
        [Brick, "Brick"],
        [Red, "Red"],
        [Cherry, "Cherry"],
        [Raspberry, "Raspberry"],
        [MagentaPink, "Magenta Pink"],
        [Iris, "Iris"],
        [Violet, "Violet"],
        [Plum, "Plum"],
        [Purple, "Purple"]
    ]
    for (var i = 0; i < pairs.length; i++) {
        select.add(makeColourOption(pairs[i][0], pairs[i][1]))
    }
}

var load = function () {
    drawCanvas(0, 0);

    populateMainColour()
    populateSubColour()
    populateBgColour()

    onLetterSpacingOffsetChange()
    onSizeChange()
    onMainColourChange()
    onSubColourChange()
    onBgColourChange()
    onMaintextChange()
    onSubtextChange()
}

var mainFontSize
var mainFontXHeight  // xheight in px is roughly fontsize in px/2
// xheight is the margin around
var mainFirstLineBaselineOffset
var mainLastLineBaselineOffset

var subFontSize
var subFirstLineBaselineOffset
var subLastLineBaselineOffset

var letterSpacingOffset = 0

var fillWidth // colour fill width
var fillHeight // colour fill height

var mainColour
var subColour
var bgColour

var maintext = ""
var subtext = ""

// updates mainFontXHeight, subFontSize, fillWidth and fillHeight
var updateTextMeasures = function () {
    subFontSize = mainFontSize * (4.0 / 7.0)

    canvas.style.letterSpacing = ((-0.05 + letterSpacingOffset) * mainFontSize).toString() + "px"
    ctx = canvas.getContext("2d")
    ctx.font = mainFontSize + "px StoneSansSemiBold"

    var mainLogoTextWidth = ctx.measureText(maintext.split("\n")[0]).width
    mainFontXHeight = ctx.measureText("x").width; // good enough

    fillWidth = mainFontXHeight + mainLogoTextWidth + mainFontXHeight

    mainFirstLineBaselineOffset = mainFontXHeight * 2

    mainLastLineBaselineOffset = mainFirstLineBaselineOffset + mainFontSize * (maintext.split("\n").length - 1)
    if (subtext == "") {
        fillHeight = mainLastLineBaselineOffset + mainFontXHeight
    } else {
        subFirstLineBaselineOffset = mainLastLineBaselineOffset + mainFontSize * (6.0 / 7.0)
        subLastLineBaselineOffset = subFirstLineBaselineOffset + subFontSize * (subtext.split("\n").length - 1)
        fillHeight = subLastLineBaselineOffset + mainFontXHeight
    }
}

var onSizeChange = function () {
    mainFontSize = parseInt(document.getElementById("size").value);
    updateCanvas();
}

var onLetterSpacingOffsetChange = function () {
    letterSpacingOffset = document.getElementById("letterSpacingOffset").value / 400.0
    updateCanvas();
}


var onMainColourChange = function () {
    var selector = document.getElementById("mainColour")
    var colour = selector.value;
    selector.style.backgroundColor = colour
    if (colour != White) {
        selector.style.color = White
    } else {
        selector.style.color = Black
    }
    mainColour = colour
    updateCanvas();
}

var onSubColourChange = function () {
    var selector = document.getElementById("subColour")
    var colour = selector.value;
    selector.style.backgroundColor = colour
    if (colour != White) {
        selector.style.color = White
    } else {
        selector.style.color = Black
    }
    subColour = colour
    updateCanvas();
}

var onBgColourChange = function () {
    var selector = document.getElementById("bgColour")
    var colour = selector.value;
    selector.style.backgroundColor = colour
    if (colour != White) {
        selector.style.color = White
    } else {
        selector.style.color = Black
    }
    bgColour = colour
    updateCanvas();
}

var onMaintextChange = function () {
    maintext = document.getElementById("maintext").value
    updateCanvas()
}

var onSubtextChange = function () {
    subtext = document.getElementById("subtext").value;
    updateCanvas()
}

var updateCanvas = function () {
    updateTextMeasures();

    drawCanvas(fillWidth, fillHeight)

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColour
    ctx.fillRect(0, 0, fillWidth, fillHeight);

    updateMainLogo()
    updateSubtext()
}

var updateMainLogo = function () {
    canvas.style.letterSpacing = ((-0.05 + letterSpacingOffset) * mainFontSize).toString() + "px"
    ctx = canvas.getContext("2d")

    ctx.font = mainFontSize + "px StoneSansSemiBold"
    ctx.fillStyle = mainColour

    var lines = maintext.split("\n")
    for (var i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], mainFontXHeight, mainFirstLineBaselineOffset + mainFontSize * i)
    }
}

var updateSubtext = function () {
    canvas.style.letterSpacing = ((-0.05 + letterSpacingOffset) * subFontSize).toString() + "px"
    ctx = canvas.getContext("2d")

    ctx.font = subFontSize + "px StoneSansSemiBold"
    ctx.fillStyle = subColour
    var lines = subtext.split("\n")
    for (var i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], mainFontXHeight, subFirstLineBaselineOffset + subFontSize * i)
    }
}