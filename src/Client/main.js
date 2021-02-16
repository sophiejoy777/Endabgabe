"use strict";
var Firework;
(function (Firework) {
    const canvas = document.getElementById("canvas");
    //Canvas 2D Kontext wird benötigt zum Zeichen von Elementen in dem Canvas
    Firework.ctx = canvas.getContext("2d");
    //Standardkonfiguration für das Feuerwerk
    let fireworkSettings = {
        name: "",
        description: "",
        hues: [0, 120, 240],
        saturation: 50,
        brightness: 50,
        gravity: 0.03,
        friction: 0.99,
        fadeEffect: 0.1,
        particleRadius: 3,
        particleNumber: 400,
        particleSpeed: 10,
        particleAlphaReduction: 0.005
    };
    let availableFireworks = [];
    let activeFireworks = [];
    canvas.addEventListener("click", ev => {
        launchRocket({ x: ev.offsetX, y: ev.offsetY }, fireworkSettings);
    });
    function launchRocket(pos, config) {
        activeFireworks.push(new Firework.FireworkRocket(pos, config));
    }
    function updateFrame() {
        window.requestAnimationFrame(updateFrame);
        Firework.ctx.fillStyle = `rgba(0, 0, 0, ${fireworkSettings.fadeEffect})`;
        Firework.ctx.fillRect(0, 0, canvas.width, canvas.height);
        activeFireworks.forEach((firework, i) => {
            if (!firework.isBurnedOut()) {
                firework.update();
            }
            else {
                activeFireworks.splice(i, 1);
            }
        });
    }
    updateFrame();
    //Hier werden alle UI elemente initialisiert
    const fireworkName = document.getElementById("name");
    const fireworkDescription = document.getElementById("description");
    const hueList = document.getElementById("huelist");
    const huePreview = document.getElementById("huepreview");
    const hueInput = document.getElementById("hue");
    const addHue = document.getElementById("addhue");
    const saturationInput = document.getElementById("saturation");
    const brightnessInput = document.getElementById("brightness");
    const gravityInput = document.getElementById("gravity");
    const frictionInput = document.getElementById("friction");
    const fadeEffectInput = document.getElementById("fadeeffect");
    const particleRadiusInput = document.getElementById("particleradius");
    const particleNumberInput = document.getElementById("particlenumber");
    const particleSpeedInput = document.getElementById("particlespeed");
    const particleAlphaReductionInput = document.getElementById("particlealphareduction");
    const submitFireworkButton = document.getElementById("submit");
    const searchFireworkButton = document.getElementById("searchFireworks");
    const loadFireworkButton = document.getElementById("loadFirework");
    const availableFireworksDropdown = document.getElementById("availableFireworks");
    //UI events
    fireworkName.addEventListener("input", () => fireworkSettings.name = fireworkName.value);
    fireworkDescription.addEventListener("input", () => fireworkSettings.description = fireworkDescription.value);
    addHue.addEventListener("click", () => {
        fireworkSettings.hues.push(parseInt(hueInput.value));
        displayHues();
    });
    hueInput.addEventListener("input", () => {
        huePreview.style.backgroundColor = `hsl(${hueInput.value}, 100%, 50%)`;
    });
    function deleteHue(toDeleleIndex) {
        fireworkSettings.hues = fireworkSettings.hues.filter((_value, index) => index != toDeleleIndex);
        displayHues();
    }
    function displayHues() {
        hueList.innerHTML = "";
        fireworkSettings.hues.forEach((hue, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = hue.toString();
            listItem.style.color = `hsl(${hue}, 100%, 50%)`;
            const deleteButton = document.createElement("input");
            deleteButton.type = "button";
            deleteButton.value = "DELETE";
            deleteButton.addEventListener("click", () => {
                deleteHue(index);
            });
            listItem.append(deleteButton);
            hueList.appendChild(listItem);
        });
    }
    saturationInput.addEventListener("input", () => {
        fireworkSettings.saturation = parseInt(saturationInput.value);
    });
    brightnessInput.addEventListener("input", () => {
        fireworkSettings.brightness = parseInt(brightnessInput.value);
    });
    gravityInput.addEventListener("input", () => {
        fireworkSettings.gravity = parseFloat(gravityInput.value);
    });
    frictionInput.addEventListener("input", () => {
        fireworkSettings.friction = parseFloat(frictionInput.value);
    });
    fadeEffectInput.addEventListener("input", () => {
        fireworkSettings.fadeEffect = parseFloat(fadeEffectInput.value);
    });
    particleRadiusInput.addEventListener("input", () => {
        fireworkSettings.particleRadius = parseInt(particleRadiusInput.value);
    });
    particleNumberInput.addEventListener("input", () => {
        fireworkSettings.particleNumber = parseInt(particleNumberInput.value);
    });
    particleSpeedInput.addEventListener("input", () => {
        fireworkSettings.particleSpeed = parseInt(particleSpeedInput.value);
    });
    particleAlphaReductionInput.addEventListener("input", () => {
        fireworkSettings.particleAlphaReduction = parseFloat(particleAlphaReductionInput.value);
    });
    function loadCurrentConfig() {
        displayHues();
        fireworkName.value = fireworkSettings.name;
        fireworkDescription.value = fireworkSettings.description;
        saturationInput.value = fireworkSettings.saturation.toString();
        brightnessInput.value = fireworkSettings.brightness.toString();
        gravityInput.value = fireworkSettings.gravity.toString();
        frictionInput.value = fireworkSettings.friction.toString();
        fadeEffectInput.value = fireworkSettings.fadeEffect.toString();
        particleRadiusInput.value = fireworkSettings.particleRadius.toString();
        particleNumberInput.value = fireworkSettings.particleNumber.toString();
        particleSpeedInput.value = fireworkSettings.particleSpeed.toString();
        particleAlphaReductionInput.value = fireworkSettings.particleAlphaReduction.toString();
    }
    loadCurrentConfig();
    submitFireworkButton.addEventListener("click", () => {
        let query = new URLSearchParams();
        fireworkSettings._id = undefined;
        query.append("fireworkconfig", JSON.stringify(fireworkSettings));
        query.append("type", "put");
        fetch("https://firework0000.herokuapp.com/?" + query.toString());
    });
    searchFireworkButton.addEventListener("click", async () => {
        let query = new URLSearchParams();
        query.append("type", "get");
        const response = await fetch("https://firework0000.herokuapp.com/?" + query.toString());
        const data = await response.json();
        availableFireworksDropdown.innerHTML = "";
        data.forEach(firework => {
            const newOption = document.createElement("option");
            newOption.value = firework._id;
            newOption.text = firework.name;
            availableFireworksDropdown.add(newOption);
        });
        availableFireworks = data;
    });
    loadFireworkButton.addEventListener("click", () => {
        const selectedId = availableFireworksDropdown.value;
        const selectedFirework = availableFireworks.find(firework => {
            return firework._id == selectedId;
        });
        fireworkSettings = selectedFirework;
        loadCurrentConfig();
    });
    function randomNumberFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    Firework.randomNumberFromRange = randomNumberFromRange;
})(Firework || (Firework = {}));
//# sourceMappingURL=main.js.map