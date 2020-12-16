/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Create a tweet element to be added to the page
function createTweetElement(tweet) {
  const aTweet = `<article class="tweet">
                    <header>
                        <div><img src="${tweet.user.avatars}"><span>${tweet.user.name}</span></div>
                        <span>${tweet.user.handle}</span>
                      </header>
                      <p>${scape(tweet.content.text)}</p>
                      <footer>
                        <span>${new Date(tweet.created_at)}</span>
                        <div>
                          icons
                        </div>
                      </footer>
                    </article>
                `;
  return aTweet;
}
// Render tweets in the tweeter container
function renderTweets(tweets) {
  $('#tweets-container').empty();
  tweets.forEach((tweet) => {
    const tweetElement = createTweetElement(tweet);
    $('#tweets-container').append(tweetElement);
  });
}

function loadTweets() {
  $.ajax('/tweets', { method: 'GET' })
    .then((tweets) => {
      renderTweets(tweets);
    })
    .catch((error) => {
      console.log('got an error: ', error);
    });
}


$(document).ready(() => {
  const errorContainer = $('#new-tweet p.error-message');
  errorContainer.hide();
  loadTweets();

  // Post new tweet from new tweet form
  const newTweetForm = $('#new-tweet-form');
  newTweetForm.on('submit', function (event) {
    event.preventDefault();
    const tweetBox = $('#tweet-text');
    const tweet = tweetBox.val();
    tweetBox.removeClass('red-border');
    errorContainer.slideUp();
    if (!tweet) {
      errorContainer.text('Tweet cannot be empty');
      tweetBox.addClass('red-border');
      errorContainer.slideDown();
      return;
    }
    if (tweet.length > textboxMaxChar) {
      errorContainer.text(`Tweet cant have more than ${textboxMaxChar} characters`);
      tweetBox.addClass('red-border');
      errorContainer.slideDown();
      return;
    }
    /* Serialize the submitted form control values to be sent to the web server with the request */
    const formValues = $(this).serialize();
    $.ajax('/tweets', { method: 'POST', data: formValues })
      .then(() => {
        loadTweets();
      })
      .catch((error) => {
        console.log('got an error: ', error);
      });
    tweetBox.val('');
    charLeftCounter();
  });
});
