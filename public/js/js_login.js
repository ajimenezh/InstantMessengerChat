var myScroll;

function loaded () {
  myScroll = new IScroll("#wrapper-login", { mouseWheel: true });
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(document).foundation();
