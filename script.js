document.addEventListener("DOMContentLoaded", () => {
    let activeModel = null, currentAudio = null, pinned = false, modelRotation = 0;
    const apiUrl = "models.json"; // Fetch models dynamically

    async function loadModels() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const markerContainer = document.getElementById("ar-markers");

            data.models.forEach(model => {
                const marker = createMarker(model);
                markerContainer.appendChild(marker);
            });
        } catch (error) {
            console.error("Error loading models:", error);
        }
    }

    function createMarker(model) {
        const marker = document.createElement("a-marker");
        marker.setAttribute("type", "pattern");
        marker.setAttribute("url", model.marker_url);
        marker.setAttribute("id", model.name.replace(/\s+/g, "-"));
        marker.setAttribute("marker-handler", "");

        const entity = document.createElement("a-entity");
        entity.setAttribute("gltf-model", model.model_url);
        entity.setAttribute("scale", "1 1 1");
        entity.setAttribute("position", "0 0 0");
        entity.setAttribute("rotation", "0 0 0");
        entity.setAttribute("visible", "false");
        entity.dataset.voice = model.voice_url;
        entity.dataset.pdf = model.pdf_url;

        marker.appendChild(entity);
        return marker;
    }

    AFRAME.registerComponent("marker-handler", {
        init: function() {
            this.el.addEventListener("markerFound", () => handleMarkerFound(this.el));
            this.el.addEventListener("markerLost", () => handleMarkerLost());
        }
    });

    function handleMarkerFound(marker) {
        activeModel = marker.children[0];
        activeModel.setAttribute("visible", "true");
    }

    function handleMarkerLost() {
        if (!pinned && activeModel) {
            activeModel.setAttribute("visible", "false");
        }
    }

    document.getElementById("rotateBtn").addEventListener("click", () => {
        if (activeModel) {
            modelRotation += 30;
            activeModel.setAttribute("rotation", `0 ${modelRotation} 0`);
        }
    });

    document.getElementById("voiceBtn").addEventListener("click", () => {
        if (activeModel && activeModel.dataset.voice) {
            if (currentAudio) currentAudio.pause();
            currentAudio = new Audio(activeModel.dataset.voice);
            currentAudio.play();
        }
    });

    document.getElementById("pdfBtn").addEventListener("click", () => {
        if (activeModel && activeModel.dataset.pdf) {
            window.open(activeModel.dataset.pdf, "_blank");
        }
    });

    document.getElementById("pinBtn").addEventListener("click", () => {
        if (activeModel) {
            pinned = true;
            localStorage.setItem("pinnedModel", activeModel.getAttribute("gltf-model"));
        }
    });

    document.getElementById("unpinBtn").addEventListener("click", () => {
        pinned = false;
        localStorage.removeItem("pinnedModel");
    });

    loadModels();
});
