import "../images";

export default function custom() {
	document.addEventListener("DOMContentLoaded", function () {
		const cardNumberInput = document.getElementById("cardNumberInput");
		const cardNameInput = document.getElementById("cardNameInput");
		const cardMonthInput = document.getElementById("cardMonthInput");
		const cardYearInput = document.getElementById("cardYearInput");
		const cardCvvInput = document.getElementById("cardCvvInput");

		const cardNumberDisplay = document.getElementById("cardNumberLabel");
		const cardNameDisplay = document.getElementById("cardNameDisplay");
		const cardMonthDisplay = document.getElementById("cardMonthDisplay");
		const cardYearDisplay = document.getElementById("cardYearDisplay");
		const cardCvvDisplay = document.getElementById("cardCvvDisplay");
		const cardItem = document.getElementById("cardItem");
		const cardNameContainer = document.querySelector(".card-item__info");
		const expiresContainer = document.querySelector(".card-item__date");
		const focusElement = document.querySelector(".card-item__focus");

		function initializeCarousels(containerClassName, logos) {
			const containers = document.querySelectorAll(containerClassName);

			containers.forEach((container) => {
				container.innerHTML = "";

				logos.forEach((logo) => {
					const img = document.createElement("img");
					img.className = "card-item__typeImg";
					img.src = logo.src;
					img.alt = logo.alt;
					container.appendChild(img);
				});

				const images = container.querySelectorAll(".card-item__typeImg");
				let currentIndex = 0;

				if (images.length > 0) {
					images[currentIndex].classList.add("active");
				}

				function showNextImage() {
					images[currentIndex].classList.remove("active");

					currentIndex = (currentIndex + 1) % images.length;

					images[currentIndex].classList.add("active");
				}

				setInterval(showNextImage, 4000);
			});
		}

		const cardLogos = [
			{
				src: "../images/visa.png",
				alt: "Visa logo",
			},
			{
				src: "../images/mastercard.png",
				alt: "Mastercard logo",
			},
		];

		initializeCarousels(".carousel-inner", cardLogos);

		const renderCardNumber = () => {
			for (let i = 0; i < 16; i++) {
				const span = document.createElement("span");
				span.className = "card-number-digit";
				span.textContent = "#";
				cardNumberDisplay.appendChild(span);
			}
		};

		renderCardNumber();

		const formatCardNumberForInput = (number) => {
			const cleaned = number.replace(/\D/g, "").slice(0, 16);
			let formattedNumber = "";
			for (let i = 0; i < cleaned.length; i++) {
				if (i > 0 && i % 4 === 0) {
					formattedNumber += " ";
				}
				formattedNumber += cleaned[i];
			}
			return formattedNumber;
		};

		const updateCardNumber = () => {
			const cardNumber = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);
			const formattedNumber = formatCardNumberForInput(cardNumber);
			cardNumberInput.value = formattedNumber;

			const digits = formattedNumber.split("").filter((char) => char !== " ");

			const digitElements =
				cardNumberDisplay.querySelectorAll(".card-number-digit");

			if (digitElements.length !== 16) {
				console.error("Mismatch in number of span elements.");
				return;
			}

			digitElements.forEach((digitElement, index) => {
				const digit = digits[index] || "#";
				if (digitElement.textContent !== digit) {
					digitElement.textContent = digit;
					digitElement.classList.add("card-number-digit-enter");
					setTimeout(() => {
						digitElement.classList.remove("card-number-digit-enter");
						digitElement.classList.add("card-number-digit-enter-active");
					}, 300);
				}
			});
		};

		const updateCardName = () => {
			let name = cardNameInput.value;
			let existingSpans = cardNameDisplay.querySelectorAll(".card-name-letter");

			if (!name.trim()) {
				cardNameDisplay.textContent = "AD SOYAD";
				return;
			}

			if (cardNameDisplay.textContent === "AD SOYAD") {
				cardNameDisplay.textContent = "";
			}

			if (name.length < existingSpans.length) {
				for (let i = name.length; i < existingSpans.length; i++) {
					existingSpans[i].remove();
				}
			}

			name.split("").forEach((char, index) => {
				if (existingSpans[index]) {
					if (existingSpans[index].textContent !== char) {
						existingSpans[index].textContent = char;
					}
				} else {
					const span = document.createElement("span");
					span.className = "card-name-letter";

					if (char === " ") {
						span.classList.add("space-letter");
						span.innerHTML = "&nbsp;";
					} else {
						span.textContent = char;
					}

					cardNameDisplay.appendChild(span);

					setTimeout(() => {
						span.classList.add("card-name-letter-enter");
					}, index * 100);
				}
			});
		};

		const updateCardDate = () => {
			const newMonth = cardMonthInput.value || "MM";
			const newYear = cardYearInput.value.slice(-2) || "YY";

			if (cardMonthDisplay.textContent !== newMonth) {
				cardMonthDisplay.textContent = newMonth;
				cardMonthDisplay.classList.add("card-date-enter");

				setTimeout(() => {
					cardMonthDisplay.classList.remove("card-date-enter");
				}, 300);
			}

			if (cardYearDisplay.textContent !== newYear) {
				cardYearDisplay.textContent = newYear;
				cardYearDisplay.classList.add("card-date-enter");

				setTimeout(() => {
					cardYearDisplay.classList.remove("card-date-enter");
				}, 300); // Duration should match your CSS animation duration
			}
		};

		const updateCardCvv = () => {
			cardCvvDisplay.textContent = cardCvvInput.value;
		};

		const flipCard = (flip) => {
			cardItem.classList.toggle("-active", flip);
		};

		function updateFocusElement(target) {
			const cardItemRect = cardItem.getBoundingClientRect();
			const rect = target.getBoundingClientRect();
			focusElement.style.width = `${rect.width}px`;
			focusElement.style.height = `${rect.height}px`;
			focusElement.style.padding = "1rem";
			// rect is based on root element positioning and it has to be corrected by card cords
			focusElement.style.transform = `translate(${
				rect.left - cardItemRect.x
			}px, ${rect.top - cardItemRect.y}px)`;
			focusElement.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
		}

		function clearFocusElement() {
			focusElement.style.transform = "scale(50, 40)";
			focusElement.style.backgroundColor = "transparent";
		}

		function focusInput(event) {
			const focusMap = {
				cardNumberInput: cardNumberDisplay,
				cardNameInput: cardNameContainer,
				cardMonthInput: expiresContainer,
				cardYearInput: expiresContainer,
			};

			const targetElement = focusMap[event.target.id];
			if (targetElement) {
				updateFocusElement(targetElement);
			}
		}

		function blurInput(event) {
			if (event.target !== cardCvvInput) {
				clearFocusElement();
			}
		}

		cardNumberInput.addEventListener("focus", focusInput);
		cardNameInput.addEventListener("focus", focusInput);
		cardMonthInput.addEventListener("focus", focusInput);
		cardYearInput.addEventListener("focus", focusInput);
		cardCvvInput.addEventListener("focus", focusInput);

		cardNumberInput.addEventListener("blur", blurInput);
		cardNameInput.addEventListener("blur", blurInput);
		cardMonthInput.addEventListener("blur", blurInput);
		cardYearInput.addEventListener("blur", blurInput);
		cardCvvInput.addEventListener("blur", blurInput);

		cardNumberInput.addEventListener("input", updateCardNumber);
		cardNameInput.addEventListener("input", updateCardName);
		cardMonthInput.addEventListener("change", updateCardDate);
		cardYearInput.addEventListener("change", updateCardDate);
		cardCvvInput.addEventListener("input", updateCardCvv);
		cardCvvInput.addEventListener("focus", () => flipCard(true));
		cardCvvInput.addEventListener("blur", () => flipCard(false));
	});
}
