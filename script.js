const WHATSAPP_BASE = "https://wa.me/5531983307031";

function textAt(root, path) {
  return path.split(".").reduce((value, key) => value && value[key], root);
}

function setText(root, path, value) {
  const node = document.querySelector(`[data-content="${path}"]`);
  if (node && typeof value === "string") node.textContent = value;
}

async function loadSiteContent() {
  try {
    const response = await fetch("content.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Content file unavailable");
    const content = await response.json();
    document.querySelectorAll("[data-content]").forEach((node) => {
      const value = textAt(content, node.dataset.content);
      if (typeof value === "string") node.textContent = value;
    });
    document.querySelectorAll("[data-link]").forEach((node) => {
      const key = node.dataset.link;
      if (key === "whatsapp") node.href = content.whatsapp || WHATSAPP_BASE;
      if (key === "phone") node.href = `tel:${(content.phoneRaw || "5531983307031").replace(/[^0-9+]/g, "")}`;
      if (key === "musicSite" && content.musicSite) node.href = content.musicSite;
      if (key === "service1Whatsapp" && content.whatsapp) node.href = `${content.whatsapp}?text=${encodeURIComponent("Olá, quero um orçamento para suporte de informática.")}`;
      if (key === "service2Whatsapp" && content.whatsapp) node.href = `${content.whatsapp}?text=${encodeURIComponent("Olá, preciso de ajuda com rede ou impressora.")}`;
      if (key === "service3Whatsapp" && content.whatsapp) node.href = `${content.whatsapp}?text=${encodeURIComponent("Olá, quero consultar um serviço residencial.")}`;
    });
    const schema = document.getElementById("business-schema");
    if (schema) schema.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "LocalBusiness",
      name: content.brand || "Leinad System",
      description: content.schemaDescription || content.heroDescription,
      telephone: `+${content.phoneRaw || "5531983307031"}`,
      areaServed: content.serviceArea || "Sete Lagoas e região",
      url: window.location.href.split("#")[0]
    });
    document.title = `${content.brand || "Leinad System"} | Soluções residenciais e tecnológicas`;
    const description = document.querySelector('meta[name="description"]');
    if (description && content.metaDescription) description.content = content.metaDescription;
  } catch (error) {
    console.warn("O conteúdo inicial do site será exibido.", error);
  }
}

document.getElementById("year").textContent = new Date().getFullYear();
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  nav?.classList.toggle("is-open", open);
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
}));
loadSiteContent();
