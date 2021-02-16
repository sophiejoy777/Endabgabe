namespace Firework {
  const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
  //Canvas 2D Kontext wird benötigt zum Zeichen von Elementen in dem Canvas
  export const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");

  //Definition des Typ's FireworkConfig
  export type FireworkConfig = {
    _id?: string; //id, welche von Mongodb automatisch vergeben wird
    name: string;
    description: string;
    hues: number[]; //hue values not colors 0-360
    saturation: number; //0-100%
    brightness: number; //0-100%
    gravity: number; //0-1
    friction: number; //0-1
    fadeEffect: number; //0-1
    particleRadius: number; //1-100px
    particleNumber: number; //1-1000
    particleSpeed: number; //0-100
    particleAlphaReduction: number; //0-1
  };

  //Standardkonfiguration für das Feuerwerk
  let fireworkSettings: FireworkConfig = {
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

  let availableFireworks: FireworkConfig[] = [];

  let activeFireworks: FireworkRocket[] = [];

  canvas.addEventListener("click", ev => {
    launchRocket({x: ev.offsetX, y: ev.offsetY}, fireworkSettings);
  });

  function launchRocket(pos: Vector, config: FireworkConfig): void {
    activeFireworks.push(new FireworkRocket(pos, config));
  }

  function updateFrame(): void {
    window.requestAnimationFrame(updateFrame);

    ctx.fillStyle = `rgba(0, 0, 0, ${fireworkSettings.fadeEffect})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    activeFireworks.forEach((firework, i) => {
      if (!firework.isBurnedOut()) {
        firework.update();
      } else {
        activeFireworks.splice(i, 1);
      }
    });
  }

  updateFrame();


  //Hier werden alle UI elemente initialisiert
  const fireworkName: HTMLInputElement = <HTMLInputElement>document.getElementById("name");
  const fireworkDescription: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("description");
  const hueList: HTMLUListElement = <HTMLUListElement>document.getElementById("huelist");
  const huePreview: HTMLDivElement = <HTMLDivElement>document.getElementById("huepreview");
  const hueInput: HTMLInputElement = <HTMLInputElement>document.getElementById("hue");
  const addHue: HTMLInputElement = <HTMLInputElement>document.getElementById("addhue");
  const saturationInput: HTMLInputElement = <HTMLInputElement>document.getElementById("saturation");
  const brightnessInput: HTMLInputElement = <HTMLInputElement>document.getElementById("brightness");
  const gravityInput: HTMLInputElement = <HTMLInputElement>document.getElementById("gravity");
  const frictionInput: HTMLInputElement = <HTMLInputElement>document.getElementById("friction");
  const fadeEffectInput: HTMLInputElement = <HTMLInputElement>document.getElementById("fadeeffect");
  const particleRadiusInput: HTMLInputElement = <HTMLInputElement>document.getElementById("particleradius");
  const particleNumberInput: HTMLInputElement = <HTMLInputElement>document.getElementById("particlenumber");
  const particleSpeedInput: HTMLInputElement = <HTMLInputElement>document.getElementById("particlespeed");
  const particleAlphaReductionInput: HTMLInputElement = <HTMLInputElement>document.getElementById("particlealphareduction");
  const submitFireworkButton: HTMLInputElement = <HTMLInputElement>document.getElementById("submit");
  const searchFireworkButton: HTMLInputElement = <HTMLInputElement>document.getElementById("searchFireworks");
  const loadFireworkButton: HTMLInputElement = <HTMLInputElement>document.getElementById("loadFirework");
  const availableFireworksDropdown: HTMLSelectElement = <HTMLSelectElement>document.getElementById("availableFireworks");


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

  function deleteHue(toDeleleIndex: number): void {
    fireworkSettings.hues = fireworkSettings.hues.filter((_value, index) => index != toDeleleIndex);
    displayHues();
  }

  function displayHues(): void {
    hueList.innerHTML = "";

    fireworkSettings.hues.forEach((hue, index) => {
      const listItem: HTMLLIElement = <HTMLLIElement>document.createElement("li");

      listItem.innerHTML = hue.toString();

      listItem.style.color = `hsl(${hue}, 100%, 50%)`;

      const deleteButton: HTMLInputElement = <HTMLInputElement>document.createElement("input");
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


  function loadCurrentConfig(): void {
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
    let query: URLSearchParams = new URLSearchParams();
    fireworkSettings._id = undefined;

    query.append("fireworkconfig", JSON.stringify(fireworkSettings));

    query.append("type", "put");

    fetch("https://firework0000.herokuapp.com/?" + query.toString());
  });

  searchFireworkButton.addEventListener("click", async () => {
    let query: URLSearchParams = new URLSearchParams();
    query.append("type", "get");

    const response: Response = await fetch("https://firework0000.herokuapp.com/?" + query.toString());

    const data: FireworkConfig[] = await response.json();

    availableFireworksDropdown.innerHTML = "";

    data.forEach(firework => {
      const newOption: HTMLOptionElement = <HTMLOptionElement>document.createElement("option");

      newOption.value = <string>firework._id;

      newOption.text = firework.name;

      availableFireworksDropdown.add(newOption);
    });

    availableFireworks = data;
  });

  loadFireworkButton.addEventListener("click", () => {
    const selectedId: string = availableFireworksDropdown.value;

    const selectedFirework: FireworkConfig = <FireworkConfig>availableFireworks.find(firework => {
      return firework._id == selectedId;
    });

    fireworkSettings = selectedFirework;

    loadCurrentConfig();
  });


  export function randomNumberFromRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}