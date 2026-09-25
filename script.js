// Small touches: reveal content and add a gentle pointer effect to cards.
document.addEventListener("DOMContentLoaded", () => {
    const revealTargets = document.querySelectorAll(
        ".about-card, .stack-card, .timeline-item, .contact-code, .quote-section"
    );

    if (!("IntersectionObserver" in window)) {
        revealTargets.forEach(el => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealTargets.forEach(el => observer.observe(el));
});
