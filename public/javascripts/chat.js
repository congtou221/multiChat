$(document).ready(function () {
    var socket = io.connect();
    var from = $.cookie('user');  //从cookie读取当前用户名
    var to = 'all'; //默认对“所有人”说话

    $(window).keydown(function(e){
        if(e.keyCode == 116){
            if(!confirm("刷新将会清除所有聊天记录，确定要刷新么？")){
                e.preventDefault();
            }
        }
    });
    socket.emit('online', {user: from});
    socket.on('online', function(data){

        if(from !== data.user){
            var msg = '<div style="color:#f00">系统(' + now() + '):用户' + data.user + '上线了！</div>';
        }else{
            var msg = '<div style="color#f00">系统(' + now() + '):你进入了聊天室！</div>';
        }
    
        $("#contents").append(msg + '<br/>');

        // 刷新用户列表
        flushUsers(data.users);

        // 显示正在对谁说话
        showSayTo();       

    });

    socket.on('onmessage', function(data){

        if(data.to === 'all'){
            var msg = '<div style="color:#000">'+ data.from + '对所有人说：' + data.msg + '</div>';
        }else{
            var msg = '<div style="color:#000">' + data.from + '对' + data.to + '说：' + data.msg + '</div>';
        }
        
        $("#contents").append(msg + '<br/>');
    });

    socket.on('offline', function(data){
       var offlineMsg = '<div style="color:#0ff">' + data.offlineUser + '下线了！</div>';
       $("#contents").append(offlineMsg + '<br/>');

       flushUsers(data.users);

       if(data.offlineUser == to){
           to = 'all';
       }

       showSayTo();

    });

    socket.on('disconnect', function(){
        var sys = '<div style="color:#f00">系统：连接服务器失败！</div>';
        $("#contents").append(sys + '<br/>');

        $("#list").empty();
    });

    socket.on('reconnect', function(){
        var sys = '<div style="color:#f00">系统：重新连接服务器！</div>';
        $("#contents").append(sys + '<br/>');

        socket.emit('online', {user: from});
    });

    $("#say").click(function(){
        if($("#input_content").html().trim() === ''){
            alert('发送消息不能为空');
        }
        socket.emit('onmessage', 
                    {   msg: $("#input_content").html(), 
                        to: to,
                        from: from
                    }
                    );
        setTimeout(function() {
            $("#input_content").empty();
        }, 200);
    });


    function flushUsers(users){
        $("#list").empty().append('<li alt="all">所有人</li>');
        for(var i in users){
            $("#list").append('<li alt="' + users[i] + '">' + users[i] + '</li>');
        }

        $("#list > li").dblclick(function(){
            if($(this).attr('alt') !== from){
                to = $(this).attr('alt');

                $("#list > li").removeClass('sayingto');
                $(this).addClass('sayingto');

                showSayTo();
            }
        })
    }
    function showSayTo(){
        $("#to").html(to);
        $("#from").html(from === 'all' ? '所有人' : from);
    }
    //获取当前时间
    function now() {
        var date = new Date();
        var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
        return time;
    }
})