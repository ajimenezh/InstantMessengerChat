var socket = io.connect();

$('#send-message').submit(function (e) {

  // Don't let the form actually post to the server
  e.preventDefault();

  // Send the "add-message" message to the server with our values
  socket.emit('send test message', {
    name: 'John Doe',
    message: $('#message').val()
  });

  // Clear out the message value
  $('#message').val('');

});

$('#send-message-post').submit(function (e) {

  // Don't let the form actually post to the server
  e.preventDefault();

  console.log("hola");
  // Send the "add-message" message to the server with our values
  socket.emit('send post message', {
    name: 'John Doe',
    message: $('#message').val()
  });

  // Clear out the message value
  $('#message').val('');

});

$('#send-message-chat').submit(function (e) {

  // Don't let the form actually post to the server
  e.preventDefault();

  // Send the "add-message" message to the server with our values
  socket.emit('send chat message', {
    name: $('#userName').val(),
    message: $('#message').val(),
    photo: $('#userPhoto').val(),
    color: $('#userColor').val(),
    id: $('#userId').val(),
    chatId: $('#chatId').val()
  });

  // Clear out the message value
  $('#message').val('');

});

$('#send-message-comment').submit(function (e) {

  // Don't let the form actually post to the server
  e.preventDefault();

  // Send the "add-message" message to the server with our values
  socket.emit('send comment message', {
    name: $('#userName').val(),
    message: $('#message').val(),
    photo: $('#userPhoto').val(),
    color: $('#userColor').val(),
    id: $('#userId').val(),
    chatId: $('#chatId').val()
  });

  // Clear out the message value
  $('#message').val('');

});

$('#send-message-publicchat').submit(function (e) {

  // Don't let the form actually post to the server
  e.preventDefault();

  // Send the "add-message" message to the server with our values
  socket.emit('send publicchat message', {
    name: $('#userName').val(),
    message: $('#message').val(),
    photo: $('#userPhoto').val(),
    color: $('#userColor').val(),
    id: $('#userId').val(),
    chatId: $('#chatId').val()
  });

  // Clear out the message value
  $('#message').val('');

});

$('#add-more-items').submit(function (e) {

  // Don't let the form actually post to the server
  e.preventDefault();

  l = l + 5;

  // Send the "add-message" message to the server with our values
  socket.emit('add more items', {
    number: l,
    hash: $('#hash').val()
  });

});



function addMessage (data) {
  $('#newchats').prepend('<div class="row"><div id="chat-container2"><a type="button" href="/account/'+ data.id +'"><div id="chat-user-text2">' + data.name + '</div><div id="chat-photo2"><img src="'+data.photo+'" width="35px" height="35px"/></div></a></div></div><div class="row"><div class="bubble2"><div id="bubble-text">' + data.message + '</div></div><div class="pointer2"></div></div>');
  //$('#newchats').prepend('<div class="row"><div id="chat-container"><div class="bubble2"><div id="bubble-text">' + data.message + '</div><div class="pointer"></div></div></div></div>');
};

function addCommentMessage (data) {
  $('#newchats').prepend('<li id="comments"><div class="large-2 small-4 columns user-text"><div id="comment-user"><a type="button" href="/account/'+data.id+'"><div id="comment-user-text">'+data.name+'</div><div id="comment-photo"><img src="'+data.photo+'" width="35px" height="35px"/></div></a></div></div><div id="comment-box">' + data.message + '</div></li>');
};


function addMessageToFeed (data) {
$('#news').prepend('<div class="row"><div class="large-12 columns"><button type="button" class="btn-default " onclick="window.location.href=\'/chats/' +  data.newsHash + '\'" style=""><div id=\"container\">' + data.newsName + '</div></button></div></div>');
};

function addNewsItem (news) {
$('#news').append('<button type="button" class="btn-default invisible_button" style=""><div id="container"><img src="'+news.newsImage+'" width="140px"><div class="post-text-container">'+news.newsName+'</div></div></button>');
};

socket.on('new test message', function (data) {
	addMessage(data);
});

socket.on('new post message', function (data) {
  addMessage(data);
});

socket.on('new chat message', function (data) {
  addMessage(data);
});

socket.on('new comment message', function (data) {
  addCommentMessage(data);
});

socket.on('new publicchat message', function (data) {
  addMessage(data);
});

socket.on('new news feed', function (data) {
    addMessageToFeed(data);
});

socket.on('more items', function (data) {
    for (var i=0; i<data.length; i++) {
      addNewsItem(data[i]);
    }
});

var myScroll;

function loaded () {
  myScroll = new IScroll("#wrapper-chat", { mouseWheel: true });
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(document).foundation();