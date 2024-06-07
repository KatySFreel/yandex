class Slider {
  constructor(selector) {
    this.slider = document.querySelector(selector);
    if (!this.slider) return;

    this.init();
  }

  init() {
    this.slides = Array.from(this.slider.querySelectorAll(".slider__item"));
    this.slideCount = this.slides.length;
    this.slidesToShow = this.getSlidesToShow();
    this.slideIndex = 0;
    this.cloneSlides();
    this.updateSlider();
    this.bindUIActions();
    this.startAutoSlide();
  }

  getSlidesToShow() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1366) return 2;
    return 3;
  }

  cloneSlides() {
    this.slides.forEach((slide) => {
      ["start", "end"].forEach((position) => {
        const clone = slide.cloneNode(true);
        clone.classList.add("clone");
        this.slider.appendChild(
          position === "end"
            ? clone
            : this.slider.insertBefore(clone, this.slider.firstChild)
        );
      });
    });
  }

  updateSlider() {
    const slideWidth = this.slider.clientWidth / this.slidesToShow;
    const offset = -(this.slideIndex + this.slidesToShow) * slideWidth;
    this.slider.style.transform = `translateX(${offset}px)`;
    this.slider.style.transition = "transform 0.5s ease";
    document.querySelector("#current-active").innerText =
      (((this.slideIndex % this.slideCount) + this.slideCount) %
        this.slideCount) +
      1;
    document.querySelector("#current-all").innerText = this.slideCount;
  }

  navigate(n) {
    this.slideIndex = (this.slideIndex + n + this.slideCount) % this.slideCount;
    this.updateSlider();
    this.resetAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideTimer = setInterval(() => this.navigate(1), 4000);
  }

  stopAutoSlide() {
    clearInterval(this.autoSlideTimer);
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  bindUIActions() {
    window.addEventListener(
      "resize",
      () => (this.slidesToShow = this.getSlidesToShow())
    );
    document
      .querySelector("#array-prev")
      .addEventListener("click", () => this.navigate(-1));
    document
      .querySelector("#array-next")
      .addEventListener("click", () => this.navigate(1));
  }
}

document.addEventListener("DOMContentLoaded", () => new Slider(".slider"));

class MobileSlider {
  constructor(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) return;

    this.init();
  }

  init() {
    const items = document.querySelectorAll(".stages__item");
    this.slidesContainer = document.createElement("div");
    this.slidesContainer.className = "stages-slider__container";
    this.container.parentNode.insertBefore(
      this.slidesContainer,
      this.container
    );
    this.container.style.display = "none";

    this.groupedIndexes = [[0, 1], [2], [3, 4], [5], [6]];
    this.groupedIndexes.forEach((group) => {
      const slide = document.createElement("div");
      slide.className = "stages-slider__slide";
      group.forEach((index) => slide.appendChild(items[index].cloneNode(true)));
      this.slidesContainer.appendChild(slide);
    });

    this.currentSlide = 0;
    this.bindUIActions();
    this.showSlide(this.currentSlide);
  }

  showSlide(index) {
    Array.from(this.slidesContainer.children).forEach(
      (slide, idx) => (slide.style.display = idx === index ? "flex" : "none")
    );
    this.currentSlide = index;
    this.updatePagination();
    this.updateButtonState();
  }

  updatePagination() {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";
    Array.from(this.slidesContainer.children).forEach((_, idx) => {
      const li = document.createElement("li");
      li.className = "navigation__item";
      li.addEventListener("click", () => this.showSlide(idx));
      if (idx === this.currentSlide) li.classList.add("active");
      pagination.appendChild(li);
    });
  }

  updateButtonState() {
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    prevButton.disabled = this.currentSlide === 0;
    nextButton.disabled =
      this.currentSlide === this.slidesContainer.children.length - 1;
  }

  bindUIActions() {
    document
      .querySelector(".prev")
      .addEventListener(
        "click",
        () => this.currentSlide > 0 && this.showSlide(this.currentSlide - 1)
      );
    document
      .querySelector(".next")
      .addEventListener(
        "click",
        () =>
          this.currentSlide < this.slidesContainer.children.length - 1 &&
          this.showSlide(this.currentSlide + 1)
      );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(max-width: 767.9px)").matches) {
    new MobileSlider(".stages__list");
  }
});
