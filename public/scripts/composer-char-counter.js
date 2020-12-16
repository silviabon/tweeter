/*
 * Character counter for textbox area in new tweet
 */
const textboxMaxChar = 140;

function charLeftCounter() {
  const charLeft = textboxMaxChar - $('#tweet-text').val().length; // this refers to the textbox
  $('#counter').val(charLeft);
  if ((charLeft < 0 && !$('#counter').hasClass('counterInvalid'))
    || (charLeft >= 0 && $('#counter').hasClass('counterInvalid'))) {
    $('#counter').toggleClass('counterInvalid');
  }
}

$(document).ready(() => {
  // --- our code goes here ---
  $('#tweet-text').on('input', charLeftCounter);
});

