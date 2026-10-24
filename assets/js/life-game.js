(() => {
  const NS = "http://www.w3.org/2000/svg";
  const width = 1248;
  const height = 741;

  const colors = {
    ink: "#4d4d4d",
    node: "#477fb5",
    line: "#727a80",
    grid: "#929292",
    divider: "#aaa69b",
    bands: ["#ffe2aa", "#f4dfb9", "#ead5ad", "#e5ddcd", "#d9d5cc"],
  };

  const plot = {
    left: 128,
    right: 1100,
    top: 138,
    bottom: 721,
  };

  const xPositions = Array.from({ length: 7 }, (_, index) =>
    plot.left + ((plot.right - plot.left) / 6) * index,
  );
  const yPositions = [197, 314, 430, 546, 662];
  const bandEdges = [138, 255, 372, 488, 604, 721];
  const satisfactionLabels = ["Great", "Decent", "Average", "Poor", "Bad"];
  const game = {
    column: -1,
    row: null,
    rolling: false,
    awaitingChoice: false,
    complete: false,
    history: [],
  };

  const createSvgElement = (tag, attributes = {}, text = "") => {
    const element = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([name, value]) =>
      element.setAttribute(name, String(value)),
    );
    if (text) element.textContent = text;
    return element;
  };

  const addText = (svg, text, x, y, attributes = {}) => {
    const node = createSvgElement(
      "text",
      {
        x,
        y,
        fill: colors.ink,
        "font-family": "Arial, Helvetica, sans-serif",
        ...attributes,
      },
      text,
    );
    svg.append(node);
    return node;
  };

  const drawBackground = (svg) => {
    colors.bands.forEach((fill, index) => {
      svg.append(
        createSvgElement("rect", {
          x: plot.left,
          y: bandEdges[index],
          width: plot.right - plot.left,
          height: bandEdges[index + 1] - bandEdges[index],
          fill,
        }),
      );
    });
  };

  const drawGuides = (svg) => {
    [xPositions[2], xPositions[4]].forEach((x) => {
      svg.append(
        createSvgElement("line", {
          x1: x,
          y1: plot.top,
          x2: x,
          y2: plot.bottom,
          stroke: colors.divider,
          "stroke-width": 1,
          opacity: 0.75,
        }),
      );
    });

    yPositions.forEach((y) => {
      svg.append(
        createSvgElement("line", {
          x1: plot.left,
          y1: y,
          x2: plot.right,
          y2: y,
          stroke: colors.grid,
          "stroke-width": 1.5,
          "stroke-dasharray": "1 3",
          "stroke-linecap": "round",
        }),
      );
    });
  };

  const drawPaths = (svg) => {
    for (let column = 0; column < xPositions.length - 1; column += 1) {
      for (let row = 0; row < yPositions.length; row += 1) {
        if (row < yPositions.length - 1) {
          svg.append(
            createSvgElement("line", {
              x1: xPositions[column],
              y1: yPositions[row],
              x2: xPositions[column + 1],
              y2: yPositions[row + 1],
              stroke: colors.line,
              "stroke-width": 1.15,
            }),
          );
        }

        if (row > 0) {
          svg.append(
            createSvgElement("line", {
              x1: xPositions[column],
              y1: yPositions[row],
              x2: xPositions[column + 1],
              y2: yPositions[row - 1],
              stroke: colors.line,
              "stroke-width": 1.15,
              "stroke-dasharray": "6 6",
            }),
          );
        }
      }
    }
  };

  const drawNodes = (svg) => {
    xPositions.forEach((x) => {
      yPositions.forEach((y) => {
        svg.append(
          createSvgElement("circle", {
            cx: x,
            cy: y,
            r: 9,
            fill: colors.node,
          }),
        );
      });
    });
  };

  const drawLabels = (svg) => {
    addText(svg, "Life Stage", 614, 64, {
      "font-size": 23,
      "font-weight": 700,
      "text-anchor": "middle",
    });

    [
      ["Youth", 290],
      ["Adulthood", 614],
      ["Elderly", 938],
    ].forEach(([label, x]) => {
      addText(svg, label, x, 115, {
        "font-size": 17,
        "text-anchor": "middle",
      });
    });

    [5, 4, 3, 2, 1].forEach((value, index) => {
      addText(svg, value, 105, yPositions[index] + 6, {
        "font-size": 17,
        "text-anchor": "end",
      });
    });

    satisfactionLabels.forEach((label, index) => {
      addText(svg, label, 1127, yPositions[index] - 14, {
        "font-size": 16,
        transform: `rotate(90 1127 ${yPositions[index] - 14})`,
      });
    });

    addText(svg, "Life Satisfaction", 1189, 344, {
      "font-size": 23,
      "font-weight": 700,
      transform: "rotate(90 1189 344)",
    });
  };

  const render = () => {
    const host = document.querySelector("#life-visualization");
    const svg = createSvgElement("svg", {
      viewBox: `0 0 ${width} ${height}`,
      xmlns: NS,
      "aria-hidden": "true",
      focusable: "false",
    });

    drawBackground(svg);
    drawGuides(svg);
    drawPaths(svg);
    drawNodes(svg);
    drawLabels(svg);
    host.replaceChildren(svg);
  };

  const getSvg = () => document.querySelector("#life-visualization svg");

  const clearJourney = () => {
    getSvg().querySelectorAll(".journey-path, .journey-node").forEach((node) => node.remove());
  };

  const addJourneyNode = (column, row, current = false) => {
    getSvg().append(
      createSvgElement("circle", {
        cx: xPositions[column],
        cy: yPositions[row],
        r: current ? 12 : 10,
        class: current ? "journey-node current-node" : "journey-node",
      }),
    );
  };

  const drawMove = (fromColumn, fromRow, toColumn, toRow) => {
    const svg = getSvg();
    svg.querySelector(".current-node")?.classList.remove("current-node");
    svg.append(
      createSvgElement("line", {
        x1: xPositions[fromColumn],
        y1: yPositions[fromRow],
        x2: xPositions[toColumn],
        y2: yPositions[toRow],
        class: "journey-path",
      }),
    );
    addJourneyNode(toColumn, toRow, true);
  };

  const rollDie = () => Math.floor(Math.random() * 6) + 1;

  const movementForRoll = (roll) => {
    if (roll <= 2) return { delta: 1, label: "down" };
    if (roll <= 4) return { delta: 0, label: "straight" };
    return { delta: -1, label: "up" };
  };

  const setStatus = (message) => {
    document.querySelector("#game-status").textContent = message;
  };

  const addHistoryItem = (message) => {
    const item = document.createElement("li");
    item.textContent = message;
    document.querySelector("#roll-history").append(item);
  };

  const updateRollButton = () => {
    const button = document.querySelector("#roll-button");
    button.disabled = game.rolling || game.awaitingChoice || game.complete;
    button.textContent = game.column < 0 ? "Roll to start" : "Roll next move";
    document.querySelector("#reset-button").disabled = game.rolling;
  };

  const chooseStart = (row, rollLabel) => {
    game.row = row;
    game.column = 0;
    game.awaitingChoice = false;
    document.querySelector("#choice-panel").hidden = true;
    addJourneyNode(0, row, true);
    addHistoryItem(`${rollLabel} · Start at ${5 - row} (${satisfactionLabels[row]})`);
    setStatus(`You begin in Youth at ${satisfactionLabels[row]}. Roll again to move forward.`);
    updateRollButton();
  };

  const showStartChoices = () => {
    game.awaitingChoice = true;
    const panel = document.querySelector("#choice-panel");
    panel.hidden = false;
    setStatus("You rolled a 6 — choose any starting satisfaction level.");
    updateRollButton();
  };

  const finishGame = () => {
    game.complete = true;
    const level = satisfactionLabels[game.row];
    setStatus(`Journey complete! You reached the Elderly stage feeling ${level.toLowerCase()} (${5 - game.row}/5).`);
    updateRollButton();
  };

  const applyMove = (roll) => {
    const movement = movementForRoll(roll);
    const oldColumn = game.column;
    const oldRow = game.row;
    const proposedRow = oldRow + movement.delta;
    const newRow = Math.max(0, Math.min(yPositions.length - 1, proposedRow));
    const hitEdge = proposedRow !== newRow;

    game.column += 1;
    game.row = newRow;
    drawMove(oldColumn, oldRow, game.column, game.row);

    const edgeNote = hitEdge ? " (edge: stayed straight)" : "";
    addHistoryItem(`Roll ${roll} · ${movement.label}${edgeNote}`);

    if (game.column === xPositions.length - 1) {
      finishGame();
      return;
    }

    const stage = game.column < 2 ? "Youth" : game.column < 4 ? "Adulthood" : "Elderly";
    setStatus(
      `You rolled ${roll}: moved ${hitEdge ? "straight at the edge" : movement.label}. ` +
        `You are in ${stage} at ${satisfactionLabels[game.row]} (${5 - game.row}/5).`,
    );
    updateRollButton();
  };

  const animateRoll = () =>
    new Promise((resolve) => {
      const die = document.querySelector("#die");
      die.classList.add("rolling");
      let ticks = 0;
      const timer = window.setInterval(() => {
        die.textContent = rollDie();
        ticks += 1;
        if (ticks >= 9) {
          window.clearInterval(timer);
          const result = rollDie();
          die.textContent = result;
          die.setAttribute("aria-label", `Rolled ${result}`);
          die.classList.remove("rolling");
          resolve(result);
        }
      }, 70);
    });

  const handleRoll = async () => {
    if (game.rolling || game.awaitingChoice || game.complete) return;
    game.rolling = true;
    updateRollButton();
    setStatus("Rolling…");

    const roll = await animateRoll();
    game.rolling = false;

    if (game.column < 0) {
      if (roll === 6) {
        showStartChoices();
      } else {
        chooseStart(5 - roll, `Roll ${roll}`);
      }
      return;
    }

    applyMove(roll);
  };

  const resetGame = () => {
    Object.assign(game, {
      column: -1,
      row: null,
      rolling: false,
      awaitingChoice: false,
      complete: false,
      history: [],
    });
    clearJourney();
    document.querySelector("#die").textContent = "?";
    document.querySelector("#die").setAttribute("aria-label", "Die has not been rolled");
    document.querySelector("#choice-panel").hidden = true;
    document.querySelector("#roll-history").replaceChildren();
    setStatus("Roll the die to choose your starting satisfaction level.");
    updateRollButton();
  };

  const initializeGame = () => {
    const choices = document.querySelector("#choice-buttons");
    for (let level = 5; level >= 1; level -= 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = level;
      button.setAttribute("aria-label", `Start at ${level}, ${satisfactionLabels[5 - level]}`);
      button.addEventListener("click", () => chooseStart(5 - level, "Rolled 6"));
      choices.append(button);
    }

    document.querySelector("#roll-button").addEventListener("click", handleRoll);
    document.querySelector("#reset-button").addEventListener("click", resetGame);
    updateRollButton();
  };

  render();
  initializeGame();
})();
