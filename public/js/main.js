'use strict';

function onMessageClick() {
  $('#message-content').empty();
  $(function(){app.adminChat()});
}

var app = {
  
  rooms: function(){
    
    var socket = io('/rooms', { transports: ['websocket'] });
    
    // When socket connects, get a list of chatrooms
    socket.on('connect', function () {
      
      // Update rooms list upon emitting updateRoomsList event
      socket.on('updateRoomsList', function(room) {
        
        // Display an error message upon a user error(i.e. creating a room with an existing title)
        $('.room-create p.message').remove();
        if(room.error != null){
          $('.room-create').append(`<p class="message error">${room.error}</p>`);
        }else{
          app.helpers.updateRoomsList(room);
        }
      });
      
      // Whenever the user hits the create button, emit createRoom event.
      $('.room-create button').on('click', function(e) {
        var inputEle = $("input[name='title']");  
        var roomTitle = inputEle.val().trim();
        if(roomTitle !== '') {
          socket.emit('createRoom', roomTitle);
          inputEle.val('');
        }
      });
      
    });
  },
  
  chat: function(roomId, peername, username){

    var socket = io('/chatroom', { transports: ['websocket'] });
    
    // When socket connects, join the current chatroom
    socket.on('connect', function () {
      
      socket.emit('join', roomId, username);
      
      socket.on("updateMessageList", function(messages){
        app.helpers.updateMessageList(messages, username);
      });
      // Update users list upon emitting updateUsersList event
      socket.on('updateUsersList', function(users, clear) {

        $('.container p.message').remove();
        app.helpers.updateUsersList(users, clear);
      });
      
      // Whenever the user hits the save button, emit newMessage event.
      $(".chat-message button").on('click', function(e) {
        
        var textareaEle = $("textarea[name='message']");
        var messageContent = textareaEle.val().trim();
        console.log($("#file").val())
        if(messageContent !== '') {
          var message = {
            content: messageContent, 
            username: username,
            peername: peername,
            date: Date.now(),
            fileUploaded: $('#sampleFile').val() != undefined && $('#sampleFile').val() != '' ? 'true' : 'false',
            fileName: $('#sampleFile').val()
          };
          if($('#sampleFile').val() != undefined && $('#sampleFile').val() != '') {
            console.log($('#uploadForm'));

            $.ajax({
              url: "/upload",
              type: "post",
              data:  new FormData($('#uploadForm')[0]),
              contentType: false,
              cache: false,
              processData: false,
              success: successHandler,
              error: function(error){
                $("#targetLayer").html(`<span>` + error + `</span>`)
              }
            });
            
            // $('#uploadForm').submit();
            // $('#uploadForm').submit(function(e) {
            //   e.preventDefault();
            //   console.log(this);
            // })
            
            function successHandler(data) {
              console.log(data);
              message.uploadFile = data;
              socket.emit('newMessage', username, roomId, message);
              textareaEle.val('');
              app.helpers.addMessage(message, 'to');    
            }
          }
          else {
            socket.emit('newMessage', username, roomId, message);
            textareaEle.val('');
            app.helpers.addMessage(message, 'to');  
          }
        }
      });
      
      // Whenever a user leaves the current room, remove the user from users list
      socket.on('removeUser', function(userId) {
        $('li#user-' + userId).remove();
        app.helpers.updateNumOfUsers();
      });
      
      // Append a new message 
      socket.on('addMessage', function(message) {
        app.helpers.addMessage(message, 'from');
      });
    });
  },
  
  adminChat: function() {
    
    var socket = io('/chatroom', {transports: ['websocket']});
    
    var uploader = new SocketIOFileClient(socket);
    
    uploader.on('start', function(fileInfo) {
      console.log('Start uploading', fileInfo);
    });
    uploader.on('stream', function(fileInfo) {
      console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
    });
    uploader.on('complete', function(fileInfo) {
      console.log('Upload Complete', fileInfo);
    });
    uploader.on('error', function(err) {
      console.log('Error!', err);
    });
    uploader.on('abort', function(fileInfo) {
      console.log('Aborted: ', fileInfo);
    });
    
    console.log('adminchat', socket);
    
    socket.on('connect', function() {
      
      console.log('connect');
      
      socket.emit('join', 'admin');
      
      socket.on("updateMessageList", function(messages) {
        
        app.helpers.adminUpdateMessage(messages);
        
      })
      
      socket.on("addMessage", function(message) {
        console.log('-', message);
        app.helpers.adminAddMessage(message);
        
      })
      
    })
    
  },
  
  helpers: {
    
    encodeHTML: function (str){
      return $('<div />').text(str).html();
    },
    
    // Update rooms list
    updateRoomsList: function(room){
      room.title = this.encodeHTML(room.title);
      room.title = room.title.length > 25? room.title.substr(0, 25) + '...': room.title;
      var html = `<a href="/message/chat/${room._id}"><li class="room-item">${room.title}</li></a>`;
      
      if(html === ''){ return; }
      
      if($(".room-list ul li").length > 0){
        $('.room-list ul').prepend(html);
      }else{
        $('.room-list ul').html('').html(html);
      }
      
      this.updateNumOfRooms();
    },
    
    // Update users list
    updateUsersList: function(users, clear){
      if(users.constructor !== Array){
        users = [users];
      }

      // var html = '';
      // for(var user of users) {
      //   html += `<li class="clearfix" id="user-${user}">
      //   <div class="about">
      //   <div class="name">${user}</div>
      //   <div class="status"><i class="fa fa-circle online"></i> online</div>
      //   </div></li>`;
      // }
      
      // if(html === ''){ return; }
      
      // if(clear != null && clear == true){
      //   $('.users-list ul').html('').html(html);
      // }else{
      //   $('.users-list ul').prepend(html);
      // }
      
      // this.updateNumOfUsers();
    },
    
    // Adding a new message to chat history
    addMessage: function(message, direction){
      console.log("--------->", message.date);
      var content_id = message.username + message.date;
      message.date      = (new Date(message.date)).toLocaleString();
      message.username  = this.encodeHTML(message.username);
      message.content   = this.encodeHTML(message.content);

      var html = '';

      direction == 'to' ? html = `<li>
      <div class="message-data">
      <span class="message-data-name">To ${message.peername}</span>
      <span class="message-data-time">${message.date}</span>
      </div>
      <div class="message my-message" id="` + content_id + `" dir="auto">${message.content}</div>
      </li>` : 
      html = `<li>
      <div class="message-data">
      <span class="message-data-name">From ${message.username}</span>
      <span class="message-data-time">${message.date}</span>
      </div>
      <div class="message my-message" id="` + content_id + `" dir="auto">${message.content}</div>
      </li>`;
      $(html).hide().appendTo('.chat-history ul').slideDown(200);
      if(message.fileUploaded) {
        var aHtml = `<p><a style="float: right;" href="/uploadData/${message.uploadFile}">${message.uploadFile.substr(message.uploadFile.search('/') + 1)}</a></p>`
        $(aHtml).appendTo("#" + content_id);
      }
      
      // Keep scroll bar down
      $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
    },
    
    // Update number of rooms
    // This method MUST be called after adding a new room
    updateNumOfRooms: function(){
      var num = $('.room-list ul li').length;
      $('.room-num-rooms').text(num +  " Room(s)");
    },
    
    // Update number of online users in the current room
    // This method MUST be called after adding, or removing list element(s)
    updateNumOfUsers: function(){
      // var num = $('.users-list ul li').length;
      // $('.chat-num-users').text(num +  " User(s)");
    },
    
    adminUpdateMessage: function(messages) {
      console.log(messages);
      messages.forEach(function(message) {
        var html = '<div><div class="user">' + message.fromUserId + '</div><div class="date">' + message.date + '</div><div class="message">' + message.contents + '</div></div>';
        $('.container-fluid').hide();
        $('#message-content').show();
        $(html).appendTo('#message-content');
        
      })
    }, 
    
    adminAddMessage: function(message) {
      var html = '<div><div class="user">' + message.username + '</div><div class="date">' + message.date + '</div><div class="message">' + message.content + '</div></div>';
      $('.container-fluid').hide();
      $('#message-content').show();
      $(html).appendTo('#message-content');  
    },
    
    updateMessageList: function(messages, username) {
      messages.forEach(function(message) {
        
        var content_id = message.username + message._id;
        message.date      = (new Date(messages.date)).toLocaleString();
        
        var html = '';
        
        message.fromUserId == username ? html = `<li>
        <div class="message-data">
        <span class="message-data-name">To ${message.toUserId}</span>
        <span class="message-data-time">${message.date}</span>
        </div>
        <div class="message my-message" id="` + content_id + `" dir="auto">${message.contents}</div>
        </li>` : 
        html = `<li>
        <div class="message-data">
        <span class="message-data-name">From ${message.fromUserId}</span>
        <span class="message-data-time">${message.date}</span>
        </div>
        <div class="message my-message" id="` + content_id + `" dir="auto">${message.contents}</div>
        </li>`;
        $(html).appendTo('.chat-history ul');

        if(message.fileUploaded != false) {
          var aHtml = `<p><a style="float: right;" href="/${message.uploadFile}">${message.uploadFile.substr(message.uploadFile.search('/') + 1)}</a></p>`;
          $(aHtml).appendTo("#" + content_id);  
        }
      })
      
    }
  }
};
