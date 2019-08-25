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


createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

const White="#ffffff"
const Black="#000000"
const Navy="#002147"
const ImperialBlue="#003E74"
const LightGrey="#EBEEEE"
const CoolGrey="#9D9D9D"
const LightBlue="#D4EFFC"
const Blue="#006EAF"
const ProcessBlue="#0091D4"
const PoolBlue="#00ACD7"

var canvas
var ctx     

var drawCanvas = function(w,h) {
    var canvasDiv = document.getElementById("canvasDiv")
    canvas = createHiDPICanvas(w,h)
    canvasDiv.firstChild.remove()
    canvasDiv.appendChild(canvas)
    ctx = canvas.getContext("2d")
}

var makeColourOption = function(colour,text){
    var option = document.createElement("option")
    option.value=colour
    option.text=text
    if (colour != White){
        option.style="color: white; background-color:"+colour
    }
    return option
}

var populateMainColour = function() {
    var select = document.getElementById("mainColour")
    var pairs=[
        [ImperialBlue,"Imperial Blue"],
        [Black, "Black"],
        [White, "White"]
    ]
    for(var i=0;i<pairs.length;i++){
        select.add(makeColourOption(pairs[i][0],pairs[i][1]))
    }
}

var populateSubColour = function() {
    var select = document.getElementById("subColour")
    var pairs=[
        [ImperialBlue, "Imperial Blue"],
        [ProcessBlue,"Process Blue"],
        [White, "White"]
    ]
    for(var i=0;i<pairs.length;i++){
        select.add(makeColourOption(pairs[i][0],pairs[i][1]))
    }
}

var populateBgColour = function() {
    var select = document.getElementById("bgColour")
    var pairs=[
        [White, "White"],
        [Blue, "Blue"],
        [ProcessBlue, "Process Blue"],
        [PoolBlue, "Pool Blue"]
    ]
    for(var i=0;i<pairs.length;i++){
        select.add(makeColourOption(pairs[i][0],pairs[i][1]))
    }
}

var load = function(){
    drawCanvas(0,0);

    populateMainColour()
    populateSubColour()
    populateBgColour()

    onSizeChange()
    onMainColourChange()
    onSubColourChange()
    onBgColourChange()
}

var mainFontSize
var mainFontXHeight  // xheight in px is roughly fontsize in px/2
                    // xheight is the margin around

var fillWidth
var fillHeight

var mainColour
var subColour
var bgColour

var subtext = ""

var updateTextMeasures = function(){
    mainFontXHeight = mainFontSize/2;

    ctx.font = mainFontSize + "px StoneSansSemiBold"
    var mainLogoTextWidth = ctx.measureText("Imperial College").width

    fillWidth = mainLogoTextWidth + mainFontXHeight

    if (subtext == ""){
        var mainLastLineBaselineOffset = mainFontSize * 2
        fillHeight = mainLastLineBaselineOffset + mainFontXHeight
    } else {
        var lines = subtext.split("\n")
        var subFirstLineBaselineOffset = mainFontSize*2 + mainFontSize * (5.0/7.0)
        var subLastLineBaselineOffset = subFirstLineBaselineOffset + subFontSize * (lines.length-1)
        fillHeight = subLastLineBaselineOffset + mainFontXHeight
    }
}

var onSizeChange = function () {
    mainFontSize = document.getElementById("size").value;
    updateCanvas();
}

var onMainColourChange = function(){
    mainColour = document.getElementById("mainColour").value;
    updateCanvas();
}

var onSubColourChange = function(){
    subColour = document.getElementById("subColour").value;
    updateCanvas();
}

var onBgColourChange = function(){
    bgColour = document.getElementById("bgColour").value;
    updateCanvas();
}

var onSubtextChange = function(){
    subtext = document.getElementById("subtext").value;
    updateCanvas()
}

var updateCanvas = function() {
    updateTextMeasures();

    drawCanvas(fillWidth,fillHeight)

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColour
    ctx.fillRect(0, 0, fillWidth, fillHeight);

    updateMainLogo()
    updateSubtext()
}

var updateMainLogo = function () {
    canvas.style.letterSpacing= (-0.05* mainFontSize).toString() + "px"
    ctx = canvas.getContext("2d")

    ctx.font = mainFontSize + "px StoneSansSemiBold"
    ctx.fillStyle = mainColour

    ctx.textBaseline = "middle"
    ctx.fillText("Imperial College", mainFontXHeight, mainFontXHeight * 1.5)
    ctx.textBaseline = "alphabetic"
    ctx.fillText("London",mainFontXHeight,mainFontSize * 2)
}

var updateSubtext = function (){
    subFontSize = mainFontSize*(4.0/7.0)

    canvas.style.letterSpacing=( -0.05 * subFontSize).toString() + "px"
    ctx = canvas.getContext("2d")

    ctx.font = subFontSize + "px StoneSansSemiBold"
    ctx.fillStyle = subColour
    var subFirstLineBaselineOffset = mainFontSize*2 + mainFontSize * (6.0/7.0)
    var lines = subtext.split("\n")
    for (var i=0;i<lines.length;i++){
        ctx.fillText(lines[i], mainFontXHeight, subFirstLineBaselineOffset + subFontSize*i)
    }
}