function fetchQuotes() {
    const category = document.getElementById('category').value;
    const count = document.getElementById('count').value;
  
    fetch(`/get-quote?category=${category}&count=${count}`)
        .then(response => response.json())
        .then(data => {
            let quoteText = '';
            data.forEach(item => {
                quoteText += `"${item.quote}" - ${item.author}<br><br>`;
            });
            document.getElementById('quote').innerHTML = quoteText;
        })
        .catch(error => {
            console.error('Error fetching quotes:', error);
            document.getElementById('quote').innerHTML = "Could not fetch quotes. Try again.";
        });
  }
  function saveQuote() {
    const quoteDiv = document.getElementById("quote");
    const quoteText = quoteDiv.innerText;
  
    const parts = quoteText.split(/\s*[-–—]\s*/);
  
    if (parts.length < 2) {
      alert("Quote or author missing. Make sure to generate a quote first.");
      return;
    }
  
    const quote = parts[0].trim();
    const author = parts.slice(1).join(" ").trim(); 
  
    if (!quote || !author) {
      alert("Quote or author missing. Make sure to generate a quote first.");
      return;
    }
  
    fetch("/save-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote: quote, author: author })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        alert("Quote saved successfully!");
      } else {
        alert("Failed to save quote.");
      }
    });
  }
  
  
  function toggleShareOptions() {
      const shareOptions = document.getElementById('share-options');
      if (shareOptions.style.display === 'none') {
        shareOptions.style.display = 'block';
      } else {
        shareOptions.style.display = 'none';
      }
  }
  
  
 

  function shareWhatsApp() {
  event.preventDefault(); 
  const quoteText = document.getElementById('quote').innerText;
      window.open(`https://wa.me/?text=${encodeURIComponent(quoteText)}`);
}

  function shareTwitter() {
    event.preventDefault();
      const quoteText = document.getElementById('quote').innerText;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}`);
  }
  function shareReddit() {
  event.preventDefault();
  const quoteText = document.getElementById('quote').innerText;
  window.open(`https://www.reddit.com/submit?title=${encodeURIComponent(quoteText)}`);
}


function shareTelegram() {
  event.preventDefault();
  const quoteText = document.getElementById('quote').innerText;
  window.open(`https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(quoteText)}`);
}


function shareFacebook() {
  event.preventDefault();
  const quoteText = document.getElementById('quote').innerText;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}&quote=${encodeURIComponent(quoteText)}`);
}
  
  function copyQuote() {
      const quoteText = document.getElementById('quote').innerText;
      navigator.clipboard.writeText(quoteText).then(() => {
        alert('Quote copied to clipboard!');
      });
  }
  
  function viewHistory() {
      window.location.href = '/history';
  }
  
 function copyQuote() {
  const quoteElement = document.getElementById('quote');
  const textToCopy = quoteElement.textContent || quoteElement.innerText;

  if (!textToCopy) {
    alert('No quote to copy!');
    return;
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('Quote copied to clipboard!');
  }).catch(err => {
    alert('Failed to copy quote: ' + err);
  });
}

