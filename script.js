document.addEventListener('DOMContentLoaded', () => {
  const bookPage = document.getElementById('bookPage');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let progressBar;
  let allSections = [];
  let currentPage = 0;
  let scrolling = false; // Variable to prevent excessive scroll calls

  console.log("DOM is fully loaded");

  function initializeProgressBar() {
      progressBar = document.querySelector('.progress-bar-inner');
      if (!progressBar) {
          console.error("progress-bar-inner not found in the dom");
      }
      console.log("Progress bar initialized");
  }

  fetch('note.txt')
      .then(response => {
          console.log("Fetched note.txt successfully");
          return response.text();
      })
      .then(text => {
          allSections = text.split(/(?=<section)/).filter(section => section.trim() !== '');
          console.log("Sections extracted from note.txt:", allSections);
          if (allSections.length === 0) {
              bookPage.innerHTML = "<p>No content available.</p>";
              nextBtn.disabled = true;
              prevBtn.disabled = true;
              console.log("No content available. Navigation disabled.");
          } else {
              if (currentPage < 0 || currentPage >= allSections.length) {
                  currentPage = 0;
              }
              showCurrentPage();
              initializeProgressBar();
              updateProgressBar();
              console.log("Initial page loaded:", currentPage);
          }
      })
      .catch(error => {
          console.error('Error fetching the file:', error);
          bookPage.innerHTML = "<p>Error loading the file. Please check console.</p>";
          nextBtn.disabled = true;
          prevBtn.disabled = true;
      });


  function showCurrentPage() {
      if (allSections.length === 0) {
          return;
      }
      bookPage.innerHTML = allSections[currentPage];
      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = currentPage === allSections.length - 1;
      bookPage.scrollTop = 0;
       window.requestAnimationFrame(function() {
              updateProgressBar(); // Ensure progress bar is up-to-date after showing content
          });

      console.log("Current page shown:", currentPage);
  }

  function updateProgressBar() {
      if (!progressBar) {
          return;
      }
      const scrollY = bookPage.scrollTop;
      const scrollHeight = bookPage.scrollHeight - bookPage.clientHeight;
      let scrollPercent = 0;
      if (scrollHeight > 0){
          scrollPercent = (scrollY / scrollHeight) * 100;
      }

      progressBar.style.width = scrollPercent + '%';
      console.log("Progress bar updated:", scrollPercent);
  }

  function goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= allSections.length) {
          currentPage = pageNumber - 1;
          showCurrentPage();
          console.log("Navigated to page:", currentPage);
      } else {
          console.log("Invalid page number:", pageNumber);
      }
  }

  prevBtn.addEventListener('click', () => {
      if (currentPage > 0) {
          currentPage--;
          showCurrentPage();
          console.log("Previous button clicked. Navigated to page:", currentPage);
      }
  });

  nextBtn.addEventListener('click', () => {
      if (currentPage < allSections.length - 1) {
          currentPage++;
          showCurrentPage();
          console.log("Next button clicked. Navigated to page:", currentPage);
      }
  });

    bookPage.addEventListener('scroll', function() {
        if(progressBar){
          if (!scrolling) {
            window.requestAnimationFrame(function() {
              updateProgressBar();
              scrolling = false;
            });
          }
          scrolling = true;
          }
  });



  // Make goToPage accessible globally
  window.goToPage = goToPage;
});