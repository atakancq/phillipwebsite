function toggleAccordion(element) {
    const content = element.nextElementSibling;
    const allContents = document.querySelectorAll('.accordion-content');

    // Close other accordion items
    allContents.forEach(item => {
        if (item !== content) {
            item.style.display = 'none';
            item.previousElementSibling.classList.remove('active');
        }
    });

    // Toggle current accordion item
    if (content.style.display === 'block') {
        content.style.display = 'none';
        element.classList.remove('active');
    } else {
        content.style.display = 'block';
        element.classList.add('active');
    }
}