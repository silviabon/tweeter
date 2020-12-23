/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Create a tweet element to be added to the page
function createTweetElement(tweet) {
  const date = formatDate(tweet.created_at);
  const aTweet = `<article class="tweet">
                    <header>
                        <div><img src="${tweet.user.avatars}"><span>${tweet.user.name}</span></div>
                        <span>${tweet.user.handle}</span>
                      </header>
                      <p>${scape(tweet.content.text)}</p>
                      <footer>
                        <span>${date}</span>
                        <div>
                        <img src="../images/flag.png">
                        <img src="../images/fwd.png">
                        <img src="../images/heart.png">
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
  const newTweetContainer = $('#new-tweet');
  const tweetBox = $('#tweet-text');
  const goUpButton = $('#goUpButton');
  newTweetContainer.hide();
  errorContainer.hide();
  goUpButton.hide();

  loadTweets();

  // Post new tweet from new tweet form
  const newTweetForm = $('#new-tweet-form');

  newTweetForm.on('submit', function (event) {
    event.preventDefault();
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
    const formValues = $(this).serialize(); /* Serialize the submitted form control values to be sent to the web server with the request */
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

  $('nav button').hover(() => {
    const arrows = $('#write_tweet_animation');
    arrows.filter(':not(:animated)').animate({ top: '15px' }, 500, () => {
      arrows.animate({ top: '0px' }, 500);
    });
  });

  $('nav button').click(() => {
    newTweetContainer.slideToggle('slow', () => {
      tweetBox.focus();
    });
  });

  $(window).scroll(() => {
    if ($(window).scrollTop() > $('nav').outerHeight()) {
      goUpButton.show();
    } else {
      goUpButton.hide();
    }
  });

  goUpButton.click(() => {
    newTweetContainer.show();
    setTimeout(() => {
      tweetBox.focus();
    }, 200);
  });
});


function convertMiliseconds(miliseconds, format) {
  let days;
  let hours;
  let minutes;
  let seconds;
  let total_hours;
  let total_minutes;
  let total_seconds;

  total_seconds = parseInt(Math.floor(miliseconds / 1000));
  total_minutes = parseInt(Math.floor(total_seconds / 60));
  total_hours = parseInt(Math.floor(total_minutes / 60));
  days = parseInt(Math.floor(total_hours / 24));

  seconds = parseInt(total_seconds % 60);
  minutes = parseInt(total_minutes % 60);
  hours = parseInt(total_hours % 24);

  switch (format) {
    case 's':
      return total_seconds;
    case 'm':
      return total_minutes;
    case 'h':
      return total_hours;
    case 'd':
      return days;
    default:
      return {
        d: days, h: hours, m: minutes, s: seconds,
      };
  }
}

// Show date as "x days ago"
// If today, show as "today"
function formatDate(originalDate) {
  const diffDateNowOriginal = new Date() - new Date(originalDate);
  const convertedTimeDiff = convertMiliseconds(diffDateNowOriginal);
  if (convertedTimeDiff.d > 1) {
    return `${convertedTimeDiff.d} days ago`;
  }
  if (convertedTimeDiff.d > 0) {
    return 'yesterday';
  }
  return 'today';
}
