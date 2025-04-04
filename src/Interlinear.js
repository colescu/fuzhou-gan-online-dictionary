// import { isChineseCharacter } from "./utils";
export function isChineseCharacter(char) {
  const chineseRegex = /[\u4e00-\u9fff]/; // CJK ideographs
  const punctuationRegex = /[\u3000-\u303F\uFF00-\uFFEF\u2000-\u206F]/; // CJK punctuation marks
  return chineseRegex.test(char) && !punctuationRegex.test(char);
}

export default class Interlinear {
  constructor(containerId, id, character, pronunciations) {
    this.container = document.getElementById(containerId);
    this.id = id;
    this.character = character;
    this.pronunciations = pronunciations;
    this.selectedValue = 0;
    this.createInterlinear();
  }

  createInterlinear() {
    const interlinear = document.createElement("div");
    interlinear.className = "interlinear";
    interlinear.id = `interlinear-${this.id}`;

    const spanCharacter = document.createElement("span");
    spanCharacter.textContent = this.character;
    if (this.pronunciations.length > 1) {
      spanCharacter.style.textDecoration = "underline";
    }
    interlinear.appendChild(spanCharacter);

    const selectMenu = document.createElement("select");
    selectMenu.className = "select-menu";
    selectMenu.style.display = "none";
    this.pronunciations.forEach((pronunciation, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = [
        pronunciation.character,
        pronunciation.syllable.showPinyin(),
        pronunciation.comment,
      ].join(" "); // option content
      selectMenu.appendChild(option);
    });
    selectMenu.addEventListener("change", (e) => {
      this.selectedValue = e.target.value;
      this.updateContent();
    });
    spanCharacter.addEventListener("click", () => {
      selectMenu.style.display = "block";
    });
    document.addEventListener("click", (event) => {
      if (
        !selectMenu.contains(event.target) &&
        event.target !== spanCharacter
      ) {
        selectMenu.style.display = "none";
      }
    });
    interlinear.appendChild(selectMenu);

    const spanIPA = document.createElement("span");
    spanIPA.className = "ipa";
    interlinear.appendChild(spanIPA);

    const spanPinyin = document.createElement("span");
    spanPinyin.className = "pinyin";
    interlinear.appendChild(spanPinyin);

    this.container.appendChild(interlinear);

    if (this.pronunciations.length > 0) {
      this.updateContent();
    } else if (isChineseCharacter(this.character)) {
      this.handleNotFound();
    }
  }

  updateContent() {
    const interlinear = this.container.querySelector(`#interlinear-${this.id}`);
    const selectedPronunciation =
      this.pronunciations[this.selectedValue].syllable;
    const spanIPA = interlinear.querySelector(".ipa");
    spanIPA.textContent = selectedPronunciation.showIPA("letter"); // TODO
    const spanPinyin = interlinear.querySelector(".pinyin");
    spanPinyin.textContent = selectedPronunciation.showPinyin();
  }

  handleNotFound() {
    const interlinear = this.container.querySelector(`#interlinear-${this.id}`);
    const span = document.createElement("span");
    span.textContent = "無"; // TODO
    interlinear.appendChild(span);
  }
}
