var myScroll;

function loaded () {
  myScroll = new IScroll("#wrapper-friends", { mouseWheel: true });
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(document).foundation();
