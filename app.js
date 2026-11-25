const stage = document.querySelector(".card-stage");
const card = document.querySelector(".fantasy-card");
const flipper = document.querySelector(".card-flipper");
const front = document.querySelector(".card-face--front");
const frontImageTrigger = front.querySelector(".art-panel");
const dialogTemplate = document.querySelector("#project-dialog-template");
const status = document.querySelector(".sr-only");
const back = front.cloneNode(true);
back.classList.replace("card-face--front", "card-face--back");
back.setAttribute("aria-hidden", "true");
back.inert = true;
flipper.append(back);

const backs = [
  {
    id: "loup",
    name: "Loup",
    direction: "up",
    image: "assets/test.png",
    imageAlt: "Loup",
    cost: "5",
    type: "Loup légendaire",
    legendary: "Légendaire de Loup à définir",
    abilityTitle: "Atout de meute :",
    ability: "Grâce à sa solitude de loup solitaire, il peut s'isoler socialement pendant des semaines pour bosser sur le projet",
    flavor: "Ahouuuuuuu",
  },
  {
    id: "eugene",
    name: "Eugene",
    direction: "right",
    image: "assets/test2.jpg",
    imageAlt: "Eugene",
    cost: "6",
    type: "Togolais bien sapé",
    legendary: "Légendaire d’Eugene à définir",
    abilityTitle: "Atout d’Eugene :",
    ability: "Séduit les clients avec son charme naturel pour attirer les promoteurs pour notre jeu",
    flavor: "Il aime beaucoup les gateaux",
  },
  {
    id: "louis",
    name: "Louis",
    direction: "down",
    image: "assets/test3.png",
    imageAlt: "Louis",
    cost: "3",
    type: "Louis parfait",
    legendary: "Légendaire de Louis à définir",
    abilityTitle: "Atout de Louis :",
    ability: "A la créativité débordante, il est juste parfait",
    flavor: "Parfait.",
  },
  {
    id: "francois",
    name: "François",
    direction: "left",
    image: "assets/test4.png",
    imageAlt: "Francis",
    cost: "7",
    type: "Addict légendaire",
    legendary: "Légendaire de François à définir",
    abilityTitle: "Atout de François :",
    ability: "Accro aux jeux de paris, il a su mettre en pause son addiction pour coopérer afin de sortir le meilleur jeu possible. Il a su témoigner de son expérience pour rendre notre jeu le plus addictif possible",
    flavor: "Il participe au projet pour rembourser ses dettes",
  },
];
const rotations = {
  up: ["-180deg", "0deg"],
  right: ["0deg", "180deg"],
  down: ["180deg", "0deg"],
  left: ["0deg", "-180deg"],
};
const dialogs = new Map();
const backImageTrigger = back.querySelector(".art-panel");
let activeBack = backs[0];
let isFlipped = false;

function configureDialog(dialog, id, title, focusTarget, eyebrow = "Dossier du projet") {
  const heading = dialog.querySelector("#project-dialog-title");
  const eyebrowElement = dialog.querySelector(".project-dialog__eyebrow");
  heading.id = `project-dialog-title-${id}`;
  heading.textContent = title;
  if (eyebrowElement) eyebrowElement.textContent = eyebrow;
  dialog.id = `project-dialog-${id}`;
  dialog.setAttribute("aria-labelledby", heading.id);
  document.body.append(dialog);
  dialog.querySelector(".project-dialog__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => focusTarget.focus());
  return dialog;
}

const swotLightbox = document.createElement("dialog");
swotLightbox.className = "swot-lightbox";
swotLightbox.innerHTML = `
  <button class="swot-lightbox__close" type="button" aria-label="Fermer l'agrandissement">×</button>
  <figure>
    <img src="" alt="" />
    <figcaption></figcaption>
  </figure>
`;
document.body.append(swotLightbox);

const swotLightboxImage = swotLightbox.querySelector("img");
const swotLightboxCaption = swotLightbox.querySelector("figcaption");
swotLightbox.querySelector(".swot-lightbox__close").addEventListener("click", () => swotLightbox.close());
swotLightbox.addEventListener("click", (event) => {
  if (event.target === swotLightbox) swotLightbox.close();
});

function openSwotLightbox(fileName, caption) {
  swotLightboxImage.src = fileName;
  swotLightboxImage.alt = caption;
  swotLightboxCaption.textContent = caption;
  swotLightbox.showModal();
}

const groupDialog = configureDialog(
  dialogTemplate.content.firstElementChild.cloneNode(true),
  "travail-de-groupe",
  "Travail de groupe",
  frontImageTrigger,
);
groupDialog.classList.add("project-dialog--rules");
frontImageTrigger.setAttribute("aria-label", "Ouvrir le popup Travail de groupe");
frontImageTrigger.setAttribute("aria-controls", groupDialog.id);
frontImageTrigger.addEventListener("click", () => groupDialog.showModal());

function createBackDialog(variant) {
  const dialog = dialogTemplate.content.firstElementChild.cloneNode(true);
  const content = dialog.querySelector(".project-dialog__content");
  content.replaceChildren();

  const memberQuestions = [
    {
      number: "9",
      title: "Répartition des rôles au cours du semestre 1",
      prompt: "Lister et expliquer la répartition des rôles de chaque membre de l'équipe, ainsi que les référents de l'équipe.",
    },
    {
      number: "10",
      title: "SWOT et analyse détaillée",
      prompt: "Présenter le SWOT ou un autre outil d'analyse du projet, puis développer une partie de manière personnalisée : questionnement, piste de réflexion et réponse.",
    },
    {
      number: "11",
      title: "Implication personnelle dans le projet",
      prompt: "Expliquer librement son implication : idées proposées, participation à la création des règles, choix effectués et raisons de ces choix.",
    },
  ];

  const members = ["François", "Louis", "Loup", "Eugène"];
  const semesterOneRoles = {
    "François": "Chef de projet, il a également aidé Louis à la création des cartes et à leur équilibrage.",
    "Louis": "Responsable de la création du design de la boîte et des cartes.",
    "Loup": "Responsable de la création des règles du jeu.",
    "Eugène": "Responsable de la recherche des images et des noms.",
  };

  memberQuestions.forEach(({ number, title, prompt }) => {
    const section = document.createElement("section");
    section.className = "project-dialog__question";

    const heading = document.createElement("h3");
    heading.textContent = `${number}. ${title}`;

    const description = document.createElement("p");
    description.textContent = prompt;

    if (number === "10" || number === "11") {
      const response = document.createElement(number === "10" ? "div" : "p");
      response.className = "project-dialog__individual-response";

      if (number === "11" && variant.id === "francois") {
        response.textContent =
          "Inventeur, réalisateur, concepteur. Je complète le cahier des charges, je me pose des questions et j’essaie d’y répondre. Je crée aussi des cartes, mais mon implication est mineure dans ce rôle comparée à Louis et à Loup.";
      } else if (number === "11" && variant.id === "loup") {
        response.textContent =
          "J'ai créé les règles du jeu et je les ai optimisées pour qu'elles soient claires et complètes. J'ai aussi créé le système d'équilibrage : chaque carte doit valoir exactement 8 points (PV + pics + puissance de l'atout). Ce système me permet de vérifier les cartes créées par mes collègues et de corriger celles qui sont trop fortes ou trop faibles.";
      } else if (number === "11" && variant.id === "louis") {
        response.textContent =
          "J’ai réalisé entièrement le design des cartes et de la boîte. J’ai aussi montré à mes camarades comment utiliser le logiciel Figma pour m’aider à faire les cartes. J’ai effectué des recherches sur les images et j’ai rédigé des listes de cartes au préalable afin de choisir celles que nous allions garder et les atouts que nous allions leur attribuer.";
      } else if (number === "11" && variant.id === "eugene") {
        response.textContent =
          "J’ai recherché des images et des noms adaptés à notre projet sous différents angles (humoristique, créatif, fantastique…) afin de le dynamiser et de le rendre encore plus captivant.";
      } else if (number === "10" && variant.id === "loup") {
        response.innerHTML = `
          <div class="rules-document">
            <div class="rules-document__toolbar">
              <div>
                <span class="rules-document__eyebrow">Document individuel · SWOT et analyse détaillée</span>
                <p>SWOT de Loup</p>
              </div>
              <a class="rules-document__download" href="SWOT_Loup.docx" download>
                Télécharger le document
              </a>
            </div>
            <iframe
              class="rules-document__viewer"
              src="SWOT_Loup_apercu.html"
              title="Aperçu intégré du SWOT de Loup"
              loading="lazy"
            ></iframe>
          </div>
        `;
      } else if (number === "10" && ["francois", "louis", "eugene"].includes(variant.id)) {
        const gallery = document.createElement("div");
        gallery.className = "project-dialog__swot-gallery";
        if (variant.id === "francois") {
          gallery.classList.add("project-dialog__swot-gallery--single");
        }

        const swotImages = variant.id === "francois"
          ? [["swotfrancois.png", "Analyse SWOT — jeu de cartes et de plateau"]]
          : variant.id === "eugene"
            ? [
                ["swoteugene.png", "Analyse SWOT — analyse globale"],
                ["swot2eugene.png", "Opportunités — constats et pistes d’exploitation"],
              ]
            : [
                ["swot_louis.png", "SWOT Analysis — analyse globale"],
                ["swot2louis.png", "Faiblesses — constat et pistes de solutions"],
              ];

        swotImages.forEach(([fileName, caption]) => {
          const figure = document.createElement("figure");

          const openButton = document.createElement("button");
          openButton.type = "button";
          openButton.className = "project-dialog__swot-open";
          openButton.setAttribute("aria-label", `Agrandir : ${caption}`);

          const image = document.createElement("img");
          image.src = fileName;
          image.alt = caption;
          image.loading = "lazy";
          openButton.addEventListener("click", () => openSwotLightbox(fileName, caption));

          const description = document.createElement("figcaption");
          description.textContent = caption;

          openButton.append(image);
          figure.append(openButton, description);
          gallery.append(figure);
        });

        response.append(gallery);
      } else {
        response.textContent = "réponse à compléter";
      }

      section.append(heading, description, response);
      content.append(section);
      return;
    }

    const answers = document.createElement("dl");
    answers.className = "project-dialog__member-answers";

    members.forEach((member) => {
      const memberName = document.createElement("dt");
      memberName.textContent = member;

      const response = document.createElement("dd");
      response.textContent = number === "9"
        ? semesterOneRoles[member]
        : "Réponse à compléter";

      answers.append(memberName, response);
    });

    section.append(heading, description, answers);
    content.append(section);
  });

  const dialogId = `fiche-${variant.id}`;
  const trigger = backImageTrigger;
  const configuredDialog = configureDialog(dialog, dialogId, `Fiche de ${variant.name}`, trigger, "Fiche personnage");
  dialogs.set(variant.id, configuredDialog);
}

backs.forEach(createBackDialog);
backImageTrigger.addEventListener("click", () => {
  dialogs.get(activeBack.id).showModal();
});

function updateBack(variant) {
  activeBack = variant;
  back.querySelector(".name-scroll h1").textContent = variant.name;
  back.querySelector(".art-image").src = variant.image;
  back.querySelector(".art-image").alt = variant.imageAlt;
  back.querySelector(".value-plaque").setAttribute("aria-label", `Valeur ${variant.cost}`);
  back.querySelector(".value-plaque span").textContent = variant.cost;
  back.querySelector(".type-bar h2").textContent = variant.type;
  back.querySelector(".ability h3").textContent = variant.abilityTitle;
  back.querySelector(".ability p").textContent = variant.ability;
  back.querySelector(".flavor").textContent = variant.flavor;
  backImageTrigger.setAttribute("aria-label", `Ouvrir la fiche de ${variant.name}`);
  backImageTrigger.setAttribute("aria-controls", `project-dialog-fiche-${variant.id}`);
}

function showBack(variant) {
  updateBack(variant);
  const [rotateX, rotateY] = rotations[variant.direction];
  back.style.setProperty("--back-x", rotateX);
  back.style.setProperty("--back-y", rotateY);
  flipper.style.setProperty("--flip-x", rotateX);
  flipper.style.setProperty("--flip-y", rotateY);
  card.classList.add("is-flipped");
  isFlipped = true;
  front.inert = true;
  front.setAttribute("aria-hidden", "true");
  back.inert = false;
  back.setAttribute("aria-hidden", "false");
  card.setAttribute("aria-label", `Carte de ${variant.name}`);
  status.textContent = `Carte de ${variant.name}.`;
}

function showFront() {
  flipper.style.setProperty("--flip-x", "0deg");
  flipper.style.setProperty("--flip-y", "0deg");
  card.classList.remove("is-flipped");
  isFlipped = false;
  front.inert = false;
  front.setAttribute("aria-hidden", "false");
  back.inert = true;
  back.setAttribute("aria-hidden", "true");
  card.setAttribute("aria-label", "Carte de Lucien le voyageur");
  status.textContent = "Face avant de Lucien le voyageur.";
}

function selectBack(direction) {
  const variant = backs.find((item) => item.direction === direction);
  if (!variant) return;
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");

  if (isFlipped && variant.id === activeBack.id) {
    showFront();
    return;
  }

  showBack(variant);
}

document.querySelectorAll("[data-direction]").forEach((button) => {
  button.addEventListener("click", () => selectBack(button.dataset.direction));
});

stage.addEventListener("keydown", (event) => {
  const directions = {
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
    ArrowLeft: "left",
  };
  const direction = directions[event.key];
  if (!direction) return;
  event.preventDefault();
  selectBack(direction);
});

card.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") return;
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  card.style.setProperty("--tilt-x", `${y * -3.2}deg`);
  card.style.setProperty("--tilt-y", `${x * 3.2}deg`);
});

card.addEventListener("pointerleave", () => {
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
});
