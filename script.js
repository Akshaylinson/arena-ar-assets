document.addEventListener("DOMContentLoaded", () => {
    fetch("models.json")
        .then(response => response.json())
        .then(data => {
            const markerElement = document.querySelector("a-marker-camera");
            markerElement.addEventListener("markerFound", () => {
                const markerId = markerElement.getAttribute("data-marker-id");
                const modelData = data.models.find(model => model.id === markerId);
                
                if (modelData) {
                    const modelEntity = document.getElementById("arModel");
                    modelEntity.setAttribute("gltf-model", modelData.model);
                    
                    document.getElementById("pdfBtn").onclick = () => window.open(modelData.pdf, "_blank");
                    document.getElementById("audioBtn").onclick = () => new Audio(modelData.audio).play();
                }
            });
        });
});

document.getElementById("rotateBtn").addEventListener("click", () => {
    const model = document.getElementById("arModel");
    let rotation = model.getAttribute("rotation");
    rotation.y += 45;
    model.setAttribute("rotation", rotation);
});

document.getElementById("pinBtn").addEventListener("click", () => {
    localStorage.setItem("pinnedModel", document.getElementById("arModel").getAttribute("gltf-model"));
});

document.getElementById("unpinBtn").addEventListener("click", () => {
    localStorage.removeItem("pinnedModel");
    document.getElementById("arModel").setAttribute("gltf-model", "");
});

if (localStorage.getItem("pinnedModel")) {
    document.getElementById("arModel").setAttribute("gltf-model", localStorage.getItem("pinnedModel"));
}
