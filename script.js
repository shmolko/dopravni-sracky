import { categories, signs } from "./signs.js";

const state = {
  selectedCategoryIds: new Set(categories.map((category) => category.id)),
  lessonDeck: [],
  currentIndex: 0,
  isFlipped: false,
  toastTimerId: null,
  swipeStartX: null,
  swipeMoved: false,
};

const elements = {
  setupView: document.querySelector("#setup-view"),
  lessonView: document.querySelector("#lesson-view"),
  studyView: document.querySelector("#study-view"),
  categorySelector: document.querySelector("#category-selector"),
  startLesson: document.querySelector("#start-lesson"),
  showStudyFromSetup: document.querySelector("#show-study-from-setup"),
  showStudyFromLesson: document.querySelector("#show-study-from-lesson"),
  backToLesson: document.querySelector("#back-to-lesson"),
  newLesson: document.querySelector("#new-lesson"),
  flashcard: document.querySelector("#flashcard"),
  cardImage: document.querySelector("#card-image"),
  cardCategory: document.querySelector("#card-category"),
  cardTitle: document.querySelector("#card-title"),
  cardShort: document.querySelector("#card-short"),
  cardDetails: document.querySelector("#card-details"),
  previousCard: document.querySelector("#previous-card"),
  nextCard: document.querySelector("#next-card"),
  studyGroups: document.querySelector("#study-groups"),
  signDialog: document.querySelector("#sign-dialog"),
  dialogImage: document.querySelector("#dialog-image"),
  dialogCategory: document.querySelector("#dialog-category"),
  dialogTitle: document.querySelector("#dialog-title"),
  dialogShort: document.querySelector("#dialog-short"),
  dialogDetails: document.querySelector("#dialog-details"),
  dialogSource: document.querySelector("#dialog-source"),
  toast: document.querySelector("#toast"),
};

function sortByCode(left, right) {
  return left.code.localeCompare(right.code, "cs", { numeric: true });
}

function shuffle(array) {
  const copy = [...array];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function getCategoryById(categoryId) {
  return categories.find((category) => category.id === categoryId);
}

function getSelectedSigns() {
  return signs.filter((sign) => state.selectedCategoryIds.has(sign.category));
}

function showView(viewName) {
  elements.setupView.classList.toggle("hidden", viewName !== "setup");
  elements.lessonView.classList.toggle("hidden", viewName !== "lesson");
  elements.studyView.classList.toggle("hidden", viewName !== "study");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");

  window.clearTimeout(state.toastTimerId);
  state.toastTimerId = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 1800);
}

function renderCategorySelector() {
  elements.categorySelector.innerHTML = "";

  categories.forEach((category) => {
    const label = document.createElement("label");
    label.className = "category-chip";
    label.classList.toggle("is-active", state.selectedCategoryIds.has(category.id));

    label.innerHTML = `
      <input type="checkbox" ${state.selectedCategoryIds.has(category.id) ? "checked" : ""} />
      <span class="chip-copy">
        <span class="chip-title">${category.title}</span>
        <span class="chip-description">${category.description}</span>
      </span>
    `;

    const input = label.querySelector("input");
    input.addEventListener("change", () => {
      if (input.checked) {
        state.selectedCategoryIds.add(category.id);
      } else {
        state.selectedCategoryIds.delete(category.id);
      }

      renderCategorySelector();
    });

    elements.categorySelector.append(label);
  });
}

function renderLesson() {
  const activeSign = state.lessonDeck[state.currentIndex];

  if (!activeSign) {
    showToast("Nejdřív si spusť lekci.");
    showView("setup");
    return;
  }

  const category = getCategoryById(activeSign.category);
  elements.flashcard.classList.toggle("is-flipped", state.isFlipped);
  elements.cardImage.src = activeSign.imageUrl;
  elements.cardImage.alt = activeSign.nameCz;
  elements.cardCategory.textContent = `${activeSign.code} · ${category.title}`;
  elements.cardTitle.textContent = activeSign.nameCz;
  elements.cardShort.textContent = activeSign.shortMeaning;
  elements.cardDetails.textContent = activeSign.detailsCz;
}

function startLesson() {
  const selectedSigns = getSelectedSigns();

  if (selectedSigns.length === 0) {
    showToast("Vyber aspoň jednu kategorii.");
    return;
  }

  state.lessonDeck = shuffle(selectedSigns);
  state.currentIndex = 0;
  state.isFlipped = false;
  renderLesson();
  showView("lesson");
}

function moveLesson(direction) {
  const nextIndex = state.currentIndex + direction;

  if (nextIndex < 0) {
    showToast("Tohle je první karta v lekci.");
    return;
  }

  if (nextIndex >= state.lessonDeck.length) {
    showToast("To byla poslední karta. Spusť novou lekci pro nové zamíchání.");
    return;
  }

  state.currentIndex = nextIndex;
  state.isFlipped = false;
  renderLesson();
}

function flipLessonCard() {
  if (!state.lessonDeck.length) {
    return;
  }

  state.isFlipped = !state.isFlipped;
  renderLesson();
}

function openSignDialog(sign) {
  const category = getCategoryById(sign.category);
  elements.dialogImage.src = sign.imageUrl;
  elements.dialogImage.alt = sign.nameCz;
  elements.dialogCategory.textContent = `${sign.code} · ${category.title}`;
  elements.dialogTitle.textContent = sign.nameCz;
  elements.dialogShort.textContent = sign.shortMeaning;
  elements.dialogDetails.textContent = sign.detailsCz;
  elements.dialogSource.href = sign.sourceUrl;
  elements.signDialog.showModal();
}

function renderStudy() {
  elements.studyGroups.innerHTML = "";

  categories.forEach((category) => {
    const categorySigns = signs
      .filter((sign) => sign.category === category.id)
      .sort(sortByCode);

    const group = document.createElement("section");
    group.className = "study-group";
    group.innerHTML = `
      <div>
        <h3>${category.title}</h3>
        <p class="study-card-text">${category.description}</p>
      </div>
      <div class="study-grid"></div>
    `;

    const grid = group.querySelector(".study-grid");

    categorySigns.forEach((sign) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "study-card";
      card.innerHTML = `
        <img src="${sign.imageUrl}" alt="${sign.nameCz}" />
        <p class="card-category">${sign.code}</p>
        <p class="study-card-title">${sign.nameCz}</p>
        <p class="study-card-text">${sign.shortMeaning}</p>
      `;

      card.addEventListener("click", () => openSignDialog(sign));
      grid.append(card);
    });

    elements.studyGroups.append(group);
  });
}

function bindSwipe() {
  // Pointer events work for both mouse and touch in modern browsers.
  elements.flashcard.addEventListener("pointerdown", (event) => {
    state.swipeStartX = event.clientX;
    state.swipeMoved = false;
  });

  elements.flashcard.addEventListener("pointermove", (event) => {
    if (state.swipeStartX === null) {
      return;
    }

    if (Math.abs(event.clientX - state.swipeStartX) > 18) {
      state.swipeMoved = true;
    }
  });

  elements.flashcard.addEventListener("pointerup", (event) => {
    if (state.swipeStartX === null) {
      return;
    }

    const deltaX = event.clientX - state.swipeStartX;
    state.swipeStartX = null;

    if (Math.abs(deltaX) > 56) {
      if (deltaX < 0) {
        moveLesson(1);
      } else {
        moveLesson(-1);
      }
      return;
    }

    if (!state.swipeMoved) {
      flipLessonCard();
    }
  });

  elements.flashcard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flipLessonCard();
    }

    if (event.key === "ArrowLeft") {
      moveLesson(-1);
    }

    if (event.key === "ArrowRight") {
      moveLesson(1);
    }
  });
}

function bindEvents() {
  elements.startLesson.addEventListener("click", startLesson);
  elements.showStudyFromSetup.addEventListener("click", () => showView("study"));
  elements.showStudyFromLesson.addEventListener("click", () => showView("study"));
  elements.backToLesson.addEventListener("click", () => {
    if (!state.lessonDeck.length) {
      showToast("Ještě nemáš rozjetou lekci.");
      return;
    }

    showView("lesson");
  });
  elements.newLesson.addEventListener("click", () => showView("setup"));
  elements.previousCard.addEventListener("click", () => moveLesson(-1));
  elements.nextCard.addEventListener("click", () => moveLesson(1));
  bindSwipe();
}

renderCategorySelector();
renderStudy();
bindEvents();
