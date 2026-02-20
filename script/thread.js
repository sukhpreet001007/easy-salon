document.addEventListener('DOMContentLoaded', () => {
    // Select the container and the progression line
    const rowsContainer = document.querySelector('.marketing-features-rows');
    const progressLine = document.querySelector('.marketing-thread-progress');
    const threadLine = document.querySelector('.marketing-thread-line');
    const ticks = document.querySelectorAll('.marketing-tick');

    if (!rowsContainer || !progressLine || !threadLine) return;

    // We need to calculate bounds
    // We update on scroll
    window.addEventListener('scroll', () => {
        // Recalculate positions on scroll (or resize, to simplify)
        const containerRect = rowsContainer.getBoundingClientRect();
        const startOffset = containerRect.top; // Relative to viewport top
        const totalHeight = containerRect.height; // Height of container
        const windowHeight = window.innerHeight;

        // Where the "activation" point is (middle of screen)
        const activationPoint = windowHeight * 0.5;

        // Calculate progress based on container position relative to middle of screen
        // Container enters viewport bottom when startOffset < windowHeight
        // We want progress to start when container top hits middle of viewport?
        // Or when container top hits bottom?
        // User said "show becoming start when comes on that page".

        // Let's make it start when the container is in the middle of the screen
        // Progress = (activationPoint - startOffset)
        // Normalized: (activationPoint - startOffset) / totalHeight ?

        let progress = 0;

        // Start filling when the top of container reaches 60% down the viewport
        const triggerPoint = windowHeight * 0.6;

        if (startOffset < triggerPoint) {
            // How much have we scrolled past the start?
            const scrolledAmount = triggerPoint - startOffset;

            // Calculate percentage
            // We want it to be full when we scroll past the end?
            // End is when bottom of container passes triggerPoint?
            // Let's say we want to fill it over the course of the container height
            progress = (scrolledAmount / (totalHeight * 0.8)) * 100; // *0.8 to complete before very end
        }

        // Clamp
        progress = Math.max(0, Math.min(progress, 100));

        // Apply height
        progressLine.style.height = `${progress}%`;

        // Handle Disappearance
        // "disappear when reach end of that part of code till its bottom CTA"
        const endOfSection = containerRect.bottom;
        if (endOfSection < windowHeight * 0.2) { // 20% from top means mostly scrolled past
            threadLine.classList.add('thread-hidden');
            // Also hide ticks
            ticks.forEach(tick => tick.style.opacity = '0');
        } else {
            threadLine.classList.remove('thread-hidden');
            // Show ticks
            ticks.forEach(tick => tick.style.opacity = '1');
        }

        // Handle Ticks
        ticks.forEach((tick, index) => {
            const tickRect = tick.getBoundingClientRect();
            const tickTop = tickRect.top;

            // Activate tick if the progress line has passed it
            // Visually, the progress bar top is containerRect.top + (progress/100 * totalHeight)
            // But visually line starts at top of container.
            // If progress height > distance from container top to tick top
            // tick relative top:
            const tickRelativeTop = tickTop - startOffset;
            const currentLineHeight = (progress / 100) * totalHeight; // Approximate since we clamped

            // If the colored line covers the tick position
            // But we used a relative calculation for progress.
            // Let's simpler logic: if tick is above the activation point?
            // No, the line grows downwards.

            // Better: if (currentLineHeight >= tickRelativeTop)
            // But ticks are centered in rows. Rows have gaps.
            // Let's assume ticks activate when the line visually reaches them.

            // Refined calculation for line tip position relative to viewport
            // Start of line is StartOffset + 50
            const lineStart = startOffset + 50;
            const lineTipY = lineStart + ((containerRect.height - 100) * (progress / 100));
            // 50 is top offset in CSS, 100 is top+bottom offset in CSS.

            if (lineTipY >= tickTop + 20) { // +20 ensures line passed the center of tick
                tick.classList.add('active');
            } else {
                tick.classList.remove('active');
            }
        });
    });
});
