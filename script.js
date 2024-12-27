const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const outputDiv = document.getElementById("output");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const subscribePopup = document.getElementById("subscribePopup");
const successPopup = document.getElementById("successPopup");
const subscribeBtn = document.getElementById("subscribeBtn");
const closeSubscribePopup = document.getElementById("closeSubscribePopup");
const closeSuccess = document.getElementById("closeSuccess");
const emailInput = document.getElementById("emailInput");
const nameInput = document.getElementById("nameInput");
const agreePolicy = document.getElementById("agreePolicy");

generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    const imageCount = document.querySelector('input[name="imageCount"]:checked').value;

    if (!prompt) {
        alert("Please enter a valid prompt!");
        return;
    }

    generateBtn.textContent = "Generating...";
    generateBtn.disabled = true;
    outputDiv.innerHTML = ""; // Clear previous output

    try {
        for (let i = 0; i < imageCount; i++) {
            const response = await fetch("https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: `${prompt} ${Math.random()}` }),
            });

            if (!response.ok) {
                popup.style.display = "flex";
                throw new Error("Invalid response");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const container = document.createElement("div");
            container.className = "container";

            const img = document.createElement("img");
            img.src = url;

            const downloadBtn = document.createElement("button");
            downloadBtn.textContent = "Download";
            downloadBtn.classList.add("btn");
            downloadBtn.onclick = () => {
                const link = document.createElement("a");
                link.href = url;
                link.download = "generated-image.png";
                link.click();
            };

            container.appendChild(img);
            container.appendChild(downloadBtn);
            outputDiv.appendChild(container);
        }
    } catch (error) {
        console.error(error.message);
    } finally {
        generateBtn.textContent = "Generate";
        generateBtn.disabled = false;
    }
});

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

setTimeout(() => {
    subscribePopup.style.display = "flex";
}, 20000);

closeSubscribePopup.addEventListener("click", () => {
    subscribePopup.style.display = "none";
});

subscribeBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email || !agreePolicy.checked) {
        alert("Please complete all fields and agree to the Privacy Policy.");
        return;
    }

    subscribePopup.style.display = "none";
    successPopup.style.display = "flex";

    // Sending the email using Brevo's API
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": "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",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sender: { name: "SVO Image Gen", email: "your-email@example.com" },
                to: [{ email: "represaguide.info@gmail.com" }],
                subject: "Newsletter Subscription",
                textContent: `A user with email ${email} has subscribed to the newsletter.`,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to send email notification.");
        }

        console.log("Email notification sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
});

closeSuccess.addEventListener("click", () => {
    successPopup.style.display = "none";
});
